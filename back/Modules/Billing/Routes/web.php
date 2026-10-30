<?php

use Illuminate\Support\Facades\Route;
use Modules\Billing\Http\Controllers\BillingController;

Route::middleware('auth')->prefix('admin/billing')->name('admin.billing.')->group(function () {
    Route::get('/', [BillingController::class, 'index'])->name('index');
    Route::post('/', [BillingController::class, 'store'])->name('store');
    Route::get('/invoice/{payment}', [BillingController::class, 'invoice'])->name('invoice');
});
