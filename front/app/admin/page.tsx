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
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { success, error, info } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<'overview' | 'matrix' | 'bookings' | 'audit' | 'settings'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hotel' | 'hostel' | 'apartment'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  // Live Audit Events Log
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; action: string; user: string; status: 'ok' | 'warn' }>>([
    { id: '1', time: 'Just now', action: 'Live Telemetry heartbeat verified from Laravel 13 engine', user: 'system', status: 'ok' },
    { id: '2', time: '12 mins ago', action: 'Guest Patan Bakhundole Studio lease confirmed', user: 'guest@hms.local', status: 'ok' },
    { id: '3', time: '28 mins ago', action: 'eSewa settlement reconciled for NPR 65,000', user: 'admin@hms.local', status: 'ok' },
    { id: '4', time: '1 hour ago', action: 'Role permissions matrix synchronized for Hostel Warden', user: 'admin@hms.local', status: 'ok' },
  ]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await hmsApi.getDashboardStats();
      setStats(res.data);
      info('Telemetry Synced', 'Live operational metrics updated from backend API.');
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
      success('Check-in Verified', `Resident/Guest for reservation ${code} successfully checked in.`);
      setAuditLogs(prev => [
        { id: Math.random().toString(), time: 'Just now', action: `Check-in executed for ${code}`, user: 'admin@hms.local', status: 'ok' },
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
      success('Check-out Recorded', `Reservation ${code} checked out. Unit inventory restored.`);
      setAuditLogs(prev => [
        { id: Math.random().toString(), time: 'Just now', action: `Check-out executed for ${code}`, user: 'admin@hms.local', status: 'ok' },
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

    const headers = ['Booking Code', 'Type', 'Guest Name', 'Email', 'Property', 'Room', 'Check-In', 'Check-Out', 'Total NPR', 'Paid NPR', 'Status'];
    const rows = stats.recent_bookings.map((b: any) => [
      b.booking_code,
      b.booking_type,
      `"${b.guest?.name || 'N/A'}"`,
      b.guest?.email || 'N/A',
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
    link.setAttribute('download', `HMS_Bookings_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('CSV Exported', 'Downloaded complete financial bookings ledger.');
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
      if (propertyFilter === 'all') return true;
      return r.property_id === Number(propertyFilter);
    }) || [];
  }, [stats, propertyFilter]);

  return (
    <div className="min-h-screen text-slate-100 flex flex-col lg:flex-row max-w-[1600px] mx-auto">
      {/* 1. Ant Design Pro Collapsible Enterprise Sidebar */}
      <aside
        className={`luxury-glass border-r border-white/10 transition-all duration-300 flex flex-col justify-between z-20 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } shrink-0`}
      >
        <div className="p-4 space-y-6">
          {/* Brand & Collapse Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
                  H
                </div>
                <div>
                  <span className="font-black text-white text-sm tracking-tight block">HMS Enterprise</span>
                  <span className="text-2xs text-amber-400 font-bold uppercase tracking-wider">Ant Pro Console</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition mx-auto"
              title="Toggle Sidebar Collapse"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveNav('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition ${
                activeNav === 'overview'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Overview Telemetry"
            >
              <Crown className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Overview & KPIs</span>}
            </button>

            <button
              onClick={() => setActiveNav('matrix')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition ${
                activeNav === 'matrix'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Unit & Bed Matrix"
            >
              <BedDouble className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Unit & Bed Matrix</span>}
            </button>

            <button
              onClick={() => setActiveNav('bookings')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition ${
                activeNav === 'bookings'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Stays & Admissions Ledger"
            >
              <Users className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>Stays Ledger</span>
                  <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-900/60 font-bold">
                    {stats?.recent_bookings?.length || 0}
                  </span>
                </div>
              )}
            </button>

            <Link
              href="/admin/rbac"
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition"
              title="Dynamic RBAC Matrix"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              {!isSidebarCollapsed && <span>Dynamic RBAC</span>}
            </Link>

            <button
              onClick={() => setActiveNav('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition ${
                activeNav === 'audit'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Audit Logs"
            >
              <Activity className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Audit Trail</span>}
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-white/10">
          {!isSidebarCollapsed ? (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-white text-xs block truncate">admin@hms.local</span>
                <span className="text-2xs text-purple-400 font-semibold block">Super Administrator</span>
              </div>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs mx-auto">
              SA
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Executive Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-x-hidden">
        {/* Ant Design Pro Global Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-2xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              <span>Home</span>
              <span>/</span>
              <span>Admin Suite</span>
              <span>/</span>
              <span className="text-amber-400 capitalize">{activeNav}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Enterprise Command Center</span>
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-2xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              API v1 Live Telemetry
            </span>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-bold luxury-glass border border-white/10 hover:border-amber-400/50 text-slate-200 transition flex items-center gap-1.5 shadow-sm"
              title="Export Bookings to CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadStats}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {loading || !stats ? (
          <div className="p-20 text-center space-y-4">
            <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-xs">Streaming real-time telemetry from Laravel 13 API...</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: Overview KPIs & Charts */}
            {activeNav === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* 6 High-Impact KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card3DTilt intensity={14}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-36">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Properties
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                      <span className="text-3xl font-black text-white">
                        {(stats.total_hotels || 0) + (stats.total_hostels || 0) + (stats.total_apartments || 0)}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {stats.total_hotels} Hotels • {stats.total_hostels} Hostels • {stats.total_apartments || 0} Apts
                      </span>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={14}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-36">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Occupancy
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                      <span className="text-3xl font-black text-emerald-400">
                        {stats.occupancy_rate}%
                      </span>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${stats.occupancy_rate}%` }}
                        />
                      </div>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={14}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-36">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        In-House Stays
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                      </span>
                      <span className="text-3xl font-black text-purple-400">
                        {(stats.active_hotel_bookings || 0) + (stats.active_hostel_students || 0) + (stats.active_apartment_leases || 0)}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {stats.active_hotel_bookings} Guests • {stats.active_hostel_students} Scholars • {stats.active_apartment_leases || 0} Tenants
                      </span>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={14}>
                    <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-36">
                      <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Configured Units
                        <BedDouble className="w-3.5 h-3.5 text-blue-400" />
                      </span>
                      <span className="text-3xl font-black text-blue-400">
                        {stats.rooms?.length || 0}
                      </span>
                      <span className="text-2xs text-slate-400">Rooms & Dorm Flats</span>
                    </div>
                  </Card3DTilt>

                  <Card3DTilt intensity={14} className="col-span-2 sm:col-span-1 lg:col-span-2">
                    <div className="luxury-glass-gold p-5 rounded-3xl border border-amber-400/40 flex flex-col justify-between h-36">
                      <span className="text-2xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                        Verified Revenue (NPR)
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        NPR {Number(stats.total_revenue).toLocaleString()}
                      </span>
                      <span className="text-2xs text-amber-300/80 font-medium">
                        Reconciled via eSewa, Khalti & Cards
                      </span>
                    </div>
                  </Card3DTilt>
                </div>

                {/* Quick Split: Unit Summary & Recent Bookings Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Unit State Gauge */}
                  <div className="luxury-glass rounded-3xl p-6 border border-white/10 space-y-4">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-amber-400" />
                      <span>Unit Inventory Health</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-2xl font-black text-emerald-400">
                          {stats.rooms?.filter((r: any) => r.status === 'available').length || 0}
                        </span>
                        <span className="block text-2xs text-slate-400 font-bold uppercase mt-1">Available</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                        <span className="text-2xl font-black text-rose-400">
                          {stats.rooms?.filter((r: any) => r.status === 'occupied').length || 0}
                        </span>
                        <span className="block text-2xs text-slate-400 font-bold uppercase mt-1">Occupied</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        <span className="text-2xl font-black text-amber-400">
                          {stats.rooms?.filter((r: any) => r.status === 'reserved').length || 0}
                        </span>
                        <span className="block text-2xs text-slate-400 font-bold uppercase mt-1">Reserved</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      Real-time inventory locks prevent double-booking across commercial hotels, student hostel bunks, and serviced apartments.
                    </p>
                  </div>

                  {/* Operational Audit Preview */}
                  <div className="luxury-glass rounded-3xl p-6 border border-white/10 space-y-4">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span>Live Audit Feed</span>
                    </h3>
                    <div className="space-y-2.5">
                      {auditLogs.slice(0, 3).map(log => (
                        <div key={log.id} className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                            <span className="text-slate-200">{log.action}</span>
                          </div>
                          <span className="text-2xs text-slate-400">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: Real-Time Room & Dorm Bed Matrix */}
            {(activeNav === 'matrix' || activeNav === 'overview') && (
              <div className="luxury-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-amber-400" />
                      <span>Real-Time Room & Dorm Bed Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Live state machine across all hotel suites and student hostel dormitory bunks.
                    </p>
                  </div>

                  {/* Status Legend & Property Filter */}
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

                {/* Room Units Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredRooms.map((room: any) => {
                    const isOccupied = room.status === 'occupied';
                    const isReserved = room.status === 'reserved';
                    return (
                      <div
                        key={room.id}
                        className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                          isOccupied
                            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                            : isReserved
                            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                            : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200 hover:border-emerald-400/60'
                        }`}
                      >
                        <div className="flex justify-between items-center font-black text-sm">
                          <span>Room {room.room_number}</span>
                          <span className={`text-2xs px-2 py-0.5 rounded-full uppercase font-bold ${
                            isOccupied ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {room.status}
                          </span>
                        </div>

                        <div className="mt-2 space-y-0.5">
                          <span className="text-2xs capitalize text-slate-300 block font-semibold">
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

            {/* VIEW 3: ProTable Reservations Ledger */}
            {(activeNav === 'bookings' || activeNav === 'overview') && (
              <div className="luxury-glass rounded-3xl border border-white/10 overflow-hidden space-y-4 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      <span>Real-Time Guest Stays & Student Admissions</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Execute check-ins, check-outs, generate vouchers, and track outstanding balances.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search code, guest..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                      <button
                        onClick={() => setTypeFilter('all')}
                        className={`px-3 py-1 rounded-lg font-bold transition ${
                          typeFilter === 'all' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setTypeFilter('hotel')}
                        className={`px-3 py-1 rounded-lg font-bold transition ${
                          typeFilter === 'hotel' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Hotels
                      </button>
                      <button
                        onClick={() => setTypeFilter('hostel')}
                        className={`px-3 py-1 rounded-lg font-bold transition ${
                          typeFilter === 'hostel' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Hostels
                      </button>
                      <button
                        onClick={() => setTypeFilter('apartment')}
                        className={`px-3 py-1 rounded-lg font-bold transition ${
                          typeFilter === 'apartment' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Apartments
                      </button>
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value as any)}
                      className="bg-slate-900 border border-white/10 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-hidden"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked_in">Checked In</option>
                      <option value="checked_out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-2xs border-b border-white/10">
                      <tr>
                        <th className="px-5 py-3.5 rounded-l-xl">Reference</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Resident / Guest</th>
                        <th className="px-5 py-3.5">Property & Unit</th>
                        <th className="px-5 py-3.5">Stay Term</th>
                        <th className="px-5 py-3.5">Settlement (NPR)</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 rounded-r-xl text-right">Actions</th>
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

            {/* VIEW 4: Audit Trail Log */}
            {activeNav === 'audit' && (
              <div className="luxury-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-amber-400" />
                      <span>Security & Operational Audit Trail</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cryptographically tracked administrative events, check-ins, lease submissions, and billing events.
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
                          <span className="text-2xs text-slate-400">Initiator: {log.user}</span>
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
      </main>
    </div>
  );
}
