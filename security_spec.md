# Security Specification: SCTS School Portal Fortress Rules

This security specification details the Attribute-Based Access Control (ABAC) policies and security test cases for the Shree Chhatrapali Tirthadevi Secondary School Admin Panel.

## 1. Data Invariants

1. **Hierarchy and Access Control**:
   - Only validated, signed-in users listed in `/admins/{uid}` or matching the bootstrapped administrator email (`gourav6746@gmail.com`) can perform Write (`create`, `update`, `delete`) operations.
   - Public / anonymous readers can only read (Get and List) school data (`team_members`, `news_and_events`, `notices`, `gallery_images`, `achievements`, `contact_configurations`, `homepage_configurations`).
   - The `/admins` collection can only be read, created, updated, or deleted by a confirmed `admin` (not a mere editor).

2. **Schema & Field Integrity**:
   - Every collection document identifier must be valid (under 128 characters, matching alphanumerics).
   - Singleton configurations like `contact_configurations` must have the fixed document ID `"main"`.
   - Singleton configurations like `homepage_configurations` must have the fixed document ID `"hero"`.
   - Order fields must be valid integers.
   - Roles in `/admins` must strictly be `"admin"` or `"editor"`.
   - Team member categories must strictly be `"admin"`, `"faculty"`, `"support"`, or `"retired"`.
   - News types must strictly be `"news"` or `"event"`.

---

## 2. The "Dirty Dozen" Payloads

The following adversarial JSON payloads must be rejected by the security rules:

### DB-01: Admin Collection Spoofing (By Unauthenticated Attacker)
An anonymous attacker tries to write themselves as an Admin.
```json
// POST /admins/malicious_uid
{
  "uid": "malicious_uid",
  "email": "hacker@evil.com",
  "role": "admin"
}
```

### DB-02: Self-Promotion (By Authenticated Non-Admin Editor)
An authenticated editor attempts to elevate their own role to admin.
```json
// UPDATE /admins/editor_uid
{
  "role": "admin"
}
```

### DB-03: Singleton Bypass on Contact Info
Creating a spurious contact page ID to bypass the primary contacts screen.
```json
// POST /contact_configurations/fake_address
{
  "id": "fake_address",
  "phone1": "+977-980000000",
  "email": "spam@school.edu",
  "addressEn": "Incorrect Address Space",
  "addressNp": "गलत ठेगाना"
}
```

### DB-04: Notice Board Creation (By Public User)
A public student attempts to insert a fake announcement.
```json
// POST /notices/fake_holiday
{
  "id": "fake_holiday",
  "titleEn": "School Closed Indefinitely",
  "titleNp": "विद्यालय अनिश्चितकालका लागि बन्द भयो",
  "descEn": "All grades are cancelled.",
  "descNp": "सबै कक्षा स्थगित",
  "dateEn": "Chaitra 25, 2081 BS",
  "dateNp": "२५ चैत २०८१",
  "isNew": true
}
```

### DB-05: Team Member Category Poisoning
An administrator user types an unsupported department category for a teacher.
```json
// POST /team_members/some_teacher
{
  "id": "some_teacher",
  "category": "super-teachers", 
  "nameEn": "Dr. Wrong Category",
  "nameNp": "गलत केटेगरी",
  "roleEn": "Trainer",
  "roleNp": "प्रशिक्षक",
  "order": 1
}
```

### DB-06: News Title Overload (Denial of Wallet)
Pushing an incredibly long title string (exceeding length bounds) to crash database rendering or blow up sizing costs.
```json
// POST /news_and_events/news_01
{
  "id": "news_01",
  "titleEn": "Lorem Ipsum is simply dummy text... [REPEATED 10,000 times]",
  "titleNp": "शीर्षक",
  "descEn": "Short text",
  "descNp": "छोटो पाठ",
  "type": "news"
}
```

### DB-07: Ghost-Field injection in Photogallery
Injecting unwhitelisted/shadow fields to carry secret commands or pollute UI layouts.
```json
// POST /gallery_images/gall_01
{
  "id": "gall_01",
  "src": "https://picsum.photos/600",
  "titleEn": "Assembly",
  "titleNp": "प्रार्थना सभा",
  "phantomField": "malicious payload or script",
  "order": 1
}
```

### DB-08: Zero Sizing Path Poisoning (Sizing Attacks)
Creating empty-string text titles or descriptions that render as blank components.
```json
// POST /notices/empty_notice
{
  "id": "empty_notice",
  "titleEn": "",
  "titleNp": "",
  "descEn": "",
  "descNp": "",
  "dateEn": "2081 BS",
  "dateNp": "२०८१",
  "isNew": true
}
```

### DB-09: Invalid Database-Reference ID Hijack
Creating an entry using a document ID containing path-traversal/wildcard characters.
```json
// POST /team_members/../invalid_path/admins
{
  "id": "../invalid_path/admins",
  "category": "faculty",
  "nameEn": "Invader",
  "nameNp": "घुसपैठिया",
  "roleEn": "Educator",
  "roleNp": "शिक्षक",
  "order": 5
}
```

### DB-10: Fake Database-Entry with Wrong Order Type
Trying to insert a staff member with a string value for the sorting order.
```json
// POST /team_members/staff_order
{
  "id": "staff_order",
  "category": "support",
  "nameEn": "Hari Lal",
  "nameNp": "हरी लाल",
  "roleEn": "Peon",
  "roleNp": "कार्यालय सहयोगी",
  "order": "first-one"
}
```

### DB-11: Bypass Sibling Verification on Achievements
A user updating achievements to a blank type or injecting garbage properties without setting required fields.
```json
// POST /achievements/ach_99
{
  "id": "ach_99",
  "titleEn": "Achievement",
  "value": "Top Award"
}
```

### DB-12: Singleton Homepage Structure Deletion
A user trying to completely wipe out or modify homepage configurations to empty objects.
```json
// POST /homepage_configurations/random_id
{
  "id": "random_id",
  "welcomeTitleEn": "Wiped out"
}
```

---

## 3. Test Runner

An automated test suite (`firestore.rules.test.ts`) must compile and run these validations using the Firebase Local Emulator (or programmatic checks), verifying that all 12 payloads trigger security rule fails (`PERMISSION_DENIED`).
