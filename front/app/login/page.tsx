'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { Crown, Hotel, Users, CreditCard, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await hmsApi.login({ email, password });
      if (res.access_token) {
        localStorage.setItem('hms_auth_token', res.access_token);
        localStorage.setItem('hms_user', JSON.stringify(res.user));

        if (res.user.roles?.includes('super_admin')) {
          router.push('/admin');
        } else if (res.user.roles?.includes('owner')) {
          router.push('/owner');
        } else {
          router.push('/portal');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, destination: string) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card3DTilt intensity={10} className="max-w-md w-full">
        <div className="luxury-glass-gold rounded-3xl p-8 border border-amber-400/40 shadow-2xl space-y-6">
          <div className="text-center pb-4 border-b border-white/10">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl mx-auto shadow-lg shadow-amber-500/30">
              H
            </div>
            <h2 className="text-2xl font-black text-white mt-3">HMS Access Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Cryptographic Bearer Tokens & Dynamic RBAC</p>
          </div>

          {/* 1-Click Demo Pills */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2.5">
            <span className="block text-2xs font-extrabold text-amber-400 uppercase tracking-widest text-center">
              ⚡ 1-Click Fast Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-2xs">
              <button
                type="button"
                onClick={() => fillCredentials('admin@hms.local', '/admin')}
                className="p-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-bold text-center transition flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-purple-400" />
                <span>Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('hotel.owner@hms.local', '/owner')}
                className="p-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold text-center transition flex items-center justify-center gap-1.5"
              >
                <Hotel className="w-3.5 h-3.5 text-blue-400" />
                <span>Hotelier</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('hostel.owner@hms.local', '/owner')}
                className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-center transition flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Hostel Warden</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('guest@hms.local', '/portal')}
                className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold text-center transition flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student / Guest</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-2xs font-extrabold uppercase text-slate-400 mb-1 tracking-wider">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@hms.local"
                className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-400 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-2xs font-extrabold uppercase text-slate-400 mb-1 tracking-wider">
                Secret Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-400 text-sm font-medium font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Authorize Session'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
            <Link href="/" className="hover:text-amber-300 flex items-center justify-center gap-1">
              <span>&larr; Return to Homepage</span>
            </Link>
          </p>
        </div>
      </Card3DTilt>
    </div>
  );
}
