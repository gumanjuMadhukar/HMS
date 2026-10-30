'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { hmsApi } from '@/lib/api';
import Card3DTilt from '@/components/Card3DTilt';
import { useToast } from '@/components/ToastContext';
import { 
  CreditCard, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Printer, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  BedDouble,
  Users,
  AlertCircle
} from 'lucide-react';

export default function UserFinderPortalPage() {
  const { success, error, info } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Payment state
  const [paymentGateway, setPaymentGateway] = useState<'esewa' | 'khalti' | 'card' | 'cash'>('esewa');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [processingPay, setProcessingPay] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await hmsApi.getUserBookings();
      setBookings(res.data || []);
    } catch (err: any) {
      console.error('Failed to load user bookings:', err);
      error('Fetch Error', err.message || 'Unable to retrieve reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleOpenPayment = (b: any) => {
    setSelectedBooking(b);
    const balance = Math.max(0, Number(b.total_amount) - Number(b.paid_amount));
    setPayAmount(balance > 0 ? balance : Number(b.total_amount));
    setShowPaymentModal(true);
  };

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setProcessingPay(true);
    try {
      await hmsApi.payBookingBalance(selectedBooking.id, {
        gateway: paymentGateway,
        amount: payAmount,
      });
      success('Payment Reconciled', `Payment of NPR ${payAmount.toLocaleString()} via ${paymentGateway.toUpperCase()} confirmed!`);
      setShowPaymentModal(false);
      loadBookings();
    } catch (err: any) {
      error('Payment Failed', err.message || 'Payment execution failed');
    } finally {
      setProcessingPay(false);
    }
  };

  const handleCancelBooking = async (b: any) => {
    if (!confirm(`Are you sure you want to cancel reservation ${b.booking_code}?`)) return;
    try {
      await hmsApi.cancelUserBooking(b.id);
      success('Reservation Cancelled', `Booking ${b.booking_code} was successfully cancelled.`);
      loadBookings();
    } catch (err: any) {
      error('Cancellation Failed', err.message || 'Cancellation failed');
    }
  };

  const handleOpenInvoice = (b: any) => {
    setSelectedBooking(b);
    setShowInvoiceModal(true);
  };

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-purple-400 uppercase tracking-widest mb-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
            <span>GUEST & STUDENT RESIDENCY PORTAL • PERSONAL STAYS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-400 stroke-[2.5]" />
            <span>My Reservations & Admissions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Access hotel booking vouchers, track hostel admission status, and settle invoices with eSewa & Khalti instant wallet settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/hotels"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
          >
            <span>🏨 Explore Hotels</span>
          </Link>
          <Link
            href="/hostels"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
          >
            <span>🏢 Apply for Hostel</span>
          </Link>
        </div>
      </div>

      {/* Bookings & Admissions Feed */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>Active & Historical Reservations ({bookings.length})</span>
          </h2>
          <button
            onClick={loadBookings}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold luxury-glass px-3 py-1.5 rounded-xl border border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center space-y-4">
            <div className="h-10 w-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-xs">Retrieving your personal residency ledger...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center luxury-glass rounded-3xl border border-white/10 space-y-4">
            <div className="text-4xl">🧳</div>
            <h3 className="text-xl font-bold text-white">No Stays Registered Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You haven&apos;t booked any hotel stays or student hostel dorms yet. Explore available properties across Nepal!
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link href="/hotels" className="px-5 py-2.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-2xl shadow-md">
                Explore Hotels
              </Link>
              <Link href="/hostels" className="px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-2xl shadow-md">
                Explore Hostels
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((b: any) => {
              const isHotel = b.booking_type === 'hotel';
              const total = Number(b.total_amount);
              const paid = Number(b.paid_amount);
              const balance = Math.max(0, total - paid);
              const isPaid = balance === 0;

              return (
                <Card3DTilt key={b.id} intensity={8}>
                  <div className="luxury-glass rounded-3xl border border-white/10 hover:border-purple-400/50 p-6 sm:p-8 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-2xs font-extrabold px-3 py-1 rounded-full uppercase ${
                          isHotel
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isHotel ? '🏨 Hotel Booking' : '🏢 Hostel Admission'}
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-300 bg-slate-950/80 px-2.5 py-0.5 rounded-lg border border-white/10">
                          {b.booking_code}
                        </span>
                        <span className={`text-2xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          b.status === 'confirmed' || b.status === 'checked_in'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : b.status === 'cancelled'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-700/30 text-slate-400'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-white">{b.property?.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        <span>{b.property?.address}, {b.property?.city}</span>
                        <span>• Contact: {b.property?.phone}</span>
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                        <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                          <span className="text-2xs text-slate-500 block font-extrabold uppercase">Unit Allocation</span>
                          <span className="font-bold text-white text-xs mt-0.5 block">
                            Room {b.room?.room_number} {b.bed ? `• Bed ${b.bed.bed_number}` : `(${b.room?.type})`}
                          </span>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                          <span className="text-2xs text-slate-500 block font-extrabold uppercase">
                            {isHotel ? 'Check-In' : 'Admission Date'}
                          </span>
                          <span className="font-bold text-white text-xs mt-0.5 block">
                            {new Date(b.check_in_date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                          <span className="text-2xs text-slate-500 block font-extrabold uppercase">
                            {isHotel ? 'Check-Out' : 'Residency Expiry'}
                          </span>
                          <span className="font-bold text-white text-xs mt-0.5 block">
                            {new Date(b.check_out_date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                          <span className="text-2xs text-slate-500 block font-extrabold uppercase">Meal Plan</span>
                          <span className="font-bold text-amber-300 text-xs mt-0.5 block uppercase">
                            {b.meal_plan || 'Standard'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial & Actions */}
                    <div className="flex flex-col sm:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 space-y-4 min-w-[220px]">
                      <div className="sm:text-right">
                        <span className="text-2xs text-slate-400 font-extrabold uppercase block tracking-wider">
                          Total Fee
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-white">
                          NPR {total.toLocaleString()}
                        </p>
                        <div className="flex items-center sm:justify-end gap-1.5 mt-1">
                          <span className={`h-2 w-2 rounded-full ${isPaid ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                          <span className={`text-2xs font-bold ${isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isPaid ? '✓ Fully Settled' : `Due: NPR ${balance.toLocaleString()}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleOpenInvoice(b)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold luxury-glass border border-white/10 hover:border-white/30 text-slate-200 transition flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Voucher</span>
                        </button>

                        {!isPaid && b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleOpenPayment(b)}
                            className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Settle Bill</span>
                          </button>
                        )}

                        {b.status !== 'cancelled' && b.status !== 'checked_out' && (
                          <button
                            onClick={() => handleCancelBooking(b)}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card3DTilt>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Digital Invoice / Stay Voucher */}
      {showInvoiceModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="luxury-glass-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-amber-400/40 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-2xs font-extrabold text-amber-400 uppercase tracking-widest">
                  Official Stay Voucher
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">HMS Residency Confirmation</h3>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="bg-slate-950/70 p-5 rounded-2xl border border-white/10 space-y-3 text-xs text-slate-300">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                <span className="text-slate-500">Booking Reference</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{selectedBooking.booking_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Resident / Guest</span>
                <span className="font-bold text-white">{selectedBooking.guest?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Property</span>
                <span className="font-bold text-white">{selectedBooking.property?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Allocated Unit</span>
                <span className="font-bold text-white">
                  Room {selectedBooking.room?.room_number} {selectedBooking.bed ? `(Bed ${selectedBooking.bed.bed_number})` : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Check-in / Admission</span>
                <span className="font-bold text-white">
                  {new Date(selectedBooking.check_in_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Check-out / Expiry</span>
                <span className="font-bold text-white">
                  {new Date(selectedBooking.check_out_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/10 text-sm">
                <span className="font-bold text-white">Total Billed</span>
                <span className="font-black text-amber-300">
                  NPR {Number(selectedBooking.total_amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Settled</span>
                <span className="font-bold text-emerald-400">
                  NPR {Number(selectedBooking.paid_amount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-2xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Digitally cryptographically signed on HMS Ledger
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
              >
                Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Settle Bill via Payment Gateway */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="luxury-glass-gold max-w-md w-full p-6 sm:p-8 rounded-3xl border border-emerald-400/40 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-2xs font-extrabold text-emerald-400 uppercase tracking-widest">
                  Instant Payment Gateway Reconciler
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Settle Reservation Balance</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Select Gateway Platform
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('esewa')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      paymentGateway === 'esewa'
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400'
                        : 'border-white/10 bg-slate-950/50 hover:border-white/20'
                    }`}
                  >
                    <span className="h-7 w-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                      e
                    </span>
                    <div>
                      <span className="font-bold block text-white text-xs">eSewa Nepal</span>
                      <span className="text-2xs text-slate-400">Digital Wallet</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('khalti')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      paymentGateway === 'khalti'
                        ? 'border-purple-400 bg-purple-500/20 text-purple-200 ring-1 ring-purple-400'
                        : 'border-white/10 bg-slate-950/50 hover:border-white/20'
                    }`}
                  >
                    <span className="h-7 w-7 rounded-lg bg-purple-500 text-white flex items-center justify-center font-black text-xs">
                      K
                    </span>
                    <div>
                      <span className="font-bold block text-white text-xs">Khalti Pay</span>
                      <span className="text-2xs text-slate-400">Instant UPI/Wallet</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('card')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      paymentGateway === 'card'
                        ? 'border-blue-400 bg-blue-500/20 text-blue-200 ring-1 ring-blue-400'
                        : 'border-white/10 bg-slate-950/50 hover:border-white/20'
                    }`}
                  >
                    <span className="h-7 w-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-xs">
                      💳
                    </span>
                    <div>
                      <span className="font-bold block text-white text-xs">Credit / Debit</span>
                      <span className="text-2xs text-slate-400">Visa / Mastercard</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('cash')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      paymentGateway === 'cash'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400'
                        : 'border-white/10 bg-slate-950/50 hover:border-white/20'
                    }`}
                  >
                    <span className="h-7 w-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                      💵
                    </span>
                    <div>
                      <span className="font-bold block text-white text-xs">Desk Settlement</span>
                      <span className="text-2xs text-slate-400">Cash / Reception</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Settlement Amount (NPR)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 p-3 rounded-2xl text-white font-mono font-bold text-base focus:outline-hidden focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-2xs text-emerald-300">
                ⚡ Payments are instantly recorded on the HMS Billing Ledger with automated reconciliation.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingPay}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25"
                >
                  {processingPay ? 'Reconciling...' : `Pay NPR ${payAmount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
