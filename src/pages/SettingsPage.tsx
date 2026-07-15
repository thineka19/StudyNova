import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Moon, Palette, Sliders, Sun, User as UserIcon } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input, { Label, Select } from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Reveal from '../components/common/Reveal';
import { useTheme, type AccentKey } from '../context/ThemeContext';
import { usePrefs } from '../context/PrefsContext';
import { useAuth } from '../context/AuthContext';

const tabButtonClass = (active: boolean) =>
  `flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium transition-colors duration-[250ms] ease-[var(--ease-premium)] ${
    active ? 'bg-card text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
  }`;

const segmentButtonClass = (active: boolean) =>
  `flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-semibold transition-colors duration-[250ms] ease-[var(--ease-premium)] ${
    active ? 'bg-primary text-white' : 'text-text-secondary'
  }`;

const ACCENTS: { key: AccentKey; label: string; className: string }[] = [
  { key: 'primary', label: 'Primary Blue', className: 'bg-primary' },
  { key: 'secondary', label: 'Secondary Blue', className: 'bg-secondary' },
  { key: 'success', label: 'Green', className: 'bg-success' },
  { key: 'warning', label: 'Amber', className: 'bg-warning' },
  { key: 'danger', label: 'Red', className: 'bg-danger' },
];

const TABS = [
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'preferences', label: 'Study Preferences', icon: Sliders },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'account', label: 'Account', icon: UserIcon },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border pt-3 first:border-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-[250ms] ease-[var(--ease-premium)] ${
          checked ? 'bg-primary' : 'bg-surface'
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-[250ms] ease-[var(--ease-premium)] ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const { notifications, setNotificationPref, planner, setPlannerPref } = usePrefs();
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabKey>('appearance');
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

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
    <div className="animate-fade-in">
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-[var(--radius-md)] bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={tabButtonClass(tab === t.key)}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'appearance' && (
        <Reveal>
          <Card className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Dark Mode</p>
                <p className="text-xs text-text-secondary">Dark is the default, premium theme</p>
              </div>
              <div className="flex rounded-[var(--radius-sm)] border border-border bg-surface p-1">
                <button type="button" onClick={() => setTheme('dark')} className={segmentButtonClass(theme === 'dark')}>
                  <Moon className="size-3.5" /> Dark
                </button>
                <button type="button" onClick={() => setTheme('light')} className={segmentButtonClass(theme === 'light')}>
                  <Sun className="size-3.5" /> Light
                </button>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <p className="mb-2 text-sm font-medium text-text-primary">Accent Color</p>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => setAccent(a.key)}
                    aria-label={a.label}
                    title={a.label}
                    className={`size-8 rounded-full ${a.className} transition-transform duration-[250ms] ease-[var(--ease-premium)] hover:scale-110 ${
                      accent === a.key ? 'ring-2 ring-accent ring-offset-2 ring-offset-card' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      {tab === 'preferences' && (
        <Reveal>
          <Card className="animate-fade-in">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="preferred-hours">Preferred Study Hours</Label>
                <Select
                  id="preferred-hours"
                  value={planner.preferredStudyHours}
                  onChange={(e) => setPlannerPref('preferredStudyHours', e.target.value)}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="session-length">Study Session Length (mins)</Label>
                <Input
                  id="session-length"
                  type="number"
                  min={10}
                  max={180}
                  value={planner.sessionLengthMins}
                  onChange={(e) => setPlannerPref('sessionLengthMins', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="break-length">Break Duration (mins)</Label>
                <Input
                  id="break-length"
                  type="number"
                  min={0}
                  max={60}
                  value={planner.breakDurationMins}
                  onChange={(e) => setPlannerPref('breakDurationMins', Number(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </Reveal>
      )}

      {tab === 'notifications' && (
        <Reveal>
          <Card className="animate-fade-in">
            <ToggleRow
              label="Deadline Reminders"
              description="Get notified before assignment deadlines"
              checked={notifications.deadlineReminders}
              onChange={(v) => setNotificationPref('deadlineReminders', v)}
            />
            <ToggleRow
              label="Exam Alerts"
              description="Get notified as exams approach"
              checked={notifications.examAlerts}
              onChange={(v) => setNotificationPref('examAlerts', v)}
            />
            <ToggleRow
              label="Daily Study Reminders"
              description="A daily nudge to keep your streak going"
              checked={notifications.dailyStudyReminders}
              onChange={(v) => setNotificationPref('dailyStudyReminders', v)}
            />
          </Card>
        </Reveal>
      )}

      {tab === 'account' && (
        <Reveal>
          <Card className="animate-fade-in">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => { setPwOpen(true); setPwSuccess(false); setPwError(null); }}>
                Change Password
              </Button>
              <Button variant="danger" icon={<LogOut className="size-4" />} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card>
        </Reveal>
      )}

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
            <Label htmlFor="s-current-pw">Current Password</Label>
            <PasswordInput id="s-current-pw" value={currentPw} onChange={setCurrentPw} autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="s-new-pw">New Password</Label>
            <PasswordInput id="s-new-pw" value={newPw} onChange={setNewPw} autoComplete="new-password" />
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
