<?php

use App\Http\Controllers\DashboardApiController;
use Illuminate\Support\Facades\Route;
use Modules\Apartment\Http\Controllers\ApartmentApiController;
use Modules\Auth\Http\Controllers\PassportAuthController;
use Modules\Billing\Http\Controllers\BillingApiController;
use Modules\Booking\Http\Controllers\BookingApiController;
use Modules\Hostel\Http\Controllers\HostelApiController;
use Modules\Hotel\Http\Controllers\HotelApiController;
use Modules\Owner\Http\Controllers\OwnerApiController;
use Modules\Portal\Http\Controllers\UserPortalApiController;
use Modules\Rbac\Http\Controllers\RbacApiController;

// ============================================
// HMS Modular API v1 (Serving Next.js Frontend & Mobile)
// ============================================
Route::prefix('v1')->group(function () {
    // 1. Auth & Bearer Tokens
    Route::prefix('auth')->group(function () {
        Route::post('/register', [PassportAuthController::class, 'register']);
        Route::post('/login', [PassportAuthController::class, 'login']);
        Route::get('/profile', [PassportAuthController::class, 'profile']);
        Route::post('/logout', [PassportAuthController::class, 'logout']);
    });

    // 2. Hotels Module API
    Route::prefix('hotels')->group(function () {
        Route::get('/', [HotelApiController::class, 'index']);
        Route::get('/{slug}', [HotelApiController::class, 'show']);
        Route::post('/book', [HotelApiController::class, 'book']);
    });

    // 3. Hostels Module API
    Route::prefix('hostels')->group(function () {
        Route::get('/', [HostelApiController::class, 'index']);
        Route::get('/{slug}', [HostelApiController::class, 'show']);
        Route::post('/admission', [HostelApiController::class, 'applyAdmission']);
    });

    // 4. Apartments & Home Rentals Module API
    Route::prefix('apartments')->group(function () {
        Route::get('/', [ApartmentApiController::class, 'index']);
        Route::get('/{slug}', [ApartmentApiController::class, 'show']);
        Route::post('/book', [ApartmentApiController::class, 'book']);
    });

    // 5. Bookings API
    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingApiController::class, 'index']);
        Route::get('/{code}', [BookingApiController::class, 'show']);
        Route::post('/{booking}/check-in', [BookingApiController::class, 'checkIn']);
        Route::post('/{booking}/check-out', [BookingApiController::class, 'checkOut']);
        Route::post('/{booking}/cancel', [BookingApiController::class, 'cancel']);
    });

    // 5. Billing API
    Route::prefix('billing')->group(function () {
        Route::get('/', [BillingApiController::class, 'index']);
        Route::post('/payment', [BillingApiController::class, 'recordPayment']);
        Route::get('/invoice/{payment}', [BillingApiController::class, 'invoice']);
    });

    // 6. Dynamic RBAC Matrix API
    Route::prefix('rbac')->group(function () {
        Route::get('/matrix', [RbacApiController::class, 'matrix']);
        Route::post('/roles', [RbacApiController::class, 'storeRole']);
        Route::post('/roles/{role}/permissions', [RbacApiController::class, 'syncRolePermissions']);
        Route::post('/users/{user}/roles', [RbacApiController::class, 'syncUserRoles']);
    });

    // 7. Property Owner Portal API
    Route::prefix('owner')->group(function () {
        Route::get('/properties', [OwnerApiController::class, 'getProperties']);
        Route::post('/properties', [OwnerApiController::class, 'storeProperty']);
        Route::post('/properties/{property}/rooms', [OwnerApiController::class, 'storeRoom']);
        Route::get('/analytics', [OwnerApiController::class, 'analytics']);
    });

    // 8. User / Tenant / Finder Portal API
    Route::prefix('user')->group(function () {
        Route::get('/bookings', [UserPortalApiController::class, 'myBookings']);
        Route::post('/bookings/{booking}/pay', [UserPortalApiController::class, 'payBooking']);
        Route::post('/bookings/{booking}/cancel', [UserPortalApiController::class, 'cancelBooking']);
    });

    // 9. Dashboard Live Stats
    Route::get('/dashboard/stats', [DashboardApiController::class, 'stats']);
});
