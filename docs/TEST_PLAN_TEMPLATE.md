# Test Plan Template - Sprint [X]

**Document Version:** 1.0  
**Sprint:** [Sprint Number]  
**Sprint Name:** [Sprint Name]  
**Duration:** [Start Date] - [End Date]  
**Prepared By:** [Tester Name]  
**Date:** [Date]  
**Status:** [Draft/In Progress/Completed]

---

## 1. Test Plan Overview (5W 1H Framework)

### 1.1 WHO (Test Team & Stakeholders)

**Test Team:**
- **Test Lead:** [Name]
- **Testers:** [Name 1, Name 2, ...]
- **Developers:** [Name 1, Name 2, ...]
- **Product Owner:** [Name]

**Stakeholders:**
- **User Administrator:** [Name/Representative]
- **Person-In-Need (PIN):** [Name/Representative]
- **CSR Representative:** [Name/Representative]
- **Platform Manager:** [Name/Representative]

**Test Environment Access:**
- **Frontend URL:** [URL]
- **Backend API URL:** [URL]
- **Database:** [Connection Details]
- **Test Accounts:** [Location of test data file]

---

### 1.2 WHAT (Scope & Objectives)

#### 1.2.1 Test Scope

**In Scope:**
- [ ] User Story #X: [Description]
- [ ] User Story #Y: [Description]
- [ ] User Story #Z: [Description]
- [List all user stories for this sprint]

**Out of Scope:**
- [ ] Features from previous sprints (unless regression testing required)
- [ ] Features from future sprints
- [ ] Performance testing (unless specified)
- [ ] Security penetration testing (unless specified)

#### 1.2.2 Test Objectives

**Primary Objectives:**
1. Verify all user stories in this sprint are implemented correctly
2. Ensure UI/UX meets acceptance criteria
3. Validate data integrity and business logic
4. Confirm system follows Boundary-Controller-Entity framework
5. Verify authentication and authorization work correctly
6. Ensure backward compatibility with previous sprint features

**Success Criteria:**
- ✅ All test cases pass (100% pass rate)
- ✅ No critical or high-priority bugs remain
- ✅ All user stories meet acceptance criteria
- ✅ Code coverage ≥ 80% (unit tests)
- ✅ All UI test cases executed successfully

---

### 1.3 WHEN (Test Schedule)

**Test Phases:**

| Phase | Duration | Start Date | End Date | Status |
|-------|----------|------------|----------|--------|
| **Test Planning** | [X] days | [Date] | [Date] | [ ] |
| **Test Case Design** | [X] days | [Date] | [Date] | [ ] |
| **Test Environment Setup** | [X] days | [Date] | [Date] | [ ] |
| **Unit Testing** | [X] days | [Date] | [Date] | [ ] |
| **Integration Testing** | [X] days | [Date] | [Date] | [ ] |
| **UI/Functional Testing** | [X] days | [Date] | [Date] | [ ] |
| **Regression Testing** | [X] days | [Date] | [Date] | [ ] |
| **User Acceptance Testing (UAT)** | [X] days | [Date] | [Date] | [ ] |
| **Test Report & Sign-off** | [X] days | [Date] | [Date] | [ ] |

**Milestones:**
- **Test Readiness Review:** [Date]
- **Test Execution Start:** [Date]
- **Test Execution Complete:** [Date]
- **UAT Sign-off:** [Date]

---

### 1.4 WHERE (Test Environment)

**Test Environment Details:**

| Component | Environment | Details |
|-----------|-------------|---------|
| **Frontend** | Development | URL: [URL], Browser: Chrome/Firefox/Safari |
| **Backend API** | Development | URL: [URL], Port: [Port] |
| **Database** | Development | Type: [PostgreSQL/MySQL/etc], Version: [Version] |
| **Authentication** | Development | JWT Token-based |
| **Test Data** | Development | 100 synthetic users (as per requirements) |

**Browser Compatibility:**
- [ ] Chrome (Latest 2 versions)
- [ ] Firefox (Latest 2 versions)
- [ ] Safari (Latest 2 versions)
- [ ] Edge (Latest 2 versions)

**Device Compatibility:**
- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667, 414x896)

**Prerequisites:**
- [ ] Test environment is accessible
- [ ] Test data is loaded (100 synthetic users)
- [ ] All test accounts are created and verified
- [ ] Database is restored to baseline state
- [ ] API endpoints are accessible
- [ ] Network connectivity is stable

---

### 1.5 WHY (Test Rationale & Risks)

#### 1.5.1 Test Rationale

**Why Testing is Critical:**
1. **User Trust:** Ensure system reliability for CSR volunteers and persons-in-need
2. **Data Integrity:** Protect sensitive user account and profile information
3. **Business Continuity:** Prevent system failures that could disrupt volunteer matching
4. **Compliance:** Meet project requirements for test-driven development
5. **Quality Assurance:** Maintain high standards for a mission-critical system

#### 1.5.2 Risk Assessment

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Test environment unavailable** | High | Medium | Maintain backup environment, schedule maintenance windows |
| **Insufficient test data** | Medium | Low | Generate 100 synthetic users as per requirements |
| **Incomplete user stories** | High | Medium | Daily stand-ups, early testing, continuous integration |
| **Browser compatibility issues** | Medium | Low | Test on multiple browsers early in sprint |
| **Performance degradation** | Medium | Low | Monitor performance metrics, load testing if needed |
| **Security vulnerabilities** | High | Low | Security testing, code reviews, authentication testing |

