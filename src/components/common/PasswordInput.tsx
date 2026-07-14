import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';

export default function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  id,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        icon={<Lock className="size-4" />}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function passwordStrength(pw: string): { score: number; label: string; colorClass: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Weak', colorClass: 'bg-danger' };
  if (score <= 3) return { score, label: 'Fair', colorClass: 'bg-warning' };
  return { score, label: 'Strong', colorClass: 'bg-success' };
}
