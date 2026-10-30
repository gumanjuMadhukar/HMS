'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { 
  ShieldCheck, 
  Key, 
  Users, 
  Lock, 
  Plus, 
  Check, 
  RefreshCw, 
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';

export default function RbacMatrixPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matrix' | 'users'>('matrix');
  const [newRole, setNewRole] = useState({ name: '', slug: '', description: '' });
  const [creatingRole, setCreatingRole] = useState(false);

  const loadMatrix = async () => {
    setLoading(true);
    try {
      const res = await hmsApi.getRbacMatrix();
      setData(res);
    } catch (err) {
      console.error('Failed to load RBAC matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatrix();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingRole(true);
    try {
      await hmsApi.createRole(newRole);
      setNewRole({ name: '', slug: '', description: '' });
      await loadMatrix();
    } catch (err: any) {
      alert(err.message || 'Failed to create role');
    } finally {
      setCreatingRole(false);
    }
  };

  const handleTogglePermission = async (role: any, permissionId: number) => {
    const currentPermIds = role.permissions.map((p: any) => p.id);
    const newPermIds = currentPermIds.includes(permissionId)
      ? currentPermIds.filter((id: number) => id !== permissionId)
      : [...currentPermIds, permissionId];

    try {
      await hmsApi.syncRolePermissions(role.id, newPermIds);
      loadMatrix();
    } catch (err: any) {
      alert(err.message || 'Permission update failed');
    }
  };

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">
            <Link href="/admin" className="hover:text-amber-300 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Command Center</span>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-400 stroke-[2.5]" />
            <span>Dynamic RBAC Security Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Fine-grained role and permission management matrix spanning Hotel Ops, Hostel Dorm Admissions, Invoicing, and User Accounts.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Permission Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts ({data?.users?.total || 4})</span>
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="p-20 text-center space-y-4">
          <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs">Querying RBAC authorization matrix...</p>
        </div>
      ) : activeTab === 'matrix' ? (
        <div className="space-y-8">
          {/* Create Custom Role Card */}
          <div className="luxury-glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Define Custom Operational Role</span>
            </div>
            <form onSubmit={handleCreateRole} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Role Name (e.g. Chief Concierge)"
                required
                value={newRole.name}
                onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                className="bg-slate-900 border border-white/10 p-3 rounded-2xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Slug (e.g. concierge_lead)"
                required
                value={newRole.slug}
                onChange={e => setNewRole({ ...newRole, slug: e.target.value })}
                className="bg-slate-900 border border-white/10 p-3 rounded-2xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 font-mono"
              />
              <input
                type="text"
                placeholder="Description of duties"
                value={newRole.description}
                onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                className="bg-slate-900 border border-white/10 p-3 rounded-2xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={creatingRole}
                className="rounded-2xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 p-3 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
              >
                {creatingRole ? 'Creating...' : '+ Create Role'}
              </button>
            </form>
          </div>

          {/* Matrix Cards for Each Role */}
          <div className="space-y-6">
            {data.roles?.map((role: any) => {
              const isSuper = role.slug === 'super_admin';
              return (
                <div
                  key={role.id}
                  className="luxury-glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 hover:border-amber-400/40 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black">
                        {role.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-white">{role.name}</h3>
                          <span className="font-mono text-2xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-white/10">
                            {role.slug}
                          </span>
                          {role.is_system && (
                            <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              System Core
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{role.description || 'System assigned role'}</p>
                      </div>
                    </div>

                    <div className="text-xs text-amber-300 font-bold px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20">
                      {isSuper ? 'All Permissions Granted' : `${role.permissions?.length || 0} Permissions Active`}
                    </div>
                  </div>

                  {isSuper ? (
                    <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>The Super Administrator possesses unrestricted, root-level cryptographic access across all hotel and hostel modules.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(data.permissions_by_module || {}).map(([moduleName, perms]: [string, any]) => (
                        <div
                          key={moduleName}
                          className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3"
                        >
                          <span className="text-2xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                            <Layers className="w-3.5 h-3.5 text-amber-400" />
                            <span>{moduleName} Module</span>
                          </span>

                          <div className="space-y-2.5">
                            {perms.map((p: any) => {
                              const isChecked = role.permissions?.some((rp: any) => rp.id === p.id);
                              return (
                                <label
                                  key={p.id}
                                  className="flex items-start gap-2.5 text-xs cursor-pointer group select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleTogglePermission(role, p.id)}
                                    className="mt-0.5 rounded border-white/20 bg-slate-900 text-amber-400 focus:ring-amber-400"
                                  />
                                  <div>
                                    <span className={`font-semibold block transition ${isChecked ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                      {p.name}
                                    </span>
                                    <span className="text-2xs font-mono text-slate-500">{p.slug}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Users Tab */
        <div className="luxury-glass rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 text-2xs uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Assigned Roles</th>
                <th className="px-6 py-4 text-right">Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.users?.data?.map((u: any) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-bold text-white text-sm">{u.name}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{u.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {u.roles?.map((r: any) => (
                        <span
                          key={r.id}
                          className="px-2.5 py-1 rounded-xl text-2xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        >
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-500/20 text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Active OAuth
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