---

### 1.6 HOW (Test Approach & Strategy)

#### 1.6.1 Testing Levels

**1. Unit Testing**
- **Framework:** [Jest/Vitest/Mocha/etc]
- **Coverage Target:** ≥ 80%
- **Focus:** Individual functions, methods, controllers, entities
- **Responsibility:** Developers

**2. Integration Testing**
- **Framework:** [Jest/Supertest/etc]
- **Focus:** API endpoints, database interactions, service layer
- **Responsibility:** Developers + QA

**3. System/Functional Testing**
- **Type:** Manual + Automated (where applicable)
- **Focus:** End-to-end user workflows, UI interactions
- **Responsibility:** QA Team

**4. User Acceptance Testing (UAT)**
- **Type:** Manual
- **Focus:** Business scenarios, user stories validation
- **Responsibility:** Product Owner + End Users

#### 1.6.2 Test Types

- [x] **Functional Testing:** Verify features work as specified
- [x] **UI Testing:** Verify user interface elements and interactions
- [x] **Authentication Testing:** Verify login/logout for all roles
- [x] **Authorization Testing:** Verify role-based access control
- [x] **Data Validation Testing:** Verify input validation and error handling
- [x] **Regression Testing:** Verify existing features still work
- [ ] **Performance Testing:** (If applicable)
- [ ] **Security Testing:** (If applicable)

#### 1.6.3 Test Design Techniques

- **Equivalence Partitioning:** Valid/invalid input ranges
- **Boundary Value Analysis:** Edge cases, limits
- **Decision Table Testing:** Complex business rules
- **State Transition Testing:** User workflow states
- **Error Guessing:** Common error scenarios

---

## 2. Test Cases by User Story

### 2.1 Test Case Template

For each user story, test cases should follow this structure:

**Test Case ID:** TC-[Sprint]-[StoryID]-[Sequence]  
**User Story:** #X - [Description]  
**Role:** [User Admin/PIN/CSR Rep/Platform Manager]  
**Priority:** [High/Medium/Low]  
**Test Type:** [Functional/UI/Integration/Regression]  
**Prerequisites:** [What needs to be set up before testing]

**Test Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**** [What should happen]  
**Actual Result:** [To be filled during execution]  
**Status:** [Pass/Fail/Blocked]  
**Notes:** [Any observations or issues]

---

## 3. UI Test Cases (User Journey Testing)

### 3.1 Authentication Test Cases

#### TC-[Sprint]-AUTH-001: User Login - Valid Credentials
**User Story:** #1, #13, #24, #33  
**Role:** All Roles  
**Priority:** High

**Prerequisites:**
- User account exists in system
- User account status is ACTIVE
- User profile is assigned and ACTIVE

**Test Steps:**
1. Navigate to login page: `[Frontend URL]/login`
2. Enter valid username: `[test_username]`
3. Enter valid password: `[test_password]`
4. Click "Login" button
5. Observe system response

**Expected Result:**
- User is redirected to role-specific dashboard
- Success message displayed: "Login successful"
- User session is created
- Navigation menu shows role-appropriate options
- User profile information is displayed in header

**UI Elements to Verify:**
- [ ] Login form is visible and accessible
- [ ] Username field accepts input
- [ ] Password field masks input
- [ ] Login button is enabled
- [ ] Loading indicator appears during authentication
- [ ] Dashboard loads correctly after login
- [ ] User role is displayed in navigation
- [ ] Logout button is visible

---

#### TC-[Sprint]-AUTH-002: User Login - Invalid Credentials
**User Story:** #1, #13, #24, #33  
**Role:** All Roles  
**Priority:** High

**Test Steps:**
1. Navigate to login page
2. Enter invalid username: `invalid_user`
3. Enter invalid password: `wrong_password`
4. Click "Login" button
5. Observe system response

**Expected Result:**
- Error message displayed: "Invalid username or password"
- User remains on login page
- No session is created
- Password field is cleared (username may remain)
- User can retry login

**UI Elements to Verify:**
- [ ] Error message is clearly visible
- [ ] Error message is in red/warning color
- [ ] Error message is dismissible or auto-dismisses
- [ ] Form fields are still accessible
- [ ] User can correct and retry

---

#### TC-[Sprint]-AUTH-003: User Login - Suspended Account
**User Story:** #1, #13, #24, #33  
**Role:** All Roles  
**Priority:** High

**Prerequisites:**
- User account exists with status SUSPENDED

**Test Steps:**
1. Navigate to login page
2. Enter username of suspended account
3. Enter valid password
4. Click "Login" button
5. Observe system response

**Expected Result:**
- Error message displayed: "Account is suspended. Please contact administrator."
- User remains on login page
- No session is created

---

#### TC-[Sprint]-AUTH-004: User Logout
**User Story:** #2, #14, #25, #34  
**Role:** All Roles  
**Priority:** High

**Prerequisites:**
- User is logged in

**Test Steps:**
1. Navigate to dashboard while logged in
2. Click "Logout" button (or user menu → Logout)
3. Confirm logout if confirmation dialog appears
4. Observe system response

**Expected Result:**
- User is redirected to login page
- Success message displayed: "Logged out successfully" (optional)
- Session is terminated
- User cannot access protected pages
- Browser back button does not restore session

