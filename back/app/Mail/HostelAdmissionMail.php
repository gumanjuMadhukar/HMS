<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HostelAdmissionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "HMS Hostel Admission Approved - {$this->booking->booking_code} ({$this->booking->property->name})"
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;'>
                <div style='background: #d97706; color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;'>
                    <h1 style='margin: 0; font-size: 22px;'>Hostel Admission Confirmed!</h1>
                    <p style='margin: 5px 0 0; font-size: 14px; opacity: 0.9;'>Admission Code: <strong>{$this->booking->booking_code}</strong></p>
                </div>
                <div style='padding: 24px 0;'>
                    <p>Dear Student <strong>{$this->booking->guest->name}</strong>,</p>
                    <p>Welcome to <strong>{$this->booking->property->name}</strong>! Your residency admission has been accepted.</p>
                    
                    <div style='background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;'>
                        <h3 style='margin-top: 0; color: #92400e; font-size: 16px;'>Residency Allocation</h3>
                        <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
                            <tr>
                                <td style='padding: 6px 0; color: #78350f;'>Hostel:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #1e293b;'>{$this->booking->property->name}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #78350f;'>Room & Bed:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #1e293b;'>Room {$this->booking->room->room_number} - Bed {$this->booking->bed?->bed_number}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #78350f;'>Admission Date:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #1e293b;'>{$this->booking->check_in_date->format('Y-m-d')}</td>
                            </tr>
                            <tr>
                                <td style='padding: 6px 0; color: #78350f;'>Monthly Rent/Mess:</td>
                                <td style='padding: 6px 0; font-weight: bold; color: #b45309;'>NPR " . number_format($this->booking->total_amount, 2) . " / month</td>
                            </tr>
                        </table>
                    </div>
                    <p style='font-size: 13px; color: #64748b;'>Warden Office: {$this->booking->property->phone} | {$this->booking->property->email}</p>
                    <p style='font-size: 13px; color: #64748b;'>Address: {$this->booking->property->address}, {$this->booking->property->city}</p>
                </div>
                <div style='border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8;'>
                    HMS Student Accommodation System
                </div>
            </div>"
        );
    }
}
