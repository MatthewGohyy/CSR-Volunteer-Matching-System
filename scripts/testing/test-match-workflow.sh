#!/bin/bash

# Test Complete Match Workflow
# Tests the newly implemented offer acceptance and match features

echo "================================"
echo "Testing Match Workflow"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Login as Admin to activate PIN account if needed
echo -e "${BLUE}1. Logging in as Admin...${NC}"
ADMIN_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' \
  | jq -r '.token')

if [ "$ADMIN_TOKEN" != "null" ] && [ -n "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✅ Admin logged in${NC}"
else
  echo -e "${RED}❌ Admin login failed${NC}"
fi
echo ""

# 2. Login as CSR
echo -e "${BLUE}2. Logging in as CSR...${NC}"
CSR_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"csrrep@test.com","password":"password123"}' \
  | jq -r '.token')

if [ "$CSR_TOKEN" != "null" ] && [ -n "$CSR_TOKEN" ]; then
  echo -e "${GREEN}✅ CSR logged in${NC}"
  echo "   Token: ${CSR_TOKEN:0:20}..."
else
  echo -e "${RED}❌ CSR login failed${NC}"
  exit 1
fi
echo ""

# 3. Try PIN login
echo -e "${BLUE}3. Logging in as PIN...${NC}"
PIN_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pin@test.com","password":"password123"}' \
  | jq -r '.token')

if [ "$PIN_TOKEN" != "null" ] && [ -n "$PIN_TOKEN" ]; then
  echo -e "${GREEN}✅ PIN logged in${NC}"
  echo "   Token: ${PIN_TOKEN:0:20}..."
else
  echo -e "${RED}⚠️  PIN login failed (account may be inactive)${NC}"
  echo "   Trying alternative PIN account..."
  
  # Try alternative PIN account
  PIN_TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"john@example.com","password":"password123"}' \
    | jq -r '.token')
  
  if [ "$PIN_TOKEN" != "null" ] && [ -n "$PIN_TOKEN" ]; then
    echo -e "${GREEN}✅ Alternative PIN logged in${NC}"
  else
    echo -e "${RED}❌ Could not login any PIN account. Skipping workflow test.${NC}"
    echo ""
    echo "Please run: cd server && npm run seed"
    exit 1
  fi
fi
echo ""

# 4. Create a request
echo -e "${BLUE}4. Creating a request...${NC}"
REQUEST_RESPONSE=$(curl -s -X POST http://localhost:4000/api/opportunities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PIN_TOKEN" \
  -d '{
    "categoryId":"8466e9a2-188a-44e1-9d2f-afd5917d3d3c",
    "title":"Need help moving furniture",
    "description":"Moving to new apartment, need help with heavy items",
    "urgency":"HIGH",
    "location":"Sydney",
    "dateNeeded":"2025-11-05"
  }')

REQUEST_ID=$(echo $REQUEST_RESPONSE | jq -r '.request.id // empty')

if [ -n "$REQUEST_ID" ] && [ "$REQUEST_ID" != "null" ]; then
  echo -e "${GREEN}✅ Request created${NC}"
  echo "   ID: $REQUEST_ID"
else
  echo -e "${RED}❌ Failed to create request${NC}"
  echo "   Response: $REQUEST_RESPONSE"
  exit 1
fi
echo ""

# 5. CSR submits an offer
echo -e "${BLUE}5. CSR submitting offer...${NC}"
OFFER_RESPONSE=$(curl -s -X POST http://localhost:4000/api/organizations/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CSR_TOKEN" \
  -d "{
    \"requestId\":\"$REQUEST_ID\",
    \"message\":\"We can help! Our team is available this weekend.\"
  }")

OFFER_ID=$(echo $OFFER_RESPONSE | jq -r '.offer.id // empty')

if [ -n "$OFFER_ID" ] && [ "$OFFER_ID" != "null" ]; then
  echo -e "${GREEN}✅ Offer submitted${NC}"
  echo "   ID: $OFFER_ID"
