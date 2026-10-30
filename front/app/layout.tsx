import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'HMS - Global Hotel Booking & Hostel Management Platform',
  description: 'Enterprise platform for Hotel bookings and Hostel bed & student admissions with dynamic RBAC and Passport OAuth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col font-sans antialiased bg-[#070b14] text-slate-100 selection:bg-amber-400 selection:text-slate-950">
        {/* Luxury Obsidian Top Navigation */}
        <header className="luxury-glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition">
                H
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-lg tracking-tight group-hover:text-amber-300 transition">
                    HMS Global
                  </span>
                  <span className="hidden sm:inline-block text-2xs font-extrabold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    v2.0 Modular
                  </span>
                </div>
                <span className="text-2xs text-slate-400 hidden sm:block">
                  Hotels • Hostels • Apartments & Villas
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-bold">
              <Link
                href="/hotels"
                className="px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1"
              >
                <span>🏨 Hotels</span>
              </Link>
              <Link
                href="/hostels"
                className="px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1"
              >
                <span>🏢 Hostels</span>
              </Link>
              <Link
                href="/apartments"
                className="px-3 py-2 rounded-xl text-amber-300 hover:bg-amber-400/10 transition flex items-center gap-1 font-black"
              >
                <span>🏠 Apartments</span>
              </Link>
              <Link
                href="/owner"
                className="px-3 py-2 rounded-xl text-emerald-400 hover:bg-emerald-400/10 transition flex items-center gap-1"
              >
                <span>🔑 Owner</span>
              </Link>
              <Link
                href="/portal"
                className="px-3 py-2 rounded-xl text-purple-400 hover:bg-purple-400/10 transition flex items-center gap-1"
              >
                <span>👤 Stays</span>
              </Link>
              <Link
                href="/admin"
                className="px-3 py-2 rounded-xl text-amber-400 hover:bg-amber-400/10 transition hidden md:flex items-center gap-1"
              >
                <span>👑 Admin</span>
              </Link>
              <a
                href="http://localhost:8025"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition hidden lg:inline-block text-2xs"
                title="View Sandbox Emails"
              >
                ✉️ Mailpit
              </a>
              <Link
                href="/login"
                className="ml-1 sm:ml-2 px-4 py-2 rounded-xl font-black text-2xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition transform active:scale-95"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Luxury Obsidian Footer */}
        <footer className="luxury-glass text-slate-400 text-xs py-10 border-t border-white/10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base">
                  H
                </div>
                <div>
                  <span className="font-bold text-white text-sm">HMS Hospitality & Residency Cloud</span>
                  <p className="text-2xs text-slate-500">Decoupled Architecture: Next.js (Port 3000) • Laravel 13 Modular REST API (Port 8082)</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                <Link href="/hotels" className="hover:text-amber-300 transition">Hotels</Link>
                <Link href="/hostels" className="hover:text-amber-300 transition">Hostels</Link>
                <Link href="/apartments" className="hover:text-amber-300 transition">Apartments & Homes</Link>
                <Link href="/owner" className="hover:text-amber-300 transition">Owner Portal</Link>
                <Link href="/portal" className="hover:text-amber-300 transition">Guest Stays</Link>
                <Link href="/admin" className="hover:text-amber-300 transition">Command Center</Link>
                <Link href="/admin/rbac" className="hover:text-amber-300 transition">Dynamic RBAC</Link>
                <a href="http://localhost:8025" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition">Mailpit Sandbox</a>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-2xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} HMS Global Inc. Certified Production Architecture.</p>
              <p>PostgreSQL 15 • Redis Ready • Passport OAuth • WebSockets Broadcast Ready</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
