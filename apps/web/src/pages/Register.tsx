import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [rollNumber, setRollNumber] = useState('');
  const [semester, setSemester] = useState(1);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          rollNumber: role === 'STUDENT' ? rollNumber : undefined,
          semester: role === 'STUDENT' ? Number(semester) : undefined,
        }),
      });

      if (res.success) {
        setSuccessMsg('Account created successfully! Check server console for email verification link.');
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create SmartCampus Account</h2>
          <p className="text-xs text-slate-400">Join the digital operating system for modern education</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="University Email Address"
            type="email"
            placeholder="jane.doe@smartcampus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-sm text-slate-100 focus:border-brand-500 focus:outline-none"
            >
              <option value="STUDENT">STUDENT</option>
              <option value="FACULTY">FACULTY</option>
              <option value="COORDINATOR">COORDINATOR</option>
            </select>
          </div>

          {role === 'STUDENT' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Roll Number"
                placeholder="CS2024-099"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
              <Input
                label="Semester"
                type="number"
                min="1"
                max="10"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
              />
            </div>
          )}

          <Button type="submit" className="w-full py-2.5 font-semibold" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered? <Link to="/login" className="text-brand-400 hover:underline font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