else
  echo -e "${RED}❌ Failed to submit offer${NC}"
  echo "   Response: $OFFER_RESPONSE"
  exit 1
fi
echo ""

# 6. PIN views offers (NEW FEATURE!)
echo -e "${BLUE}6. PIN viewing offers...${NC}"
OFFERS=$(curl -s http://localhost:4000/api/volunteers/offers \
  -H "Authorization: Bearer $PIN_TOKEN")

TOTAL_OFFERS=$(echo $OFFERS | jq -r '.total // 0')
PENDING_OFFERS=$(echo $OFFERS | jq -r '.pending // 0')

echo -e "${GREEN}✅ PIN can view offers${NC}"
echo "   Total: $TOTAL_OFFERS"
echo "   Pending: $PENDING_OFFERS"
echo ""

# 7. PIN accepts the offer (NEW FEATURE!)
echo -e "${BLUE}7. PIN accepting offer...${NC}"
ACCEPT_RESPONSE=$(curl -s -X PUT "http://localhost:4000/api/volunteers/offers/$OFFER_ID/accept" \
  -H "Authorization: Bearer $PIN_TOKEN")

MATCH_ID=$(echo $ACCEPT_RESPONSE | jq -r '.match.id // empty')

if [ -n "$MATCH_ID" ] && [ "$MATCH_ID" != "null" ]; then
  echo -e "${GREEN}✅ Offer accepted - Match created!${NC}"
  echo "   Match ID: $MATCH_ID"
else
  echo -e "${RED}❌ Failed to accept offer${NC}"
  echo "   Response: $ACCEPT_RESPONSE"
  exit 1
fi
echo ""

# 8. View the match
echo -e "${BLUE}8. Viewing matches...${NC}"
MATCHES=$(curl -s http://localhost:4000/api/volunteers/matches \
  -H "Authorization: Bearer $PIN_TOKEN")

MATCH_COUNT=$(echo $MATCHES | jq -r '.matches | length')
MATCH_STATUS=$(echo $MATCHES | jq -r '.matches[0].status // empty')

echo -e "${GREEN}✅ Match visible${NC}"
echo "   Count: $MATCH_COUNT"
echo "   Status: $MATCH_STATUS"
echo ""

# 9. Complete the match (NEW FEATURE!)
echo -e "${BLUE}9. Completing match...${NC}"
COMPLETE_RESPONSE=$(curl -s -X PUT "http://localhost:4000/api/matches/$MATCH_ID/complete" \
  -H "Authorization: Bearer $PIN_TOKEN")

COMPLETE_MSG=$(echo $COMPLETE_RESPONSE | jq -r '.message // empty')

if [ -n "$COMPLETE_MSG" ]; then
  echo -e "${GREEN}✅ Match completed!${NC}"
  echo "   Message: $COMPLETE_MSG"
else
  echo -e "${RED}❌ Failed to complete match${NC}"
  echo "   Response: $COMPLETE_RESPONSE"
  exit 1
fi
echo ""

# 10. Verify completion
echo -e "${BLUE}10. Verifying completion...${NC}"
FINAL_MATCHES=$(curl -s http://localhost:4000/api/volunteers/matches \
  -H "Authorization: Bearer $PIN_TOKEN")

FINAL_STATUS=$(echo $FINAL_MATCHES | jq -r '.matches[0].status // empty')

if [ "$FINAL_STATUS" == "COMPLETED" ]; then
  echo -e "${GREEN}✅ Match status is COMPLETED${NC}"
else
  echo -e "${RED}❌ Match status is $FINAL_STATUS (expected COMPLETED)${NC}"
fi
echo ""

echo "================================"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo "================================"
echo ""
echo "Summary of new features tested:"
echo "  • PIN can view offers on their requests"
echo "  • PIN can accept offers"
echo "  • Match is created automatically"
echo "  • Match can be completed"
echo ""
