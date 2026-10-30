'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card3DTilt from './Card3DTilt';
import { Star, Wifi, Coffee, Utensils, Shield, MapPin, ArrowUpRight, Flame, Sparkles } from 'lucide-react';

export default function TripsShowcase3D() {
  const [filter, setFilter] = useState<'all' | 'hotels' | 'hostels' | 'apartments' | 'treks'>('all');

  const properties = [
    {
      id: 7,
      name: 'Lakeside Presidential Himalayan Villa',
      city: 'Sedi Hillside, Pokhara',
      tag: '👑 Luxurious Tier • Private Villa',
      type: 'apartments',
      badge: '👑 Ultra Luxury Villa',
      rating: 5,
      price: 'NPR 145,000',
      period: 'per month (or NPR 14k/nt)',
      imageGradient: 'from-amber-950/80 via-slate-900/90 to-yellow-950',
      icon: '🏡',
      description: '3BHK private estate with 180° Phewa Lake and Annapurna panoramas. Features outdoor heated jacuzzi, chef kitchen, EV car charger, and personal butler concierge.',
      amenities: ['Private Heated Jacuzzi', 'Lake & Mountain View', 'EV Charger', 'Personal Butler'],
      link: '/apartments',
    },
    {
      id: 8,
      name: 'Jhamsikhel Executive 2BHK Residence',
      city: 'Expat Hub, Lalitpur',
      tag: '⭐ Premium Tier • Serviced Flat',
      type: 'apartments',
      badge: '⭐ Premium Residence',
      rating: 4,
      price: 'NPR 65,000',
      period: 'per month',
      imageGradient: 'from-blue-950/80 via-slate-900/90 to-indigo-950',
      icon: '🏢',
      description: 'Fully furnished 2BHK in prime Jhamsikhel. Modular Italian kitchen, dual sunlit balconies, 24/7 silent inverter power backup, and designated parking.',
      amenities: ['Modular Kitchen', 'Inverter Backup', 'Housekeeping', 'Basement Parking'],
      link: '/apartments',
    },
    {
      id: 9,
      name: 'Patan Bakhundole Budget Cozy Studio',
      city: 'Bakhundole, Lalitpur',
      tag: '🌱 Economy Tier • Smart Flat',
      type: 'apartments',
      badge: '🌱 Smart Economy',
      rating: 3,
      price: 'NPR 22,000',
      period: 'per month',
      imageGradient: 'from-emerald-950/80 via-slate-900/90 to-teal-950',
      icon: '🛋️',
      description: 'Self-sufficient private studio flat for solo nomads and scholars. Includes kitchenette, 100Mbps dedicated fiber Wi-Fi, solar hot water, and quiet balcony.',
      amenities: ['Kitchenette', '100Mbps Wi-Fi', 'Solar Hot Water', 'Quiet Balcony'],
      link: '/apartments',
    },
    {
      id: 1,
      name: 'Himalayan Horizon Resort & Spa',
      city: 'Pokhara, Lakeside',
      tag: '5-Star Luxury Mountain Haven',
      type: 'hotels',
      badge: '👑 Most Prestigious',
      rating: 5,
      price: 'NPR 8,500',
      period: 'per night',
      imageGradient: 'from-amber-900/60 via-slate-900/80 to-blue-950',
      icon: '🏔️',
      description: 'Panoramic views of the Annapurna Massif & Machhapuchhre, infinity thermal pool, organic breakfast buffet, and royal Ayurvedic spa.',
      amenities: ['Annapurna View', 'Infinity Pool', 'Ayurvedic Spa', 'Free Airport Shuttle'],
      link: '/hotels',
    },
    {
      id: 2,
      name: 'Kathmandu Heritage Boutique Sanctuary',
      city: 'Thamel, Kathmandu',
      tag: 'Artisanal Newari Architecture',
      type: 'hotels',
      badge: '🏛️ Cultural Heritage',
      rating: 4,
      price: 'NPR 5,500',
      period: 'per night',
      imageGradient: 'from-orange-950/70 via-slate-900/80 to-indigo-950',
      icon: '🛕',
      description: 'Handcrafted terracotta brickwork and carved timber woodwork. Located minutes away from UNESCO historical Durbar Square with rooftop cafe.',
      amenities: ['Terracotta Suite', 'Rooftop Lounge', 'Cultural Tours', 'Organic Bakery'],
      link: '/hotels',
    },
    {
      id: 3,
      name: 'Apex Scholars Residency & Tech Hostel',
      city: 'Mid-Baneshwor, Kathmandu',
      tag: 'Boys Academic Residency',
      type: 'hostels',
      badge: '🎓 Best Student Ratings',
      rating: 5,
      price: 'NPR 14,000',
      period: 'per month (all-inclusive)',
      imageGradient: 'from-emerald-950/70 via-slate-900/80 to-blue-950',
      icon: '🏢',
      description: 'Dedicated residency for engineering, medical & IT scholars. Includes 4 times daily hygienic mess buffet, 100Mbps dedicated fiber Wi-Fi, and inverter power backup.',
      amenities: ['4x Meals / Day', '100Mbps Fiber', 'Inverter Backup', 'Quiet Study Hall'],
      link: '/hostels',
    },
    {
      id: 4,
      name: 'Lotus Valley Girls Executive Residency',
      city: 'Tinkune / Pulchowk Hub',
      tag: 'Premier Girls Student & PG Sanctuary',
      type: 'hostels',
      badge: '🛡️ 24/7 Security & Warden',
      rating: 5,
      price: 'NPR 13,500',
      period: 'per month (all-inclusive)',
      imageGradient: 'from-purple-950/70 via-slate-900/80 to-pink-950',
      icon: '🌸',
      description: 'State-of-the-art sanctuary featuring biometric access gate, live CCTV surveillance, nutritious balanced dietitian menu, laundry services, and solar hot water.',
      amenities: ['Biometric Access', 'Nutritionist Menu', 'Solar Hot Water', 'Daily Housekeeping'],
      link: '/hostels',
    },
    {
      id: 5,
      name: 'Everest Panorama Skydeck Lodge',
      city: 'Namche Bazaar, Solukhumbu',
      tag: 'High Altitude Luxury Trekking Base',
      type: 'treks',
      badge: '❄️ Epic Himalayan Base',
      rating: 5,
      price: 'USD $160',
      period: 'per night',
      imageGradient: 'from-cyan-950/70 via-slate-900/80 to-slate-950',
      icon: '⛰️',
      description: 'Heated electric stone flooring, supplemental oxygen lounge, panoramic glass atrium overlooking Mount Everest, and sherpa guiding concierge.',
      amenities: ['Everest View', 'Oxygen Lounge', 'Heated Flooring', 'Sherpa Concierge'],
      link: '/hotels',
    },
    {
      id: 6,
      name: 'Chitwan Jungle Safari Chalets',
      city: 'Sauraha, Chitwan',
      tag: 'Wildlife Sanctuary & River Oasis',
      type: 'treks',
      badge: '🐅 Nature Paradise',
      rating: 4,
      price: 'NPR 7,200',
      period: 'per night',
      imageGradient: 'from-green-950/70 via-slate-900/80 to-amber-950',
      icon: '🌿',
      description: 'Riverfront wooden chalets overlooking the Rapti river. Watch rhinos and exotic birds from your private deck with guided elephant encounters.',
      amenities: ['River Deck', 'Safari Jeep Included', 'Campfire Dinners', 'Bird Watching'],
      link: '/hotels',
    },
  ];

  const filtered = properties.filter(p => filter === 'all' || p.type === filter);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Curated Hospitality Portfolio • Nepal & Global</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Handpicked Stays & <br />
            <span className="gold-gradient-text">Residency Sanctuaries</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
            From 5-star lakeside suites with Annapurna panoramas to state-of-the-art student tech dorms with nutritious mess meals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl luxury-glass border border-white/10 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'all' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Experiences ({properties.length})
          </button>
          <button
            onClick={() => setFilter('hotels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'hotels' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏨 Luxury Hotels
          </button>
          <button
            onClick={() => setFilter('hostels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'hostels' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏢 Student Hostels & PGs
          </button>
          <button
            onClick={() => setFilter('apartments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'apartments' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏠 Apartments & Villas
          </button>
          <button
            onClick={() => setFilter('treks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'treks' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏔️ Himalayan Treks
          </button>
        </div>
      </div>

      {/* 3D Tilt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(prop => (
          <Card3DTilt key={prop.id} intensity={12} className="h-full">
            <div className="h-full flex flex-col justify-between luxury-glass rounded-3xl p-6 border border-white/10 hover:border-amber-400/50 transition-all duration-300 relative group overflow-hidden">
              {/* Background Ambient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${prop.imageGradient} opacity-40 group-hover:opacity-65 transition duration-500`} />

              {/* Card Top */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-2xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {prop.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: prop.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Big Visual Badge */}
                <div className="h-40 rounded-2xl bg-slate-950/60 border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-amber-400/30 transition">
                  <div className="text-4xl">{prop.icon}</div>
                  <div>
                    <span className="text-2xs font-extrabold text-amber-400/90 uppercase tracking-widest">
                      {prop.tag}
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-amber-200 transition line-clamp-1">
                      {prop.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400" /> {prop.city}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {prop.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {prop.amenities.map((a, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-2xs font-medium text-slate-300"
                    >
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer / Pricing & CTA */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-2xs text-slate-400 uppercase block font-semibold">Starting From</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white group-hover:text-amber-300 transition">
                      {prop.price}
                    </span>
                    <span className="text-2xs text-slate-400">{prop.period}</span>
                  </div>
                </div>

                <Link
                  href={prop.link}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition"
                >
                  <span>Book Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card3DTilt>
        ))}
      </div>
    </section>
  );
}
