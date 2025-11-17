# BCE Presentation Cheat Sheet

This cheat sheet sits on top of the BCE summary in `README.md` and gives you a
fast way to prove Boundary → Controller → Entity traceability for any user
story the lecturer chooses.

---

## BCE Layer Reference (per README)

| Layer | Path | What to highlight |
| --- | --- | --- |
| Boundary | `client/src/components/` | React dashboards, modals, and shared UI that call REST endpoints via `client/src/config/api.ts`. |
| Controller | `server/src/controllers/` | Express handlers grouped by persona (`auth/`, `userAdmin/`, `pin/`, `csrRep/`, `platformManager/`, `matches/`). |
| Entity | `server/src/entities/` | Prisma/TypeORM-style entities with static repo-style methods (`UserAccount`, `Request`, `VolunteerOffer`, etc.). |

**Tip:** Keep `README.md` open at the “BCE Architecture Implementation” section
while presenting so you can reference the textual diagram before diving into
code.

---

## How to Demonstrate a Story in BCE Order

1. **Start from the Boundary** – open the relevant dashboard or modal
   component and show the React Query call or mutation (e.g.,
   `AdminDashboard.tsx` lines that call `/admin/users`).
2. **Jump to the Controller** – use IDE navigation or `rg` to open the matching
   file in `server/src/controllers/...`. Point out validation + service calls.
3. **Show the Entity** – open `server/src/entities/...` to show the model or
   repository method that persists data.
4. **Optionally run a script** – `scripts/testing/test-endpoints.sh` or the
   persona-specific workflow scripts under `scripts/testing/` can verify the
   flow live if time permits.

---

## Story → Code Map

Each row lists the quickest BCE path and a reminder of what to show on screen.

### User Administrator (Stories 1–12)

| Story | Boundary (React) | Controller(s) | Entity / Data | Demo Tip |
| --- | --- | --- | --- | --- |
| 1 – Login to manage accounts | `client/src/components/LoginPage.tsx` | `server/src/controllers/auth/login.controller.ts` | `server/src/entities/UserAccount.entity.ts`<br>`server/src/entities/UserProfile.entity.ts` | Show POST `/api/auth/login` returning role so router sends admins to their dashboard. |
| 2 – Logout securely | `client/src/components/AdminDashboard.tsx` (header button) | `server/src/controllers/auth/logout.controller.ts` | `UserAccount.entity.ts` | Click logout to show token removal + `/api/auth/logout` call. |
| 3 – Create user accounts | `AdminDashboard.tsx`, `CreateUserModal.tsx` | `userAdmin/createUserAccount.controller.ts` | `UserAccount.entity.ts` | Open modal → submit → highlight POST `/api/admin/users`. |
| 4 – View user accounts | `AdminDashboard.tsx`, `UserDetailsModal.tsx` | `userAdmin/searchUserAccounts.controller.ts`, `userAdmin/viewUserAccount.controller.ts` | `UserAccount.entity.ts`, `UserProfile.entity.ts` | Filter table then open modal to show GET `/api/admin/users/:id`. |
| 5 – Update a user account | `UserDetailsModal.tsx` (Edit mode) | `userAdmin/updateUserAccount.controller.ts` | `UserAccount.entity.ts` | Toggle edit → save → show PUT `/api/admin/users/:id`. |
| 6 – Suspend a user account | `UserDetailsModal.tsx` (Suspend/Activate buttons) | `userAdmin/suspendUserAccount.controller.ts`, `userAdmin/activateUserAccount.controller.ts` | `UserAccount.entity.ts` | Click suspend to show PUT `/api/admin/users/:id/suspend` flipping status. |
| 7 – Search user accounts | `AdminDashboard.tsx` search input (`useDebounce`) | `userAdmin/searchUserAccounts.controller.ts` | `UserAccount.entity.ts` | Type query → highlight GET `/api/admin/users?query=` response. |
| 8 – Create user profiles | `CreateUserProfileModal.tsx` | `userAdmin/createUserProfile.controller.ts` | `UserProfile.entity.ts` | In Profiles tab, open modal and show POST `/api/admin/profiles`. |
| 9 – View user profiles | `AdminDashboard.tsx` (Profiles tab), `UserProfileDetailsModal.tsx` | `userAdmin/searchUserProfiles.controller.ts`, `userAdmin/viewUserProfile.controller.ts` | `UserProfile.entity.ts` | Switch tabs, open profile to show GET `/api/admin/profiles/:id`. |
| 10 – Update a user profile | `UserProfileDetailsModal.tsx` | `userAdmin/updateUserProfile.controller.ts` | `UserProfile.entity.ts` | Edit permissions/status → show PUT `/api/admin/profiles/:id`. |
| 11 – Suspend a user profile | `UserProfileDetailsModal.tsx` | `userAdmin/suspendUserProfile.controller.ts`, `userAdmin/activateUserProfile.controller.ts` | `UserProfile.entity.ts` | Demonstrate Activate/Deactivate toggle hitting `/api/admin/profiles/:id/suspend`. |
| 12 – Search user profiles | `AdminDashboard.tsx` profile search + status filter | `userAdmin/searchUserProfiles.controller.ts` | `UserProfile.entity.ts` | Show GET `/api/admin/profiles?query=&isActive=` updating table. |

