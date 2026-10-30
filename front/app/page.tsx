'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Hero3DCanvas from '@/components/Hero3DCanvas';
import SearchRooms3D from '@/components/SearchRooms3D';
import Card3DTilt from '@/components/Card3DTilt';
import { 
  Building2, 
  Hotel, 
  Crown, 
  KeyRound, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Star,
  MapPin,
  Coffee,
  Wifi,
  Zap,
  ArrowRight,
  Home,
  Users,
  Compass,
  BedDouble,
  Clock,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'hotels' | 'hostels' | 'apartments'>('all');
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Curated Luxury Properties Showcase
  const showcaseProperties = [
    {
      id: 1,
      category: 'hotels',
      tag: '5★ Luxury Resort',
      title: 'Himalayan Horizon Annapurna Sanctuary',
      location: 'Pokhara Lakeside North, Phewa Lake',
      price: 'NPR 14,000',
      period: '/ night',
      rating: 4.9,
      reviews: 328,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Annapurna View', 'Heated Jacuzzi', 'Infinity Pool', 'Helipad'],
      href: '/hotels',
      featuredBadge: 'Himalayan Landmark',
    },
    {
      id: 2,
      category: 'hotels',
      tag: 'Heritage Boutique',
      title: 'Kathmandu Royal Durbar Court & Spa',
      location: 'Thamel Historical Enclave, Kathmandu',
      price: 'NPR 5,800',
      period: '/ night',
      rating: 4.8,
      reviews: 194,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Newari Courtyard', 'Rooftop Lounge', 'Spa & Yoga', 'Artisanal Cafe'],
      href: '/hotels',
      featuredBadge: 'Heritage Luxury',
    },
    {
      id: 3,
      category: 'apartments',
      tag: 'Executive Serviced 2BHK',
      title: 'Jhamsikhel Executive Diplomatic Flat',
      location: 'Restaurant Row, Sanepa / Jhamsikhel, Lalitpur',
      price: 'NPR 65,000',
      period: '/ month',
      rating: 4.9,
      reviews: 86,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Italian Kitchen', '24/7 Generator', 'Underground Parking', 'Gym'],
      href: '/apartments',
      featuredBadge: 'Premium Expat Choice',
    },
    {
      id: 4,
      category: 'hostels',
      tag: 'Premier Scholar Dorm',
      title: 'Apex Scholars Elite Campus Residency',
      location: 'New Baneshwor Academic Hub, Kathmandu',
      price: 'NPR 13,500',
      period: '/ month (4 Meals)',
      rating: 4.7,
      reviews: 242,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      amenities: ['4-Meal Mess', '100Mbps Dedicated Fiber', 'Biometric Entry', 'Library'],
      href: '/hostels',
      featuredBadge: 'Top Rated Student Dorm',
    },
    {
      id: 5,
      category: 'apartments',
      tag: 'Private Hillside Villa',
      title: 'Lakeside Presidential Himalayan Penthouse',
      location: 'Sedi Heights, Pokhara',
      price: 'NPR 145,000',
      period: '/ month',
      rating: 5.0,
      reviews: 42,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Private Jacuzzi', 'Annapurna Deck', 'Private Butler', 'EV Charger'],
      href: '/apartments',
      featuredBadge: 'Ultra Luxury Villa',
    },
    {
      id: 6,
      category: 'apartments',
      tag: 'Budget Cozy Studio',
      title: 'Patan Bakhundole Digital Nomad Studio',
      location: 'Bakhundole Height, Sanepa, Lalitpur',
      price: 'NPR 22,000',
      period: '/ month',
      rating: 4.8,
      reviews: 64,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Kitchenette', 'Solar Hot Water', 'Balcony', 'Dedicated Desk'],
      href: '/apartments',
      featuredBadge: 'Economy Package',
    },
  ];

  const filteredShowcase = activeCategory === 'all' 
    ? showcaseProperties 
    : showcaseProperties.filter(p => p.category === activeCategory);

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden pb-24">
      {/* 1. Interactive 3D Constellation Canvas Background */}
      <Hero3DCanvas />

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Pulsating Emerald Live Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full luxury-glass-gold text-xs font-bold text-amber-300 shadow-2xl border border-amber-400/40 animate-pulse-glow">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="tracking-wider uppercase text-2xs sm:text-xs">
            HMS GLOBAL • LUXURY HOSPITALITY & SCHOLAR RESIDENCY CLOUD
          </span>
        </div>

        {/* Cinematic Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-5xl mx-auto">
          The Art of <br />
          <span className="gold-gradient-text drop-shadow-[0_15px_35px_rgba(245,158,11,0.35)]">
            Himalayan Living
          </span>{' '}
          & Student Sanctuaries
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Decoupled enterprise hospitality engineered for Nepal and the world. 
          Seamlessly manage commercial luxury hotel bookings, student dorm admissions with mess plans, and tiered serviced apartments.
        </p>

        {/* 3D Search Console */}
        <div className="pt-4">
          <SearchRooms3D />
        </div>

        {/* Floating Telemetry Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl luxury-glass border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-semibold">100% Cryptographic Invoicing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl luxury-glass border border-white/10">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-white font-semibold">Instant eSewa & Khalti Settlement</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl luxury-glass border border-white/10">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="text-white font-semibold">Live Room State Machine</span>
          </div>
        </div>
      </section>

      {/* 3. Live Platform Performance & Metrics Ribbon */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="luxury-glass p-6 rounded-3xl border border-white/10 text-center space-y-1 hover:border-amber-400/40 transition">
            <span className="text-3xl sm:text-4xl font-black text-amber-400">1,280+</span>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Verified Units & Beds</p>
            <span className="text-2xs text-slate-400 block">Across 18 cities in Nepal</span>
          </div>

          <div className="luxury-glass p-6 rounded-3xl border border-white/10 text-center space-y-1 hover:border-emerald-400/40 transition">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400">99.4%</span>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Occupancy Reliability</p>
            <span className="text-2xs text-slate-400 block">Zero double-booking guarantee</span>
          </div>

          <div className="luxury-glass p-6 rounded-3xl border border-white/10 text-center space-y-1 hover:border-purple-400/40 transition">
            <span className="text-3xl sm:text-4xl font-black text-purple-400">NPR 45M+</span>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Annual Ledger Settled</p>
            <span className="text-2xs text-slate-400 block">Digital wallets & cards</span>
          </div>

          <div className="luxury-glass p-6 rounded-3xl border border-white/10 text-center space-y-1 hover:border-blue-400/40 transition">
            <span className="text-3xl sm:text-4xl font-black text-blue-400">18,500+</span>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Guests & Scholars</p>
            <span className="text-2xs text-slate-400 block">Housed safely across Nepal</span>
          </div>
        </div>
      </section>

      {/* 4. Curated Luxury Properties Showcase */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-2xs font-extrabold text-amber-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CURATED RESIDENCIES & RETREATS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Featured Properties in Nepal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              From Annapurna view 5-star mountain sanctuaries in Pokhara to student dormitories and diplomatic flats in Lalitpur.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl transition ${
                activeCategory === 'all' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setActiveCategory('hotels')}
              className={`px-4 py-2 rounded-xl transition ${
                activeCategory === 'hotels' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏨 Hotels
            </button>
            <button
              onClick={() => setActiveCategory('hostels')}
              className={`px-4 py-2 rounded-xl transition ${
                activeCategory === 'hostels' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏢 Hostels
            </button>
            <button
              onClick={() => setActiveCategory('apartments')}
              className={`px-4 py-2 rounded-xl transition ${
                activeCategory === 'apartments' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏠 Apartments
            </button>
          </div>
        </div>

        {/* 6 Showcase Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShowcase.map(property => {
            const isSaved = savedIds.includes(property.id);
            return (
              <Card3DTilt key={property.id} intensity={12}>
                <div className="luxury-glass rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between h-full group">
                  {/* Photo Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-2xs font-extrabold uppercase bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/40">
                        {property.tag}
                      </span>
                      <button
                        onClick={() => toggleSave(property.id)}
                        className={`h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                          isSaved ? 'bg-rose-500 text-white' : 'bg-slate-950/70 text-slate-300 hover:text-white'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Featured Hallmark Badge */}
                    <div className="absolute bottom-3 left-4">
                      <span className="text-2xs font-bold text-slate-300 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {property.featuredBadge}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1 text-2xs truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {property.location}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 text-2xs shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {property.rating} ({property.reviews})
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-amber-200 transition line-clamp-1">
                        {property.title}
                      </h3>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {property.amenities.map(a => (
                          <span
                            key={a}
                            className="text-2xs px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-2xs text-slate-400 font-extrabold uppercase block">Rate</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-white">{property.price}</span>
                          <span className="text-2xs text-slate-400">{property.period}</span>
                        </div>
                      </div>

                      <Link
                        href={property.href}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 transform active:scale-95"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      </section>

      {/* 5. The 3 Distinct Vertical Engines Breakdown */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest block">
            COMPLETE VERTICAL INTEGRATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            One Engine. Three Distinct Hospitality Worlds.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tailored workflows for hotels, university dorms, and serviced flats under a single unified database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vertical 1: Hotels */}
          <div className="luxury-glass p-8 rounded-3xl border border-white/10 space-y-5 hover:border-amber-400/40 transition">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-2xl">
              🏨
            </div>
            <h3 className="text-2xl font-black text-white">Commercial Hotels & Resorts</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full night audit controls, instant room check-in/out, live inventory lockouts, guest registration with ID uploads, and automated tax receipts.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Real-time availability calendar & state machine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>eSewa, Khalti, & Visa/Mastercard payment reconciliation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated official voucher PDF generation</span>
              </li>
            </ul>
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 pt-2"
            >
              <span>Explore Hotel Engine</span> &rarr;
            </Link>
          </div>

          {/* Vertical 2: Hostels */}
          <div className="luxury-glass p-8 rounded-3xl border border-white/10 space-y-5 hover:border-emerald-400/40 transition">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-2xl">
              🏢
            </div>
            <h3 className="text-2xl font-black text-white">Student & Scholar Hostels</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed specifically for Kathmandu student hubs (Baneshwor, Putalisadak, Patan). Multi-bed dorm bunks, gender policies, and warden mess meal rosters.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dorm bed allocation & vacancy visualizer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Boys, Girls, and Co-Ed policy guards</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>4-Meal chef mess planner included</span>
              </li>
            </ul>
            <Link
              href="/hostels"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2"
            >
              <span>Explore Hostel Engine</span> &rarr;
            </Link>
          </div>

          {/* Vertical 3: Apartments & Villas */}
          <div className="luxury-glass p-8 rounded-3xl border border-white/10 space-y-5 hover:border-purple-400/40 transition">
            <div className="h-14 w-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-2xl">
              🏠
            </div>
            <h3 className="text-2xl font-black text-white">Apartments & Luxury Villas</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tailored for expat zones (Jhamsikhel, Sanepa, Pokhara Lakefront). Monthly leases across 3 tiered packages (Economy, Premium, and Luxurious VIP).
            </p>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3-Tier pricing packages (Economy, Premium, Luxury)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Monthly term lease contracts & deposit handling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated lease agreement confirmation emails</span>
              </li>
            </ul>
            <Link
              href="/apartments"
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 pt-2"
            >
              <span>Explore Apartment Engine</span> &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Executive Portals Navigation Matrix with 3D Tilt */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest block mb-1">
            EXECUTIVE CONTROL CONSOLES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Choose Your Operational Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Tailored interfaces with dynamic RBAC permissions for Super Admins, Owners, and Residents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Portal 1: Super Admin */}
          <Card3DTilt intensity={14} className="h-full">
            <Link
              href="/admin"
              className="h-full flex flex-col justify-between luxury-glass p-6 rounded-3xl border border-white/10 hover:border-amber-400/60 transition group"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold mb-4 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition">
                  <Crown className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-2xs font-bold text-amber-400 uppercase tracking-wider block">
                  Ant Design Pro Suite
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-200 transition">
                  Super Admin Console
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Real-time telemetry, room state matrix, check-in/out execution, CSV exports, and audit logs.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Access Command &rarr;</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-2xs">ADMIN</span>
              </div>
            </Link>
          </Card3DTilt>

          {/* Portal 2: Property Owner */}
          <Card3DTilt intensity={14} className="h-full">
            <Link
              href="/owner"
              className="h-full flex flex-col justify-between luxury-glass p-6 rounded-3xl border border-white/10 hover:border-emerald-400/60 transition group"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center font-bold mb-4 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition">
                  <KeyRound className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-2xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Asset & Inventory Engine
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-200 transition">
                  Property Owner Portal
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Register new hotels & hostels, add rooms & dorm beds, set NPR pricing tiers, and monitor occupancy velocity.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Access Assets &rarr;</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-400/20 text-2xs">OWNER</span>
              </div>
            </Link>
          </Card3DTilt>

          {/* Portal 3: Guest / Resident Portal */}
          <Card3DTilt intensity={14} className="h-full">
            <Link
              href="/portal"
              className="h-full flex flex-col justify-between luxury-glass p-6 rounded-3xl border border-white/10 hover:border-purple-400/60 transition group"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition">
                  <CreditCard className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-2xs font-bold text-purple-400 uppercase tracking-wider block">
                  Guest & Resident Self-Service
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-purple-200 transition">
                  My Reservations & Vouchers
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Print digital stay vouchers, view admission approvals, and settle balances instantly via eSewa & Khalti.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>View Stays &rarr;</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-400/20 text-2xs">GUEST</span>
              </div>
            </Link>
          </Card3DTilt>

          {/* Portal 4: Dynamic RBAC */}
          <Card3DTilt intensity={14} className="h-full">
            <Link
              href="/admin/rbac"
              className="h-full flex flex-col justify-between luxury-glass p-6 rounded-3xl border border-white/10 hover:border-blue-400/60 transition group"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-2xs font-bold text-blue-400 uppercase tracking-wider block">
                  Security Matrix
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-blue-200 transition">
                  Dynamic RBAC Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Manage operational roles, assign granular permissions, and control user access across modules.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Configure RBAC &rarr;</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-400/20 text-2xs">SECURITY</span>
              </div>
            </Link>
          </Card3DTilt>
        </div>
      </section>
    </div>
  );
}
