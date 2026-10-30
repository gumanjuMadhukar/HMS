<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ============================================
        // 1. Dynamic RBAC: Roles & Permissions
        // ============================================
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // super_admin, hotel_owner, hostel_owner, staff, customer
            $table->text('description')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('module')->default('general'); // hotel, hostel, booking, billing, rbac
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'role_id']);
            $table->timestamps();
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->unique(['role_id', 'permission_id']);
            $table->timestamps();
        });

        // ============================================
        // 2. API Tokens (Passport / Bearer Token support)
        // ============================================
        Schema::create('api_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        // ============================================
        // 3. Properties (Hotels & Hostels)
        // ============================================
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->default('hotel'); // hotel, hostel
            $table->string('property_type')->default('standard'); // boutique, luxury, resort, boys_hostel, girls_hostel, co_ed
            $table->integer('star_rating')->default(3); // 1-5 stars for hotels
            $table->string('gender_policy')->default('co_ed'); // co_ed, boys_only, girls_only
            $table->string('address');
            $table->string('city'); // Kathmandu, Pokhara, Lalitpur, Chitwan, etc.
            $table->string('country')->default('Nepal');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('description')->nullable();
            $table->json('amenities')->nullable(); // wifi, ac, hot_water, breakfast, parking, power_backup, cafeteria, library
            $table->json('house_rules')->nullable(); // curfew_time, smoking_policy, guest_policy
            $table->string('currency')->default('NPR'); // NPR, USD
            $table->string('status')->default('active'); // active, pending, maintenance
            $table->timestamps();
        });

        // ============================================
        // 4. Rooms & Suites
        // ============================================
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('room_number');
            $table->string('floor')->default('1');
            $table->string('type')->default('deluxe'); // single, double, triple, dorm, deluxe, executive_suite
            $table->integer('capacity')->default(1);
            $table->integer('total_beds')->default(1);
            $table->decimal('price_per_night', 10, 2)->default(0); // for hotel stays
            $table->decimal('price_per_month', 10, 2)->default(0); // for hostel admissions
            $table->string('status')->default('available'); // available, occupied, maintenance, reserved
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->timestamps();
        });

        // ============================================
        // 5. Hostel Beds (Hostel-specific bed allocation)
        // ============================================
        Schema::create('hostel_beds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->string('bed_number'); // Bed A, Bed B, Lower 1, Upper 2
            $table->string('bed_type')->default('single'); // single, lower_bunk, upper_bunk
            $table->decimal('monthly_rate', 10, 2)->default(0);
            $table->string('status')->default('available'); // available, occupied, reserved
            $table->timestamps();
        });

        // ============================================
        // 6. Guests & Hostel Students/Tenants
        // ============================================
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('id_type')->nullable(); // citizenship, passport, student_id
            $table->string('id_number')->nullable();
            $table->string('institution')->nullable(); // College, University, or Company
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('blood_group')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        // ============================================
        // 7. Bookings (Hotel Stays & Hostel Admissions)
        // ============================================
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->string('booking_type')->default('hotel'); // hotel, hostel
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('hostel_bed_id')->nullable()->constrained('hostel_beds')->nullOnDelete();
            $table->foreignId('guest_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->date('check_in_date');
            $table->date('check_out_date')->nullable(); // Nullable for long-term hostel stays
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            $table->string('meal_plan')->nullable(); // ep (room only), cp (breakfast), map (half board), hostel_full_mess
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->string('status')->default('confirmed'); // confirmed, checked_in, checked_out, cancelled
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ============================================
        // 8. Billing & Payments
        // ============================================
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->decimal('amount', 12, 2);
            $table->string('currency')->default('NPR'); // NPR, USD
            $table->string('payment_method')->default('cash'); // cash, esewa, khalti, card, bank_transfer
            $table->timestamp('payment_date')->useCurrent();
            $table->string('transaction_id')->nullable();
            $table->string('status')->default('completed'); // completed, pending, refunded
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('guests');
        Schema::dropIfExists('hostel_beds');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('properties');
        Schema::dropIfExists('api_tokens');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
