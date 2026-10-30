'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
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
  Key
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hotel' | 'hostel' | 'apartment'>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await hmsApi.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCheckIn = async (bookingId: number) => {
    try {
      await hmsApi.checkIn(bookingId);
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (bookingId: number) => {
    try {
      await hmsApi.checkOut(bookingId);
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Check-out failed');
    }
  };

  // Filtered bookings
  const filteredBookings = stats?.recent_bookings?.filter((b: any) => {
    const matchesSearch = 
      b.booking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.property?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || b.booking_type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  // Filtered rooms
  const filteredRooms = stats?.rooms?.filter((r: any) => {
    if (propertyFilter === 'all') return true;
    return r.property_id === Number(propertyFilter);
  }) || [];

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Luxury Executive Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>HMS EXECUTIVE COMMAND CONSOLE • LIVE TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <Crown className="w-8 h-8 text-amber-400 inline stroke-[2.5]" />
            <span>Super Administrator Suite</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time control over global luxury hotel allocations, student dormitory beds, dynamic RBAC access, and automated billing.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/rbac"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Dynamic RBAC</span>
          </Link>

          <Link
            href="/owner"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
          >
            <Key className="w-4 h-4" />
            <span>Owner Portal</span>
          </Link>

          <a
            href="http://localhost:8025"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-2xl luxury-glass text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition"
            title="Open Mailpit Sandbox"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Mailpit</span>
          </a>

          <button
            onClick={loadStats}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
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
          {/* 6 High-Impact 3D KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* KPI 1 */}
            <Card3DTilt intensity={15}>
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

            {/* KPI 2 */}
            <Card3DTilt intensity={15}>
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

            {/* KPI 3 */}
            <Card3DTilt intensity={15}>
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

            {/* KPI 4 */}
            <Card3DTilt intensity={15}>
              <div className="luxury-glass p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-36">
                <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  Total Units
                  <BedDouble className="w-3.5 h-3.5 text-blue-400" />
                </span>
                <span className="text-3xl font-black text-blue-400">
                  {stats.rooms?.length || 0}
                </span>
                <span className="text-2xs text-slate-400">Configured Rooms & Dorms</span>
              </div>
            </Card3DTilt>

            {/* KPI 5 */}
            <Card3DTilt intensity={15} className="col-span-2 sm:col-span-1 lg:col-span-2">
              <div className="luxury-glass-gold p-5 rounded-3xl border border-amber-400/40 flex flex-col justify-between h-36">
                <span className="text-2xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                  Verified Collections (NPR)
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

          {/* Interactive Room & Dorm Bed Occupancy Grid */}
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
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span> Occupied
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span> Reserved
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

          {/* Bookings & Admissions Management Table */}
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
                    placeholder="Search by code, guest name..."
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
                                onClick={() => handleCheckIn(b.id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 shadow-sm transition"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Check In</span>
                              </button>
                            )}

                            {b.status === 'checked_in' && (
                              <button
                                onClick={() => handleCheckOut(b.id)}
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

          {/* VOUCHER MODAL */}
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
        </>
      )}
    </div>
  );
}
