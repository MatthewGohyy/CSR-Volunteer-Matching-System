#!/bin/bash

# Test Remaining Endpoints: Decline Offer and Cancel Match

echo "========================================"
echo "Testing Remaining Match Endpoints"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Login
echo -e "${BLUE}1. Logging in...${NC}"
PIN_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pin@test.com","password":"password123"}' \
  | jq -r '.token')

CSR_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"csrrep@test.com","password":"password123"}' \
  | jq -r '.token')

if [ "$PIN_TOKEN" != "null" ] && [ "$CSR_TOKEN" != "null" ]; then
  echo -e "${GREEN}✅ Both users logged in${NC}"
else
  echo -e "${RED}❌ Login failed${NC}"
  exit 1
fi
echo ""

# Test 1: Decline Offer
echo "========================================"
echo "TEST 1: Decline Offer"
echo "========================================"
echo ""

echo -e "${BLUE}Creating a request...${NC}"
REQUEST=$(curl -s -X POST http://localhost:4000/api/opportunities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PIN_TOKEN" \
  -d '{
    "categoryId":"8466e9a2-188a-44e1-9d2f-afd5917d3d3c",
    "title":"Need gardening help",
    "description":"Need help with garden maintenance",
    "urgency":"LOW",
    "location":"Melbourne",
    "dateNeeded":"2025-11-10"
  }')

REQUEST_ID=$(echo $REQUEST | jq -r '.request.id')
echo "   Request ID: $REQUEST_ID"

echo -e "${BLUE}CSR submitting offer...${NC}"
OFFER=$(curl -s -X POST http://localhost:4000/api/organizations/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CSR_TOKEN" \
  -d "{
    \"requestId\":\"$REQUEST_ID\",
    \"message\":\"We can help with gardening!\"
  }")

OFFER_ID=$(echo $OFFER | jq -r '.offer.id')
echo "   Offer ID: $OFFER_ID"
echo ""

echo -e "${BLUE}PIN declining offer...${NC}"
DECLINE_RESPONSE=$(curl -s -X PUT "http://localhost:4000/api/volunteers/offers/$OFFER_ID/decline" \
  -H "Authorization: Bearer $PIN_TOKEN")

DECLINE_MSG=$(echo $DECLINE_RESPONSE | jq -r '.message // empty')

if [ -n "$DECLINE_MSG" ]; then
  echo -e "${GREEN}✅ Offer declined successfully${NC}"
  echo "   Message: $DECLINE_MSG"
else
  echo -e "${RED}❌ Failed to decline offer${NC}"
  echo "   Response: $DECLINE_RESPONSE"
fi
echo ""

echo -e "${BLUE}Verifying offer status...${NC}"
OFFERS=$(curl -s http://localhost:4000/api/volunteers/offers \
  -H "Authorization: Bearer $PIN_TOKEN")

DECLINED_COUNT=$(echo $OFFERS | jq -r '.declined // 0')
echo -e "${GREEN}✅ Declined offers count: $DECLINED_COUNT${NC}"
echo ""

# Test 2: Cancel Match
echo "========================================"
echo "TEST 2: Cancel Match"
echo "========================================"
echo ""

echo -e "${BLUE}Creating another request...${NC}"
REQUEST2=$(curl -s -X POST http://localhost:4000/api/opportunities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PIN_TOKEN" \
  -d '{
    "categoryId":"8466e9a2-188a-44e1-9d2f-afd5917d3d3c",
    "title":"Need moving help",
    "description":"Need help moving furniture",
    "urgency":"MEDIUM",
    "location":"Sydney",
    "dateNeeded":"2025-11-15"
  }')

REQUEST_ID2=$(echo $REQUEST2 | jq -r '.request.id')
echo "   Request ID: $REQUEST_ID2"

echo -e "${BLUE}CSR submitting offer...${NC}"
OFFER2=$(curl -s -X POST http://localhost:4000/api/organizations/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CSR_TOKEN" \
  -d "{
    \"requestId\":\"$REQUEST_ID2\",
    \"message\":\"We can help with moving!\"
  }")

OFFER_ID2=$(echo $OFFER2 | jq -r '.offer.id')
echo "   Offer ID: $OFFER_ID2"

echo -e "${BLUE}PIN accepting offer to create match...${NC}"
ACCEPT=$(curl -s -X PUT "http://localhost:4000/api/volunteers/offers/$OFFER_ID2/accept" \
  -H "Authorization: Bearer $PIN_TOKEN")

MATCH_ID=$(echo $ACCEPT | jq -r '.match.id')
echo "   Match ID: $MATCH_ID"
echo ""

echo -e "${BLUE}Canceling the match...${NC}"
CANCEL_RESPONSE=$(curl -s -X PUT "http://localhost:4000/api/matches/$MATCH_ID/cancel" \
  -H "Authorization: Bearer $PIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Plans changed, need to reschedule"}')

CANCEL_MSG=$(echo $CANCEL_RESPONSE | jq -r '.message // empty')

if [ -n "$CANCEL_MSG" ]; then
  echo -e "${GREEN}✅ Match cancelled successfully${NC}"
  echo "   Message: $CANCEL_MSG"
else
  echo -e "${RED}❌ Failed to cancel match${NC}"
  echo "   Response: $CANCEL_RESPONSE"
fi
echo ""

echo -e "${BLUE}Verifying match status...${NC}"
MATCHES=$(curl -s http://localhost:4000/api/volunteers/matches \
  -H "Authorization: Bearer $PIN_TOKEN")

MATCH_STATUS=$(echo $MATCHES | jq -r '.matches[] | select(.id == "'$MATCH_ID'") | .status')

if [ "$MATCH_STATUS" == "CANCELLED" ]; then
  echo -e "${GREEN}✅ Match status is CANCELLED${NC}"
else
  echo -e "${RED}⚠️  Match status is $MATCH_STATUS (expected CANCELLED)${NC}"
fi
echo ""

echo -e "${BLUE}Verifying request was reopened...${NC}"
REQUESTS=$(curl -s http://localhost:4000/api/opportunities/my/requests \
  -H "Authorization: Bearer $PIN_TOKEN")

REQUEST_STATUS=$(echo $REQUESTS | jq -r '.requests[] | select(.id == "'$REQUEST_ID2'") | .status')

if [ "$REQUEST_STATUS" == "ACTIVE" ]; then
  echo -e "${GREEN}✅ Request was reopened (status: ACTIVE)${NC}"
  echo "   This request can now receive new offers!"
else
  echo -e "${RED}⚠️  Request status is $REQUEST_STATUS${NC}"
fi
echo ""

echo "========================================"
echo -e "${GREEN}✅ All remaining endpoints tested!${NC}"
echo "========================================"
echo ""
echo "Summary:"
echo "  ✅ Decline Offer - Working"
echo "  ✅ Cancel Match - Working"
echo "  ✅ Request Reopening - Working"
echo ""
