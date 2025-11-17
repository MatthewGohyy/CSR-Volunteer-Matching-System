# Story 11 Walkthrough Script – Suspend User Profile

Use this script to describe User Story #11 (“Suspend a user profile”) with the
necessary code-level detail. Keep each file visible as stated and read the
matching quote verbatim.

| Step | On-Screen File / Highlight | Say this verbatim |
| --- | --- | --- |
| 1 | `docs/requirements/USER_STORIES.md` — Sprint 1 table, row “#11 User Admin … suspend a user profile …” | “Starting with the requirements, Story Eleven explicitly says ‘As a User Admin, I want to suspend a user profile so that the associated role or permissions are temporarily disabled.’ Everything I show next traces back to this line.” |
| 2 | `client/src/components/AdminDashboard.tsx` — lines 420‑513 where profiles are listed and `setShowProfileModal(true)` is called | “In the Admin dashboard boundary component, each profile list item calls `setSelectedProfile(profile)` and `setShowProfileModal(true)`, which renders the `UserProfileDetailsModal`. This is the UI entry point for suspending a profile, so the boundary clearly wires the click into that modal.” |
| 3a | `client/src/components/UserProfileDetailsModal.tsx` — highlight the Suspend button JSX (lines ~334‑356) | “Inside the modal, when `currentProfile.isActive` is true, the ‘Suspend Profile’ button is rendered. Clicking it calls `handleProfileStatusChange(false)` while showing a red destructive style so the admin knows this action disables the role.” |
| 3b | Same file — scroll to the `handleProfileStatusChange` function (lines ~61‑95) | “`handleProfileStatusChange` is where the boundary actually calls the API: it shows a confirmation dialog, flips the `isProcessing` flag, and then issues `await api.put(\`/admin/profiles/${profile.id}/suspend\`)`. Because this function lives in the React component, we can clearly see the Boundary invoking the controller endpoint defined for this story.” |
| 4 | `server/src/controllers/userAdmin/suspendUserProfile.controller.ts` — show the doc comment plus `UserProfile.update(id, { isActive: false })` | “Here in the controller layer, the `SuspendUserProfileController` references Story Eleven in the doc comment. The handler extracts the profile ID, calls `UserProfile.update(id, { isActive: false })`, and responds with the message ‘User profile suspended successfully…’. That’s the exact controller the boundary hit in the previous step.” |
| 5 | `server/src/entities/UserProfile.entity.ts` — highlight the static `update` method and the `prisma.userProfile.update({ data })` call | “Finally in the entity layer, the static `UserProfile.update` method performs the database write. It validates name clashes, then executes `prisma.userProfile.update` with whatever fields we pass—in this case only `isActive: false`. This is the part that actually disables the role for every user assigned to it.” |
| 6 | (Optional live demo) Application running — suspend a profile and show the toast message | “To close the loop, I click Suspend in the UI, confirm the dialog, and you can see the toast ‘User profile suspended successfully’ plus the chip changing from ACTIVE to INACTIVE, proving the full Boundary → Controller → Entity flow delivers Story Eleven.” |

**Reminder:** mention that re-activating the profile uses the mirror endpoint
`PUT /admin/profiles/{id}/activate`, which shares the same boundary, controller,
and entity structure—demonstrating consistency across both actions.*** End Patch

