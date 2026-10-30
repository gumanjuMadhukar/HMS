<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PublicBookingController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;
use Modules\Finder\Http\Controllers\FinderController;
use Modules\Owner\Http\Controllers\OwnerDashboardController;
use Modules\Owner\Http\Controllers\OwnerPropertyController;
use Modules\Rbac\Http\Controllers\RbacController;

// ============================================
// Public Portal
// ============================================
Route::get('/', [PublicBookingController::class, 'index'])->name('home');
Route::get('/rooms', [PublicBookingController::class, 'rooms'])->name('public.rooms');
Route::post('/book', [PublicBookingController::class, 'bookRoom'])->name('public.book');
Route::get('/booking/confirmed/{bookingCode}', [PublicBookingController::class, 'confirmed'])->name('public.booking.confirmed');

// ============================================
// User / Finder Panel (Public search & Private dashboard)
// ============================================
Route::prefix('finder')->name('finder.')->group(function () {
    Route::get('/', [FinderController::class, 'index'])->name('index');
    Route::get('/room/{room}', [FinderController::class, 'show'])->name('show');
    
    Route::middleware('auth')->group(function () {
        Route::get('/my-bookings', [FinderController::class, 'myBookings'])->name('my-bookings');
    });
});

// ============================================
// Authentication
// ============================================
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ============================================
// Owner Panel (Multi-tenant Property Owners)
// Protected by: auth + role:owner,super_admin
// ============================================
Route::middleware(['auth', 'role:owner,super_admin'])->prefix('owner')->name('owner.')->group(function () {
    Route::get('/dashboard', [OwnerDashboardController::class, 'index'])->name('dashboard');
    Route::get('/properties', [OwnerPropertyController::class, 'index'])->name('properties.index');
    Route::post('/properties', [OwnerPropertyController::class, 'store'])->name('properties.store');
});

// ============================================
// Super Admin Panel
// Protected by: auth + role:super_admin
// ============================================
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rooms Management
    Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');
    Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::patch('/rooms/{room}/status', [RoomController::class, 'updateStatus'])->name('rooms.status');
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

    // Bookings & Stays
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::post('/bookings/{booking}/check-in', [BookingController::class, 'checkIn'])->name('bookings.check-in');
    Route::post('/bookings/{booking}/check-out', [BookingController::class, 'checkOut'])->name('bookings.check-out');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    // Tenants & Guests
    Route::get('/guests', [GuestController::class, 'index'])->name('guests.index');
    Route::post('/guests', [GuestController::class, 'store'])->name('guests.store');

    // Payments & Invoices
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}/invoice', [PaymentController::class, 'invoice'])->name('payments.invoice');

    // Dynamic RBAC Management
    Route::get('/rbac', [RbacController::class, 'index'])->name('rbac.index');
    Route::post('/rbac/roles', [RbacController::class, 'storeRole'])->name('rbac.roles.store');
    Route::post('/rbac/roles/{role}/permissions', [RbacController::class, 'updateRolePermissions'])->name('rbac.roles.permissions');
    Route::post('/rbac/users/{user}/roles', [RbacController::class, 'assignUserRole'])->name('rbac.users.roles');
});

// Smart dashboard redirect based on role
Route::get('/dashboard', function () {
    if (! auth()->check()) {
        return redirect()->route('login');
    }
    if (auth()->user()->hasRole('super_admin')) {
        return redirect()->route('admin.dashboard');
    }
    if (auth()->user()->hasRole('owner')) {
        return redirect()->route('owner.dashboard');
    }
    return redirect()->route('finder.my-bookings');
})->name('dashboard');
