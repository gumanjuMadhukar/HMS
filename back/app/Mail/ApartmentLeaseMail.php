<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApartmentLeaseMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "HMS Lease Agreement Confirmed - {$this->booking->booking_code} ({$this->booking->property->name})"
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;'>
                <div style='background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;'>
                    <h1 style='margin: 0; font-size: 22px;'>Home Rental & Apartment Lease Confirmed!</h1>
                    <p style='margin: 5px 0 0; font-size: 14px; opacity: 0.9;'>Lease Reference: <strong>{$this->booking->booking_code}</strong></p>
                </div>
                <div style='padding: 24px 0;'>
                    <p>Dear <strong>{$this->booking->guest->name}</strong>,</p>
                    <p>Congratulations! Your reservation for <strong>{$this->booking->property->name}</strong> has been verified and confirmed.</p>
                    
                    <div style='background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;'>
                        <h3 style='margin-top: 0; color: #166534; font-size: 16px;'>Lease & Rental Summary</h3>
                        <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                            <tr>
                                <td style='padding: 6px 0; color: #15803d;'>Residence:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$this->booking->property->name}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #15803d;'>Apartment Unit:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>Unit {$this->booking->room->room_number} ({$this->booking->room->type})</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #15803d;'>Move-In Date:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$this->booking->check_in_date->format('Y-m-d')}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #15803d;'>Lease Expiry:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$this->booking->check_out_date->format('Y-m-d')}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #15803d;'>Total Billed Amount:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #059669;'>NPR " . number_format($this->booking->total_amount, 2) . "</td>
                            </tr>
                        </table>
                    </div>
                    <p style='font-size: 13px; color: #64748b;'>Address: {$this->booking->property->address}, {$this->booking->property->city}, Nepal</p>
                    <p style='font-size: 13px; color: #64748b;'>Property Host / Concierge: {$this->booking->property->phone} | {$this->booking->property->email}</p>
                </div>
                <div style='border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8;'>
                    HMS Global Serviced Apartment & Villa Rental Engine
                </div>
            </div>"
        );
    }
}
