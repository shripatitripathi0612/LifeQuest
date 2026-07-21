import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthShell from '../components/common/AuthShell';
import { useAuthStore } from '../store/authStore';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const res = await resetPassword(email);
    if (res.success) setSent(true);
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="We'll send you a link to get back in"
      footer={
        <Link to="/login" className="text-electric-400 font-semibold hover:text-electric-300">
          Back to Sign In
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          <p className="text-sm text-slate-400">
            If an account exists for <span className="text-white">{email}</span>, a reset link is on its way.
          </p>
        </div>
      ) : (
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

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            <KeyRound className="w-4 h-4" />
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
