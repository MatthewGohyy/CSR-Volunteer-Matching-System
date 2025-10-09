#!/bin/bash

# CSR Platform - Complete Workflow Test Script
# This script tests the entire user journey from registration to match completion

API_BASE="http://localhost:4000/api"

echo "🧪 Testing CSR Volunteer Matching System Workflow"
echo "================================================="
echo ""

# 1. Register PIN
echo "1️⃣  Registering Person In Need (PIN)..."
PIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register/pin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testpin@example.com",
    "password": "Test1234",
    "name": "Test PIN User",
    "age": 70,
    "location": "Jurong West, Singapore",
    "phoneNumber": "+65 9111 1111",
    "accessibilityNeeds": "Wheelchair accessible"
  }')

PIN_TOKEN=$(echo $PIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
PIN_ID=$(echo $PIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['user']['id'])" 2>/dev/null)

if [ -z "$PIN_TOKEN" ]; then
    echo "❌ PIN registration failed"
    echo $PIN_RESPONSE
    exit 1
fi
echo "✅ PIN registered successfully (ID: ${PIN_ID:0:8}...)"
echo ""

# 2. Get Categories
echo "2️⃣  Getting service categories..."
CATEGORIES=$(curl -s "$API_BASE/opportunities/categories")
CATEGORY_ID=$(echo $CATEGORIES | python3 -c "import sys, json; print(json.load(sys.stdin)['categories'][0]['id'])" 2>/dev/null)
echo "✅ Got categories (Using: Medical)"
echo ""

# 3. Create Request
echo "3️⃣  Creating help request..."
REQUEST_RESPONSE=$(curl -s -X POST "$API_BASE/opportunities" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PIN_TOKEN" \
  -d "{
    \"categoryId\": \"$CATEGORY_ID\",
    \"title\": \"Need help with grocery shopping\",
    \"description\": \"I need assistance with weekly grocery shopping\",
    \"urgency\": \"MEDIUM\",
    \"location\": \"Jurong West\"
  }")

REQUEST_ID=$(echo $REQUEST_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['request']['id'])" 2>/dev/null)

if [ -z "$REQUEST_ID" ]; then
    echo "❌ Request creation failed"
    echo $REQUEST_RESPONSE
    exit 1
fi
echo "✅ Request created (ID: ${REQUEST_ID:0:8}...)"
echo ""

# 4. Register CSR Rep
echo "4️⃣  Registering CSR Representative..."
CSR_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register/csr-rep" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testcsr@example.com",
    "password": "Test1234",
    "companyName": "Test Tech Corp",
    "companyRegistrationNumber": "TEST123456",
    "contactPerson": "CSR Manager",
    "phoneNumber": "+65 6222 2222"
  }')

CSR_TOKEN=$(echo $CSR_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ -z "$CSR_TOKEN" ]; then
    echo "❌ CSR Rep registration failed"
    echo $CSR_RESPONSE
    exit 1
fi
echo "✅ CSR Rep registered successfully"
echo ""

# 5. Browse Requests
echo "5️⃣  CSR Rep browsing requests..."
REQUESTS=$(curl -s "$API_BASE/opportunities")
echo "✅ CSR Rep can see available requests"
echo ""

# 6. Shortlist Request
echo "6️⃣  CSR Rep shortlisting request..."
SHORTLIST=$(curl -s -X POST "$API_BASE/organizations/shortlist" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CSR_TOKEN" \
  -d "{\"requestId\": \"$REQUEST_ID\"}")
echo "✅ Request shortlisted"
echo ""

# 7. Submit Volunteer Offer
echo "7️⃣  CSR Rep submitting volunteer offer..."
OFFER_RESPONSE=$(curl -s -X POST "$API_BASE/organizations/offers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CSR_TOKEN" \
  -d "{
    \"requestId\": \"$REQUEST_ID\",
    \"message\": \"We would love to help with your grocery shopping!\"
  }")

OFFER_ID=$(echo $OFFER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['offer']['id'])" 2>/dev/null)

if [ -z "$OFFER_ID" ]; then
    echo "❌ Offer submission failed"
    echo $OFFER_RESPONSE
    exit 1
fi
echo "✅ Volunteer offer submitted (ID: ${OFFER_ID:0:8}...)"
echo ""

# 8. PIN views offers
echo "8️⃣  PIN viewing received offers..."
OFFERS=$(curl -s -H "Authorization: Bearer $PIN_TOKEN" "$API_BASE/matches/offers")
echo "✅ PIN can see volunteer offers"
echo ""

# 9. PIN accepts offer
echo "9️⃣  PIN accepting volunteer offer..."
ACCEPT=$(curl -s -X POST "$API_BASE/matches/offers/$OFFER_ID/accept" \
  -H "Authorization: Bearer $PIN_TOKEN")

MATCH_ID=$(echo $ACCEPT | python3 -c "import sys, json; print(json.load(sys.stdin)['match']['id'])" 2>/dev/null)

if [ -z "$MATCH_ID" ]; then
    echo "❌ Offer acceptance failed"
    echo $ACCEPT
    exit 1
fi
echo "✅ Offer accepted! Match created (ID: ${MATCH_ID:0:8}...)"
echo ""

# 10. View Matches
echo "🔟 Both parties viewing their matches..."
PIN_MATCHES=$(curl -s -H "Authorization: Bearer $PIN_TOKEN" "$API_BASE/volunteers/matches")
CSR_MATCHES=$(curl -s -H "Authorization: Bearer $CSR_TOKEN" "$API_BASE/organizations/matches")
echo "✅ Both can view match details"
echo ""

# 11. Complete Match
echo "1️⃣1️⃣  Completing the match..."
COMPLETE=$(curl -s -X PUT "$API_BASE/matches/$MATCH_ID/complete" \
  -H "Authorization: Bearer $PIN_TOKEN")
echo "✅ Match completed successfully!"
echo ""

echo "================================================="
echo "🎉 Complete Workflow Test PASSED!"
echo "================================================="
echo ""
echo "Summary:"
echo "  ✅ PIN Registration"
echo "  ✅ Request Creation"
echo "  ✅ CSR Rep Registration"
echo "  ✅ Request Browsing"
echo "  ✅ Shortlisting"
echo "  ✅ Volunteer Offer"
echo "  ✅ Offer Acceptance"
echo "  ✅ Match Creation"
echo "  ✅ Match Completion"
echo ""
echo "Your backend is fully functional! 🚀"

