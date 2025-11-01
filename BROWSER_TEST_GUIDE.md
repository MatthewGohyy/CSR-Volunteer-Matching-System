# 🌐 Browser Testing Guide

**Complete step-by-step guide to test the volunteer matching workflow in your browser**

---

## 🚀 Getting Started

### Prerequisites:
- ✅ Backend running on http://localhost:4000
- ✅ Frontend running on http://localhost:3000

### Test Accounts:
```
PIN User:
  Email: pin@test.com
  Password: password123

CSR User:
  Email: csrrep@test.com
  Password: password123
```

---

## 📋 Test Workflow: Complete Offer → Match Flow

### **PART 1: CSR User - Submit an Offer** 🏢

#### Step 1: Login as CSR
1. Open http://localhost:3000 in your browser
2. Enter email: `csrrep@test.com`
3. Enter password: `password123`
4. Click **"Sign In"**
5. ✅ You should see the CSR Representative Dashboard

#### Step 2: Browse Requests
1. You should be on the **"Browse Requests"** tab by default
2. ✅ Check: You can see a list of requests from PIN users
3. Look for active requests with:
   - Title
   - Description
   - Status badge (should be "ACTIVE")
   - Urgency level (LOW/MEDIUM/HIGH)
   - Location
   - Category tag
   - View/Shortlist counts

#### Step 3: Submit a Volunteer Offer
1. Find any **ACTIVE** request
2. Click the **"Submit Offer"** button on that request card
3. ✅ A modal should pop up showing:
   - Request details at the top
   - Textarea for your offer message
   - Character counter (minimum 20 characters)
   - Tips section
4. Type an offer message (at least 20 characters):
   ```
   We would love to help! Our company has extensive experience in 
   community support and we are available to assist you. Please let 
   us know your preferred time.
   ```
5. Click **"Submit Offer"**
6. ✅ Check:
   - Modal closes
   - Success message appears
   - Offer is submitted

#### Step 4: View Your Submitted Offers
1. Click the **"My Offers"** tab (Mail icon)
2. ✅ You should see:
   - Statistics cards at top (Total, Pending, Accepted, Declined)
   - Your submitted offer in the list
   - Status badge showing "PENDING"
   - Request details
   - PIN user information
   - Your offer message
3. ✅ Check the filter tabs:
   - Click "All" - shows all your offers
   - Click "Pending" - shows only pending offers
   - Click "Accepted" - shows accepted offers (empty for now)
   - Click "Declined" - shows declined offers (empty for now)

#### Step 5: Logout
1. Click the **"Logout"** button (top right)
2. ✅ You should be redirected to login page

---

### **PART 2: PIN User - Accept the Offer** 👤

