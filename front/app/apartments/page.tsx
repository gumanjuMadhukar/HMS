'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { useToast } from '@/components/ToastContext';
import { 
  Home, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Layers, 
  DollarSign, 
  Zap, 
  Crown, 
  Coffee, 
  Wifi, 
  Car, 
  Mail,
  ArrowRight
} from 'lucide-react';

export default function ApartmentsPage() {
  const { success, error } = useToast();
  const [apartments, setApartments] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'economy' | 'premium' | 'luxurious'>('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApartmentRoom, setSelectedApartmentRoom] = useState<any>(null);
  const [selectedApartmentProperty, setSelectedApartmentProperty] = useState<any>(null);
  const [leaseSuccess, setLeaseSuccess] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form State
  const [leaseForm, setLeaseForm] = useState({
    name: 'Aayush Maharjan',
    email: 'guest@hms.local',
    phone: '+977-9812987654',
    move_in_date: new Date().toISOString().split('T')[0],
    term_mode: 'monthly', // 'monthly' or 'daily'
    lease_duration_months: 3,
    lease_duration_days: 7,
    adults: 2,
    children: 0,
    package_tier: 'premium',
    notes: 'Ground floor or lift accessible requested. Designated parking needed.',
  });

  const loadApartments = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (cityFilter) params.city = cityFilter;
      if (tierFilter !== 'all') params.tier = tierFilter;
      if (typeFilter) params.property_type = typeFilter;

      const res = await hmsApi.getApartments(params);
      setApartments(res.data?.data || res.data || []);
      setCities(res.cities || ['Lalitpur', 'Kathmandu', 'Pokhara']);
    } catch (err) {
      console.error('Failed to load apartments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApartments();
  }, [cityFilter, tierFilter, typeFilter]);

  const handleOpenBooking = (property: any, room: any, defaultTier: string) => {
    setSelectedApartmentProperty(property);
    setSelectedApartmentRoom(room);
    setLeaseForm(prev => ({
      ...prev,
      package_tier: defaultTier,
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApartmentRoom) return;
    setBookingLoading(true);

    try {
      const payload: any = {
        room_id: selectedApartmentRoom.id,
        name: leaseForm.name,
        email: leaseForm.email,
        phone: leaseForm.phone,
        move_in_date: leaseForm.move_in_date,
        adults: leaseForm.adults,
        children: leaseForm.children,
        package_tier: leaseForm.package_tier,
        notes: leaseForm.notes,
      };

      if (leaseForm.term_mode === 'monthly') {
        payload.lease_duration_months = Number(leaseForm.lease_duration_months);
      } else {
        payload.lease_duration_days = Number(leaseForm.lease_duration_days);
      }

      const res = await hmsApi.bookApartment(payload);
      setLeaseSuccess(res.data);
      success('Lease Application Confirmed', `Reference: ${res.data.booking_code}. Confirmation email sent!`);
      setSelectedApartmentRoom(null);
      setSelectedApartmentProperty(null);
    } catch (err: any) {
      error('Lease Booking Failed', err.message || 'Lease booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  // Helper to determine package metadata
  const getTierMeta = (starRating: number) => {
    if (starRating >= 5) {
      return {
        label: 'Luxurious VIP',
        color: 'from-amber-400 to-yellow-500 text-slate-950',
        badge: '👑 Luxurious Package',
        border: 'border-amber-400/40',
        perks: ['Private Jacuzzi / Pool', 'Panoramic View', 'Chef / Butler Access', 'EV Charging'],
      };
    } else if (starRating === 4) {
      return {
        label: 'Executive Premium',
        color: 'from-blue-500 to-indigo-600 text-white',
        badge: '⭐ Premium Package',
        border: 'border-blue-400/40',
        perks: ['Modular Italian Kitchen', '24/7 Power Backup', 'Housekeeping Service', 'Basement Parking'],
      };
    } else {
      return {
        label: 'Smart Economy',
        color: 'from-emerald-500 to-teal-600 text-slate-950',
        badge: '🌱 Economy Package',
        border: 'border-emerald-400/40',
        perks: ['Furnished Kitchenette', '100Mbps Dedicated Fiber', 'Solar Hot Water', 'Work Desk'],
      };
    }
  };

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="luxury-glass-gold rounded-3xl p-8 sm:p-12 border border-amber-400/40 text-center relative overflow-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <Home className="w-4 h-4 text-amber-400" />
          <span>SERVICED APARTMENTS, FLATS & PRIVATE VILLAS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Home Rentals & <span className="gold-gradient-text">Serviced Residences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light">
          Short-term holiday rentals & long-term residential leases in Kathmandu, Lalitpur & Pokhara.
          Available in **Economy**, **Premium**, and **Luxurious** all-inclusive packages.
        </p>

        {/* Tier Package Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setTierFilter('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              tierFilter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                : 'luxury-glass text-slate-300 hover:text-white'
            }`}
          >
            All Packages ({apartments.length})
          </button>

          <button
            onClick={() => setTierFilter('economy')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
              tierFilter === 'economy'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                : 'luxury-glass text-slate-300 hover:text-white'
            }`}
          >
            <span>🌱 Economy Package</span>
            <span className="text-2xs opacity-80">(NPR 20k - 35k/mo)</span>
          </button>

          <button
            onClick={() => setTierFilter('premium')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
              tierFilter === 'premium'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                : 'luxury-glass text-slate-300 hover:text-white'
            }`}
          >
            <span>⭐ Premium Package</span>
            <span className="text-2xs opacity-80">(NPR 40k - 85k/mo)</span>
          </button>

          <button
            onClick={() => setTierFilter('luxurious')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
              tierFilter === 'luxurious'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                : 'luxury-glass text-slate-300 hover:text-white'
            }`}
          >
            <span>👑 Luxurious Package</span>
            <span className="text-2xs opacity-80">(NPR 100k+ / Villas)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="luxury-glass rounded-2xl p-4 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border border-white/10">
          <div>
            <label className="text-2xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Location / City</span>
            </label>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Residential Zones (Nepal)</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-2xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Layout / Configuration</span>
            </label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Layouts (Studio, 1BHK, 2BHK, Villa)</option>
              <option value="studio">Studio Flat</option>
              <option value="1bhk">1BHK Apartment</option>
              <option value="2bhk">2BHK Family Residence</option>
              <option value="villa">Luxury Penthouse & Villa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lease Success Notification */}
      {leaseSuccess && (
        <div className="luxury-glass-gold p-6 rounded-3xl border border-emerald-400/40 text-center space-y-3 animate-in fade-in zoom-in-95">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block">
            Apartment Lease Verified & Confirmed
          </span>
          <h3 className="text-2xl font-black text-white">Lease Reference: {leaseSuccess.booking_code}</h3>
          <p className="text-xs text-slate-300">
            Tenant: {leaseSuccess.guest?.name} • Unit: {leaseSuccess.room?.room_number} • Total Billed: NPR {Number(leaseSuccess.total_amount).toLocaleString()}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/portal"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
            >
              View in My Stays &rarr;
            </Link>
            <a
              href="http://localhost:8025"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl luxury-glass text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>View Lease Summary in Mailpit</span>
            </a>
            <button
              onClick={() => setLeaseSuccess(null)}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Package Tier Explanatory Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="luxury-glass p-6 rounded-3xl border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              Economy Package
            </span>
            <span className="text-xs text-slate-400 font-mono">From NPR 18k/mo</span>
          </div>
          <h3 className="text-lg font-bold text-white">Cozy Studios & 1BHKs</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Targeted for remote professionals and students wanting self-sufficient private flats. Includes kitchenette, high-speed Wi-Fi, solar heating, and clean drinking water.
          </p>
        </div>

        <div className="luxury-glass p-6 rounded-3xl border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
              Premium Package
            </span>
            <span className="text-xs text-slate-400 font-mono">From NPR 45k/mo</span>
          </div>
          <h3 className="text-lg font-bold text-white">Serviced 2BHK Residences</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Targeted for corporate delegates and families in prime expat neighborhoods (Jhamsikhel, Baluwatar). Modular kitchen, 24/7 power backup, parking, and housekeeping.
          </p>
        </div>

        <div className="luxury-glass-gold p-6 rounded-3xl border border-amber-400/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-2xs font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
              Luxurious VIP Package
            </span>
            <span className="text-xs text-amber-300 font-mono">From NPR 100k+/mo</span>
          </div>
          <h3 className="text-lg font-bold text-white">Himalayan Villas & Penthouses</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ultra-luxury private villas and panoramic penthouses in Pokhara & Nagarkot. Private heated jacuzzi, lakeside terraces, chef on demand, EV car charger, and personal butler.
          </p>
        </div>
      </div>

      {/* Main Apartment Properties Grid */}
      <main>
        {loading ? (
          <div className="p-20 text-center space-y-4">
            <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-xs">Querying apartment portfolio from Laravel 13 Modular API...</p>
          </div>
        ) : apartments.length === 0 ? (
          <div className="p-16 text-center luxury-glass rounded-3xl border border-white/10 space-y-3">
            <p className="text-slate-400 text-sm">No apartments matching your filter criteria.</p>
            <button
              onClick={() => { setCityFilter(''); setTierFilter('all'); setTypeFilter(''); }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map(apt => {
              const tierMeta = getTierMeta(apt.star_rating);
              return (
                <Card3DTilt key={apt.id} intensity={10} className="h-full">
                  <div className={`h-full flex flex-col justify-between luxury-glass rounded-3xl p-6 border ${tierMeta.border} hover:border-amber-400/60 transition duration-300 relative group`}>
                    <div className="space-y-4">
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-2xs font-black uppercase tracking-wider bg-white/5 border border-white/10 text-amber-300">
                          {tierMeta.badge}
                        </span>
                        <span className="text-2xs font-extrabold text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded-full border border-white/10">
                          {apt.city}, Nepal
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-200 transition">
                          {apt.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" /> {apt.address}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {apt.description}
                      </p>

                      {/* Package Perks List */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tierMeta.perks.map((perk, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-slate-950/70 border border-white/5 text-2xs text-slate-300"
                          >
                            ✓ {perk}
                          </span>
                        ))}
                      </div>

                      {/* Units & Pricing Table */}
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <span className="text-2xs font-black uppercase tracking-wider text-amber-400 block">
                          Available Units ({apt.rooms?.length || 0})
                        </span>

                        {apt.rooms?.map((room: any) => (
                          <div
                            key={room.id}
                            className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-white block">
                                {room.room_number} ({room.type.toUpperCase()})
                              </span>
                              <span className="text-2xs text-slate-400">
                                {room.capacity} Guests • Floor {room.floor}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="font-mono font-bold text-amber-300 block text-xs">
                                NPR {Number(room.price_per_month).toLocaleString()}/mo
                              </span>
                              <button
                                onClick={() => handleOpenBooking(apt, room, tierMeta.label.toLowerCase())}
                                className="mt-1 px-3 py-1 rounded-xl text-2xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition"
                              >
                                Lease / Book
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-2xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Landlord
                      </span>
                      <span>Currency: {apt.currency || 'NPR'}</span>
                    </div>
                  </div>
                </Card3DTilt>
              );
            })}
          </div>
        )}
      </main>

      {/* APARTMENT LEASE / RESERVATION MODAL */}
      {selectedApartmentRoom && selectedApartmentProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="luxury-glass-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest">
                  Serviced Apartment & Home Lease
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {selectedApartmentProperty.name}
                </h3>
                <p className="text-xs text-amber-300 font-mono">
                  Unit {selectedApartmentRoom.room_number} • NPR {Number(selectedApartmentRoom.price_per_month).toLocaleString()} / month (or NPR {Number(selectedApartmentRoom.price_per_night).toLocaleString()} / night)
                </p>
              </div>
              <button
                onClick={() => { setSelectedApartmentRoom(null); setSelectedApartmentProperty(null); }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              {/* Term Mode: Monthly Lease vs Short Stay */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setLeaseForm({ ...leaseForm, term_mode: 'monthly' })}
                  className={`py-2 rounded-xl font-bold text-xs transition ${
                    leaseForm.term_mode === 'monthly'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📅 Monthly Lease
                </button>
                <button
                  type="button"
                  onClick={() => setLeaseForm({ ...leaseForm, term_mode: 'daily' })}
                  className={`py-2 rounded-xl font-bold text-xs transition ${
                    leaseForm.term_mode === 'daily'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🧳 Short-Term Nightly
                </button>
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Tenant / Primary Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  value={leaseForm.name}
                  onChange={e => setLeaseForm({ ...leaseForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={leaseForm.phone}
                    onChange={e => setLeaseForm({ ...leaseForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={leaseForm.email}
                    onChange={e => setLeaseForm({ ...leaseForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Move-In / Check-In Date
                  </label>
                  <input
                    type="date"
                    required
                    value={leaseForm.move_in_date}
                    onChange={e => setLeaseForm({ ...leaseForm, move_in_date: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    {leaseForm.term_mode === 'monthly' ? 'Lease Duration (Months)' : 'Stay Length (Nights)'}
                  </label>
                  {leaseForm.term_mode === 'monthly' ? (
                    <select
                      value={leaseForm.lease_duration_months}
                      onChange={e => setLeaseForm({ ...leaseForm, lease_duration_months: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months (Standard)</option>
                      <option value="6">6 Months (Long-Term)</option>
                      <option value="12">12 Months (Annual Lease)</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={leaseForm.lease_duration_days}
                      onChange={e => setLeaseForm({ ...leaseForm, lease_duration_days: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Adult Occupants
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedApartmentRoom.capacity || 6}
                    value={leaseForm.adults}
                    onChange={e => setLeaseForm({ ...leaseForm, adults: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Selected Package Tier
                  </label>
                  <select
                    value={leaseForm.package_tier}
                    onChange={e => setLeaseForm({ ...leaseForm, package_tier: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-amber-300 font-bold text-xs"
                  >
                    <option value="economy">Economy Package</option>
                    <option value="premium">Premium Package</option>
                    <option value="luxury">Luxurious VIP Package</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Special Notes / Parking / Pet Accommodations
                </label>
                <textarea
                  rows={2}
                  value={leaseForm.notes}
                  onChange={e => setLeaseForm({ ...leaseForm, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                />
              </div>

              {/* Total Calculation Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-2xs text-slate-400 block uppercase font-bold">Estimated Total Fee</span>
                  <span className="font-mono text-lg font-black text-amber-300">
                    NPR {(
                      leaseForm.term_mode === 'monthly'
                        ? Number(leaseForm.lease_duration_months) * Number(selectedApartmentRoom.price_per_month)
                        : Number(leaseForm.lease_duration_days) * Number(selectedApartmentRoom.price_per_night)
                    ).toLocaleString()}
                  </span>
                </div>
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zero Brokerage Fee
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setSelectedApartmentRoom(null); setSelectedApartmentProperty(null); }}
                  className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25"
                >
                  {bookingLoading ? 'Confirming...' : 'Confirm Lease Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
