#!/bin/bash

# Verification Script for Test Data Generation
# This script verifies that the large dataset was generated successfully

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        📊 TEST DATA VERIFICATION SCRIPT                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
SERVER_RUNNING=$(lsof -ti:4000)
if [ -z "$SERVER_RUNNING" ]; then
    echo -e "${YELLOW}⚠️  Server not running. Starting server in background...${NC}"
    npm run dev > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 5
    CLEANUP_SERVER=true
else
    echo -e "${GREEN}✅ Server is running${NC}"
    CLEANUP_SERVER=false
fi

echo ""
echo "🔍 Checking Database Counts..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Query database through API
RESPONSE=$(curl -s http://localhost:4000/api/test-db)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to connect to API${NC}"
    exit 1
fi

# Extract counts using grep and cut
USER_COUNT=$(echo $RESPONSE | grep -o '"users":[0-9]*' | cut -d':' -f2)
CATEGORY_COUNT=$(echo $RESPONSE | grep -o '"categories":[0-9]*' | cut -d':' -f2)
REQUEST_COUNT=$(echo $RESPONSE | grep -o '"requests":[0-9]*' | cut -d':' -f2)

echo ""
echo "📊 Data Verification Results:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check User Accounts
if [ "$USER_COUNT" -ge 100 ]; then
    echo -e "${GREEN}✅ User Accounts: $USER_COUNT (Requirement: 100+)${NC}"
else
    echo -e "${RED}❌ User Accounts: $USER_COUNT (Requirement: 100+)${NC}"
fi

# Check Categories
if [ "$CATEGORY_COUNT" -ge 20 ]; then
    echo -e "${GREEN}✅ Categories: $CATEGORY_COUNT (Expected: 20+)${NC}"
else
    echo -e "${YELLOW}⚠️  Categories: $CATEGORY_COUNT (Expected: 20+)${NC}"
fi

# Check Requests
if [ "$REQUEST_COUNT" -ge 100 ]; then
    echo -e "${GREEN}✅ Requests: $REQUEST_COUNT (Expected: 100+)${NC}"
else
    echo -e "${YELLOW}⚠️  Requests: $REQUEST_COUNT (Expected: 100+)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Overall status
if [ "$USER_COUNT" -ge 100 ] && [ "$CATEGORY_COUNT" -ge 20 ] && [ "$REQUEST_COUNT" -ge 100 ]; then
    echo -e "${GREEN}🎉 ALL REQUIREMENTS MET!${NC}"
    echo ""
    echo "✅ Test data successfully generated and verified"
    echo "✅ System ready for demo and testing"
    EXIT_CODE=0
else
    echo -e "${RED}⚠️  SOME REQUIREMENTS NOT MET${NC}"
    echo ""
    echo "Please run: npm run seed:large"
    EXIT_CODE=1
fi

echo ""
echo "💡 Quick Commands:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Generate data:    npm run seed:large"
echo "  Reset & generate: npm run seed:reset"
echo "  View in browser:  npx prisma studio"
echo "  Start server:     npm run dev"
echo ""

# Cleanup
if [ "$CLEANUP_SERVER" = true ] && [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID 2>/dev/null
fi

exit $EXIT_CODE

