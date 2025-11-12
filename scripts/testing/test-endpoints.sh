#!/bin/bash

# CSR Volunteer Matching System - Endpoint Testing Script
# This script tests all refactored controllers

BASE_URL="http://localhost:4000/api"

echo "=========================================="
echo "CSR Volunteer Matching System - Endpoint Testing"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL=0
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local description=$5
    
    TOTAL=$((TOTAL + 1))
    echo -e "${YELLOW}Test $TOTAL: $description${NC}"
    echo "  Method: $method"
    echo "  Endpoint: $endpoint"
    
    if [ -n "$token" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data")
        else
            response=$(curl -s -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $token")
        fi
    else
        if [ -n "$data" ]; then
            response=$(curl -s -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -X $method "$BASE_URL$endpoint")
        fi
    fi
    
    # Check if response contains error
    if echo "$response" | grep -q '"error"'; then
        echo -e "${RED}  ✗ FAILED${NC}"
        echo "  Response: $response"
        FAILED=$((FAILED + 1))
    else
        echo -e "${GREEN}  ✓ PASSED${NC}"
        PASSED=$((PASSED + 1))
    fi
    echo ""
}

echo "=========================================="
echo "1. AUTHENTICATION ENDPOINTS (Stories #1, #2, #13, #14, #24, #25, #33, #34)"
echo "=========================================="
echo ""

# Test Login (Story #1, #13, #24, #33)
echo "Testing Login Controller..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "admin@test.com",
        "password": "admin123"
    }')

if echo "$LOGIN_RESPONSE" | grep -q '"token"'; then
    echo -e "${GREEN}✓ Login endpoint working${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ Login endpoint failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    FAILED=$((FAILED + 1))
    TOKEN=""
fi
TOTAL=$((TOTAL + 1))
echo ""

# Test Logout (Story #2, #14, #25, #34)
if [ -n "$TOKEN" ]; then
    test_endpoint "POST" "/auth/logout" "" "$TOKEN" "Logout Controller (Stories #2, #14, #25, #34)"
else
    echo -e "${YELLOW}Skipping logout test (no token)${NC}"
    echo ""
fi

echo "=========================================="
echo "2. PLATFORM MANAGER ENDPOINTS (Stories #35-#39)"
echo "=========================================="
echo ""

# Test View Categories (Story #36)
test_endpoint "GET" "/platform-manager/categories" "" "$TOKEN" "View Categories Controller (Story #36)"

# Test Search Categories (Story #39)
test_endpoint "GET" "/platform-manager/categories/search?q=education" "" "$TOKEN" "Search Categories Controller (Story #39)"

echo "=========================================="
echo "3. PUBLIC ENDPOINTS"
echo "=========================================="
echo ""

# Test Get Categories (Public)
test_endpoint "GET" "/opportunities/categories" "" "" "Get Categories (Public endpoint)"

echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
