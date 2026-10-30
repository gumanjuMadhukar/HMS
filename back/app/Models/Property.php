<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Hostel\Models\HostelBed;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'category', // hotel, hostel
        'property_type', // boutique, resort, standard, boys_hostel, girls_hostel, co_ed
        'star_rating',
        'gender_policy',
        'address',
        'city',
        'country',
        'phone',
        'email',
        'description',
        'amenities',
        'house_rules',
        'currency',
        'status',
    ];

    protected $casts = [
        'amenities' => 'array',
        'house_rules' => 'array',
        'star_rating' => 'integer',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function beds(): HasMany
    {
        return $this->hasManyThrough(HostelBed::class, Room::class);
    }

    // Scopes
    public function scopeHotels($query)
    {
        return $query->where('category', 'hotel');
    }

    public function scopeHostels($query)
    {
        return $query->where('category', 'hostel');
    }

    public function scopeApartments($query)
    {
        return $query->whereIn('category', ['apartment', 'home_rental']);
    }
}
