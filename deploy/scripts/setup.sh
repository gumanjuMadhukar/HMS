#!/bin/bash
# ============================================
# HMS - Full Stack Next.js + Laravel 13 Modular Setup
# Run via:
#   docker exec -it hms_app bash /var/www/deploy/scripts/setup.sh
# ============================================

set -e

echo "🚀 Starting HMS Full-Stack Setup (Laravel 13 Headless API + Next.js)..."

cd /var/www

# Install Composer packages inside container if vendor is missing
if [ ! -f "vendor/autoload.php" ]; then
    echo "📦 Installing backend composer dependencies..."
    composer install --prefer-dist --no-interaction --ignore-platform-reqs || composer update --prefer-dist --no-interaction --ignore-platform-reqs
fi

# Regenerate autoload classmap to include Modules\ namespace
echo "🔄 Regenerating Composer Autoload with Modules..."
composer dump-autoload --optimize --no-interaction

# Generate app key if needed
echo "🔑 Generating app encryption key..."
php artisan key:generate --force

# Fresh database migrations
echo "🗄️ Running fresh database migrations with Hotel, Hostel, and RBAC tables..."
php artisan migrate:fresh --force

# Seed complete demo data
echo "🌱 Seeding hotels, hostels, rooms, dorm beds, admissions, and demo users..."
php artisan db:seed --force

# Optimize & clear caches
echo "⚡ Clearing application caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Set storage and cache permissions
echo "🔒 Configuring backend permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache || true

echo ""
echo "=========================================================================="
echo "🎉 HMS Full-Stack Hotel & Hostel System is Ready!"
echo ""
echo "   ⚡ Next.js Frontend:       http://localhost:3000"
echo "   🏨 Hotel Booking Engine:   http://localhost:3000/hotels"
echo "   🏢 Hostel Management:      http://localhost:3000/hostels"
echo "   👑 Super Admin Dashboard:  http://localhost:3000/admin"
echo "   🔐 Dynamic RBAC Matrix:    http://localhost:3000/admin/rbac"
echo "   🔑 Sign In (1-Click Demo): http://localhost:3000/login"
echo ""
echo "   🛠️ Laravel Backend API:    http://localhost:8082/api/v1"
echo "   ✉️ Mailpit Email Sandbox:  http://localhost:8025"
echo ""
echo "   Demo Accounts (Password: password123):"
echo "   - Super Admin:     admin@hms.local"
echo "   - Hotel Owner:     hotel.owner@hms.local"
echo "   - Hostel Warden:   hostel.owner@hms.local"
echo "   - Customer/Tenant: guest@hms.local"
echo "=========================================================================="