#### Step 6: Login as PIN
1. At the login page (http://localhost:3000)
2. Enter email: `pin@test.com`
3. Enter password: `password123`
4. Click **"Sign In"**
5. ✅ You should see the PIN Dashboard

#### Step 7: View Your Requests
1. You should be on the **"My Requests"** tab by default
2. ✅ Check: You can see your requests with:
   - Edit and Delete buttons
   - View count
   - Shortlist count
   - Status badges
3. Find the request that the CSR submitted an offer on
4. Note that it still shows status "ACTIVE" (not matched yet)

#### Step 8: View Received Offers
1. Click the **"Offers"** tab (Mail icon)
2. ✅ You should see:
   - **Statistics cards** showing:
     - Total offers received
     - Pending offers (should be at least 1)
     - Accepted offers
     - Declined offers
   - **Offer cards** showing:
     - Company name (Test Corp Pty Ltd)
     - Company location
     - Request title
     - Offer message from CSR
     - Status badge (PENDING)
     - Date received
     - **Two action buttons**: "Accept Offer" and "Decline"
3. ✅ Check the filter tabs:
   - "All" - shows all offers
   - "Pending" - shows pending offers
   - "Accepted" - shows accepted offers
   - "Declined" - shows declined offers

#### Step 9: Accept the Offer
1. Find the offer from "Test Corp Pty Ltd"
2. Click the **"Accept Offer"** button
3. ✅ Check:
   - Success message appears: "Offer accepted successfully! Match created."
   - Offer card updates to show "ACCEPTED" status
   - Accept and Decline buttons disappear
   - Statistics update (Pending decreases, Accepted increases)

**🎉 A match has been automatically created!**

#### Step 10: View the Match
1. Click the **"Matches"** tab (Users icon)
2. ✅ You should see:
   - **Statistics cards** showing:
     - Total matches
     - Active matches (should be at least 1)
     - Completed matches
     - Cancelled matches
   - **Match card** showing:
     - Status badge "ACTIVE" (green)
     - Request title
     - Request details
     - Matched company: "Test Corp Pty Ltd"
     - Company location
     - Match date
     - **Action buttons**: "Mark as Completed" and "Cancel Match"
3. ✅ Check filter tabs work:
   - "All" - all matches
   - "Active" - active matches
   - "Completed" - completed matches
   - "Cancelled" - cancelled matches

#### Step 11: Logout
1. Click **"Logout"** button
2. ✅ Redirected to login page

---

### **PART 3: CSR User - View and Complete Match** 🏢

#### Step 12: Login as CSR Again
1. Login with: `csrrep@test.com` / `password123`
2. ✅ You should see CSR Dashboard

#### Step 13: Check Your Offer Status
1. Click **"My Offers"** tab
2. ✅ Check:
   - The offer you submitted now shows status "ACCEPTED" (green badge)
   - Statistics updated (Pending decreased, Accepted increased)
   - Accept/Decline buttons are gone

#### Step 14: View the Match
1. Click **"Matches"** tab (Users icon)
2. ✅ You should see:
   - Statistics showing at least 1 active match
   - **Match card** showing:
     - Status "ACTIVE"
     - Request details
     - Matched PIN user name
     - PIN user location
     - Match date
     - **Action buttons**: "Mark as Completed" and "Cancel Match"

#### Step 15: Complete the Match
1. Click **"Mark as Completed"** button
2. ✅ Check:
   - Success message: "Match completed successfully!"
   - Match status changes to "COMPLETED"
   - Action buttons disappear
   - Statistics update (Active decreases, Completed increases)
   - Match card might move to "Completed" filter

#### Step 16: Verify Request Completed
1. Click **"Browse Requests"** tab
2. ✅ The request that was matched should now show status "COMPLETED"
3. OR click **"Completed History"** tab
4. ✅ The completed request should appear there

---

### **PART 4: PIN User - Verify Completion** 👤

#### Step 17: Login as PIN Again
1. Logout and login as PIN: `pin@test.com` / `password123`

#### Step 18: Check Match Status
1. Click **"Matches"** tab
2. ✅ Check:
   - The match shows status "COMPLETED"
   - Statistics updated
   - Action buttons are gone

#### Step 19: Check Request Status
1. Click **"Completed History"** tab
2. ✅ The request should appear here with status "COMPLETED"
3. It should no longer appear in "My Requests" (active requests)

---

## 🧪 Additional Tests to Try

### Test 1: Decline an Offer
1. Login as CSR
2. Submit another offer on a different request
3. Logout, login as PIN
4. Go to Offers tab
5. Click **"Decline"** instead of Accept
6. ✅ Check:
   - Offer status changes to "DECLINED"
   - No match is created
   - Statistics update

### Test 2: Cancel a Match
1. Create a new match (CSR submits offer → PIN accepts)
2. As either user, go to Matches tab
3. Click **"Cancel Match"** button
4. Enter a cancellation reason in the modal
5. Click confirm
6. ✅ Check:
   - Match status changes to "CANCELLED"
   - Cancellation reason is saved
   - Request status changes back to "ACTIVE"
   - Request appears in browse/active requests again
   - Other CSRs can now submit offers on it

### Test 3: Multiple Offers on Same Request
1. Login as CSR and submit an offer
2. Logout and create a second CSR account (use different browser or incognito)
3. Login as second CSR and submit another offer on same request
4. Login as PIN
5. Accept one offer
6. ✅ Check:
   - Accepted offer shows "ACCEPTED"
   - Other offer automatically changes to "DECLINED"
   - Only one match is created

### Test 4: Filter and Search
1. Test all filter tabs in each section:
   - Offers: All, Pending, Accepted, Declined
   - Matches: All, Active, Completed, Cancelled
2. Test search functionality in Browse Requests
3. Test category and urgency filters

### Test 5: Create New Request
1. Login as PIN
2. Click **"Create Request"** button (My Requests tab)
3. Fill in the form:
   - Title
   - Description
   - Category
   - Location
   - Urgency
   - Preferred date
4. Submit
5. ✅ Check:
   - Request appears in your list
   - Request appears for CSRs to browse
   - Request has status "ACTIVE"

---

## ✅ Success Criteria

After completing all tests, you should have verified:

### ✅ PIN User Can:
- [x] Create requests
- [x] View received offers
- [x] Accept offers (creates match)
- [x] Decline offers
- [x] View active matches
- [x] Complete matches
- [x] Cancel matches
- [x] See completed history

### ✅ CSR User Can:
- [x] Browse active requests
- [x] Submit offers on requests
- [x] View submitted offers
- [x] See offer status updates
- [x] View active matches
- [x] Complete matches
- [x] Cancel matches
- [x] See completed history

### ✅ System Automatically:
- [x] Creates match when offer accepted
- [x] Declines other pending offers when one accepted
- [x] Updates request status to MATCHED
- [x] Updates request status to COMPLETED when match completed
- [x] Reopens request to ACTIVE when match cancelled
- [x] Shows real-time statistics
- [x] Filters and sorts correctly

---

## 🎨 UI Elements to Check

### Design & UX:
- [ ] All buttons are clickable and responsive
- [ ] Color-coded status badges (green, yellow, red, gray)
- [ ] Icons display correctly (Mail, Users, Star, etc.)
- [ ] Loading spinners appear during API calls
- [ ] Success/error messages display
- [ ] Empty states show helpful messages
- [ ] Statistics cards show correct counts
- [ ] Filter tabs highlight when active
- [ ] Forms validate input (character limits, required fields)
- [ ] Modals open and close smoothly

### Responsive Design:
- [ ] Works on desktop (wide screen)
- [ ] Works on tablet (medium screen)
- [ ] Works on mobile (small screen)

---

## 🐛 What to Look For (Potential Issues)

### Common Issues to Check:
- ❌ Buttons not responding
- ❌ Statistics not updating
- ❌ Empty states not showing
- ❌ Filters not working
- ❌ Error messages not displaying
- ❌ Loading states stuck
- ❌ Modal not closing
- ❌ Data not refreshing

### If Something Doesn't Work:
1. Check browser console (F12) for errors
2. Check network tab for failed API calls
3. Verify backend is running on port 4000
4. Verify frontend is running on port 3000
5. Try refreshing the page
6. Try logging out and back in

---

## 📊 Expected Flow Chart

```
PIN Creates Request
        ↓
Request Status: ACTIVE
        ↓
CSR Browses & Submits Offer
        ↓
Offer Status: PENDING
        ↓
PIN Views & Accepts Offer
        ↓
Offer Status: ACCEPTED
Match Status: ACTIVE
Request Status: MATCHED
        ↓
Both Users View Match
        ↓
Either User Completes Match
        ↓
Match Status: COMPLETED
Request Status: COMPLETED
        ↓
Appears in History
```

---

## 🎉 Success!

If you can complete the entire workflow from request creation → offer submission → offer acceptance → match creation → match completion, then:

**✅ Your frontend implementation is working perfectly!**

---

## 📝 Notes for Testing

### Test Data:
- Use realistic request titles and descriptions
- Vary urgency levels (LOW, MEDIUM, HIGH)
- Try different categories
- Test with different locations

### Browser Compatibility:
- Test in Chrome (recommended)
- Test in Safari
- Test in Firefox
- Test in Edge

### Performance:
- API calls should be fast (< 500ms)
- UI should be responsive
- No lag when switching tabs
- Smooth animations

---

**Happy Testing! 🚀**

If you find any issues, check:
1. Browser console for errors
2. Network tab for API failures
3. Backend logs for server errors

All features should work smoothly based on our automated tests!
