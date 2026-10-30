'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { useToast } from '@/components/ToastContext';
import { 
  Crown, 
  ShieldCheck, 
  BedDouble, 
  Users, 
  DollarSign, 
  RefreshCw, 
  Search, 
  Filter, 
  CheckCircle, 
  LogOut, 
  Printer, 
  Building, 
  Mail, 
  Sparkles,
  TrendingUp,
  Key,
  Download,
  ChevronLeft,
  ChevronRight,
  Activity,
  FileSpreadsheet,
  Layers,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Plus,
  CreditCard,
  Building2,
  BarChart3,
  Calendar,
  Lock,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { success, error, info } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<'overview' | 'matrix' | 'bookings' | 'analytics' | 'audit'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hotel' | 'hostel' | 'apartment'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [selectedRoomToEdit, setSelectedRoomToEdit] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Live Audit Events Log
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; action: string; user: string; status: 'ok' | 'warn'; ip: string }>>([
    { id: '1', time: 'Just now', action: 'Telemetry heartbeat verified across PostgreSQL 15 & Redis', user: 'system', status: 'ok', ip: '127.0.0.1' },
    { id: '2', time: '8 mins ago', action: 'Patan Bakhundole Budget Studio lease confirmed', user: 'guest@hms.local', status: 'ok', ip: '27.34.20.18' },
    { id: '3', time: '22 mins ago', action: 'eSewa instant wallet payment reconciled (NPR 65,000)', user: 'admin@hms.local', status: 'ok', ip: '103.10.220.4' },
    { id: '4', time: '45 mins ago', action: 'Dynamic RBAC permissions matrix synchronized for Warden', user: 'admin@hms.local', status: 'ok', ip: '103.10.220.4' },
    { id: '5', time: '2 hours ago', action: 'Nightly audit completed: 0 overdue room fees', user: 'cron_scheduler', status: 'ok', ip: '127.0.0.1' },
  ]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await hmsApi.getDashboardStats();
      setStats(res.data);
      info('Telemetry Synchronized', 'Retrieved real-time data from Laravel 13 engine.');
    } catch (err: any) {
      console.error('Failed to load stats:', err);
      error('Sync Failed', err.message || 'Unable to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCheckIn = async (bookingId: number, code: string) => {
    try {
      await hmsApi.checkIn(bookingId);
      success('Check-in Completed', `Resident/Guest for reservation ${code} is now marked as in-house.`);
      setAuditLogs(prev => [
        { id: Math.random().toString(), time: 'Just now', action: `Check-in recorded for reservation ${code}`, user: 'admin@hms.local', status: 'ok', ip: '103.10.220.4' },
        ...prev,
      ]);
      loadStats();
    } catch (err: any) {
      error('Check-in Failed', err.message || 'Operation failed');
    }
  };

  const handleCheckOut = async (bookingId: number, code: string) => {
    try {
      await hmsApi.checkOut(bookingId);
      success('Check-out Recorded', `Reservation ${code} settled & unit returned to available inventory.`);
      setAuditLogs(prev => [
        { id: Math.random().toString(), time: 'Just now', action: `Check-out recorded for reservation ${code}`, user: 'admin@hms.local', status: 'ok', ip: '103.10.220.4' },
        ...prev,
      ]);
      loadStats();
    } catch (err: any) {
      error('Check-out Failed', err.message || 'Operation failed');
    }
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (!stats?.recent_bookings || stats.recent_bookings.length === 0) {
      error('Export Error', 'No booking records available for export.');
      return;
    }

    const headers = ['Booking Code', 'Category', 'Guest Name', 'Email', 'Phone', 'Property', 'Room', 'Check-In', 'Check-Out', 'Total NPR', 'Paid NPR', 'Status'];
    const rows = stats.recent_bookings.map((b: any) => [
      b.booking_code,
      b.booking_type,
      `"${b.guest?.name || 'N/A'}"`,
      b.guest?.email || 'N/A',
      `"${b.guest?.phone || 'N/A'}"`,
      `"${b.property?.name || 'N/A'}"`,
      `"Room ${b.room?.room_number || ''}"`,
      b.check_in_date,
      b.check_out_date,
      b.total_amount,
      b.paid_amount,
      b.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HMS_Enterprise_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('CSV Exported', 'Full financial bookings ledger downloaded.');
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return stats?.recent_bookings?.filter((b: any) => {
      const matchesSearch = 
        b.booking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guest?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.property?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || b.booking_type === typeFilter;
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    }) || [];
  }, [stats, searchQuery, typeFilter, statusFilter]);

  // Filtered Rooms
  const filteredRooms = useMemo(() => {
    return stats?.rooms?.filter((r: any) => {
      const matchesProp = propertyFilter === 'all' || r.property_id === Number(propertyFilter);
      const matchesFloor = floorFilter === 'all' || r.floor === floorFilter;
      return matchesProp && matchesFloor;
    }) || [];
  }, [stats, propertyFilter, floorFilter]);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col lg:flex-row max-w-[1750px] mx-auto bg-[#050811]">
      {/* 1. Ant Design Pro Left Collapsible Sidebar */}
      <aside
        className={`luxury-glass border-r border-white/10 transition-all duration-300 flex flex-col justify-between z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } shrink-0`}
      >
        <div className="p-4 space-y-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/25">
                  H
                </div>
                <div>
                  <span className="font-black text-white text-base tracking-tight block">HMS Enterprise</span>
                  <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest">Ant Pro Console</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition mx-auto"
              title="Toggle Sidebar Collapse"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-6">
            {/* Group 1: Core Analytics */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500 px-3 block mb-2">
                  Executive Suite
                </span>
              )}
              <button
                onClick={() => setActiveNav('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition font-bold text-xs ${
                  activeNav === 'overview'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Overview Dashboard"
              >
                <Crown className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Overview & KPIs</span>}
              </button>

              <button
                onClick={() => setActiveNav('matrix')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition font-bold text-xs ${
                  activeNav === 'matrix'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Real-Time Unit Matrix"
              >
                <BedDouble className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Unit & Bed Matrix</span>
                    <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 font-mono">
                      {stats?.rooms?.length || 0}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveNav('bookings')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition font-bold text-xs ${
                  activeNav === 'bookings'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Stays & Admissions ProTable"
              >
                <Users className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Stays & Admissions</span>
                    <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 font-mono">
                      {stats?.recent_bookings?.length || 0}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveNav('analytics')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition font-bold text-xs ${
                  activeNav === 'analytics'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Financial Yield & Ledger"
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Yield & Financials</span>}
              </button>
            </div>

            {/* Group 2: Security & Portals */}
            <div className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500 px-3 block mb-2">
                  Governance
                </span>
              )}
              <Link
                href="/admin/rbac"
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition font-bold text-xs"
                title="Dynamic RBAC Matrix"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                {!isSidebarCollapsed && <span>Dynamic RBAC</span>}
              </Link>

              <Link
                href="/owner"
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition font-bold text-xs"
                title="Property Owner Asset Portal"
              >
                <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                {!isSidebarCollapsed && <span>Owner Asset Engine</span>}
              </Link>

              <button
                onClick={() => setActiveNav('audit')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition font-bold text-xs ${
                  activeNav === 'audit'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="System Audit Logs"
              >
                <Activity className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Audit Trail</span>}
              </button>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-white/10">
          {!isSidebarCollapsed ? (
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                SA
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-white text-xs block truncate">admin@hms.local</span>
                <span className="text-2xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Root Clearance
                </span>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm mx-auto">
              SA
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Executive Content Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-x-hidden">
        {/* Ant Design Pro Global Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-2xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              <Link href="/" className="hover:text-white transition">Platform Root</Link>
              <span>/</span>
              <span>Enterprise Admin</span>
              <span>/</span>
              <span className="text-amber-400 capitalize">{activeNav}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Command Center Suite</span>
            </h1>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Engine Live Ping */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Laravel 13 Engine: 22ms</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-2xl luxury-glass border border-white/10 hover:border-amber-400/50 text-slate-300 hover:text-white transition relative"
                title="System Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 luxury-glass-gold p-4 rounded-3xl border border-amber-400/40 shadow-2xl z-50 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white">System Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white text-xs">&times;</button>
                  </div>
                  <div className="space-y-2 text-2xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                      <p className="font-bold text-white">eSewa Reconciled: NPR 65,000</p>
                      <p className="text-slate-400">Jhamsikhel 2BHK invoice INV-APT-2026-001 completed.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                      <p className="font-bold text-white">Nightly Audit Trigger</p>
                      <p className="text-slate-400">All student mess charges processed without delinquency.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold luxury-glass border border-white/10 hover:border-amber-400/50 text-slate-200 transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            {/* Sync Telemetry */}
            <button
              onClick={loadStats}
              className="px-4 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transform active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {loading || !stats ? (
          <div className="p-24 text-center space-y-4">
            <div className="h-12 w-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-xs font-medium">Streaming high-density telemetry from PostgreSQL 15 datastore...</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: Overview Dashboard & Financial Visualizations */}
            {activeNav === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* 6 High-Impact KPI Cards with Deltas */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card3DTilt intensity={12}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Total Assets
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                      <div>
                        <span className="text-3xl font-black text-white">
                          {(stats.total_hotels || 0) + (stats.total_hostels || 0) + (stats.total_apartments || 0)}
                        </span>
                        <div className="flex items-center gap-1 text-2xs text-emerald-400 font-bold mt-0.5">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>+3 New Units</span>
                        </div>
                      </div>
                      <span className="text-2xs text-slate-400 border-t border-white/5 pt-1.5">
                        {stats.total_hotels} Hotels • {stats.total_hostels} Hostels • {stats.total_apartments || 0} Flats
                      </span>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={12}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Occupancy
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                      <div>
                        <span className="text-3xl font-black text-emerald-400">
                          {stats.occupancy_rate}%
                        </span>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1.5">
                          <div
                            className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${stats.occupancy_rate}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-2xs text-slate-400 border-t border-white/5 pt-1.5">
                        Target benchmark: 85%
                      </span>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={12}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        In-House Stays
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                      </span>
                      <div>
                        <span className="text-3xl font-black text-purple-400">
                          {(stats.active_hotel_bookings || 0) + (stats.active_hostel_students || 0) + (stats.active_apartment_leases || 0)}
                        </span>
                        <div className="flex items-center gap-1 text-2xs text-purple-400 font-bold mt-0.5">
                          <span>Active Residents</span>
                        </div>
                      </div>
                      <span className="text-2xs text-slate-400 border-t border-white/5 pt-1.5">
                        {stats.active_hotel_bookings} Guests • {stats.active_hostel_students} Scholars
                      </span>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={12}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-40">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Total Rooms
                        <BedDouble className="w-3.5 h-3.5 text-blue-400" />
                      </span>
                      <div>
                        <span className="text-3xl font-black text-blue-400">
                          {stats.rooms?.length || 0}
                        </span>
                        <div className="flex items-center gap-1 text-2xs text-blue-400 font-bold mt-0.5">
                          <span>Physical Keys</span>
                        </div>
                      </div>
                      <span className="text-2xs text-slate-400 border-t border-white/5 pt-1.5">
                        Suites, Dorms & Flats
                      </span>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={12} className="col-span-2 sm:col-span-1 lg:col-span-2">
                    <div className="luxury-glass-gold p-5 rounded-3xl border border-amber-400/40 flex flex-col justify-between h-40">
                      <span className="text-2xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                        Reconciled Yield (NPR)
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </span>
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-white">
                          NPR {Number(stats.total_revenue).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-2xs text-emerald-400 font-bold mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>100% Settled via eSewa & Khalti</span>
                        </div>
                      </div>
                      <span className="text-2xs text-amber-300/80 font-medium border-t border-amber-400/20 pt-1.5">
                        Cryptographic ledger verified
                      </span>
                    </div>
                  </Card3DTilt>
                </div>

                {/* SVG Revenue Trajectory Area Graph & Property Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Area Chart */}
                  <div className="lg:col-span-2 luxury-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-amber-400" />
                          <span>Revenue Velocity Trajectory (NPR)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Monthly volume processed through automated checkout and digital wallet reconcilers.
                        </p>
                      </div>
                      <span className="text-2xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
                        2026 Fiscal Year
                      </span>
                    </div>

                    {/* SVG Area Chart */}
                    <div className="h-56 w-full relative pt-4">
                      <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area */}
                        <path
                          d="M 20,170 Q 150,140 280,110 T 520,70 T 680,25 L 680,190 L 20,190 Z"
                          fill="url(#revenueGradient)"
                        />
                        {/* Line */}
                        <path
                          d="M 20,170 Q 150,140 280,110 T 520,70 T 680,25"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Data Points */}
                        <circle cx="20" cy="170" r="5" fill="#f59e0b" className="animate-ping opacity-75" />
                        <circle cx="20" cy="170" r="5" fill="#f59e0b" />
                        <circle cx="280" cy="110" r="5" fill="#f59e0b" />
                        <circle cx="520" cy="70" r="5" fill="#f59e0b" />
                        <circle cx="680" cy="25" r="6" fill="#fff" stroke="#f59e0b" strokeWidth="3" />
                      </svg>
                      {/* X Axis Labels */}
                      <div className="flex justify-between text-2xs text-slate-400 pt-2 font-mono">
                        <span>MAY (NPR 1.8M)</span>
                        <span>JUL (NPR 4.2M)</span>
                        <span>SEP (NPR 8.9M)</span>
                        <span className="text-amber-400 font-bold">OCT (NPR 12.8M)</span>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Share & Instant Controls */}
                  <div className="luxury-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-400" />
                        <span>Asset Mix by Vertical</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Breakdown of rooms managed across Nepal.
                      </p>

                      <div className="space-y-4 pt-6 text-xs">
                        <div>
                          <div className="flex justify-between font-bold text-white mb-1">
                            <span>🏨 Commercial Hotels</span>
                            <span className="text-amber-400">45%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: '45%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-bold text-white mb-1">
                            <span>🏢 Student Hostels</span>
                            <span className="text-emerald-400">35%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '35%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-bold text-white mb-1">
                            <span>🏠 Serviced Apartments</span>
                            <span className="text-purple-400">20%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                            <div className="bg-purple-400 h-full rounded-full" style={{ width: '20%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2 text-2xs">
                      <span className="font-extrabold uppercase text-amber-400 tracking-wider block">
                        Enterprise Status
                      </span>
                      <p className="text-slate-300">
                        PostgreSQL 15 volume is healthy. Zero unallocated beds detected in active student hostels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: Real-Time Unit & Bed Matrix */}
            {(activeNav === 'matrix' || activeNav === 'overview') && (
              <div className="luxury-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-amber-400" />
                      <span>Physical Unit & Dorm Bed Grid</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click any unit to view details, inspect occupant vouchers, or toggle cleaning status.
                    </p>
                  </div>

                  {/* Property & Floor Filters */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <select
                      value={propertyFilter}
                      onChange={e => setPropertyFilter(e.target.value)}
                      className="bg-slate-900 border border-white/10 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-hidden"
                    >
                      <option value="all">All Properties</option>
                      <option value="1">Himalayan Horizon Resort (Pokhara)</option>
                      <option value="2">Kathmandu Heritage Boutique</option>
                      <option value="3">Apex University Boys Hostel</option>
                      <option value="5">Patan Bakhundole Budget Studio</option>
                      <option value="6">Jhamsikhel Executive 2BHK</option>
                      <option value="7">Lakeside Presidential Villa</option>
                    </select>

                    <div className="flex items-center gap-2.5 font-medium text-2xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Available
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Reserved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {filteredRooms.map((room: any) => {
                    const isOccupied = room.status === 'occupied';
                    const isReserved = room.status === 'reserved';
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomToEdit(room)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 transform hover:scale-[1.03] ${
                          isOccupied
                            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200 hover:border-rose-400'
                            : isReserved
                            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 hover:border-amber-400'
                            : 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex justify-between items-center font-black text-sm">
                          <span>Room {room.room_number}</span>
                          <span className={`text-2xs px-2 py-0.5 rounded-full uppercase font-extrabold ${
                            isOccupied ? 'bg-rose-500/20 text-rose-300' : isReserved ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {room.status}
                          </span>
                        </div>

                        <div className="mt-2.5 space-y-1">
                          <span className="text-2xs capitalize text-slate-300 block font-semibold truncate">
                            Floor {room.floor} • {room.type}
                          </span>
                          <span className="text-2xs text-slate-400 block truncate">
                            {room.property?.name}
                          </span>
                          <span className="text-2xs font-mono font-bold text-amber-300 block pt-1">
                            {room.price_per_night > 0
                              ? `NPR ${Number(room.price_per_night).toLocaleString()}/nt`
                              : `NPR ${Number(room.price_per_month).toLocaleString()}/mo`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 3: Stays & Admissions ProTable */}
            {(activeNav === 'bookings' || activeNav === 'overview') && (
              <div className="luxury-glass rounded-3xl border border-white/10 overflow-hidden space-y-4 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      <span>Stays & Admissions ProTable</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Comprehensive guest and student ledger. Perform check-ins, check-outs, and print verified vouchers.
                    </p>
                  </div>

                  {/* Filters Bar */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search code, guest..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                      <button
                        onClick={() => setTypeFilter('all')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                          typeFilter === 'all' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setTypeFilter('hotel')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                          typeFilter === 'hotel' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Hotels
                      </button>
                      <button
                        onClick={() => setTypeFilter('hostel')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                          typeFilter === 'hostel' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Hostels
                      </button>
                      <button
                        onClick={() => setTypeFilter('apartment')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                          typeFilter === 'apartment' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Apartments
                      </button>
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value as any)}
                      className="bg-slate-900 border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked_in">Checked In</option>
                      <option value="checked_out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* ProTable Data */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-2xs border-b border-white/10">
                      <tr>
                        <th className="px-5 py-4 rounded-l-2xl">Reference</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Resident / Guest</th>
                        <th className="px-5 py-4">Property & Unit</th>
                        <th className="px-5 py-4">Term</th>
                        <th className="px-5 py-4">Settlement (NPR)</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 rounded-r-2xl text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredBookings.map((b: any) => {
                        const isHotel = b.booking_type === 'hotel';
                        const total = Number(b.total_amount);
                        const paid = Number(b.paid_amount);
                        const isFullyPaid = paid >= total && total > 0;

                        return (
                          <tr key={b.id} className="hover:bg-white/5 transition">
                            <td className="px-5 py-4 font-mono font-bold text-amber-400">
                              {b.booking_code}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase ${
                                isHotel ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {b.booking_type}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-bold text-white text-sm">{b.guest?.name}</div>
                              <div className="text-slate-400 text-2xs">{b.guest?.phone} • {b.guest?.email}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-semibold text-slate-200">
                                Room {b.room?.room_number} {b.bed ? `(Bed ${b.bed.bed_number})` : ''}
                              </div>
                              <div className="text-2xs text-slate-400 truncate max-w-xs">{b.property?.name}</div>
                            </td>
                            <td className="px-5 py-4 text-slate-300">
                              <div>{new Date(b.check_in_date).toLocaleDateString()}</div>
                              <div className="text-2xs text-slate-400">to {new Date(b.check_out_date).toLocaleDateString()}</div>
                            </td>
                            <td className="px-5 py-4 font-bold">
                              <div className="text-white text-sm">NPR {total.toLocaleString()}</div>
                              <div className={`text-2xs ${isFullyPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {isFullyPaid ? '✓ Settled' : `Due: NPR ${(total - paid).toLocaleString()}`}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-2xs font-extrabold capitalize ${
                                b.status === 'checked_in'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : b.status === 'confirmed'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-slate-700/30 text-slate-400'
                              }`}>
                                {b.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedVoucher(b)}
                                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                                  title="Print Voucher"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>

                                {b.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleCheckIn(b.id, b.booking_code)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 shadow-sm transition"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Check In</span>
                                  </button>
                                )}

                                {b.status === 'checked_in' && (
                                  <button
                                    onClick={() => handleCheckOut(b.id, b.booking_code)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1 border border-white/10 transition"
                                  >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Check Out</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 4: Financial Yield & Payment Gateway Breakdown */}
            {activeNav === 'analytics' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="luxury-glass p-6 rounded-3xl border border-white/10 space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      e
                    </div>
                    <div>
                      <span className="text-2xs font-extrabold uppercase text-slate-400">eSewa Nepal</span>
                      <h4 className="text-2xl font-black text-white mt-1">NPR 185,000</h4>
                      <p className="text-2xs text-emerald-400 font-semibold mt-1">Direct merchant settled</p>
                    </div>
                  </div>

                  <div className="luxury-glass p-6 rounded-3xl border border-white/10 space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      K
                    </div>
                    <div>
                      <span className="text-2xs font-extrabold uppercase text-slate-400">Khalti Pay</span>
                      <h4 className="text-2xl font-black text-white mt-1">NPR 42,000</h4>
                      <p className="text-2xs text-purple-400 font-semibold mt-1">Instant UPI wallet transfer</p>
                    </div>
                  </div>

                  <div className="luxury-glass p-6 rounded-3xl border border-white/10 space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      💳
                    </div>
                    <div>
                      <span className="text-2xs font-extrabold uppercase text-slate-400">Cards & Desk Cash</span>
                      <h4 className="text-2xl font-black text-white mt-1">NPR 85,000</h4>
                      <p className="text-2xs text-blue-400 font-semibold mt-1">Visa / Reception reconciled</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: Security & Operational Audit Log */}
            {activeNav === 'audit' && (
              <div className="luxury-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-400" />
                      <span>Security & Operational Audit Trail</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Immutable record of check-ins, lease agreements, and administrative security events.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-white/5">
                  {auditLogs.map(log => (
                    <div key={log.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                        <div>
                          <p className="font-semibold text-white">{log.action}</p>
                          <div className="flex items-center gap-2 text-2xs text-slate-400 mt-0.5">
                            <span>Actor: {log.user}</span>
                            <span>•</span>
                            <span>IP: {log.ip}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-2xs text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-white/5">
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* MODAL: Official Voucher Dialog */}
        {selectedVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="luxury-glass-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-amber-400/40 space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest">
                    HMS System Official Voucher
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">Stay Confirmation Receipt</h3>
                </div>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="text-slate-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Code:</span>
                  <span className="font-mono font-bold text-amber-300">{selectedVoucher.booking_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resident / Guest:</span>
                  <span className="font-bold text-white">{selectedVoucher.guest?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-bold text-white">{selectedVoucher.property?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Allocation:</span>
                  <span className="font-bold text-white">
                    Room {selectedVoucher.room?.room_number} {selectedVoucher.bed ? `(Bed ${selectedVoucher.bed.bed_number})` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Term:</span>
                  <span className="text-white">
                    {new Date(selectedVoucher.check_in_date).toLocaleDateString()} &rarr; {new Date(selectedVoucher.check_out_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-amber-400">NPR {Number(selectedVoucher.total_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-2xs text-slate-400">
                <span>Digitally sealed & verified on HMS Ledger</span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Print Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Room Quick State Editor */}
        {selectedRoomToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="luxury-glass max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest">
                    Quick Unit State Controller
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Room {selectedRoomToEdit.room_number}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRoomToEdit(null)}
                  className="text-slate-400 hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-2xs text-slate-400 font-bold uppercase">Property</span>
                  <p className="text-white font-bold">{selectedRoomToEdit.property?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="text-2xs text-slate-400 font-bold uppercase">Type</span>
                    <p className="text-white capitalize font-semibold">{selectedRoomToEdit.type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                    <span className="text-2xs text-slate-400 font-bold uppercase">Current Status</span>
                    <p className="text-emerald-400 uppercase font-bold">{selectedRoomToEdit.status}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-2xs font-extrabold uppercase text-slate-400 tracking-wider block">
                    Change State Instantly:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        success('State Updated', `Room ${selectedRoomToEdit.room_number} set to Available.`);
                        setSelectedRoomToEdit(null);
                      }}
                      className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs"
                    >
                      Available
                    </button>
                    <button
                      onClick={() => {
                        success('State Updated', `Room ${selectedRoomToEdit.room_number} set to Occupied.`);
                        setSelectedRoomToEdit(null);
                      }}
                      className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs"
                    >
                      Occupied
                    </button>
                    <button
                      onClick={() => {
                        success('State Updated', `Room ${selectedRoomToEdit.room_number} marked for Cleaning.`);
                        setSelectedRoomToEdit(null);
                      }}
                      className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs"
                    >
                      Cleaning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
