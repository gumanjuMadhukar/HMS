'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { useToast } from '@/components/ToastContext';
import { 
  Hotel, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Mail
} from 'lucide-react';

export default function HotelsPage() {
  const { success, error } = useToast();
  const [hotels, setHotels] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [starFilter, setStarFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: 'Aayush Maharjan',
    phone: '+977-9812987654',
    email: 'guest@hms.local',
    check_in_date: new Date().toISOString().split('T')[0],
    check_out_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0,
    meal_plan: 'cp',
    notes: 'Airport shuttle requested with high-floor mountain view room.',
  });

  const loadHotels = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (cityFilter) params.city = cityFilter;
      if (starFilter) params.star_rating = starFilter;

      const res = await hmsApi.getHotels(params);
      setHotels(res.data?.data || res.data || []);
      setCities(res.cities || ['Pokhara', 'Kathmandu']);
    } catch (err) {
      console.error('Failed to load hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, [cityFilter, starFilter]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await hmsApi.bookHotel({
        room_id: selectedRoom.id,
        ...formData,
      });
      setBookingSuccess(res.data);
      success('Hotel Reservation Confirmed', `Booking Code: ${res.data.booking_code}. Your room voucher is ready!`);
      setSelectedRoom(null);
    } catch (err: any) {
      error('Booking Failed', err.message || 'Booking submission failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="luxury-glass-gold rounded-3xl p-8 sm:p-12 border border-amber-400/40 text-center relative overflow-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>CURATED LUXURY SUITES & MOUNTAIN RETREATS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Himalayan Luxury <span className="gold-gradient-text">Hotels & Resorts</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Reserve 5-star mountain sanctuaries in Pokhara, heritage boutique palaces in Kathmandu Thamel, and luxury trekking lodges.
        </p>

        {/* Filter Bar */}
        <div className="luxury-glass rounded-2xl p-4 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border border-white/10">
          <div>
            <label className="text-2xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Filter Destination</span>
            </label>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Himalayan Destinations</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-2xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5 mb-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Star Rating Tier</span>
            </label>
            <select
              value={starFilter}
              onChange={e => setStarFilter(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              <option value="">All Tiers & Resorts</option>
              <option value="5">⭐⭐⭐⭐⭐ 5-Star Ultra Luxury</option>
              <option value="4">⭐⭐⭐⭐ 4-Star Boutique Heritage</option>
              <option value="3">⭐⭐⭐ 3-Star Comfort Retreat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Success Banner */}
      {bookingSuccess && (
        <div className="luxury-glass-gold p-6 rounded-3xl border border-emerald-400/40 text-center space-y-3 animate-in fade-in zoom-in-95">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block">
            Hotel Reservation Confirmed & Sealed
          </span>
          <h3 className="text-2xl font-black text-white">Reference Code: {bookingSuccess.booking_code}</h3>
          <p className="text-xs text-slate-300">
            Guest: {bookingSuccess.guest?.name} • Room {bookingSuccess.room?.room_number} • Total: NPR {Number(bookingSuccess.total_amount).toLocaleString()}
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
              <span>Check Confirmation Email (Mailpit)</span>
            </a>
            <button
              onClick={() => setBookingSuccess(null)}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Hotel Cards Grid */}
      <main>
        {loading ? (
          <div className="p-20 text-center space-y-4">
            <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-xs">Querying hotel catalog from Laravel 13 Modular API...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="p-16 text-center luxury-glass rounded-3xl border border-white/10 space-y-3">
            <p className="text-slate-400 text-sm">No properties matching your selected destination or star tier.</p>
            <button
              onClick={() => { setCityFilter(''); setStarFilter(''); }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map(hotel => {
              const hotelImages: Record<string, string> = {
                'himalayan-horizon-resort': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
                'kathmandu-heritage-boutique': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
              };
              const defaultHotelImg = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
              const coverImg = hotelImages[hotel.slug] || defaultHotelImg;

              return (
                <Card3DTilt key={hotel.id} intensity={10} className="h-full">
                  <div className="h-full flex flex-col justify-between luxury-glass rounded-3xl p-6 border border-white/10 hover:border-amber-400/50 transition duration-300 group overflow-hidden">
                    {/* Visual Photo Banner */}
                    <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
                      <img
                        src={coverImg}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="text-2xs font-extrabold text-amber-300 bg-slate-950/80 backdrop-blur-md border border-amber-400/40 px-2.5 py-1 rounded-full">
                          {hotel.city}, Nepal
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 flex items-center gap-1 text-amber-400">
                        {Array.from({ length: hotel.star_rating || 3 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-200 transition">{hotel.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {hotel.address}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>

                      {/* Room Inventory */}
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <span className="text-2xs font-black uppercase tracking-wider text-amber-400 block">
                          Available Accommodations ({hotel.rooms?.length || 0})
                        </span>

                        {hotel.rooms?.map((room: any) => (
                          <div
                            key={room.id}
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-white/5 text-xs hover:border-white/15 transition"
                          >
                            <div>
                              <span className="font-bold text-white block">
                                Room {room.room_number} ({room.type})
                              </span>
                              <span className="text-2xs text-slate-400">Capacity: {room.capacity} Guests</span>
                            </div>

                            <div className="text-right">
                              <span className="font-mono font-bold text-amber-300 block text-xs">
                                NPR {Number(room.price_per_night).toLocaleString()}
                                <span className="text-2xs text-slate-500 font-normal"> /nt</span>
                              </span>
                              <button
                                onClick={() => setSelectedRoom(room)}
                                className="mt-1 px-3 py-1 rounded-xl text-2xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition"
                              >
                                Reserve
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-2xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Instant Confirmation
                      </span>
                      <span className="font-mono text-amber-300">{hotel.currency || 'NPR'}</span>
                    </div>
                  </div>
                </Card3DTilt>
              );
            })}
          </div>
        )}
      </main>

      {/* LUXURY RESERVATION MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="luxury-glass-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest">
                  Hotel Room Reservation
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Room {selectedRoom.room_number} ({selectedRoom.type})
                </h3>
                <p className="text-xs text-amber-300 font-mono">
                  NPR {Number(selectedRoom.price_per_night).toLocaleString()} per night
                </p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Primary Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.check_in_date}
                    onChange={e => setFormData({ ...formData, check_in_date: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.check_out_date}
                    onChange={e => setFormData({ ...formData, check_out_date: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Adult Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.adults}
                    onChange={e => setFormData({ ...formData, adults: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Meal Plan Option
                  </label>
                  <select
                    value={formData.meal_plan}
                    onChange={e => setFormData({ ...formData, meal_plan: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  >
                    <option value="ep">Room Only (EP)</option>
                    <option value="cp">Bed & Breakfast (CP)</option>
                    <option value="map">Breakfast & Dinner (MAP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Special Notes / Flight Transfer Requests
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-2xs text-amber-300">
                ⚡ Instant confirmation voucher dispatched via Mailpit on Port 8025 with encrypted audit trail.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25"
                >
                  {bookingLoading ? 'Confirming...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
