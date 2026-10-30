#!/bin/bash
# ==============================================================================
# HMS - Synthetic Healthcheck Script
# Verifies container health and HTTP status codes
# ==============================================================================

set -e

echo "🔎 Inspecting HMS system container health..."

# Check Docker containers
CONTAINERS=("hms_front_prod" "hms_app_prod" "hms_nginx_prod" "hms_db_prod" "hms_redis_prod")

for c in "${CONTAINERS[@]}"; do
    if docker ps --format '{{.Names}}' | grep -q "^${c}$"; then
        STATUS=$(docker inspect --format='{{.State.Status}}' "$c")
        echo "   [CONTAINER] $c -> $STATUS"
    else
        echo "   [WARNING] Container $c not running (checking local vs prod mode)"
    fi
done

# Check API HTTP probe
echo "🔎 Probing backend API response..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/api/v1/dashboard/stats 2>/dev/null || curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/api/v1/dashboard/stats 2>/dev/null || echo "000")

if [ "$API_RESPONSE" = "200" ]; then
    echo "   ✅ Backend API returned HTTP 200 OK"
else
    echo "   ⚠️  Backend API returned HTTP $API_RESPONSE"
fi

# Check Next.js Frontend probe
echo "🔎 Probing Next.js frontend response..."
FRONT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [ "$FRONT_RESPONSE" = "200" ] || [ "$FRONT_RESPONSE" = "304" ]; then
    echo "   ✅ Next.js Frontend returned HTTP $FRONT_RESPONSE OK"
else
    echo "   ⚠️  Next.js Frontend returned HTTP $FRONT_RESPONSE"
fi

echo "🩺 Synthetic healthcheck completed."

