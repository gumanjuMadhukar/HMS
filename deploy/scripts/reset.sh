#!/bin/bash
# ============================================
# HMS - Reset script (wipe DB + re-seed)
# Run inside the app container:
#   docker exec -it hms_app bash /var/www/deploy/scripts/reset.sh
# ============================================

set -e

echo "⚠️  Resetting HMS database..."

cd /var/www

php artisan migrate:fresh --force --seed

php artisan config:cache
php artisan route:cache

echo "✅ HMS reset complete!"

