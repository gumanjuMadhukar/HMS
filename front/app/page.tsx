'use client';

import React from 'react';
import Link from 'next/link';
import HimalayanCanvas3D from '@/components/HimalayanCanvas3D';
import SearchRooms3D from '@/components/SearchRooms3D';
import TripsShowcase3D from '@/components/TripsShowcase3D';
import Card3DTilt from '@/components/Card3DTilt';
import { 
  Building2, 
  Hotel, 
  ShieldAlert, 
  Crown, 
  KeyRound, 
  CreditCard, 
  Mail, 
  Sparkles, 
  Globe2, 
  CheckCircle2, 
  TrendingUp, 
  Layers,
  Home 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden pb-24">
      {/* 3D Himalayan Canvas Background */}
      <HimalayanCanvas3D />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full luxury-glass-gold text-xs font-bold text-amber-300 shadow-xl border border-amber-400/30 animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>HMS GLOBAL 2.0 • LUXURY HOSPITALITY & STUDENT RESIDENCY CLOUD</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Main 3D Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mx-auto">
          The Pinnacle of <br />
          <span className="gold-gradient-text drop-shadow-[0_10px_35px_rgba(212,175,55,0.4)]">
            Himalayan Luxury Stays
          </span>{' '}
          & Student Residencies
        </h1>

        <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
          Decoupled architecture orchestrated by Next.js App Router and headless Laravel 13 Modular REST API.
          Engineered for global hotel booking engine workflows and comprehensive hostel dorm & mess management in Nepal.
        </p>

        {/* 3D Search Console */}
        <div className="pt-6">
          <SearchRooms3D />
        </div>
      </section>

      {/* 4 Dedicated Executive Portals Grid with 3D Tilt */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest block mb-1">
            Role-Based Multi-Portal Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Choose Your Operational Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Distinct interfaces tailored for Super Administrators, Property Owners, Wardens, and Student Guests.
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
                  System Command Center
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-200 transition">
                  Super Admin Panel
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Enterprise KPIs, live room occupancy matrices, real-time check-in / check-out controls, and system revenue analytics.
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
                  Register new hotels & hostels, add rooms & dorm beds, set NPR/USD pricing tiers, and monitor occupancy velocity.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Manage Portfolio &rarr;</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-400/20 text-2xs">OWNER</span>
              </div>
            </Link>
          </Card3DTilt>

          {/* Portal 3: Student & Guest */}
          <Card3DTilt intensity={14} className="h-full">
            <Link
              href="/portal"
              className="h-full flex flex-col justify-between luxury-glass p-6 rounded-3xl border border-white/10 hover:border-purple-400/60 transition group"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition">
                  <CreditCard className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-2xs font-bold text-purple-400 uppercase tracking-wider block">
                  Resident & Traveler Hub
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-purple-200 transition">
                  Guest & Student Portal
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  View stay vouchers, check hostel admission status, download official digital receipts, and pay via eSewa & Khalti.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>My Reservations &rarr;</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-400/20 text-2xs">FINDER</span>
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
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition">
                  <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-2xs font-bold text-blue-400 uppercase tracking-wider block">
                  Dynamic Security Matrix
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-blue-200 transition">
                  Dynamic RBAC Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Real-time permission toggle matrix, custom role generator, and multi-user role assignments with Passport OAuth tokens.
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

      {/* Curated 3D Himalayan Trips & Accommodations */}
      <TripsShowcase3D />

      {/* Tiered Packages Showcase: Economy, Premium, Luxurious */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-2xs font-black text-amber-400 uppercase tracking-widest block mb-1">
            Flexible Living Packages • Short-Term & Annual Leases
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Apartment & Home Rental <span className="gold-gradient-text">Packages</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Tailored all-inclusive packages ranging from smart budget studios to ultra-luxurious private Himalayan villas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Economy Package */}
          <Card3DTilt intensity={12}>
            <div className="luxury-glass p-8 rounded-3xl border border-emerald-500/30 flex flex-col justify-between h-full space-y-6 hover:border-emerald-400/60 transition">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-2xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block">
                  🌱 Economy Package
                </span>
                <h3 className="text-2xl font-black text-white">Smart Studios & 1BHKs</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Budget-friendly private living for solo nomads, remote developers, and university scholars.
                </p>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  NPR 18k - 30k <span className="text-xs text-slate-400 font-normal">/ month</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2">✓ Kitchenette with Induction/Gas</div>
                  <div className="flex items-center gap-2">✓ 100Mbps Dedicated Fiber Wi-Fi</div>
                  <div className="flex items-center gap-2">✓ Solar Heated Water & Balcony</div>
                  <div className="flex items-center gap-2">✓ Zero Brokerage / Direct Lease</div>
                </div>
              </div>
              <Link
                href="/apartments?tier=economy"
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs text-center block shadow-lg shadow-emerald-500/25 transition"
              >
                Browse Economy Homes &rarr;
              </Link>
            </div>
          </Card3DTilt>

          {/* Premium Package */}
          <Card3DTilt intensity={12}>
            <div className="luxury-glass p-8 rounded-3xl border border-blue-500/30 flex flex-col justify-between h-full space-y-6 hover:border-blue-400/60 transition relative">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-2xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
                  ⭐ Premium Package
                </span>
                <h3 className="text-2xl font-black text-white">Serviced 2BHK / 3BHK</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Upscale expat & family sanctuaries in prime zones (Jhamsikhel, Baluwatar, Sanepa).
                </p>
                <div className="text-3xl font-black text-blue-400 font-mono">
                  NPR 45k - 85k <span className="text-xs text-slate-400 font-normal">/ month</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2">✓ Full Modular Italian Kitchen</div>
                  <div className="flex items-center gap-2">✓ 24/7 Silent Power Generator Backup</div>
                  <div className="flex items-center gap-2">✓ Designated Basement Car Parking</div>
                  <div className="flex items-center gap-2">✓ Weekly Housekeeping & Linen Change</div>
                </div>
              </div>
              <Link
                href="/apartments?tier=premium"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs text-center block shadow-lg shadow-blue-500/25 transition"
              >
                Browse Premium Residences &rarr;
              </Link>
            </div>
          </Card3DTilt>

          {/* Luxurious VIP Package */}
          <Card3DTilt intensity={12}>
            <div className="luxury-glass-gold p-8 rounded-3xl border border-amber-400/50 flex flex-col justify-between h-full space-y-6 hover:border-amber-400 transition relative">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-2xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-block">
                  👑 Luxurious VIP Package
                </span>
                <h3 className="text-2xl font-black text-white">Himalayan Villas & Penthouses</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Presidential lakefront estates & penthouses with unobstructed Annapurna panoramas.
                </p>
                <div className="text-3xl font-black text-amber-300 font-mono">
                  NPR 100k - 250k <span className="text-xs text-slate-400 font-normal">/ month</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2">✓ Private Heated Jacuzzi & Pool</div>
                  <div className="flex items-center gap-2">✓ Lake & Annapurna Mountain View</div>
                  <div className="flex items-center gap-2">✓ Private EV Car Charger On-Site</div>
                  <div className="flex items-center gap-2">✓ Dedicated Private Chef & Butler</div>
                </div>
              </div>
              <Link
                href="/apartments?tier=luxurious"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs text-center block shadow-lg shadow-amber-500/30 transition"
              >
                Browse Luxury Villas &rarr;
              </Link>
            </div>
          </Card3DTilt>
        </div>
      </section>

      {/* Enterprise Metrics Ribbon */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="luxury-glass-gold p-8 rounded-3xl border border-amber-400/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">100%</span>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Automated Invoicing</p>
              <p className="text-2xs text-slate-400">eSewa, Khalti & Cards Reconciled</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">6 Modules</span>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Clean Nwidart Architecture</p>
              <p className="text-2xs text-slate-400">Auth, Rbac, Hotel, Hostel, Booking, Billing</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">&lt; 50ms</span>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">API Response Speed</p>
              <p className="text-2xs text-slate-400">Headless REST API on PHP 8.4</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white">24/7 Sandbox</span>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Mailpit Email Pipeline</p>
              <p className="text-2xs text-slate-400">Port 8025 Real-Time Notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Readiness & Architecture Blueprint Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="luxury-glass rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-widest block mb-1">
                Full Production Stack
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Decoupled Architecture Blueprint
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
                Ready for high-concurrency cloud scaling (AWS ECS / Kubernetes / Docker Swarm) with dedicated database isolation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="http://localhost:8025"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-white/10"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Open Mailpit Sandbox</span>
              </a>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Launch Demo Access
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-400" />
                <span>Frontend: Next.js 15 App Router</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Server-side rendering, client-side interactive 3D WebGL animations, TypeScript type-safety, and Tailwind CSS luxury dark themes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Backend: Laravel 13 Modular</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Decoupled headless API, Nwidart-style domain modules, Passport OAuth tokens, dynamic RBAC middleware, and automated email dispatches.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Orchestration & Database</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Multi-service Docker Compose with PostgreSQL 15 on port 5433, Nginx reverse proxy on port 8082, and Mailpit SMTP server on port 1025.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
