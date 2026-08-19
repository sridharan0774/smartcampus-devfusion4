import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    apiFetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(res => {
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Email address verified successfully!');
        } else {
          setStatus('error');
          setMessage(res.message || 'Verification failed.');
        }
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.message || 'Verification failed.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
          <GraduationCap className="w-8 h-8" />
        </div>

        {status === 'loading' && (
          <div className="space-y-2">
            <p className="text-lg font-bold text-white">Verifying Account Token...</p>
            <p className="text-xs text-slate-400">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Email Verified!</h2>
            <p className="text-xs text-slate-400">{message}</p>
            <Link to="/login">
              <Button className="w-full">Proceed to Sign In</Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-xs text-red-400">{message}</p>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
