import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, LogOut, Pencil, Trophy, Upload } from 'lucide-react';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input, { Label } from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import ProgressOrb from '../components/common/ProgressOrb';
import StreakFlame from '../components/common/StreakFlame';
import Reveal from '../components/common/Reveal';
import WeeklyTrendChart from '../components/analytics/WeeklyTrendChart';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { xpToNextLevel } from '../lib/xp';

function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card variant="glass" className="flex items-center gap-2.5 !p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10 text-accent">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-base font-bold text-text-primary">{value}</p>
        <p className="truncate text-[11px] text-text-secondary">{label}</p>
      </div>
    </Card>
  );
}

export default function ProfilePage() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { data, derived } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!user) return null;

  const completedTasks = data?.studySessions.filter((s) => s.completed).length ?? 0;
  const totalHours = Math.round(derived.totalHoursStudied * 10) / 10;
  const streak = derived.currentStreakDays;
  const xp = data?.xp ?? { totalXP: 0, level: 1, badges: [] };
  const progress = xpToNextLevel(xp.totalXP);
  const unlockedBadges = xp.badges.filter((b) => b.unlockedAt).length;

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateProfile({ name: name.trim(), email: email.trim().toLowerCase() });
    setEditOpen(false);
  };

  const handleChangePassword = () => {
    const result = changePassword(currentPw, newPw);
    if (!result.ok) {
      setPwError(result.error);
      setPwSuccess(false);
      return;
    }
    setPwError(null);
    setPwSuccess(true);
    setCurrentPw('');
    setNewPw('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card variant="glass" className="flex flex-col items-center gap-6 p-6 lg:flex-row lg:items-center">
        <div className="relative">
          <Avatar name={user.name} src={user.avatar} size="xl" />
          <button
            type="button"
            onClick={handleAvatarClick}
            aria-label="Upload profile picture"
            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-105"
          >
            <Upload className="size-3.5" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-xl font-bold text-text-primary">{user.name}</h2>
          <p className="text-sm text-text-secondary">{user.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <StreakFlame days={streak} />
            <span className="rounded-[var(--radius-full)] bg-primary/15 px-2.5 py-1 text-xs font-semibold text-accent">
              Level {xp.level}
            </span>
          </div>
        </div>

        <ProgressOrb
          value={(progress.current / progress.needed) * 100}
          size={110}
          tone="primary"
          label={`Lvl ${progress.level + 1}`}
          sublabel={`${progress.current}/${progress.needed} XP`}
        />

        <Button variant="secondary" size="sm" icon={<Pencil className="size-3.5" />} onClick={() => setEditOpen(true)}>
          Edit Profile
        </Button>
      </Card>

      <Reveal>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-secondary">Learning Statistics</h3>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatChip icon={<CheckCircle2 className="size-4" />} label="Topics Completed" value={completedTasks} />
            <StatChip icon={<Clock className="size-4" />} label="Total Focus Hours" value={`${totalHours}h`} />
            <StatChip icon={<Trophy className="size-4" />} label="Achievements" value={unlockedBadges} />
            <StatChip icon={<Trophy className="size-4" />} label="Productivity Score" value={xp.totalXP} />
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-secondary">Growth Over Time</h3>
          <WeeklyTrendChart />
        </div>
      </Reveal>

      <Reveal>
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-text-secondary">Account Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" icon={<Pencil className="size-4" />} onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
            <Button
              variant="secondary"
              icon={<Pencil className="size-4" />}
              onClick={() => {
                setPwOpen(true);
                setPwSuccess(false);
                setPwError(null);
              }}
            >
              Change Password
            </Button>
            <Button variant="danger" icon={<LogOut className="size-4" />} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>
      </Reveal>

      <Modal open={editOpen} title="Edit Profile" onClose={() => setEditOpen(false)}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Full Name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-email">Email Address</Label>
            <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <Modal open={pwOpen} title="Change Password" onClose={() => setPwOpen(false)}>
        <div className="space-y-4">
          {pwError && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              Password updated successfully.
            </div>
          )}
          <div>
            <Label htmlFor="current-pw">Current Password</Label>
            <PasswordInput id="current-pw" value={currentPw} onChange={setCurrentPw} autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="new-pw">New Password</Label>
            <PasswordInput id="new-pw" value={newPw} onChange={setNewPw} autoComplete="new-password" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setPwOpen(false)}>
              Close
            </Button>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
