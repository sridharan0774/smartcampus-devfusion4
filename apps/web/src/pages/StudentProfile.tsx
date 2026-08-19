import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Phone, Linkedin, Github, FileText, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

export const StudentProfile: React.FC = () => {
  const { user, refetchUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const res = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          phone,
          bio,
          linkedinUrl,
          githubUrl,
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
        await refetchUser();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h1>
          <p className="text-xs text-slate-500">{user?.email} | Role: <span className="font-semibold uppercase text-brand-600">{user?.role}</span></p>
          <p className="text-xs text-slate-400 mt-1">Roll: {user?.rollNumber || 'N/A'} | Semester {user?.semester || 6}</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <Card title="Edit Personal Information &amp; Portfolio Links">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Bio &amp; Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none"
              placeholder="Tell us about your academic interests..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="LinkedIn Profile URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              leftIcon={<Linkedin className="w-4 h-4" />}
            />
            <Input
              label="GitHub Profile URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              leftIcon={<Github className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Technical Skills (Comma Separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, Node.js, TypeScript, PostgreSQL"
          />

          <Button type="submit" isLoading={isSaving}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};
