import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// NOTE: This is a local, client-only mock auth system for demo purposes.
// There is no backend, so "passwords" are only obscured (not securely hashed)
// and sessions are just an id stored in localStorage/sessionStorage.

const USERS_KEY = 'studynova:auth:users:v1';
const SESSION_KEY = 'studynova:auth:session:v1';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  login: (
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<AuthUser, 'name' | 'email' | 'avatar'>>) => void;
  changePassword: (currentPassword: string, newPassword: string) => { ok: true } | { ok: false; error: string };
}

function obscure(pw: string): string {
  return typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(pw))) : pw;
}

function loadUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
}

function writeSession(userId: string, remember: boolean) {
  if (remember) {
    localStorage.setItem(SESSION_KEY, userId);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, userId);
    localStorage.removeItem(SESSION_KEY);
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>(loadUsers);
  const [user, setUser] = useState<AuthUser | null>(() => {
    const sessionId = readSessionUserId();
    if (!sessionId) return null;
    return loadUsers().find((u) => u.id === sessionId) ?? null;
  });

  const signUp: AuthContextValue['signUp'] = async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password: obscure(password),
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    saveUsers(nextUsers);
    writeSession(newUser.id, true);
    setUser(newUser);
    return { ok: true };
  };

  const login: AuthContextValue['login'] = async (email, password, remember) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email === normalizedEmail);
    if (!found || found.password !== obscure(password)) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    writeSession(found.id, remember);
    setUser(found);
    return { ok: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const updateProfile: AuthContextValue['updateProfile'] = (patch) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    const nextUsers = users.map((u) => (u.id === user.id ? updated : u));
    setUsers(nextUsers);
    saveUsers(nextUsers);
    setUser(updated);
  };

  const changePassword: AuthContextValue['changePassword'] = (currentPassword, newPassword) => {
    if (!user) return { ok: false, error: 'Not logged in.' };
    if (user.password !== obscure(currentPassword)) {
      return { ok: false, error: 'Current password is incorrect.' };
    }
    const updated = { ...user, password: obscure(newPassword) };
    const nextUsers = users.map((u) => (u.id === user.id ? updated : u));
    setUsers(nextUsers);
    saveUsers(nextUsers);
    setUser(updated);
    return { ok: true };
  };

  const value: AuthContextValue = {
    user,
    loading: false,
    signUp,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
