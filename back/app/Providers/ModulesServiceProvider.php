<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModulesServiceProvider extends ServiceProvider
{
    /**
     * Active system modules
     */
    protected array $modules = [
        'Auth',
        'Rbac',
        'Hotel',
        'Hostel',
        'Booking',
        'Billing',
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        foreach ($this->modules as $module) {
            $modulePath = base_path("Modules/{$module}");

            // Load module web routes
            if (file_exists("{$modulePath}/Routes/web.php")) {
                Route::middleware('web')
                    ->group("{$modulePath}/Routes/web.php");
            }

            // Load module api routes
            if (file_exists("{$modulePath}/Routes/api.php")) {
                Route::prefix('api/v1')
                    ->middleware('api')
                    ->group("{$modulePath}/Routes/api.php");
            }

            // Load module views with namespace e.g. view('hotel::index')
            if (is_dir("{$modulePath}/Resources/views")) {
                $this->loadViewsFrom("{$modulePath}/Resources/views", strtolower($module));
            }
        }
    }
}
