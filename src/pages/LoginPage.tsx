import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, LogIn } from 'lucide-react';
import AuthShell from '../components/auth/AuthShell';
import Input, { Checkbox, Label } from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    const result = await login(email, password, remember);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/', { replace: true });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your study plan"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-accent hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
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
          <PasswordInput id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <button
            type="button"
            onClick={() => setShowForgot((s) => !s)}
            className="text-sm font-medium text-accent hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {showForgot && (
          <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-secondary animate-fade-in">
            If an account exists for that email, we&apos;ve sent password reset instructions. (Demo only — no email
            is actually sent.)
          </div>
        )}

        <Button type="submit" icon={<LogIn className="size-4" />} loading={submitting} className="w-full">
          Sign In
        </Button>
      </form>
    </AuthShell>
  );
}