### Person-In-Need (Stories 13–23)

| Story | Boundary (React) | Controller(s) | Entity / Data | Demo Tip |
| --- | --- | --- | --- | --- |
| 13 – Login to submit requests | `LoginPage.tsx` | `auth/login.controller.ts` | `UserAccount.entity.ts`, `UserProfile.entity.ts` | Same login flow; highlight role-based redirect to `PINDashboard`. |
| 14 – Logout for security | `client/src/components/PINDashboard.tsx` (`handleLogout`) | `auth/logout.controller.ts` | `UserAccount.entity.ts` | Click logout to show POST `/api/auth/logout`. |
| 15 – Create a request | `PINDashboard.tsx` + inline `CreateEditRequestModal` | `pin/createRequest.controller.ts` | `server/src/entities/Request.entity.ts` | Use “Create Request” button → show POST `/api/opportunities`. |
| 16 – View my requests | `PINDashboard.tsx` (“My Requests” tab) | `pin/searchMyRequests.controller.ts`, `pin/viewMyRequest.controller.ts` | `Request.entity.ts` | Scroll list + open item to show GET `/api/opportunities/my/requests` then `/api/opportunities/{id}`. |
| 17 – Update a request | `CreateEditRequestModal` (Edit mode) | `pin/updateRequest.controller.ts` | `Request.entity.ts` | Click Edit → save → show PUT `/api/opportunities/:id`. |
| 18 – Delete a request | `PINDashboard.tsx` delete icon | `pin/deleteRequest.controller.ts` | `Request.entity.ts` | Confirm delete → show DELETE `/api/opportunities/:id`. |
| 19 – Search my requests | `PINDashboard.tsx` search bar (`useDebounce`) | `pin/searchMyRequests.controller.ts` | `Request.entity.ts` | Type search → GET `/api/opportunities/my/requests?search=` updates list. |
| 20 – View number of views | `CreateEditRequestModal` (view mode metrics) | `pin/viewRequestViewController.ts` | `Request.entity.ts` (`viewCount`) | Show GET `/api/opportunities/my/{id}/views` populating counter badges. |
| 21 – View shortlist count | `CreateEditRequestModal` metrics | `pin/viewRequestShortlist.controller.ts` | `server/src/entities/Shortlist.entity.ts` | Show GET `/api/opportunities/my/{id}/shortlists`. |
| 22 – Search completed history | `PINDashboard.tsx` (“History” tab search) | `pin/searchCompletedRequests.controller.ts` | `server/src/entities/Match.entity.ts`, `Request.entity.ts` | Filter history grid using GET `/volunteers/requests/history?search=`. |
| 23 – View completed history | `RequestModal` with `type="completed"` | `pin/viewCompletedRequest.controller.ts` | `Match.entity.ts`, `Request.entity.ts` | Open a history row to show GET `/volunteers/requests/history/{id}` rendering details. |

### CSR Representative (Stories 24–32)

