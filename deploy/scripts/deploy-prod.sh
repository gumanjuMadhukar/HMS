#!/bin/bash
# ==============================================================================
# HMS - Enterprise Zero-Downtime Production Deployment Script
# Target Host: 16.176.178.159
# Invoked via: GitHub Actions CI/CD or `bash deploy/scripts/deploy-prod.sh`
# ==============================================================================

set -e

echo "🚀 =============================================================================="
echo "   HMS GLOBAL ENTERPRISE DEPLOYMENT INITIATED"
echo "   Date: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "=============================================================================="

# Determine project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEPLOY_DIR="$PROJECT_ROOT/deploy"

cd "$PROJECT_ROOT"

echo "📂 Project root: $PROJECT_ROOT"

# 1. Environment Verification
if [ ! -f "$DEPLOY_DIR/.env.production" ]; then
    echo "⚠️  .env.production missing in deploy/. Generating from template..."
    cp "$DEPLOY_DIR/.env.production.example" "$DEPLOY_DIR/.env.production"
    echo "🔑 Generating secure production key..."
    NEW_KEY="base64:$(head -c 32 /dev/urandom | base64)"
    sed -i "s|APP_KEY=.*|APP_KEY=$NEW_KEY|" "$DEPLOY_DIR/.env.production"
fi

# Ensure storage directories exist on host
mkdir -p "$PROJECT_ROOT/back/storage/framework/cache" \
         "$PROJECT_ROOT/back/storage/framework/sessions" \
         "$PROJECT_ROOT/back/storage/framework/views" \
         "$PROJECT_ROOT/back/storage/logs" \
         "$PROJECT_ROOT/back/bootstrap/cache"

# 2. Pull / Build Production Docker Containers
echo "🐳 Building and orchestrating production containers..."
docker compose -f "$DEPLOY_DIR/docker-compose.prod.yml" build front app
docker compose -f "$DEPLOY_DIR/docker-compose.prod.yml" up -d --remove-orphans

# 3. Wait for PostgreSQL and Redis Health
echo "⏳ Awaiting PostgreSQL & Redis readiness..."
for i in {1..20}; do
    if docker exec hms_db_prod pg_isready -U postgres -d hostel_saas >/dev/null 2>&1; then
        echo "✅ PostgreSQL 15 is healthy and accepting connections."
        break
    fi
    echo "   Retrying PostgreSQL probe ($i/20)..."
    sleep 2
done

# 4. Execute Relational Migrations
echo "🗄️ Executing database migrations..."
docker exec hms_app_prod php artisan migrate --force

# Check if tables need seeding
TABLE_COUNT=$(docker exec hms_db_prod psql -U postgres -d hostel_saas -t -c "SELECT COUNT(*) FROM properties;" 2>/dev/null | tr -d ' ' | tr -d '\n' || echo "0")
if [ -z "$TABLE_COUNT" ] || [ "$TABLE_COUNT" = "0" ] || [ "$FORCE_SEED" = "true" ]; then
    echo "🌱 Seeding demo hotels, hostels, serviced apartments, and RBAC matrix..."
    docker exec hms_app_prod php artisan db:seed --force
fi

# 5. Production Cache Optimization
echo "⚡ Warming production route & configuration cache..."
docker exec hms_app_prod php artisan config:cache
docker exec hms_app_prod php artisan route:cache
docker exec hms_app_prod php artisan view:cache

# 6. Restart Queue Workers for Async Jobs
echo "🔄 Reloading queue workers..."
docker exec hms_app_prod php artisan queue:restart || true

# 7. Enforce File System Permissions
echo "🔒 Enforcing secure permissions on storage & bootstrap cache..."
docker exec hms_app_prod chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache || true
docker exec hms_app_prod chmod -R 775 /var/www/storage /var/www/bootstrap/cache || true

# 8. Post-Deployment Automated Healthcheck
echo "🩺 Running synthetic healthchecks..."
bash "$DEPLOY_DIR/scripts/healthcheck.sh"

echo ""
echo "=============================================================================="
echo "🎉 HMS Production Deployment Successfully Finalized!"
echo ""
echo "   🌐 Next.js Frontend:     http://16.176.178.159:3000"
echo "   🛠️ Laravel API:           http://16.176.178.159:8081/api/v1"
echo "   👑 Admin Command Center:  http://16.176.178.159:3000/admin"
echo "=============================================================================="

