import './globals.css';
import Link from 'next/link';
import { ToastProvider } from '@/components/ToastContext';
import { Sparkles, ShieldCheck, Mail, MapPin, Phone, Globe, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'HMS Global — Luxury Hotels, Hostels & Serviced Apartments',
  description: 'Enterprise hospitality and residency cloud platform for Commercial Hotels, Student Dormitories, and Serviced Apartments in Nepal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col font-sans antialiased bg-[#050811] text-slate-100 selection:bg-amber-400 selection:text-slate-950">
        <ToastProvider>
          {/* Top Announcement Bar */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border-b border-amber-400/20 py-1.5 px-4 text-center text-2xs font-bold text-amber-300 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>HMS 2.2 ENTERPRISE ONLINE • DEDICATED HOSTEL MESS & HOTEL BOOKINGS ENGINE ACROSS NEPAL</span>
            <span className="hidden sm:inline-block text-slate-400">• Verified by Nepal Tourism Board Standards</span>
          </div>

          {/* Floating Luxury Obsidian Top Navigation */}
          <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-2 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto luxury-glass rounded-3xl border border-white/10 px-4 sm:px-6 h-18 flex items-center justify-between shadow-2xl">
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/30 group-hover:scale-105 group-hover:rotate-1 transition">
                  H
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-lg tracking-tight group-hover:text-amber-300 transition">
                      HMS Global
                    </span>
                    <span className="hidden sm:inline-block text-2xs font-extrabold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                      v2.2 Pro
                    </span>
                  </div>
                  <span className="text-2xs text-slate-400 hidden sm:block">
                    Himalayan Hotels • Student Dorms • Luxury Flats
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
                <Link
                  href="/hotels"
                  className="px-3.5 py-2 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
                >
                  <span>🏨 Hotels</span>
                </Link>

                <Link
                  href="/hostels"
                  className="px-3.5 py-2 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
                >
                  <span>🏢 Hostels</span>
                </Link>

                <Link
                  href="/apartments"
                  className="px-3.5 py-2 rounded-2xl text-amber-300 hover:bg-amber-400/15 transition flex items-center gap-1.5 font-black border border-amber-400/25 bg-amber-400/5"
                >
                  <span>🏠 Apartments</span>
                </Link>

                <Link
                  href="/owner"
                  className="px-3.5 py-2 rounded-2xl text-emerald-400 hover:bg-emerald-400/10 transition hidden md:flex items-center gap-1.5"
                >
                  <span>🔑 Owner</span>
                </Link>

                <Link
                  href="/portal"
                  className="px-3.5 py-2 rounded-2xl text-purple-400 hover:bg-purple-400/10 transition flex items-center gap-1.5"
                >
                  <span>👤 Stays</span>
                </Link>

                <Link
                  href="/admin"
                  className="px-3.5 py-2 rounded-2xl text-amber-400 hover:bg-amber-400/15 transition hidden lg:flex items-center gap-1.5"
                >
                  <span>👑 Admin Pro</span>
                </Link>

                {/* Currency & Sign In */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/10 ml-1">
                  <span className="hidden xl:inline-block text-2xs font-mono font-bold text-amber-300 bg-slate-900 px-2 py-1 rounded-lg border border-white/10">
                    NPR (रु)
                  </span>

                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl font-black text-2xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
                  >
                    Sign In
                  </Link>
                </div>
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Luxury Obsidian Enterprise Footer */}
          <footer className="luxury-glass text-slate-400 text-xs py-16 border-t border-white/10 mt-20 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Col 1: Brand & Identity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
                      H
                    </div>
                    <div>
                      <span className="font-bold text-white text-base">HMS Global Cloud</span>
                      <p className="text-2xs text-amber-400 font-semibold">Nepal & Global Hospitality Architecture</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Decoupled architecture orchestrated by Next.js 15 client runtime and headless Laravel 13 Modular REST API.
                  </p>
                  <div className="flex items-center gap-2 text-2xs text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span>API v1 REST Engine Online (Port 8082 / 8081)</span>
                  </div>
                </div>

                {/* Col 2: Hospitality Domains */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Hospitality Verticals</h4>
                  <ul className="space-y-2 text-xs">
                    <li><Link href="/hotels" className="hover:text-amber-300 transition">Commercial Hotels & Resorts</Link></li>
                    <li><Link href="/hostels" className="hover:text-amber-300 transition">Student Dorms & 4-Meal Mess</Link></li>
                    <li><Link href="/apartments" className="hover:text-amber-300 transition">Serviced Flats & Private Villas</Link></li>
                    <li><Link href="/hotels?city=Pokhara" className="hover:text-amber-300 transition">Pokhara Lakeside Sanctuaries</Link></li>
                    <li><Link href="/hostels?city=Kathmandu" className="hover:text-amber-300 transition">Kathmandu University Hostels</Link></li>
                  </ul>
                </div>

                {/* Col 3: Enterprise Portals */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Operational Portals</h4>
                  <ul className="space-y-2 text-xs">
                    <li><Link href="/admin" className="hover:text-amber-300 transition">Super Administrator Suite</Link></li>
                    <li><Link href="/admin/rbac" className="hover:text-amber-300 transition">Dynamic RBAC Permission Matrix</Link></li>
                    <li><Link href="/owner" className="hover:text-amber-300 transition">Property Owner & Asset Manager</Link></li>
                    <li><Link href="/portal" className="hover:text-amber-300 transition">Guest Reservations & Vouchers</Link></li>
                    <li><a href="http://localhost:8025" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition">Mailpit Sandbox (Email Inspector)</a></li>
                  </ul>
                </div>

                {/* Col 4: Regional Hubs in Nepal */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Regional Headquarters</h4>
                  <div className="space-y-2 text-2xs text-slate-400">
                    <p className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Jhamsikhel / Sanepa, Ward 3, Lalitpur</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lakeside North, Sedi Hillside, Pokhara</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Support: +977-1-5540000 / 9801234567</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>eSewa & Khalti Merchant Certified</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} HMS Global Inc. Certified Enterprise Hospitality Architecture.</p>
                <p>PostgreSQL 15 • Redis 7 • OAuth Passport Bearer • Next.js 15 App Router</p>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
