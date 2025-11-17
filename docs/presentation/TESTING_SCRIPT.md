# Test Data & TDD Walkthrough Script

Use this script when the lecturer asks about synthetic data coverage or the
team’s test-driven development process. Each step lists what to keep on screen
and provides verbatim wording.

---

## Part A – Synthetic Test Data (100+ users per requirement)

| Step | On-Screen File / Focus | Say this verbatim |
| --- | --- | --- |
| A1 | `docs/testing/TEST_DATA_SUMMARY.md` — Overview + Data Distribution table | “Our Faker.js dataset is documented in `TEST_DATA_SUMMARY.md`. You can see we generated 1,854 records: 104 user accounts, 126 categories, 190 requests, 189 shortlists, 300 offers, 100 matches, and 845 notifications. This satisfies the requirement for at least 100 synthetic records per user type, and the table shows the exact breakdown.” |
| A2 | Same file — “Realistic Australian Data” + “Data Variety” sections | “Rows 25 through 83 explain how we localized everything to Australia—names, suburbs, phone numbers, even ACN numbers—so lecturers can trust the realism. We also varied statuses, urgency, and timestamps so every workflow can be demonstrated without changing data.” |
| A3 | Same file — “Usage Commands” section | “To recreate the data live I run `npm run seed:large` or `npm run seed:reset` from the `server/` folder. There’s also `bash scripts/testing/verify-test-data.sh`, listed right here, which prints out each table count so I can prove the dataset in front of you.” |
| A4 | Terminal (ready to run) — `bash scripts/testing/verify-test-data.sh` | “Now I’ll execute `bash scripts/testing/verify-test-data.sh`. This hits Prisma and echoes each table’s record count. The output matches the documentation, so you can see the data actually exists, not just on paper.” |
| A5 (optional deep dive) | `server/prisma/seeders/generate-large-dataset.ts` — highlight Faker.js usage | “If you’d like to see how the data is produced, this Prisma seeder loops through Faker factories to insert Australian-themed accounts, requests, matches, and notifications in about three seconds. That’s the source mentioned at the end of the summary file.” |

---

## Part B – Test Driven Development (Sprint 1)

| Step | On-Screen File / Focus | Say this verbatim |
| --- | --- | --- |
| B1 | `docs/testing/SPRINT1_TDD_GUIDE.md` — “Coverage” + “Test Structure” sections | “Our TDD story is captured in `SPRINT1_TDD_GUIDE.md`. Right at the top it confirms we covered all 12 Sprint 1 user stories with a single Jest suite, and the structure section points you to `server/tests/sprint1.test.ts` which holds about 25 cases.” |
| B2 | Same file — “Test Data” section | “This guide also explains our two-tier data strategy: Faker.js seeds give us 100+ realistic users for demos, while each test run creates isolated `sprint1-*` accounts that are cleaned up after execution. That separation keeps automated tests deterministic.” |
| B3 | `docs/testing/TDD_REPORT_SECTION.md` — sections 3–7 (tech stack, implementation, metrics) | “For the formal report we summarized the TDD stack—Jest plus Supertest—along with metrics: 23 test cases, 12 of 12 stories covered, 2.8 second runtime, zero failures. I show this page so examiners can see the narrative version with tables and sample console output.” |
| B4 | `server/tests/sprint1.test.ts` — top of file plus `beforeAll` setup and one `describe` block | “Here is the actual code. At the top we import Supertest, Prisma, and our password helper, then `beforeAll` seeds four dedicated users (`sprint1-admin@test.com`, etc.) so each story has its own credentials. Every `describe` block is labeled with the story number—for example Story #11 near the bottom—so you can trace each test back to the requirement.” |
| B5 | Terminal — `npm run test:sprint1` | “When I run `npm run test:sprint1`, Jest executes the same suite the docs describe. The console output mirrors the snippet in the report: authentication tests first, then user account tests, then profile tests. This is our executable proof that the Sprint 1 stories were implemented with TDD.” |
| B6 (optional) | Terminal — `npm run test:sprint1:coverage` | “If you want coverage numbers, `npm run test:sprint1:coverage` prints the statement, branch, function, and line percentages so we can show quantitative quality metrics as part of the TDD evidence.” |

---

## Quick Reference Commands (mention verbally if asked)

```bash
# Generate / reset Faker dataset
cd server
npm run seed:large
npm run seed:reset

# Verify counts
bash scripts/testing/verify-test-data.sh

# Run Sprint 1 automated tests
npm run test:sprint1
npm run test:sprint1:coverage
```

Keep this script alongside `STORY11_SCRIPT.md` so you can jump between BCE walkthroughs and testing evidence without hunting for files.***

