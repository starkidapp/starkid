# StarBo — App Store & Play Store Submission Assets

## Generated Icons  (`store-assets/icons/`)

| File | Size | Where to upload |
|------|------|-----------------|
| `ios-appstore-1024.png` | 1024×1024 | App Store Connect → App Icon |
| `android-playstore-512.png` | 512×512 | Play Console → Store listing → App icon |
| `android-feature-graphic-1024x500.png` | 1024×500 | Play Console → Store listing → Feature graphic |

---

## Screenshots  (`store-assets/screenshots/`)

Open each HTML file in **Safari or Chrome**, set zoom to 100%, then:
- **Mac**: Cmd+Shift+4 → select the exact 1290×2796 area
- Or use browser DevTools → set viewport to 1290×2796 → Cmd+Shift+P → "Capture full size screenshot"

| File | Screen |
|------|--------|
| `screenshot-1-welcome.html` | App intro / branding |
| `screenshot-2-tasks.html` | Kid task list |
| `screenshot-3-kids.html` | Family / kids picker |
| `screenshot-4-rewards.html` | Stars & rankings |
| `screenshot-5-parent.html` | Parent dashboard |

**Feature graphic**: open `feature-graphic.html` at exactly **1024×500** viewport

---

## App Store Connect (iOS)

**Required screenshots per device:**
- iPhone 6.9"  → 1320×2868 px  (upload the 1290×2796 and it scales)
- iPhone 6.7"  → 1290×2796 px  ← use these
- At least 1 screenshot required, up to 10

**Steps:**
1. Log in to https://appstoreconnect.apple.com
2. My Apps → StarBo → App Store → iPhone Screenshots
3. Upload 5 screenshots from the `screenshots/` folder
4. App Icon is already embedded in the IPA (from `icon.png` 1024×1024)

---

## Google Play Console (Android)

**Steps:**
1. Log in to https://play.google.com/console
2. Store listing → Graphics
3. Upload `android-playstore-512.png` as **App icon**
4. Upload `android-feature-graphic-1024x500.png` as **Feature graphic**
5. Upload at least 2 phone screenshots (use screenshots 1–5)
6. Phone screenshots minimum size: 320px, maximum 3840px — yours are fine

---

## App Description (copy-paste ready)

**Short description (80 chars max):**
> Fun task & reward tracker that motivates kids with stars ⭐

**Full description:**
> StarBo helps parents assign tasks to their children and motivates kids to complete them by earning stars and rewards.
>
> ⭐ FOR KIDS
> • See your daily tasks and check them off
> • Earn stars for every completed task
> • Watch your star count grow every month
> • Compete on the monthly family leaderboard
>
> 👨‍👩‍👧 FOR PARENTS
> • Manage multiple kids from one dashboard
> • Create tasks with subtasks and star values
> • Give bonus stars for great behavior
> • Add penalties to teach accountability
> • Secure PIN-protected parent area
> • View full activity history per child
>
> 🏆 FEATURES
> • Works for the whole family
> • Clean, colorful, kid-friendly design
> • Offline-ready with cloud sync
> • Available in multiple languages

---

## Keywords (App Store)
kids, tasks, chores, rewards, stars, parenting, children, routine, homework, behavior

## Category
- **App Store**: Education  (primary) / Lifestyle (secondary)
- **Play Store**: Education  (primary)

## Age Rating
- **App Store**: 4+
- **Play Store**: Everyone

---

## URLs (paste into both stores)
- Privacy policy: https://starkid-ce96b.web.app/privacy-policy.html
- Support / marketing: https://starkid-ce96b.web.app/support.html
- Account deletion (Play → Data safety → "Delete account URL"): https://starkid-ce96b.web.app/delete-account.html

## Google Play — Data safety answers
- Collects data: **Yes**. Shares data with third parties: **No**.
- Encrypted in transit: **Yes**. Users can request deletion: **Yes** (in-app + URL above).
- Personal info → **Name**, **Email address**: collected, required, purpose *App functionality, Account management*.
- App activity → **Other user-generated content** (tasks, stars): collected, purpose *App functionality*.
- No location, photos, contacts, financial, health, device IDs, analytics or ads.
- Ads: **No ads**. Target audience: **18+ (parents)**. The app is set up and managed by parents. Choosing child age groups triggers the Families policy.

## App Store — App Privacy answers
- Data Linked to You: **Contact Info → Name, Email Address**; **User Content → Other User Content**. Purpose: *App Functionality*.
- Used for tracking: **No**. No Data Not Linked to You.
- Sign-in required → add a **demo parent account** (email + password + parent access code) under App Review Information.
- Account deletion: Parent Profile → Delete Account.
