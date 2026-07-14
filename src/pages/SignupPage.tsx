import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, UserPlus } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import Input, { Label } from '../components/common/Input';
import PasswordInput, { passwordStrength } from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(password);

  const validate = (): string | null => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await signUp(name, email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start planning smarter, today"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
        )}

        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            icon={<User className="size-4" />}
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            icon={<Mail className="size-4" />}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="new-password" />
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex h-1.5 gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-200 ${
                      i < strength.score ? strength.colorClass : 'bg-surface'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-text-secondary">Password strength: {strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="confirm">Confirm Password</Label>
          <PasswordInput id="confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        </div>

        <Button type="submit" icon={<UserPlus className="size-4" />} loading={submitting} className="w-full">
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}
