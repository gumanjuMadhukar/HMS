<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Payment;
use App\Models\Property;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Hostel\Models\HostelBed;
use Modules\Rbac\Models\Permission;
use Modules\Rbac\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================
        // 1. Roles
        // ============================================
        $superAdminRole = Role::firstOrCreate(
            ['slug' => 'super_admin'],
            ['name' => 'System Administrator', 'description' => 'Full access to all global hotels, hostels, billing, and system settings.', 'is_system' => true]
        );

        $hotelOwnerRole = Role::firstOrCreate(
            ['slug' => 'hotel_owner'],
            ['name' => 'Hotel Owner', 'description' => 'Manages hotel properties, room rates, guest reservations, and payouts.', 'is_system' => true]
        );

        $hostelOwnerRole = Role::firstOrCreate(
            ['slug' => 'hostel_owner'],
            ['name' => 'Hostel Owner / Warden', 'description' => 'Manages student hostel beds, monthly admissions, mess, and fee collection.', 'is_system' => true]
        );

        $staffRole = Role::firstOrCreate(
            ['slug' => 'staff'],
            ['name' => 'Front Desk & Reception', 'description' => 'Handles room check-in, check-out, and on-spot payment collections.', 'is_system' => true]
        );

        $customerRole = Role::firstOrCreate(
            ['slug' => 'customer'],
            ['name' => 'Customer / Student', 'description' => 'Discovers hotels & hostels, reserves rooms/beds, views stay invoices.', 'is_system' => true]
        );

        // ============================================
        // 2. Permissions
        // ============================================
        $permissionsData = [
            // Hotel Module
            ['name' => 'Manage Hotels', 'slug' => 'manage_hotels', 'module' => 'hotel'],
            ['name' => 'Manage Hotel Rooms & Rates', 'slug' => 'manage_hotel_rooms', 'module' => 'hotel'],
            ['name' => 'Manage Hotel Bookings', 'slug' => 'manage_hotel_bookings', 'module' => 'hotel'],

            // Hostel Module
            ['name' => 'Manage Hostels', 'slug' => 'manage_hostels', 'module' => 'hostel'],
            ['name' => 'Manage Hostel Beds & Dorms', 'slug' => 'manage_hostel_beds', 'module' => 'hostel'],
            ['name' => 'Manage Student Admissions', 'slug' => 'manage_hostel_admissions', 'module' => 'hostel'],
            ['name' => 'Collect Monthly Hostel Fees', 'slug' => 'collect_hostel_fees', 'module' => 'hostel'],

            // Billing & Payments
            ['name' => 'View Payments & Ledger', 'slug' => 'view_payments', 'module' => 'billing'],
            ['name' => 'Record Payments', 'slug' => 'record_payments', 'module' => 'billing'],
            ['name' => 'Generate Invoices', 'slug' => 'generate_invoices', 'module' => 'billing'],

            // Dynamic RBAC
            ['name' => 'Manage System Roles', 'slug' => 'manage_roles', 'module' => 'rbac'],
            ['name' => 'Manage System Permissions', 'slug' => 'manage_permissions', 'module' => 'rbac'],
            ['name' => 'Assign User Roles', 'slug' => 'assign_user_roles', 'module' => 'rbac'],
        ];

        $perms = [];
        foreach ($permissionsData as $p) {
            $perms[$p['slug']] = Permission::firstOrCreate(['slug' => $p['slug']], $p);
        }

        // Attach permissions to Hotel Owner
        $hotelOwnerRole->permissions()->sync([
            $perms['manage_hotels']->id,
            $perms['manage_hotel_rooms']->id,
            $perms['manage_hotel_bookings']->id,
            $perms['view_payments']->id,
            $perms['record_payments']->id,
            $perms['generate_invoices']->id,
        ]);

        // Attach permissions to Hostel Owner
        $hostelOwnerRole->permissions()->sync([
            $perms['manage_hostels']->id,
            $perms['manage_hostel_beds']->id,
            $perms['manage_hostel_admissions']->id,
            $perms['collect_hostel_fees']->id,
            $perms['view_payments']->id,
            $perms['record_payments']->id,
            $perms['generate_invoices']->id,
        ]);

        // Attach permissions to Staff
        $staffRole->permissions()->sync([
            $perms['manage_hotel_bookings']->id,
            $perms['manage_hostel_admissions']->id,
            $perms['collect_hostel_fees']->id,
            $perms['record_payments']->id,
        ]);

        // ============================================
        // 3. System Accounts
        // ============================================
        $admin = User::updateOrCreate(
            ['email' => 'admin@hms.local'],
            ['name' => 'System Administrator', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $admin->roles()->sync([$superAdminRole->id]);

        $hotelOwner = User::updateOrCreate(
            ['email' => 'hotel.owner@hms.local'],
            ['name' => 'Binod Chaudhary (Hotelier)', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $hotelOwner->roles()->sync([$hotelOwnerRole->id]);

        $hostelOwner = User::updateOrCreate(
            ['email' => 'hostel.owner@hms.local'],
            ['name' => 'Rameshwor Shrestha (Warden)', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $hostelOwner->roles()->sync([$hostelOwnerRole->id]);

        $customer = User::updateOrCreate(
            ['email' => 'guest@hms.local'],
            ['name' => 'Aayush Maharjan (Customer/Student)', 'password' => Hash::make('password123'), 'email_verified_at' => now()]
        );
        $customer->roles()->sync([$customerRole->id]);

        // ============================================
        // 4. Properties: Hotels
        // ============================================
        $hotel1 = Property::updateOrCreate(
            ['slug' => 'himalayan-horizon-resort'],
            [
                'owner_id' => $hotelOwner->id,
                'name' => 'Himalayan Horizon Resort & Spa',
                'category' => 'hotel',
                'property_type' => 'resort',
                'star_rating' => 5,
                'address' => 'Lakeside Baidam, Ward 6',
                'city' => 'Pokhara',
                'country' => 'Nepal',
                'phone' => '+977-61-460000',
                'email' => 'resv@himalayanhorizon.local',
                'description' => 'Premier 5-star mountain retreat offering uninterrupted panoramic views of the Annapurna range, infinity swimming pool, organic breakfast buffet, and spa sanctuaries.',
                'amenities' => ['wifi', 'ac', 'breakfast', 'swimming_pool', 'mountain_view', 'parking', 'spa'],
                'currency' => 'NPR',
                'status' => 'active',
            ]
        );

        $hotel2 = Property::updateOrCreate(
            ['slug' => 'kathmandu-heritage-boutique'],
            [
                'owner_id' => $hotelOwner->id,
                'name' => 'Kathmandu Heritage Boutique Hotel',
                'category' => 'hotel',
                'property_type' => 'boutique',
                'star_rating' => 4,
                'address' => 'Thamel Marg, Ward 26',
                'city' => 'Kathmandu',
                'country' => 'Nepal',
                'phone' => '+977-1-4700000',
                'email' => 'stay@ktmheritage.local',
                'description' => 'Artisanal boutique sanctuary crafted with Newari terracotta brickwork and carved timber woodwork. Located minutes away from historical tourist hubs with rooftop cafe.',
                'amenities' => ['wifi', 'ac', 'breakfast', 'rooftop_cafe', 'cultural_tours', 'airport_shuttle'],
                'currency' => 'NPR',
                'status' => 'active',
            ]
        );

        // ============================================
        // 5. Properties: Hostels
        // ============================================
        $hostel1 = Property::updateOrCreate(
            ['slug' => 'apex-university-boys-hostel'],
            [
                'owner_id' => $hostelOwner->id,
                'name' => 'Apex University Boys Hostel',
                'category' => 'hostel',
                'property_type' => 'boys_hostel',
                'gender_policy' => 'boys_only',
                'address' => 'Mid-Baneshwor, Near Apex College',
                'city' => 'Kathmandu',
                'country' => 'Nepal',
                'phone' => '+977-9841239876',
                'email' => 'warden@apexhostel.local',
                'description' => 'Dedicated student hostel accommodating university scholars and IT professionals. Includes 4 times daily hygienic mess meals, 100Mbps dedicated fiber Wi-Fi, power backup inverter, and quiet study room.',
                'amenities' => ['wifi', 'meals', 'hot_water', 'study_hall', 'power_backup', 'laundry', 'cctv'],
                'currency' => 'NPR',
                'status' => 'active',
            ]
        );

        $hostel2 = Property::updateOrCreate(
            ['slug' => 'lotus-valley-girls-hostel'],
            [
                'owner_id' => $hostelOwner->id,
                'name' => 'Lotus Valley Girls Hostel',
                'category' => 'hostel',
                'property_type' => 'girls_hostel',
                'gender_policy' => 'girls_only',
                'address' => 'Kumaripati, Near St. Xavier’s',
                'city' => 'Lalitpur',
                'country' => 'Nepal',
                'phone' => '+977-9801987654',
                'email' => 'contact@lotushostel.local',
                'description' => 'Secure and serene residency for female students and corporate ladies. Strict security, resident lady warden, solar water heater, modern kitchen with nutritional menu.',
                'amenities' => ['wifi', 'meals', 'solar_water', 'warden_security', 'biometric_entry', 'library'],
                'currency' => 'NPR',
                'status' => 'active',
            ]
        );

        // ============================================
        // 5b. Properties: Serviced Apartments & Home Rentals (Economy, Premium, Luxurious)
        // ============================================
        $apt1 = Property::updateOrCreate(
            ['slug' => 'patan-bakhundole-budget-studio'],
            [
                'owner_id' => $hotelOwner->id,
                'name' => 'Patan Bakhundole Budget Cozy Studio',
                'category' => 'apartment',
                'property_type' => 'studio',
                'star_rating' => 3, // Economy Tier
                'gender_policy' => 'co_ed',
                'address' => 'Bakhundole Height, Sanepa Road',
                'city' => 'Lalitpur',
                'country' => 'Nepal',
                'phone' => '+977-1-5540000',
                'email' => 'rentals@patanstudios.local',
                'description' => 'Affordable self-contained studio flat for solo digital nomads and university scholars. Compact kitchenette, 100Mbps dedicated fiber Wi-Fi, solar hot water, and quiet residential neighborhood.',
                'amenities' => ['wifi', 'kitchenette', 'solar_water', 'balcony', 'work_desk'],
                'currency' => 'NPR',
                'status' => 'active',
            ]
        );

        $apt2 = Property::updateOrCreate(
            ['slug' => 'jhamsikhel-executive-2bhk-residence'],
            [
                'owner_id' => $hotelOwner->id,
                'name' => 'Jhamsikhel Executive 2BHK Serviced Residence',
                'category' => 'apartment',
                'property_type' => '2bhk',
                'star_rating' => 4, // Premium Tier
                'gender_policy' => 'co_ed',
                'address' => 'Restaurant Lane, Ward 3',
                'city' => 'Lalitpur',
                'country' => 'Nepal',
                'phone' => '+977-1-5520000',
                'email' => 'contact@jhamsikhelresidence.local',
                'description' => 'Fully furnished high-end 2BHK apartment in the premier expat haven of Jhamsikhel. Complete modular Italian kitchen, dual balconies, 24/7 silent inverter generator backup, basement designated parking, and weekly housekeeping.',
                'amenities' => ['wifi', 'modular_kitchen', 'inverter_backup', 'parking', 'gym_access', 'washing_machine', 'cctv'],
                'currency' => 'NPR',
                'status' => 'active',
            ]
        );

        $apt3 = Property::updateOrCreate(
            ['slug' => 'lakeside-presidential-villa-penthouse'],
            [
                'owner_id' => $hotelOwner->id,
                'name' => 'Lakeside Presidential Himalayan Villa & Penthouse',
                'category' => 'home_rental',
                'property_type' => 'villa',
                'star_rating' => 5, // Luxurious Tier
                'gender_policy' => 'co_ed',
                'address' => 'Lakeside North, Sedi Hillside',
                'city' => 'Pokhara',
                'country' => 'Nepal',
                'phone' => '+977-61-468888',
                'email' => 'vip@pokharaluxuryvillas.local',
                'description' => 'Ultra-luxurious 3BHK private hillside villa offering breathtaking 180-degree unobstructed panoramas of Phewa Lake and the snowcapped Annapurna range. Includes private outdoor heated jacuzzi, chef kitchen, EV car charger, personal butler service, and lush private organic garden.',
                'amenities' => ['wifi', 'private_jacuzzi', 'lake_view', 'annapurna_view', 'chef_kitchen', 'ev_charger', 'butler_service', 'private_garden'],
                'currency' => 'NPR',
                'status' => 'active',
            ]
        );

        // ============================================
        // 6. Hotel Rooms
        // ============================================
        $hRoom1 = Room::updateOrCreate(
            ['property_id' => $hotel1->id, 'room_number' => '401'],
            [
                'floor' => '4',
                'type' => 'deluxe',
                'capacity' => 2,
                'total_beds' => 1,
                'price_per_night' => 8500.00,
                'status' => 'available',
                'description' => 'Annapurna mountain view deluxe room with private sun deck and king plush mattress.',
            ]
        );

        $hRoom2 = Room::updateOrCreate(
            ['property_id' => $hotel1->id, 'room_number' => '501'],
            [
                'floor' => '5',
                'type' => 'suite',
                'capacity' => 4,
                'total_beds' => 2,
                'price_per_night' => 16000.00,
                'status' => 'available',
                'description' => 'Presidential Lake-view suite with jacuzzi, living lounge, and private butler service.',
            ]
        );

        $hRoom3 = Room::updateOrCreate(
            ['property_id' => $hotel2->id, 'room_number' => '201'],
            [
                'floor' => '2',
                'type' => 'deluxe',
                'capacity' => 2,
                'total_beds' => 1,
                'price_per_night' => 5500.00,
                'status' => 'available',
                'description' => 'Traditional Newari architecture room with carved teakwood furnishings and rain shower.',
            ]
        );

        // Apartment & Home Rental Units
        $aptRoom1 = Room::updateOrCreate(
            ['property_id' => $apt1->id, 'room_number' => 'Studio-202'],
            [
                'floor' => '2',
                'type' => 'single',
                'capacity' => 2,
                'total_beds' => 1,
                'price_per_night' => 1800.00,
                'price_per_month' => 22000.00,
                'status' => 'available',
                'description' => 'Economy Tier: Cozy furnished studio flat with open kitchenette, attached private bathroom, and balcony.',
            ]
        );

        $aptRoom2 = Room::updateOrCreate(
            ['property_id' => $apt2->id, 'room_number' => 'Flat-4B'],
            [
                'floor' => '4',
                'type' => 'double',
                'capacity' => 4,
                'total_beds' => 2,
                'price_per_night' => 3800.00,
                'price_per_month' => 65000.00,
                'status' => 'available',
                'description' => 'Premium Tier: 2BHK furnished serviced apartment with AC, modular gas kitchen, washing machine, and basement parking.',
            ]
        );

        $aptRoom3 = Room::updateOrCreate(
            ['property_id' => $apt3->id, 'room_number' => 'Villa-A1'],
            [
                'floor' => 'Ground & Penthouse',
                'type' => 'suite',
                'capacity' => 6,
                'total_beds' => 3,
                'price_per_night' => 14000.00,
                'price_per_month' => 145000.00,
                'status' => 'available',
                'description' => 'Luxurious Tier: 3BHK Private Himalayan Villa with outdoor heated jacuzzi, panoramic lake deck, chef kitchen, and private EV charging.',
            ]
        );

        // ============================================
        // 7. Hostel Rooms & Beds
        // ============================================
        $hostelRoom1 = Room::updateOrCreate(
            ['property_id' => $hostel1->id, 'room_number' => '101'],
            [
                'floor' => '1',
                'type' => 'double',
                'capacity' => 2,
                'total_beds' => 2,
                'price_per_month' => 14000.00,
                'status' => 'available',
                'description' => '2-Seater sharing room with individual study tables, book racks, and metal wardrobes.',
            ]
        );

        $bed1 = HostelBed::updateOrCreate(
            ['room_id' => $hostelRoom1->id, 'bed_number' => 'Bed 101-A'],
            ['bed_type' => 'single', 'monthly_rate' => 14000.00, 'status' => 'occupied']
        );

        $bed2 = HostelBed::updateOrCreate(
            ['room_id' => $hostelRoom1->id, 'bed_number' => 'Bed 101-B'],
            ['bed_type' => 'single', 'monthly_rate' => 14000.00, 'status' => 'available']
        );

        $hostelRoom2 = Room::updateOrCreate(
            ['property_id' => $hostel1->id, 'room_number' => '201'],
            [
                'floor' => '2',
                'type' => 'dorm',
                'capacity' => 4,
                'total_beds' => 4,
                'price_per_month' => 11000.00,
                'status' => 'available',
                'description' => '4-Bed Dormitory with double-decker bunk beds, separate lockers, and charging dock.',
            ]
        );

        foreach (['Bed 201-Lower A', 'Bed 201-Upper A', 'Bed 201-Lower B', 'Bed 201-Upper B'] as $bNum) {
            HostelBed::updateOrCreate(
                ['room_id' => $hostelRoom2->id, 'bed_number' => $bNum],
                ['bed_type' => str_contains($bNum, 'Upper') ? 'upper_bunk' : 'lower_bunk', 'monthly_rate' => 11000.00, 'status' => 'available']
            );
        }

        // ============================================
        // 8. Demo Bookings & Admissions
        // ============================================
        $guestRecord = Guest::updateOrCreate(
            ['phone' => '+977-9812987654'],
            [
                'user_id' => $customer->id,
                'name' => 'Aayush Maharjan',
                'email' => 'guest@hms.local',
                'institution' => 'Tribhuvan University (IOE Pulchowk)',
                'guardian_name' => 'Bikram Maharjan',
                'guardian_phone' => '+977-9841000000',
                'id_type' => 'citizenship',
                'id_number' => '27-01-76-09876',
                'permanent_address' => 'Bhaktapur, Nepal',
            ]
        );

        // Booking 1: Hostel Admission in Room 101 Bed A
        $hostelBooking = Booking::updateOrCreate(
            ['booking_code' => 'HST-APEX01'],
            [
                'booking_type' => 'hostel',
                'property_id' => $hostel1->id,
                'room_id' => $hostelRoom1->id,
                'hostel_bed_id' => $bed1->id,
                'guest_id' => $guestRecord->id,
                'user_id' => $customer->id,
                'check_in_date' => Carbon::now()->startOfMonth(),
                'check_out_date' => Carbon::now()->endOfMonth(),
                'meal_plan' => 'full_mess',
                'total_amount' => 14000.00,
                'paid_amount' => 14000.00,
                'status' => 'checked_in',
                'notes' => 'College ID verified. Admitted to Bed 101-A.',
            ]
        );

        Payment::updateOrCreate(
            ['booking_id' => $hostelBooking->id, 'invoice_number' => 'INV-HST-2026-001'],
            [
                'amount' => 14000.00,
                'currency' => 'NPR',
                'payment_method' => 'esewa',
                'payment_date' => Carbon::now()->startOfMonth(),
                'transaction_id' => 'ESEWA-98234812',
                'status' => 'completed',
                'notes' => '1st Month Hostel Fee + Full Mess Plan Paid',
            ]
        );

        // Booking 2: Hotel Reservation in Pokhara Resort
        $hotelBooking = Booking::updateOrCreate(
            ['booking_code' => 'HTL-POKH01'],
            [
                'booking_type' => 'hotel',
                'property_id' => $hotel1->id,
                'room_id' => $hRoom1->id,
                'guest_id' => $guestRecord->id,
                'user_id' => $customer->id,
                'check_in_date' => Carbon::now()->addDays(2),
                'check_out_date' => Carbon::now()->addDays(5),
                'adults' => 2,
                'children' => 0,
                'meal_plan' => 'cp',
                'total_amount' => 25500.00,
                'paid_amount' => 25500.00,
                'status' => 'confirmed',
                'notes' => 'Honeymoon couple setup requested with airport shuttle.',
            ]
        );

        Payment::updateOrCreate(
            ['booking_id' => $hotelBooking->id, 'invoice_number' => 'INV-HTL-2026-001'],
            [
                'amount' => 25500.00,
                'currency' => 'NPR',
                'payment_method' => 'card',
                'payment_date' => Carbon::now(),
                'transaction_id' => 'VISA-4912984102',
                'status' => 'completed',
                'notes' => '3 Nights Stay at Deluxe Room with Breakfast',
            ]
        );

        // Booking 3: Premium Serviced Apartment Lease in Jhamsikhel
        $aptBooking = Booking::updateOrCreate(
            ['booking_code' => 'APT-JHAM01'],
            [
                'booking_type' => 'apartment',
                'property_id' => $apt2->id,
                'room_id' => $aptRoom2->id,
                'guest_id' => $guestRecord->id,
                'user_id' => $customer->id,
                'check_in_date' => Carbon::now()->startOfMonth(),
                'check_out_date' => Carbon::now()->addMonths(3),
                'adults' => 2,
                'children' => 0,
                'meal_plan' => 'self_kitchen',
                'total_amount' => 195000.00,
                'paid_amount' => 65000.00,
                'status' => 'checked_in',
                'notes' => 'Premium 2BHK 3-Month Lease. First month rent cleared.',
            ]
        );

        Payment::updateOrCreate(
            ['booking_id' => $aptBooking->id, 'invoice_number' => 'INV-APT-2026-001'],
            [
                'amount' => 65000.00,
                'currency' => 'NPR',
                'payment_method' => 'esewa',
                'payment_date' => Carbon::now(),
                'transaction_id' => 'ESEWA-982173491',
                'status' => 'completed',
                'notes' => 'Month 1 Lease Settlement via eSewa Nepal',
            ]
        );
    }
}
