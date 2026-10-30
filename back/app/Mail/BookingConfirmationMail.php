<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "HMS Booking Confirmation - {$this->booking->booking_code} ({$this->booking->property->name})"
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;'>
                <div style='background: #2563eb; color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;'>
                    <h1 style='margin: 0; font-size: 22px;'>Hotel Reservation Confirmed!</h1>
                    <p style='margin: 5px 0 0; font-size: 14px; opacity: 0.9;'>Booking Reference: <strong>{$this->booking->booking_code}</strong></p>
                </div>
                <div style='padding: 24px 0;'>
                    <p>Dear <strong>{$this->booking->guest->name}</strong>,</p>
                    <p>Thank you for choosing <strong>{$this->booking->property->name}</strong>. Your reservation has been successfully confirmed.</p>
                    
                    <div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;'>
                        <h3 style='margin-top: 0; color: #1e293b; font-size: 16px;'>Reservation Details</h3>
                        <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                            <tr>
                                <td style='padding: 6px 0; color: #64748b;'>Property:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$this->booking->property->name}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #64748b;'>Room:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>Room {$this->booking->room->room_number} ({$this->booking->room->type})</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #64748b;'>Check-in:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$this->booking->check_in_date->format('Y-m-d')}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #64748b;'>Check-out:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$this->booking->check_out_date->format('Y-m-d')}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #64748b;'>Total Amount:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #2563eb;'>NPR " . number_format($this->booking->total_amount, 2) . "</td>
                            </tr>
                        </table>
                    </div>
                    <p style='font-size: 13px; color: #64748b;'>Location: {$this->booking->property->address}, {$this->booking->property->city}, {$this->booking->property->country}</p>
                    <p style='font-size: 13px; color: #64748b;'>Inquiries: {$this->booking->property->phone} | {$this->booking->property->email}</p>
                </div>
                <div style='border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8;'>
                    HMS Global Hospitality & Hostel Management System
                </div>
            </div>"
        );
    }
}
