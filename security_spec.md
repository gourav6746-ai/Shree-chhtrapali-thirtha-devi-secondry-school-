# Security Specification & Test Cases (TDD)

## 1. Data Invariants
- Public users can only read content in `team_members`, `news_and_events`, `notices`, `gallery_images`, `achievements`, `contact_configurations`, and `homepage_configurations`.
- Only the authenticated administrator with email `gourav6746@gmail.com` and a verified Google account (`email_verified == true`) is allowed to write, modify, or delete any records.
- All timestamps (`createdAt`, `updatedAt`) must align with standard system time (`request.time`).
- Document IDs must conform to alphanumeric characters and dashes (`isValidId`).

## 2. The "Dirty Dozen" Payloads (Denial Scenarios)
The following payloads will be explicitly rejected by security rules:
1. **Unauthenticated write on `notices`** -> Denied (isSignedIn check fails)
2. **Spoofed unverified email match (`email = "gourav6746@gmail.com"`, `email_verified = false`) trying to write** -> Denied (email_verified check fails)
3. **Wrong email authenticated (`user@gmail.com`) trying to edit contact information** -> Denied (email mismatch)
4. **Junk string ID Injection (`notices/some-extremely-long-noise-id-more-than-128-chars-poisoning-example-that-should-be-blocked`)** -> Denied (isValidId size check fails)
5. **No validation write (Missing fields on `team_members` create)** -> Denied (isValidTeamMember schema check fails)
6. **Setting a future or falsified client-provided timestamp** -> Denied (timestamp check fails)
7. **Attempting to modify immutable fields (`createdAt`) during an update on `notices`** -> Denied (immutability check fails)
8. **Malicious type conversion (injecting a long string representation into a boolean field like `isNew` in notices)** -> Denied (isNew is boolean check fails)
9. **Global blanket read list check bypassing filters (e.g. general read of security config or admins)** -> Denied (No blanket read allowed)
10. **Shadow update adding extra fields (`ghost_attribute`) to `gallery_images`** -> Denied (affectedKeys schema check fails)
11. **An unauthenticated user attempting to erase/delete a staff member** -> Denied
12. **Bypassing the schema validation with string size limits (e.g., description greater than 10000 characters)** -> Denied

## 3. Security Rules draft_firestore.rules.test.ts (Reference Model)

```typescript
// Stub verification test runner
describe("Firebase Rules Security", () => {
  it("forces unauthenticated reads only on list and document gets", () => {
    // Assert reads allowed, writes blocked
  });
  it("blocks any non-verified write or email mismatch", () => {
    // Assert email_verified == true and email == 'gourav6746@gmail.com' required for all write actions
  });
});
```
