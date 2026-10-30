'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { 
  Building2, 
  Key, 
  Plus, 
  BedDouble, 
  Users, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  CheckCircle, 
  ShieldCheck,
  Building
} from 'lucide-react';

export default function OwnerPortalPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  // Modals
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  // Forms
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    category: 'hotel',
    property_type: 'boutique',
    gender_policy: 'co_ed',
    star_rating: 4,
    city: 'Kathmandu',
    address: '',
    phone: '',
    email: '',
    description: '',
    currency: 'NPR',
  });

  const [roomForm, setRoomForm] = useState({
    property_id: 1,
    room_number: '',
    floor: '1',
    type: 'deluxe',
    capacity: 2,
    price_per_night: 4500,
    price_per_month: 0,
    description: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [propsRes, statsRes] = await Promise.all([
        hmsApi.getOwnerProperties(),
        hmsApi.getOwnerAnalytics(),
      ]);
      setProperties(propsRes.data || []);
      setAnalytics(statsRes.data || null);
      if (propsRes.data?.length > 0 && !selectedProperty) {
        setSelectedProperty(propsRes.data[0]);
      }
    } catch (err) {
      console.error('Failed to load owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hmsApi.createOwnerProperty(propertyForm);
      alert('Property created successfully!');
      setShowPropertyModal(false);
      setPropertyForm({
        name: '',
        category: 'hotel',
        property_type: 'boutique',
        gender_policy: 'co_ed',
        star_rating: 4,
        city: 'Kathmandu',
        address: '',
        phone: '',
        email: '',
        description: '',
        currency: 'NPR',
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create property');
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const propId = Number(roomForm.property_id || selectedProperty?.id || properties[0]?.id);
      await hmsApi.createOwnerRoom(propId, roomForm);
      alert('Room & bed capacity initialized successfully!');
      setShowRoomModal(false);
      setRoomForm({
        property_id: propId,
        room_number: '',
        floor: '1',
        type: 'deluxe',
        capacity: 2,
        price_per_night: 4500,
        price_per_month: 0,
        description: '',
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create room');
    }
  };

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>OWNER PORTAL • ASSET INVENTORY & REVENUE ACCELERATOR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <Key className="w-8 h-8 text-emerald-400 stroke-[2.5]" />
            <span>Property & Asset Portfolio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Oversee room occupancy, manage hostel dorm bunks, add inventory, and track NPR revenue trajectories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPropertyModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Property</span>
          </button>
          <button
            onClick={() => {
              if (selectedProperty) setRoomForm(r => ({ ...r, property_id: selectedProperty.id }));
              setShowRoomModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Room / Dorm Beds</span>
          </button>
        </div>
      </div>

      {/* KPI Analytics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card3DTilt intensity={12}>
          <div className="luxury-glass p-5 rounded-3xl border border-white/10 h-32 flex flex-col justify-between">
            <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Properties</span>
            <p className="text-3xl font-black text-white">{analytics?.total_properties || properties.length}</p>
            <span className="text-2xs text-slate-500">Hotels & Hostels</span>
          </div>
        </Card3DTilt>

        <Card3DTilt intensity={12}>
          <div className="luxury-glass p-5 rounded-3xl border border-white/10 h-32 flex flex-col justify-between">
            <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Total Rooms</span>
            <p className="text-3xl font-black text-blue-400">{analytics?.total_rooms || 0}</p>
            <span className="text-2xs text-slate-500">Across Units</span>
          </div>
        </Card3DTilt>

        <Card3DTilt intensity={12}>
          <div className="luxury-glass p-5 rounded-3xl border border-white/10 h-32 flex flex-col justify-between">
            <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Dorm Beds</span>
            <p className="text-3xl font-black text-amber-400">{analytics?.total_beds || 0}</p>
            <span className="text-2xs text-slate-500">Hostel Capacity</span>
          </div>
        </Card3DTilt>

        <Card3DTilt intensity={12}>
          <div className="luxury-glass p-5 rounded-3xl border border-white/10 h-32 flex flex-col justify-between">
            <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Occupancy</span>
            <p className="text-3xl font-black text-emerald-400">{analytics?.room_occupancy_rate || 0}%</p>
            <span className="text-2xs text-slate-500">{analytics?.occupied_rooms || 0} Rooms Occupied</span>
          </div>
        </Card3DTilt>

        <Card3DTilt intensity={12}>
          <div className="luxury-glass p-5 rounded-3xl border border-white/10 h-32 flex flex-col justify-between">
            <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Active Bookings</span>
            <p className="text-3xl font-black text-purple-400">{analytics?.active_reservations || 0}</p>
            <span className="text-2xs text-slate-500">In-House Stays</span>
          </div>
        </Card3DTilt>

        <Card3DTilt intensity={12}>
          <div className="luxury-glass-gold p-5 rounded-3xl border border-amber-400/40 h-32 flex flex-col justify-between">
            <span className="text-2xs font-extrabold text-amber-300 uppercase tracking-wider">Verified Revenue</span>
            <p className="text-2xl font-black text-white">
              NPR {analytics?.total_revenue ? Number(analytics.total_revenue).toLocaleString() : '0'}
            </p>
            <span className="text-2xs text-amber-300/80 font-bold">Settled Yield</span>
          </div>
        </Card3DTilt>
      </div>

      {/* Property Selector & Inventory Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Managed Properties & Inventories</span>
          </h2>
          <span className="text-xs text-slate-400">Select property to drill down into room & bed units</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading portfolio properties...</div>
        ) : properties.length === 0 ? (
          <div className="p-16 text-center luxury-glass rounded-3xl border border-dashed border-white/20 space-y-3">
            <p className="text-slate-400 text-sm">No properties registered under your owner profile yet.</p>
            <button
              onClick={() => setShowPropertyModal(true)}
              className="px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold"
            >
              Add First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property list sidebar */}
            <div className="space-y-3">
              {properties.map((prop: any) => {
                const isSelected = selectedProperty?.id === prop.id;
                return (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedProperty(prop)}
                    className={`p-4 rounded-3xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'luxury-glass-gold border-amber-400/50 shadow-lg ring-1 ring-amber-400/50'
                        : 'luxury-glass border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-2xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        prop.category === 'hotel'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {prop.category}
                      </span>
                      <span className="text-2xs text-slate-400 font-mono">
                        {prop.rooms_count ?? prop.rooms?.length ?? 0} Rooms
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mt-2.5">{prop.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" /> {prop.address}, {prop.city}
                    </p>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-2xs text-slate-300">
                      <span>Rating: {'★'.repeat(prop.star_rating || 3)}</span>
                      <span className="font-mono text-amber-300">{prop.currency}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Property Detail & Room Inventory Table */}
            <div className="md:col-span-2 luxury-glass rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
              {selectedProperty ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-white">{selectedProperty.name}</h2>
                        <span className={`text-2xs font-bold px-2 py-0.5 rounded-full uppercase ${
                          selectedProperty.category === 'hotel'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {selectedProperty.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{selectedProperty.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        setRoomForm(r => ({ ...r, property_id: selectedProperty.id }));
                        setShowRoomModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition whitespace-nowrap self-start sm:self-center"
                    >
                      + Add Room Here
                    </button>
                  </div>

                  {/* Room Inventory */}
                  <div>
                    <h4 className="text-2xs font-extrabold text-amber-400 uppercase tracking-wider mb-3">
                      Configured Rooms & Bed Capacities ({selectedProperty.rooms?.length || 0})
                    </h4>

                    {(!selectedProperty.rooms || selectedProperty.rooms.length === 0) ? (
                      <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-white/5">
                        <p className="text-xs text-slate-500">No rooms configured in this property yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950/60 text-slate-400 uppercase text-2xs font-semibold border-b border-white/10">
                            <tr>
                              <th className="px-4 py-3 rounded-l-xl">Room #</th>
                              <th className="px-4 py-3">Floor</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Capacity</th>
                              <th className="px-4 py-3">Pricing</th>
                              <th className="px-4 py-3 rounded-r-xl">Beds / Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {selectedProperty.rooms.map((room: any) => (
                              <tr key={room.id} className="hover:bg-white/5 transition">
                                <td className="px-4 py-3 font-bold text-white">
                                  Room {room.room_number}
                                </td>
                                <td className="px-4 py-3 text-slate-400">Floor {room.floor}</td>
                                <td className="px-4 py-3">
                                  <span className="capitalize px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-2xs font-semibold border border-white/10">
                                    {room.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-300">{room.capacity} Persons</td>
                                <td className="px-4 py-3 font-semibold text-amber-300 font-mono">
                                  {selectedProperty.category === 'hotel'
                                    ? `NPR ${Number(room.price_per_night).toLocaleString()}/nt`
                                    : `NPR ${Number(room.price_per_month).toLocaleString()}/mo`}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {room.beds && room.beds.length > 0 ? (
                                      room.beds.map((b: any) => (
                                        <span
                                          key={b.id}
                                          className={`text-2xs px-2 py-0.5 rounded font-mono ${
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
                                      ))
                                    ) : (
                                      <span className={`text-2xs px-2.5 py-0.5 rounded-full font-semibold ${
                                        room.status === 'occupied'
                                          ? 'bg-rose-500/20 text-rose-300'
                                          : 'bg-emerald-500/20 text-emerald-300'
                                      }`}>
                                        {room.status}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Register New Property */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="luxury-glass-gold rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-widest">
                  New Property Portfolio Unit
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Register Property</h3>
              </div>
              <button
                onClick={() => setShowPropertyModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annapurna View Resort or Green Valley Girls Hostel"
                  value={propertyForm.name}
                  onChange={e => setPropertyForm({ ...propertyForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={propertyForm.category}
                    onChange={e => setPropertyForm({ ...propertyForm, category: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  >
                    <option value="hotel">Hotel / Resort</option>
                    <option value="hostel">Hostel / Dormitory</option>
                    <option value="apartment">Serviced Apartment / Flat</option>
                    <option value="home_rental">Vacation Home / Villa</option>
                  </select>
                </div>

                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Property Type
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="resort, boutique, boys_hostel, girls_hostel"
                    value={propertyForm.property_type}
                    onChange={e => setPropertyForm({ ...propertyForm, property_type: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyForm.city}
                    onChange={e => setPropertyForm({ ...propertyForm, city: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Star (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={propertyForm.star_rating}
                    onChange={e => setPropertyForm({ ...propertyForm, star_rating: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Gender Policy
                  </label>
                  <select
                    value={propertyForm.gender_policy}
                    onChange={e => setPropertyForm({ ...propertyForm, gender_policy: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  >
                    <option value="co_ed">Co-Ed</option>
                    <option value="boys_only">Boys Only</option>
                    <option value="girls_only">Girls Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyForm.phone}
                    onChange={e => setPropertyForm({ ...propertyForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={propertyForm.email}
                    onChange={e => setPropertyForm({ ...propertyForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lakeside Ward 6 or Baneshwor Height"
                  value={propertyForm.address}
                  onChange={e => setPropertyForm({ ...propertyForm, address: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                />
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Description & Amenities
                </label>
                <textarea
                  rows={2}
                  required
                  value={propertyForm.description}
                  onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPropertyModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Register Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Room / Dorm Beds */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="luxury-glass-gold rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest">
                  Capacity Provisioning
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Add Room & Bed Units</h3>
              </div>
              <button
                onClick={() => setShowRoomModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Target Property
                </label>
                <select
                  value={roomForm.property_id}
                  onChange={e => setRoomForm({ ...roomForm, property_id: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs focus:outline-hidden focus:border-amber-400"
                >
                  {properties.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category.toUpperCase()} - {p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Room Number / ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101, 204, Dorm-A"
                    value={roomForm.room_number}
                    onChange={e => setRoomForm({ ...roomForm, room_number: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1, 2, G"
                    value={roomForm.floor}
                    onChange={e => setRoomForm({ ...roomForm, floor: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Room Type
                  </label>
                  <select
                    value={roomForm.type}
                    onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  >
                    <option value="single">Single Room</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                    <option value="dorm">Dormitory (4-8 Beds)</option>
                    <option value="deluxe">Deluxe Room</option>
                    <option value="suite">Executive Suite</option>
                  </select>
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Capacity (Persons)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    required
                    value={roomForm.capacity}
                    onChange={e => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Hotel: Price / Night (NPR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 4500"
                    value={roomForm.price_per_night}
                    onChange={e => setRoomForm({ ...roomForm, price_per_night: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Hostel: Price / Month (NPR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 12000"
                    value={roomForm.price_per_month}
                    onChange={e => setRoomForm({ ...roomForm, price_per_month: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Notes / Amenities Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Ensuite bathroom, private balcony, air-conditioning..."
                  value={roomForm.description}
                  onChange={e => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Initialize Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
