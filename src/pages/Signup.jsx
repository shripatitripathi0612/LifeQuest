import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthShell from '../components/common/AuthShell';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');
  const [done, setDone] = useState(false);
  const { signUp, loading, error, clearError, isDemoMode } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    const res = await signUp(email, password);
    if (res.success) {
      if (res.needsEmailConfirmation) {
        setDone(true);
      } else {
        navigate('/app');
      }
    }
  };

  if (done) {
    return (
      <AuthShell title="Check Your Inbox" subtitle="Almost there, hero">
        <div className="flex flex-col items-center text-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <p className="text-sm text-slate-400">
            We've sent a confirmation link to <span className="text-white">{email}</span>. Confirm your email to begin your quest.
          </p>
          <Link to="/login" className="btn-secondary mt-2">Back to Sign In</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Begin Your Quest"
      subtitle="Create your hero account"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-electric-400 font-semibold hover:text-electric-300">
            Sign in
          </Link>
        </>
      }
    >
      {isDemoMode && (
        <div className="mb-4 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2">
          Demo mode: no Supabase project connected, so accounts are stored locally in this browser. See README to connect real Supabase auth.
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="password"
            required
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {(error || localError) && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {localError || error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          <UserPlus className="w-4 h-4" />
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  );
}
