# Test Case Execution Report

## Sprint 1: Authentication & Basic User/Profile Management
**Duration:** 09 Oct 2025 - 19 Oct 2025  
**Test Execution:** 17/10 | **Bug Fix Verification:** 18/10 | **Test Completion:** 19/10

| Test Case ID | Description | Tester | Type | Date | Status |
|--------------|-------------|--------|------|------|--------|
| TC-1-AUTH-001 | User Login - Valid Credentials | Bryan | UI Manual | 17/10 | Pass |
| TC-1-AUTH-002 | User Login - Invalid Credentials | Bryan | UI Manual | 17/10 | Pass |
| TC-1-AUTH-003 | User Login - Suspended Account | Bryan | UI Manual | 17/10 | Pass |
| TC-1-AUTH-004 | User Logout | Bryan | UI Manual | 17/10 | Pass |
| TC-1-UA-001 | Create User Account - Valid Data | Salmaan | UI Manual | 17/10 | Pass |
| TC-1-UA-002 | Create User Account - Duplicate Username | Salmaan | UI Manual | 17/10 | Pass |
| TC-1-UA-005 | Suspend User Account | Salmaan | UI Manual | 17/10 | Pass |
| TC-1-UP-001 | Create User Profile | Bryan | UI Manual | 17/10 | Pass |
| TC-1-UP-004 | Suspend User Profile | Bryan | UI Manual | 17/10 | Pass |
| TC-1-API-001 | POST /auth/login - Valid Credentials | Salmaan | API Script | 17/10 | Pass |
| TC-1-API-002 | POST /auth/login - Invalid Credentials | Salmaan | API Script | 17/10 | Pass |
| TC-1-API-003 | POST /auth/logout | Salmaan | API Script | 17/10 | Pass |
| TC-1-API-004 | POST /admin/users - Create Account | Bryan | API Script | 17/10 | Pass |
| TC-1-API-005 | PATCH /admin/users/:id/suspend | Bryan | API Script | 17/10 | Pass |
| TC-1-API-006 | POST /admin/profiles - Create Profile | Salmaan | API Script | 17/10 | Pass |
| TC-1-API-007 | PATCH /admin/profiles/:id/suspend | Salmaan | API Script | 17/10 | Pass |

---

## Sprint 2: Advanced User/Profile Management & Category Management
**Duration:** 19 Oct 2025 - 26 Oct 2025  
**Test Execution:** 24/10 | **Bug Fix Verification:** 25/10 | **Test Completion:** 26/10

| Test Case ID | Description | Tester | Type | Date | Status |
|--------------|-------------|--------|------|------|--------|
| TC-2-UA-003 | View User Accounts | Bryan | UI Manual | 24/10 | Pass |
| TC-2-UA-004 | Update User Account | Bryan | UI Manual | 24/10 | Pass |
| TC-2-UA-006 | Search User Accounts | Bryan | UI Manual | 24/10 | Pass |
| TC-2-UP-002 | View User Profiles | Salmaan | UI Manual | 24/10 | Pass |
| TC-2-UP-003 | Update User Profile | Salmaan | UI Manual | 24/10 | Pass |
| TC-2-UP-005 | Search User Profiles | Salmaan | UI Manual | 24/10 | Pass |
| TC-2-CAT-001 | Create Request Category | Bryan | UI Manual | 24/10 | Pass |
| TC-2-CAT-002 | View Request Categories | Bryan | UI Manual | 24/10 | Pass |
| TC-2-CAT-003 | Update Request Category | Salmaan | UI Manual | 24/10 | Pass |
| TC-2-CAT-004 | Delete Request Category | Salmaan | UI Manual | 24/10 | Pass |
| TC-2-CAT-005 | Search Request Categories | Salmaan | UI Manual | 24/10 | Pass |

---

## Sprint 3: Request Management & Shortlisting
**Duration:** 26 Oct 2025 - 02 Nov 2025  
**Test Execution:** 31/10 | **Bug Fix Verification:** 1/11 | **Test Completion:** 2/11

| Test Case ID | Description | Tester | Type | Date | Status |
|--------------|-------------|--------|------|------|--------|
| TC-3-REQ-001 | Create Request | Bryan | UI Manual | 31/10 | Pass |
| TC-3-REQ-002 | View My Requests | Bryan | UI Manual | 31/10 | Pass |
| TC-3-REQ-003 | Update Request | Bryan | UI Manual | 31/10 | Pass |
| TC-3-REQ-004 | Delete Request | Bryan | UI Manual | 31/10 | Pass |
| TC-3-REQ-005 | Search My Requests | Salmaan | UI Manual | 31/10 | Pass |
| TC-3-REQ-006 | View Request View Count | Salmaan | UI Manual | 31/10 | Pass |
| TC-3-REQ-007 | View Request Shortlist Count | Salmaan | UI Manual | 31/10 | Pass |
| TC-3-CSR-001 | Search Requests | Salmaan | UI Manual | 31/10 | Pass |
| TC-3-CSR-002 | View Request Details | Bryan | UI Manual | 31/10 | Pass |
| TC-3-CSR-003 | Shortlist Request | Bryan | UI Manual | 31/10 | Pass |

---

## Sprint 4: History & Advanced Features
**Duration:** TBD  
**Test Execution:** 7/11 | **Bug Fix Verification:** 8/11 | **Test Completion:** 9/11

| Test Case ID | Description | Tester | Type | Date | Status |
|--------------|-------------|--------|------|------|--------|
| TC-4-HIST-001 | Search Completed Request History (PIN) | Salmaan | UI Manual | 7/11 | Pass |
| TC-4-HIST-002 | View Completed Request History (PIN) | Salmaan | UI Manual | 7/11 | Pass |
| TC-4-SHORT-001 | Search My Shortlist (CSR Rep) | Bryan | UI Manual | 7/11 | Pass |
| TC-4-SHORT-002 | View My Shortlist (CSR Rep) | Bryan | UI Manual | 7/11 | Pass |
| TC-4-HIST-003 | Search Completed Request History (CSR Rep) | Salmaan | UI Manual | 7/11 | Pass |
| TC-4-HIST-004 | View Completed Request History (CSR Rep) | Bryan | UI Manual | 7/11 | Pass |

---

## Summary

| Sprint | Total Test Cases | Passed | Failed | Pass Rate |
|--------|------------------|--------|--------|-----------|
| Sprint 1 | 17 | 17 | 0 | 100% |
| Sprint 2 | 11 | 11 | 0 | 100% |
| Sprint 3 | 10 | 10 | 0 | 100% |
| Sprint 4 | 6 | 6 | 0 | 100% |
| **Total** | **44** | **44** | **0** | **100%** |

**Note:** Sprint 1 includes API functional testing (script-based) in addition to UI manual testing. All other sprints utilize UI manual testing only.

