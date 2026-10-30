<?php

namespace Modules\Hostel\Models;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HostelBed extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'bed_number',
        'bed_type', // single, lower_bunk, upper_bunk
        'monthly_rate',
        'status', // available, occupied, reserved
    ];

    protected $casts = [
        'monthly_rate' => 'decimal:2',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function currentBooking(): HasOne
    {
        return $this->hasOne(Booking::class, 'hostel_bed_id')
            ->where('status', 'checked_in')
            ->latestOfMany();
    }
}