**UI Elements to Verify:**
- [ ] Logout button is visible in navigation
- [ ] Logout confirmation dialog appears (if implemented)
- [ ] User is redirected to login page
- [ ] Session data is cleared
- [ ] Protected routes require re-authentication

---

### 3.2 User Account Management Test Cases (User Admin)

#### TC-[Sprint]-UA-001: Create User Account - Valid Data
**User Story:** #3  
**Role:** User Admin  
**Priority:** High

**Prerequisites:**
- User Admin is logged in
- Navigate to User Account Management section

**Test Steps:**
1. Click "Create New User Account" button
2. Fill in form fields:
   - Username: `new_user_001`
   - Email: `newuser@example.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
   - Name: `John Doe`
   - Contact Number: `+65 9123 4567`
   - Status: `ACTIVE`
3. Click "Create" button
4. Observe system response

**Expected Result:**
- Success message: "User account created successfully"
- New user account appears in user list
- User account ID is generated
- Created date/time is recorded
- User can now log in with new credentials

**UI Elements to Verify:**
- [ ] Create button is visible and enabled
- [ ] Form fields are accessible and editable
- [ ] Password strength indicator (if implemented)
- [ ] Form validation messages appear for invalid inputs
- [ ] Success notification appears after creation
- [ ] New account appears in list view
- [ ] Form resets after successful creation

---

#### TC-[Sprint]-UA-002: Create User Account - Duplicate Username
**User Story:** #3  
**Role:** User Admin  
**Priority:** Medium

**Prerequisites:**
- User account with username `existing_user` already exists

**Test Steps:**
1. Click "Create New User Account"
2. Enter username: `existing_user`
3. Fill in other required fields with valid data
4. Click "Create" button
5. Observe system response

**Expected Result:**
- Error message: "Username already exists. Please choose a different username."
- Form remains populated (except password fields)
- User account is not created
- User can correct and retry

**UI Elements to Verify:**
- [ ] Error message is clearly displayed
- [ ] Error message is associated with username field
- [ ] Form data is preserved (except sensitive fields)
- [ ] User can modify and retry

---

#### TC-[Sprint]-UA-003: View User Accounts
**User Story:** #4  
**Role:** User Admin  
**Priority:** High

**Prerequisites:**
- User Admin is logged in
- At least 5 user accounts exist in system

**Test Steps:**
1. Navigate to "User Accounts" section
2. Observe the user accounts list
3. Click on a user account to view details
4. Observe detailed view

**Expected Result:**
- List of user accounts is displayed
- Each account shows: Username, Name, Email, Status, Created Date
- Pagination is available if >10 accounts
- Clicking an account shows full details
- Details include: All account fields, associated profiles, last login date

**UI Elements to Verify:**
- [ ] Table/list view is properly formatted
- [ ] Column headers are clear and sortable (if implemented)
- [ ] Pagination controls work correctly
- [ ] Search/filter functionality (if implemented)
- [ ] Clicking row/item opens detail view
- [ ] Detail view shows all relevant information
- [ ] Edit/Delete buttons are visible (if applicable)

---

#### TC-[Sprint]-UA-004: Update User Account
**User Story:** #5  
**Role:** User Admin  
**Priority:** High

**Prerequisites:**
- User Admin is logged in
- User account exists and is viewable

**Test Steps:**
1. Navigate to User Accounts list
2. Click on a user account to view details
3. Click "Edit" button
4. Modify fields (e.g., Email: `updated@example.com`, Name: `Jane Doe Updated`)
5. Click "Save" button
6. Observe system response

**Expected Result:**
- Success message: "User account updated successfully"
- Updated information is reflected in detail view
- Updated information is reflected in list view
- Last modified date/time is updated
- Changes are persisted in database

**UI Elements to Verify:**
- [ ] Edit button is visible and enabled
- [ ] Form fields are pre-populated with existing data
- [ ] Fields are editable
- [ ] Save button is enabled
- [ ] Cancel button returns to detail view
- [ ] Success notification appears
- [ ] Updated data is immediately visible

---

#### TC-[Sprint]-UA-005: Suspend User Account
**User Story:** #6  
**Role:** User Admin  
**Priority:** High

**Prerequisites:**
- User Admin is logged in
- User account exists with status ACTIVE

**Test Steps:**
1. Navigate to User Accounts list
2. Click on an ACTIVE user account
3. Click "Suspend" button
4. Confirm suspension in confirmation dialog
5. Observe system response

**Expected Result:**
- Success message: "User account suspended successfully"
- Account status changes to SUSPENDED
- Status is reflected in list and detail views
- Suspended user cannot log in
- Suspension date/time is recorded

**UI Elements to Verify:**
- [ ] Suspend button is visible for ACTIVE accounts
- [ ] Confirmation dialog appears
- [ ] Confirmation dialog has clear message
- [ ] User can cancel suspension
- [ ] Status indicator changes color/style
- [ ] Success notification appears
- [ ] Account appears in filtered view (if status filter exists)

---

#### TC-[Sprint]-UA-006: Search User Accounts
**User Story:** #7  
**Role:** User Admin  
**Priority:** Medium

**Prerequisites:**
- User Admin is logged in
- Multiple user accounts exist (at least 10)

**Test Steps:**
1. Navigate to User Accounts section
2. Locate search bar/field
3. Enter search term: `john`
4. Press Enter or click "Search" button
5. Observe results

**Expected Result:**
- Search results display accounts matching search term
- Search matches: Username, Name, Email fields
- Results are highlighted or clearly shown
- "No results found" message if no matches
- Search can be cleared to show all accounts

**UI Elements to Verify:**
- [ ] Search bar is visible and accessible
- [ ] Search is case-insensitive (or clearly indicated)
- [ ] Search results update in real-time (if implemented)
- [ ] Clear search button/icon is available
- [ ] Results count is displayed
- [ ] No results message is user-friendly

---

### 3.3 User Profile Management Test Cases (User Admin)

#### TC-[Sprint]-UP-001: Create User Profile
**User Story:** #8  
**Role:** User Admin  
**Priority:** High

**Prerequisites:**
- User Admin is logged in
- User account exists

**Test Steps:**
1. Navigate to User Profiles section
2. Click "Create New User Profile" button
3. Select User Account from dropdown
4. Select Role: `CSR Representative`
5. Set Status: `ACTIVE`
6. Click "Create" button
7. Observe system response

**Expected Result:**
- Success message: "User profile created successfully"
- New profile appears in profiles list
- Profile is linked to selected user account
- Profile ID is generated
- User now has access to role-specific features

**UI Elements to Verify:**
- [ ] Create button is visible
- [ ] User account dropdown shows available accounts
- [ ] Role selection is clear (CSR Rep, PIN, User Admin, Platform Manager)
- [ ] Status selection works correctly
- [ ] Success notification appears
- [ ] New profile appears in list

---

#### TC-[Sprint]-UP-002: View User Profiles
**User Story:** #9  
**Role:** User Admin  
**Priority:** High

**Test Steps:**
1. Navigate to User Profiles section
2. Observe profiles list
3. Click on a profile to view details
4. Observe detailed view

**Expected Result:**
- List shows: Profile ID, User Account, Role, Status, Created Date
- Detail view shows: Full profile information, associated user account details, permissions

**UI Elements to Verify:**
- [ ] List view is properly formatted
- [ ] Detail view shows complete information
- [ ] Associated user account is clickable/linked
- [ ] Role is clearly displayed

---

#### TC-[Sprint]-UP-003: Update User Profile
**User Story:** #10  
**Role:** User Admin  
**Priority:** High

**Test Steps:**
1. Navigate to User Profiles
2. Click on a profile
3. Click "Edit" button
4. Change Role or Status
5. Click "Save" button
6. Observe system response

**Expected Result:**
- Success message: "User profile updated successfully"
- Changes are reflected immediately
- User's access rights update based on new role/status

**UI Elements to Verify:**
- [ ] Edit functionality works correctly
- [ ] Role changes are validated
- [ ] Status changes are validated
- [ ] Success notification appears

---

#### TC-[Sprint]-UP-004: Suspend User Profile
**User Story:** #11  
**Role:** User Admin  
**Priority:** High

**Test Steps:**
1. Navigate to User Profiles
2. Click on an ACTIVE profile
3. Click "Suspend" button
4. Confirm suspension
5. Observe system response

**Expected Result:**
- Profile status changes to SUSPENDED
- User loses access to role-specific features
- Success message displayed

**UI Elements to Verify:**
- [ ] Suspend button is visible
- [ ] Confirmation dialog appears
- [ ] Status updates correctly
- [ ] User access is immediately revoked

---

#### TC-[Sprint]-UP-005: Search User Profiles
**User Story:** #12  
**Role:** User Admin  
**Priority:** Medium

**Test Steps:**
1. Navigate to User Profiles
2. Enter search term in search bar
3. Observe results

**Expected Result:**
- Search matches: Profile ID, User Account name, Role
- Results are filtered correctly
- Clear search functionality works

**UI Elements to Verify:**
- [ ] Search bar is functional
- [ ] Results update correctly
- [ ] Clear search works

---

### 3.4 Request Category Management Test Cases (Platform Manager)

#### TC-[Sprint]-CAT-001: Create Request Category
**User Story:** #35  
**Role:** Platform Manager  
**Priority:** High

**Prerequisites:**
- Platform Manager is logged in

**Test Steps:**
1. Navigate to "Request Categories" section
2. Click "Create New Category" button
3. Enter Category Name: `Education Support`
4. Enter Description: `Categories for educational assistance requests`
5. Click "Create" button
6. Observe system response

**Expected Result:**
- Success message: "Request category created successfully"
- New category appears in categories list
- Category ID is generated
- Category can be used when creating requests

**UI Elements to Verify:**
- [ ] Create button is visible
- [ ] Form fields are accessible
- [ ] Validation works (required fields)
- [ ] Success notification appears
- [ ] New category appears in list
- [ ] Category is available in dropdowns (if applicable)

---

#### TC-[Sprint]-CAT-002: View Request Categories
**User Story:** #36  
**Role:** Platform Manager  
**Priority:** High

**Test Steps:**
1. Navigate to Request Categories section
2. Observe categories list
3. Click on a category to view details

**Expected Result:**
- List displays all categories
- Detail view shows full category information
- Categories are properly formatted

**UI Elements to Verify:**
- [ ] List view is clear and organized
- [ ] Detail view shows complete information
- [ ] Categories are sortable (if implemented)

---

#### TC-[Sprint]-CAT-003: Update Request Category
**User Story:** #37  
**Role:** Platform Manager  
**Priority:** High

**Test Steps:**
1. Navigate to Request Categories
2. Click on a category
3. Click "Edit" button
4. Modify category name or description
5. Click "Save" button

**Expected Result:**
- Category is updated successfully
- Changes are reflected immediately
- Existing requests using this category are not affected

**UI Elements to Verify:**
- [ ] Edit functionality works
- [ ] Changes are saved correctly
- [ ] Success notification appears

---

#### TC-[Sprint]-CAT-004: Delete Request Category
**User Story:** #38  
**Role:** Platform Manager  
**Priority:** High

**Prerequisites:**
- Category exists with no associated requests (or deletion is allowed with requests)

**Test Steps:**
1. Navigate to Request Categories
2. Click on a category
3. Click "Delete" button
4. Confirm deletion in dialog
5. Observe system response

**Expected Result:**
- Warning message if category has associated requests (if applicable)
- Category is deleted after confirmation
- Success message displayed
- Category removed from list

**UI Elements to Verify:**
- [ ] Delete button is visible
- [ ] Confirmation dialog appears
- [ ] Warning messages are clear
- [ ] Deletion is successful
- [ ] Category removed from list

---

#### TC-[Sprint]-CAT-005: Search Request Categories
**User Story:** #39  
**Role:** Platform Manager  
**Priority:** Medium

**Test Steps:**
1. Navigate to Request Categories
2. Enter search term in search bar
3. Observe filtered results

**Expected Result:**
- Search matches category name and description
- Results are filtered correctly
- Clear search works

**UI Elements to Verify:**
- [ ] Search functionality works
- [ ] Results update correctly
- [ ] Clear search button works

---

### 3.5 Request Management Test Cases (PIN)

#### TC-[Sprint]-REQ-001: Create Request
**User Story:** #15  
**Role:** PIN  
**Priority:** High

**Prerequisites:**
- PIN is logged in
- Request categories exist

**Test Steps:**
1. Navigate to "My Requests" section
2. Click "Create New Request" button
3. Fill in request form:
   - Title: `Need Tutoring for Mathematics`
   - Description: `I need help with high school mathematics`
   - Category: Select from dropdown (e.g., `Education Support`)
   - Urgency Level: `HIGH`
   - Location: `Singapore`
   - Date Needed: Select future date
4. Click "Submit" or "Create" button
5. Observe system response

**Expected Result:**
- Success message: "Request created successfully"
- Request appears in "My Requests" list
- Request ID is generated
- Request status is ACTIVE
- View count is 0
- Shortlist count is 0
- Request is visible to CSR Reps

**UI Elements to Verify:**
- [ ] Create button is visible and accessible
- [ ] Form fields are properly labeled
- [ ] Category dropdown is populated
- [ ] Urgency level selection works (radio buttons/dropdown)
- [ ] Date picker works correctly
- [ ] Form validation works (required fields)
- [ ] Success notification appears
- [ ] Request appears in list immediately
- [ ] Request detail view is accessible

---

#### TC-[Sprint]-REQ-002: View My Requests
**User Story:** #16  
**Role:** PIN  
**Priority:** High

**Prerequisites:**
- PIN is logged in
- PIN has created at least 3 requests

**Test Steps:**
1. Navigate to "My Requests" section
2. Observe requests list
3. Click on a request to view details
4. Observe detailed view

**Expected Result:**
- List displays all user's requests
- Each request shows: Title, Category, Status, Created Date, View Count, Shortlist Count
- Detail view shows: All request information, status, engagement metrics
- Requests are sorted by creation date (newest first) or as configured

**UI Elements to Verify:**
- [ ] List view is properly formatted
- [ ] Request cards/rows are clearly displayed
- [ ] Status indicators are color-coded
- [ ] View count and shortlist count are visible
- [ ] Clicking request opens detail view
- [ ] Detail view shows complete information
- [ ] Edit/Delete buttons are visible (if applicable)

---

#### TC-[Sprint]-REQ-003: Update Request
**User Story:** #17  
**Role:** PIN  
**Priority:** High

**Prerequisites:**
- PIN is logged in
- PIN has an ACTIVE request

**Test Steps:**
1. Navigate to "My Requests"
2. Click on an ACTIVE request
3. Click "Edit" button
4. Modify request details (e.g., change urgency from MEDIUM to HIGH)
5. Click "Save" button
6. Observe system response

**Expected Result:**
- Success message: "Request updated successfully"
- Updated information is reflected in detail view
- Updated information is reflected in list view
- Last modified date is updated
- Changes are visible to CSR Reps

**UI Elements to Verify:**
- [ ] Edit button is visible for ACTIVE requests
- [ ] Form is pre-populated with existing data
- [ ] All fields are editable
- [ ] Save button works correctly
- [ ] Cancel button returns to detail view
- [ ] Success notification appears
- [ ] Updated data is immediately visible

---

#### TC-[Sprint]-REQ-004: Delete Request
**User Story:** #18  
**Role:** PIN  
**Priority:** High

**Prerequisites:**
- PIN is logged in
- PIN has an ACTIVE request

**Test Steps:**
1. Navigate to "My Requests"
2. Click on an ACTIVE request
3. Click "Delete" button
4. Confirm deletion in dialog
5. Observe system response

**Expected Result:**
- Confirmation dialog: "Are you sure you want to delete this request?"
- Request is deleted after confirmation
- Success message: "Request deleted successfully"
- Request is removed from list
- Request is no longer visible to CSR Reps
- Request status changes to CANCELLED (or is physically deleted)

**UI Elements to Verify:**
- [ ] Delete button is visible for ACTIVE requests
- [ ] Confirmation dialog appears
- [ ] User can cancel deletion
- [ ] Deletion is successful
- [ ] Request removed from list
- [ ] Success notification appears

---

#### TC-[Sprint]-REQ-005: Search My Requests
**User Story:** #19  
**Role:** PIN  
**Priority:** Medium

**Prerequisites:**
- PIN is logged in
- PIN has multiple requests (at least 5)

**Test Steps:**
1. Navigate to "My Requests"
2. Locate search bar
3. Enter search term: `tutoring`
4. Press Enter or click "Search"
5. Observe filtered results

**Expected Result:**
- Results show requests matching search term
- Search matches: Title, Description, Category
- Results are highlighted or clearly shown
- "No results found" if no matches
- Clear search shows all requests

**UI Elements to Verify:**
- [ ] Search bar is visible
- [ ] Search is functional
- [ ] Results update correctly
- [ ] Clear search works
- [ ] No results message is user-friendly

---

#### TC-[Sprint]-REQ-006: View Request View Count
**User Story:** #20  
**Role:** PIN  
**Priority:** Medium

**Prerequisites:**
- PIN is logged in
- PIN has a request
- CSR Rep has viewed the request (view count > 0)

**Test Steps:**
1. Navigate to "My Requests"
2. Locate a request in the list
3. Observe the view count displayed
4. Click on the request to view details
5. Observe view count in detail view

**Expected Result:**
- View count is displayed in list view
- View count is displayed in detail view
- View count is accurate (matches actual views)
- View count updates when CSR Rep views the request

**UI Elements to Verify:**
- [ ] View count is visible in list view
- [ ] View count is visible in detail view
- [ ] View count is formatted clearly (e.g., "Views: 5")
- [ ] View count updates in real-time (if implemented) or on refresh

---

#### TC-[Sprint]-REQ-007: View Request Shortlist Count
**User Story:** #21  
**Role:** PIN  
**Priority:** Medium

**Prerequisites:**
- PIN is logged in
- PIN has a request
- CSR Rep has shortlisted the request (shortlist count > 0)

**Test Steps:**
1. Navigate to "My Requests"
2. Locate a request in the list
3. Observe the shortlist count displayed
4. Click on the request to view details
5. Observe shortlist count in detail view

**Expected Result:**
- Shortlist count is displayed in list view
- Shortlist count is displayed in detail view
- Shortlist count is accurate
- Shortlist count updates when CSR Rep shortlists the request

**UI Elements to Verify:**
- [ ] Shortlist count is visible in list view
- [ ] Shortlist count is visible in detail view
- [ ] Shortlist count is formatted clearly (e.g., "Shortlisted: 3")
- [ ] Shortlist count updates correctly

---

### 3.6 Request Search & Shortlisting Test Cases (CSR Rep)

#### TC-[Sprint]-CSR-001: Search Requests
**User Story:** #26  
**Role:** CSR Rep  
**Priority:** High

**Prerequisites:**
- CSR Rep is logged in
- Multiple ACTIVE requests exist in system

**Test Steps:**
1. Navigate to "Browse Requests" or "Search Requests" section
2. Locate search bar
3. Enter search term: `education`
4. Press Enter or click "Search"
5. Observe search results

**Expected Result:**
- Results display requests matching search term
- Search matches: Title, Description, Category
- Results show: Title, Category, Urgency, Location, View Count, Shortlist Count
- Results are sorted appropriately
- Filters may be available (Category, Urgency, Location)

**UI Elements to Verify:**
- [ ] Search bar is visible and accessible
- [ ] Search results are displayed clearly
- [ ] Request cards/rows are well-formatted
- [ ] Key information is visible (Title, Category, Urgency)
- [ ] Filters are available and functional (if implemented)
- [ ] Clear search works
- [ ] Pagination works (if many results)

---

#### TC-[Sprint]-CSR-002: View Request Details
**User Story:** #27  
**Role:** CSR Rep  
**Priority:** High

**Prerequisites:**
- CSR Rep is logged in
- ACTIVE requests exist

**Test Steps:**
1. Navigate to "Browse Requests"
2. Click on a request from the list
3. Observe request detail view
4. Verify all information is displayed

**Expected Result:**
- Detail view shows: Title, Description, Category, Urgency, Location, Date Needed, PIN information (if allowed), View Count, Shortlist Count, Created Date
- "Shortlist" button is visible
- View count increments by 1
- Request information is complete and accurate

**UI Elements to Verify:**
- [ ] Detail view is properly formatted
- [ ] All request fields are displayed
- [ ] "Shortlist" button is visible and enabled
- [ ] View count is displayed
- [ ] Back button returns to list
- [ ] Information is clearly organized

---

#### TC-[Sprint]-CSR-003: Shortlist Request
**User Story:** #28  
**Role:** CSR Rep  
**Priority:** High

**Prerequisites:**
- CSR Rep is logged in
- ACTIVE request exists
- Request is not already shortlisted by this CSR Rep

**Test Steps:**
1. Navigate to "Browse Requests"
2. Click on a request to view details
3. Click "Shortlist" or "Save to Shortlist" button
4. Observe system response
5. Navigate to "My Shortlist" section
6. Verify request appears in shortlist

**Expected Result:**
- Success message: "Request added to shortlist"
- "Shortlist" button changes to "Remove from Shortlist" or similar
- Request appears in "My Shortlist" section
- Shortlist count for the request increments by 1
- Request can be removed from shortlist

**UI Elements to Verify:**
- [ ] Shortlist button is visible and enabled
- [ ] Button state changes after shortlisting
- [ ] Success notification appears
- [ ] Request appears in shortlist section
- [ ] Shortlist count updates
- [ ] Remove from shortlist works

---

### 3.7 History & Advanced Features Test Cases

#### TC-[Sprint]-HIST-001: Search Completed Request History (PIN)
**User Story:** #22  
**Role:** PIN  
**Priority:** Medium

**Prerequisites:**
- PIN is logged in
- PIN has at least 3 completed requests

**Test Steps:**
1. Navigate to "Request History" or "Completed Requests" section
2. Locate search bar
3. Enter search term
4. Observe filtered results

**Expected Result:**
- Only COMPLETED requests are shown
- Search filters completed requests
- Results match search criteria
- Completed requests show completion date

**UI Elements to Verify:**
- [ ] History section is accessible
- [ ] Search works correctly
- [ ] Only completed requests are shown
- [ ] Results are properly formatted

---

#### TC-[Sprint]-HIST-002: View Completed Request History (PIN)
**User Story:** #23  
**Role:** PIN  
**Priority:** Medium

**Test Steps:**
1. Navigate to "Request History"
2. Observe list of completed requests
3. Click on a completed request
4. View details

**Expected Result:**
- List shows all completed requests
- Detail view shows complete request information
- Completion date is displayed
- CSR Rep information is shown (if applicable)

**UI Elements to Verify:**
- [ ] History list is properly formatted
- [ ] Detail view shows complete information
- [ ] Completion information is clear

---

#### TC-[Sprint]-SHORT-001: Search My Shortlist (CSR Rep)
**User Story:** #29  
**Role:** CSR Rep  
**Priority:** Medium

**Prerequisites:**
- CSR Rep is logged in
- CSR Rep has shortlisted at least 5 requests

**Test Steps:**
1. Navigate to "My Shortlist" section
2. Enter search term in search bar
3. Observe filtered results

**Expected Result:**
- Search filters shortlisted requests
- Results match search criteria
- Only shortlisted requests are shown

**UI Elements to Verify:**
- [ ] Shortlist section is accessible
- [ ] Search works correctly
- [ ] Results are properly formatted

---

#### TC-[Sprint]-SHORT-002: View My Shortlist (CSR Rep)
**User Story:** #30  
**Role:** CSR Rep  
**Priority:** Medium

**Test Steps:**
1. Navigate to "My Shortlist"
2. Observe list of shortlisted requests
3. Click on a request to view details

**Expected Result:**
- List shows all shortlisted requests
- Requests are properly formatted
- Detail view is accessible
- Remove from shortlist option is available

**UI Elements to Verify:**
- [ ] Shortlist list is properly formatted
- [ ] Requests are clearly displayed
- [ ] Remove functionality works

---

#### TC-[Sprint]-HIST-003: Search Completed Request History (CSR Rep)
**User Story:** #31  
**Role:** CSR Rep  
**Priority:** Medium

**Test Steps:**
1. Navigate to "Request History" or "Completed Assistance"
2. Enter search term
3. Observe filtered results

**Expected Result:**
- Only completed requests where CSR Rep provided assistance are shown
- Search filters correctly
- Results match search criteria

**UI Elements to Verify:**
- [ ] History section is accessible
- [ ] Search works correctly
- [ ] Results are properly formatted

---

#### TC-[Sprint]-HIST-004: View Completed Request History (CSR Rep)
**User Story:** #32  
**Role:** CSR Rep  
**Priority:** Medium

**Test Steps:**
1. Navigate to "Request History"
2. Observe list of completed requests
3. View details of a completed request

**Expected Result:**
- List shows completed requests where CSR Rep provided assistance
- Detail view shows complete information
- PIN information is shown (if applicable)

**UI Elements to Verify:**
- [ ] History list is properly formatted
- [ ] Detail view shows complete information

---

## 4. Test Execution

### 4.1 Test Execution Schedule

| Test Phase | Planned Start | Planned End | Actual Start | Actual End | Status |
|------------|---------------|-------------|--------------|------------|--------|
| Unit Testing | [Date] | [Date] | [Date] | [Date] | [ ] |
| Integration Testing | [Date] | [Date] | [Date] | [Date] | [ ] |
| UI/Functional Testing | [Date] | [Date] | [Date] | [Date] | [ ] |
| Regression Testing | [Date] | [Date] | [Date] | [Date] | [ ] |
| UAT | [Date] | [Date] | [Date] | [Date] | [ ] |

### 4.2 Test Execution Log

**Test Case Execution Summary:**

| Test Case ID | Test Case Name | Executed By | Execution Date | Status | Defect ID | Notes |
|--------------|----------------|-------------|----------------|--------|-----------|-------|
| TC-[Sprint]-AUTH-001 | User Login - Valid | [Name] | [Date] | Pass/Fail | [ID] | [Notes] |
| TC-[Sprint]-AUTH-002 | User Login - Invalid | [Name] | [Date] | Pass/Fail | [ID] | [Notes] |
| ... | ... | ... | ... | ... | ... | ... |

**Test Metrics:**
- **Total Test Cases:** [Number]
- **Passed:** [Number] ([Percentage]%)
- **Failed:** [Number] ([Percentage]%)
- **Blocked:** [Number] ([Percentage]%)
- **Not Executed:** [Number] ([Percentage]%)

---

## 5. Defect Management

### 5.1 Defect Severity Levels

| Severity | Description | Example |
|----------|-------------|---------|
| **Critical** | System crash, data loss, security breach | Login completely broken, data corruption |
| **High** | Major functionality broken, workaround exists | Cannot create user account, can use alternative method |
| **Medium** | Minor functionality issue, easy workaround | Search returns incorrect results, can manually find |
| **Low** | Cosmetic issue, typo, minor UI glitch | Button color incorrect, spelling mistake |

### 5.2 Defect Log Template

**Defect ID:** DEF-[Sprint]-[Sequence]  
**Title:** [Brief description]  
**Severity:** [Critical/High/Medium/Low]  
**Priority:** [P1/P2/P3/P4]  
**Status:** [New/Assigned/In Progress/Fixed/Verified/Closed]  
**Reported By:** [Name]  
**Reported Date:** [Date]  
**Assigned To:** [Developer Name]  
**Fixed Date:** [Date]  
**Verified Date:** [Date]

**Description:**
[Detailed description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]  
**Actual Result:** [What actually happens]  
**Screenshots/Attachments:** [Links or references]  
**Environment:** [Browser, OS, etc.]

---

## 6. Test Data Requirements

### 6.1 Test Data Setup

**Synthetic User Data (100 users as per requirements):**
- User Administrators: [X] users
- Person-In-Need (PIN): [X] users
- CSR Representatives: [X] users
- Platform Managers: [X] users

**Test Data File:** `[path/to/test-data.json]` or `create-test-users.ts`

**Test Accounts:**
| Role | Username | Password | Status | Profile Status |
|------|----------|----------|--------|----------------|
| User Admin | `admin_test_001` | `[Password]` | ACTIVE | ACTIVE |
| PIN | `pin_test_001` | `[Password]` | ACTIVE | ACTIVE |
| CSR Rep | `csr_test_001` | `[Password]` | ACTIVE | ACTIVE |
| Platform Manager | `pm_test_001` | `[Password]` | ACTIVE | ACTIVE |

**Test Request Categories:**
- [Category 1]
- [Category 2]
- [Category 3]
- ...

**Test Requests:**
- [X] ACTIVE requests
- [X] MATCHED requests
- [X] COMPLETED requests
- [X] CANCELLED requests

---

## 7. Test Completion Criteria

### 7.1 Entry Criteria (Test Readiness)

- [ ] All user stories for sprint are implemented
- [ ] Code is checked into version control
- [ ] Unit tests are written and passing (≥80% coverage)
- [ ] Test environment is set up and accessible
- [ ] Test data is loaded (100 synthetic users)
- [ ] Test plan is reviewed and approved
- [ ] Test cases are reviewed and approved

### 7.2 Exit Criteria (Test Completion)

- [ ] All test cases are executed
- [ ] All critical and high-severity defects are fixed and verified
- [ ] Test pass rate ≥ 95%
- [ ] Code coverage ≥ 80% (unit tests)
- [ ] UAT is completed and signed off
- [ ] Test report is prepared and reviewed
- [ ] Regression testing is completed (if applicable)
- [ ] Performance is acceptable (if applicable)

---

## 8. Test Report

### 8.1 Test Summary

**Sprint:** [Sprint Number]  
**Test Period:** [Start Date] - [End Date]  
**Test Lead:** [Name]

**Overall Status:** [Pass/Fail/Partial]

### 8.2 Test Results Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Test Cases Executed | [Number] | [Number] | [ ] |
| Test Cases Passed | [Number] | [Number] | [ ] |
| Test Cases Failed | 0 | [Number] | [ ] |
| Test Pass Rate | 100% | [Percentage]% | [ ] |
| Code Coverage | ≥80% | [Percentage]% | [ ] |
| Critical Defects | 0 | [Number] | [ ] |
| High Defects | 0 | [Number] | [ ] |

### 8.3 Defect Summary

| Severity | Count | Fixed | Remaining |
|----------|-------|-------|-----------|
| Critical | [Number] | [Number] | [Number] |
| High | [Number] | [Number] | [Number] |
| Medium | [Number] | [Number] | [Number] |
| Low | [Number] | [Number] | [Number] |
| **Total** | **[Number]** | **[Number]** | **[Number]** |

### 8.4 Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

### 8.5 Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | [Name] | [Signature] | [Date] |
| Development Lead | [Name] | [Signature] | [Date] |
| Product Owner | [Name] | [Signature] | [Date] |

---

## 9. Appendices

### 9.1 Test Environment Configuration

[Detailed environment setup instructions]

### 9.2 Test Tools

- **Unit Testing:** [Jest/Vitest/etc]
- **Integration Testing:** [Supertest/etc]
- **UI Testing:** [Manual/Cypress/Playwright/etc]
- **Test Management:** [Tool name]
- **Defect Tracking:** [Jira/GitHub Issues/etc]

### 9.3 References

- User Stories Document: `USER_STORIES.md`
- Project Requirements: `.cursor/rules/project_requirements.mdc`
- API Documentation: [Link]
- UI/UX Design: [Link]

### 9.4 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial test plan template |

---

**End of Test Plan Template**

