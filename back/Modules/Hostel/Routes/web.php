<?php

use Illuminate\Support\Facades\Route;
use Modules\Hostel\Http\Controllers\HostelController;

Route::prefix('hostels')->name('hostels.')->group(function () {
    Route::get('/', [HostelController::class, 'index'])->name('index');
    Route::get('/{slug}', [HostelController::class, 'show'])->name('show');
    Route::post('/admission', [HostelController::class, 'applyAdmission'])->name('admission');
});
