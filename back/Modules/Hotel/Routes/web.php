<?php

use Illuminate\Support\Facades\Route;
use Modules\Hotel\Http\Controllers\HotelController;

Route::prefix('hotels')->name('hotels.')->group(function () {
    Route::get('/', [HotelController::class, 'index'])->name('index');
    Route::get('/{slug}', [HotelController::class, 'show'])->name('show');
    Route::post('/book', [HotelController::class, 'bookRoom'])->name('book');
});