| Story | Boundary (React) | Controller(s) | Entity / Data | Demo Tip |
| --- | --- | --- | --- | --- |
| 24 – Login to manage requests | `LoginPage.tsx` | `auth/login.controller.ts` | `UserAccount.entity.ts`, `UserProfile.entity.ts` | Login as CSR to land on `CSRRepDashboard`. |
| 25 – Logout securely | `client/src/components/CSRRepDashboard.tsx` | `auth/logout.controller.ts` | `UserAccount.entity.ts` | Use header button to demonstrate logout call. |
| 26 – Search requests | `CSRRepDashboard.tsx` (“Browse” tab search + filters) | `csrRep/searchRequests.controller.ts` | `Request.entity.ts`, `RequestCategory.entity.ts` | Adjust filters to show GET `/api/opportunities?query=&categoryId=&urgency=`. |
| 27 – View request details | `RequestModal` (default) | `csrRep/viewRequest.controller.ts` | `Request.entity.ts` | Open card to show GET `/api/opportunities/{id}` with PIN metadata. |
| 28 – Save (shortlist) a request | `CSRRepDashboard.tsx` shortlist button | `csrRep/saveRequest.controller.ts`, `csrRep/removeShortlist.controller.ts` | `Shortlist.entity.ts` | Click star → show POST `/organizations/shortlist` (or DELETE to remove). |
| 29 – Search shortlist | `CSRRepDashboard.tsx` (“My Shortlist” tab search) | `csrRep/searchShortlist.controller.ts` | `Shortlist.entity.ts` | Search input triggers GET `/organizations/shortlists?search=`. |
| 30 – View shortlist items | `RequestModal` with `type="shortlist"` | `csrRep/viewShortlist.controller.ts`, `csrRep/getShortlistedIds.controller.ts` | `Shortlist.entity.ts`, `Request.entity.ts` | Open shortlist row to show GET `/organizations/shortlists/{id}`. |
| 31 – Search completed history | `CSRRepDashboard.tsx` (“Completed History” tab) | `csrRep/searchCompletedRequests.controller.ts` | `Match.entity.ts`, `Request.entity.ts` | Filter history to show GET `/organizations/requests/history?search=`. |
| 32 – View completed history entry | `RequestModal` with `type="csrHistory"` | `csrRep/viewCompletedRequest.controller.ts`, `csrRep/viewMatch.controller.ts` | `Match.entity.ts`, `Request.entity.ts` | Open entry → GET `/organizations/requests/history/{matchId}` showing past assistance. |

### Platform Manager (Stories 33–39)

| Story | Boundary (React) | Controller(s) | Entity / Data | Demo Tip |
| --- | --- | --- | --- | --- |
| 33 – Login for platform controls | `LoginPage.tsx` | `auth/login.controller.ts` | `UserAccount.entity.ts`, `UserProfile.entity.ts` | Login with platform manager credentials → land on `PlatformManagerDashboard`. |
| 34 – Logout securely | `client/src/components/PlatformManagerDashboard.tsx` | `auth/logout.controller.ts` | `UserAccount.entity.ts` | Show logout button hitting `/api/auth/logout`. |
| 35 – Create request categories | `PlatformManagerDashboard.tsx` + `CreateEditCategoryModal` | `platformManager/createCategory.controller.ts` | `server/src/entities/RequestCategory.entity.ts` | Use “Create Category” button → POST `/platform-manager/categories`. |
| 36 – View request categories | `PlatformManagerDashboard.tsx` list & stats | `platformManager/searchCategories.controller.ts`, `platformManager/viewCategory.controller.ts` | `RequestCategory.entity.ts` | Scroll cards + open detail (GET `/platform-manager/categories/:id`). |
| 37 – Update request categories | `CreateEditCategoryModal` (edit) | `platformManager/updateCategory.controller.ts` | `RequestCategory.entity.ts` | Edit category → PUT `/platform-manager/categories/:id`. |
| 38 – Delete request categories | `PlatformManagerDashboard.tsx` delete icon | `platformManager/deleteCategory.controller.ts` | `RequestCategory.entity.ts` | Confirm delete → DELETE `/platform-manager/categories/:id`. |
| 39 – Search categories | `PlatformManagerDashboard.tsx` search bar | `platformManager/searchCategories.controller.ts` | `RequestCategory.entity.ts` | Type query to show GET `/platform-manager/categories?search=` filtering list. |

---

## Extra Receipts to Mention

- **Docs:** `docs/api/API_DOCUMENTATION.md` (47 endpoints) and
  `docs/architecture/CLASS_DIAGRAM_COMPLETE_DOCUMENTATION.md` back up each
  controller/entity pairing.
- **Testing:** `scripts/testing/test-*.sh` scripts run end-to-end flows per
  persona; cite them if the lecturer asks about verification.
- **Data:** `docs/testing/TEST_DATA_SUMMARY.md` lists the 100 synthetic users
  referenced in the stories.

Use this sheet alongside the README so you can switch between explanation,
code, and proof in seconds.

