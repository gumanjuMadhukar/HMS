'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { 
  Building2, 
  MapPin, 
  Users, 
  Utensils, 
  Wifi, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Mail,
  GraduationCap
} from 'lucide-react';

export default function HostelsPage() {
  const [hostels, setHostels] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [admissionSuccess, setAdmissionSuccess] = useState<any>(null);
  const [admissionLoading, setAdmissionLoading] = useState(false);

  // Admission Form State
  const [formData, setFormData] = useState({
    name: 'Rohan Shrestha',
    phone: '+977-9841234567',
    email: 'student@hms.local',
    institution: 'Tribhuvan University (IOE Pulchowk)',
    guardian_name: 'Narayan Shrestha',
    guardian_phone: '+977-9851000000',
    id_type: 'citizenship',
    id_number: '27-01-78-11234',
    admission_date: new Date().toISOString().split('T')[0],
    meal_plan: 'full_mess',
    hostel_bed_id: '',
    notes: 'Ground floor study desk requested with standard bunk.',
  });

  const loadHostels = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (cityFilter) params.city = cityFilter;
      if (genderFilter) params.gender_policy = genderFilter;

      const res = await hmsApi.getHostels(params);
      setHostels(res.data?.data || res.data || []);
      setCities(res.cities || ['Kathmandu', 'Pokhara', 'Lalitpur']);
    } catch (err) {
      console.error('Failed to load hostels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, [cityFilter, genderFilter]);

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdmissionLoading(true);
    try {
      const res = await hmsApi.applyHostelAdmission({
        room_id: selectedRoom.id,
        ...formData,
      });
      setAdmissionSuccess(res.data);
      setSelectedRoom(null);
    } catch (err: any) {
      alert(err.message || 'Admission submission failed');
    } finally {
      setAdmissionLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="luxury-glass-gold rounded-3xl p-8 sm:p-12 border border-emerald-400/40 text-center relative overflow-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>STUDENT RESIDENCY & DORMITORY CLOUD</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Premier Student & <span className="emerald-gradient-text">Executive Hostels</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Verified student accommodations in Kathmandu, Lalitpur & Pokhara with 4-time hygienic mess meals, 100Mbps dedicated fiber Wi-Fi, and 24/7 security.
        </p>

        {/* Filter Bar */}
        <div className="luxury-glass rounded-2xl p-4 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border border-white/10">
          <div>
            <label className="text-2xs uppercase font-extrabold text-emerald-300 tracking-wider flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location / City</span>
            </label>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-400 cursor-pointer"
            >
              <option value="">All Academic Hubs (Nepal)</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-2xs uppercase font-extrabold text-emerald-300 tracking-wider flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gender Policy</span>
            </label>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-400 cursor-pointer"
            >
              <option value="">All Residency Types</option>
              <option value="boys_only">👨 Boys Hostel Only</option>
              <option value="girls_only">👩 Girls Hostel Only</option>
              <option value="co_ed">🏢 Co-Living Executive PG</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admission Success Banner */}
      {admissionSuccess && (
        <div className="luxury-glass-gold p-6 rounded-3xl border border-emerald-400/40 text-center space-y-3 animate-in fade-in zoom-in-95">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block">
            Hostel Admission Verified & Dispatched
          </span>
          <h3 className="text-2xl font-black text-white">Admission Code: {admissionSuccess.booking_code}</h3>
          <p className="text-xs text-slate-300">
            Student: {admissionSuccess.guest?.name} • Room {admissionSuccess.room?.room_number} {admissionSuccess.bed && `(Bed ${admissionSuccess.bed.bed_number})`} • Monthly: NPR {Number(admissionSuccess.total_amount).toLocaleString()}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/portal"
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs"
            >
              View in My Stays &rarr;
            </Link>
            <a
              href="http://localhost:8025"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl luxury-glass text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Check Admission Email (Mailpit)</span>
            </a>
            <button
              onClick={() => setAdmissionSuccess(null)}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Hostel Cards Grid */}
      <main>
        {loading ? (
          <div className="p-20 text-center space-y-4">
            <div className="h-10 w-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-xs">Querying hostel inventory from Laravel 13 Modular API...</p>
          </div>
        ) : hostels.length === 0 ? (
          <div className="p-16 text-center luxury-glass rounded-3xl border border-white/10 space-y-3">
            <p className="text-slate-400 text-sm">No hostels matching your selected filters.</p>
            <button
              onClick={() => { setCityFilter(''); setGenderFilter(''); }}
              className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostels.map(hostel => (
              <Card3DTilt key={hostel.id} intensity={10} className="h-full">
                <div className="h-full flex flex-col justify-between luxury-glass rounded-3xl p-6 border border-white/10 hover:border-emerald-400/50 transition duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider ${
                        hostel.gender_policy === 'boys_only'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : hostel.gender_policy === 'girls_only'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {hostel.gender_policy?.replace('_', ' ')}
                      </span>
                      <span className="text-2xs font-bold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
                        {hostel.city}, Nepal
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">{hostel.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {hostel.address}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {hostel.description}
                    </p>

                    {/* Room & Dorm Beds Roster */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <span className="text-2xs font-black uppercase tracking-wider text-emerald-400 block">
                        Dorms & Sharing Rooms ({hostel.rooms?.length || 0})
                      </span>

                      {hostel.rooms?.map((room: any) => (
                        <div
                          key={room.id}
                          className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 hover:border-white/15 transition"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white block text-xs">
                                Room {room.room_number} ({room.type})
                              </span>
                              <span className="text-2xs text-slate-400">Capacity: {room.capacity} Scholars</span>
                            </div>

                            <div className="text-right">
                              <span className="font-mono font-bold text-emerald-300 block text-xs">
                                NPR {Number(room.price_per_month).toLocaleString()}
                                <span className="text-2xs text-slate-500 font-normal"> /mo</span>
                              </span>
                              <button
                                onClick={() => setSelectedRoom(room)}
                                className="mt-1 px-3 py-1 rounded-xl text-2xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm transition"
                              >
                                Apply Admission
                              </button>
                            </div>
                          </div>

                          {/* Dorm Bed Badges */}
                          {room.beds && room.beds.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5">
                              {room.beds.map((b: any) => (
                                <span
                                  key={b.id}
                                  className={`text-2xs px-2 py-0.5 rounded-lg font-mono font-semibold ${
                                    b.status === 'occupied'
                                      ? 'bg-rose-500/20 text-rose-300'
                                      : b.status === 'reserved'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-emerald-500/20 text-emerald-300'
                                  }`}
                                  title={`Bed ${b.bed_number} (${b.status})`}
                                >
                                  {b.bed_number}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-2xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Utensils className="w-3.5 h-3.5" /> 4x Daily Mess Included
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <Wifi className="w-3.5 h-3.5" /> 100Mbps Fiber
                    </span>
                  </div>
                </div>
              </Card3DTilt>
            ))}
          </div>
        )}
      </main>

      {/* LUXURY ADMISSION MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="luxury-glass-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-emerald-400/40 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-widest">
                  Hostel Student Admission Application
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  Room {selectedRoom.room_number} ({selectedRoom.type})
                </h3>
                <p className="text-xs text-emerald-300 font-mono">
                  Monthly Rent & Mess: NPR {Number(selectedRoom.price_per_month).toLocaleString()} / month
                </p>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Student Mobile
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Enrolled College / University / Work Firm
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IOE Pulchowk, Apex College, Softwarica"
                  value={formData.institution}
                  onChange={e => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardian_name}
                    onChange={e => setFormData({ ...formData, guardian_name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardian_phone}
                    onChange={e => setFormData({ ...formData, guardian_phone: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Citizenship / National ID #
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.id_number}
                    onChange={e => setFormData({ ...formData, id_number: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Move-In / Admission Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.admission_date}
                    onChange={e => setFormData({ ...formData, admission_date: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Specific Bed Selection */}
              {selectedRoom.beds && selectedRoom.beds.length > 0 && (
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Choose Specific Dorm Bed
                  </label>
                  <select
                    value={formData.hostel_bed_id}
                    onChange={e => setFormData({ ...formData, hostel_bed_id: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  >
                    <option value="">Any Available Bed Unit</option>
                    {selectedRoom.beds.map((b: any) => (
                      <option key={b.id} value={b.id} disabled={b.status === 'occupied'}>
                        Bed {b.bed_number} ({b.status.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-2xs text-emerald-300">
                🛡️ Warden notification and student admission voucher automatically routed to Mailpit on Port 8025.
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
                  disabled={admissionLoading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25"
                >
                  {admissionLoading ? 'Submitting...' : 'Submit Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
