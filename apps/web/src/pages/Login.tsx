import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, Lock, Mail, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleNotice, setGoogleNotice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Password123!');
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await apiFetch('/api/auth/google');
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setGoogleNotice('Google OAuth credentials are not configured in environment variables.');
      }
    } catch {
      setGoogleNotice('Google OAuth is not configured on this server environment.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to SmartCampus</h2>
          <p className="text-xs text-slate-400">Enter your university email to access your role dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {googleNotice && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
            {googleNotice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="student@smartcampus.demo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <Link to="/forgot-password" className="text-brand-400 hover:underline">Forgot Password?</Link>
          </div>

          <Button type="submit" className="w-full py-2.5 font-semibold" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center justify-center space-x-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Sign In with Google</span>
        </button>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500 text-center">Quick Demo Credentials (One-Click)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fillDemo('student@smartcampus.demo')}
              className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 text-center border border-slate-700"
            >
              🎓 Student
            </button>
            <button
              onClick={() => fillDemo('faculty@smartcampus.demo')}
              className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 text-center border border-slate-700"
            >
              👨‍🏫 Faculty
            </button>
            <button
              onClick={() => fillDemo('coordinator@smartcampus.demo')}
              className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 text-center border border-slate-700"
            >
              🎯 Coordinator
            </button>
            <button
              onClick={() => fillDemo('admin@smartcampus.demo')}
              className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 text-center border border-slate-700"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account? <Link to="/register" className="text-brand-400 hover:underline font-semibold">Register here</Link>
        </p>
      </div>
    </div>
  );
};
