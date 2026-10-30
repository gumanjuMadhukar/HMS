'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Sparkles, Search, Compass, BedDouble, ShieldCheck, Home } from 'lucide-react';

export default function SearchRooms3D() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hotels' | 'hostels' | 'apartments' | 'trips'>('hotels');
  const [destination, setDestination] = useState('Pokhara');
  const [checkIn, setCheckIn] = useState('2026-11-01');
  const [checkOut, setCheckOut] = useState('2026-11-05');
  const [guests, setGuests] = useState('2');
  const [roomType, setRoomType] = useState('deluxe');

  const destinations = [
    { name: 'Pokhara Lakeside', region: 'Annapurna Views • Luxury Resorts', code: 'Pokhara' },
    { name: 'Kathmandu Heritage', region: 'Thamel & Durbar Square • Boutique Hotels', code: 'Kathmandu' },
    { name: 'Baneshwor Student Hub', region: 'Colleges & Hostels • 4-Meal Mess', code: 'Kathmandu' },
    { name: 'Nagarkot Sunrise', region: 'Himalayan Ridge Retreats', code: 'Nagarkot' },
    { name: 'Chitwan National Park', region: 'Safari Lodges & Wildlife', code: 'Chitwan' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'hotels') {
      router.push(`/hotels?city=${encodeURIComponent(destination)}`);
    } else if (activeTab === 'hostels') {
      router.push(`/hostels?city=${encodeURIComponent(destination)}`);
    } else if (activeTab === 'apartments') {
      router.push(`/apartments?city=${encodeURIComponent(destination)}`);
    } else {
      router.push(`/hotels?city=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative z-30">
      {/* Search Category Tabs with 3D Depth */}
      <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'hotels'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
              : 'luxury-glass text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Luxury Hotels & Resorts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hostels')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'hostels'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
              : 'luxury-glass text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Hostel Dorms & Residencies</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('apartments')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'apartments'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-105'
              : 'luxury-glass text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Apartments & Villas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trips')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 hidden sm:flex items-center gap-2 ${
            activeTab === 'trips'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
              : 'luxury-glass text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Himalayan Trips & Treks</span>
        </button>
      </div>

      {/* Main 3D Floating Glass Console */}
      <div className="luxury-glass-gold p-4 sm:p-6 rounded-3xl relative overflow-hidden backdrop-blur-2xl">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Destination */}
          <div className="lg:col-span-4 bg-slate-950/60 p-3.5 rounded-2xl border border-white/10 hover:border-amber-400/50 transition group">
            <label className="text-2xs uppercase font-extrabold text-amber-300/80 tracking-wider flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Destination / City</span>
            </label>
            <select
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-sm focus:outline-hidden cursor-pointer"
            >
              {destinations.map(d => (
                <option key={d.name} value={d.code} className="bg-slate-900 text-white">
                  {d.name} ({d.region})
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="lg:col-span-3 bg-slate-950/60 p-3.5 rounded-2xl border border-white/10 hover:border-amber-400/50 transition">
            <label className="text-2xs uppercase font-extrabold text-amber-300/80 tracking-wider flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeTab === 'hostels' ? 'Admission Date' : activeTab === 'apartments' ? 'Move-In Date' : 'Check-In • Out'}</span>
            </label>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-hidden text-xs"
              />
              <input
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Guests / Capacity */}
          <div className="lg:col-span-3 bg-slate-950/60 p-3.5 rounded-2xl border border-white/10 hover:border-amber-400/50 transition">
            <label className="text-2xs uppercase font-extrabold text-amber-300/80 tracking-wider flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeTab === 'hostels' ? 'Bed Type & Gender' : 'Guests & Room Tier'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="1" className="bg-slate-900 text-white">1 Guest / Single</option>
                <option value="2" className="bg-slate-900 text-white">2 Guests / Double</option>
                <option value="4" className="bg-slate-900 text-white">4 Persons (Dorm/Family)</option>
              </select>
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                className="bg-transparent text-amber-300 font-semibold text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="deluxe" className="bg-slate-900 text-white">Deluxe Room</option>
                <option value="suite" className="bg-slate-900 text-white">Presidential Suite</option>
                <option value="dorm" className="bg-slate-900 text-white">Hostel Dorm Bunk</option>
              </select>
            </div>
          </div>

          {/* Search Trigger */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Search className="w-4 h-4 stroke-[3]" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10 text-2xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Popular Filters:
          </span>
          <button
            type="button"
            onClick={() => setDestination('Pokhara')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition"
          >
            🏔️ Annapurna View
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('hostels'); setDestination('Kathmandu'); }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition"
          >
            🎓 IOE / Apex Student Dorms
          </button>
          <button
            type="button"
            onClick={() => setRoomType('suite')}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition"
          >
            👑 Lakeview Suites
          </button>
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            Verified Cleanliness Guarantee
          </button>
        </div>
      </div>
    </div>
  );
}
