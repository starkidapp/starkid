# StarBo — App Store & Play Store Submission Assets

## Regenerating everything

```
node store-assets/generate-store-assets.js
```

Builds every icon, the Play feature graphic and all framed screenshots from
`assets/images/starbo-icon.png`, `assets/images/starbo-logo.png` and the real
simulator captures in `store-assets/screenshots/raw/` (iPhone) and
`store-assets/screenshots/raw-ipad/` (iPad).

## Icons (`store-assets/icons/`)

| File                                   | Size                       | Where to upload                                            |
| -------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| `ios-appstore-1024.png`                | 1024×1024, no transparency | Only needed if asked — the app icon ships inside the build |
| `android-playstore-512.png`            | 512×512                    | Play Console → Store listing → App icon                    |
| `android-feature-graphic-1024x500.png` | 1024×500                   | Play Console → Store listing → Feature graphic             |

## Screenshots (`store-assets/screenshots/png/`)

Six per size, upload in order 1 → 6:
1 home · 2 celebrate · 3 kid-tasks · 4 kids-picker · 5 parent · 6 leaderboard

| Folder                                           | Size      | Where                                                   |
| ------------------------------------------------ | --------- | ------------------------------------------------------- |
| `iphone-6.9/`                                    | 1320×2868 | **App Store → iPhone 6.9" (required)**                  |
| `iphone-6.5/`                                    | 1284×2778 | App Store → iPhone 6.5" (optional)                      |
| `ipad-13/`                                       | 2064×2752 | **App Store → iPad 13" (required — app supports iPad)** |
| `android-phone/`                                 | 1080×1920 | Play Console → Phone screenshots                        |
| `iphone-6.7/`, `iphone-medium-*`, `iphone-duo-*` | various   | Spares for other listings                               |

## Header & search-result artwork (`store-assets/appstore-header/`)

| File                          | Size             | Where                                                   |
| ----------------------------- | ---------------- | ------------------------------------------------------- |
| `starbo-header-3840x1646.png` | 3840×1646 (21:9) | App Store Connect → Asset Library → product page header |
| `starbo-search-3840x2560.png` | 3840×2560 (3:2)  | App Store Connect → Asset Library → search result       |

Both are opaque PNGs (Apple rejects transparency). Apple crops them a little
differently per device, so preview both after uploading.

## App Store Connect (iOS)

1. https://appstoreconnect.apple.com → Apps → StarBo → your version
2. **Previews and Screenshots** → iPhone 6.9" → drag in `iphone-6.9/1…6`
3. Switch to **iPad 13"** → drag in `ipad-13/1…6`
4. Save

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

- **App Store**: Education (primary) / Lifestyle (secondary)
- **Play Store**: Education (primary)

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
- Personal info → **Name**, **Email address**: collected, required, purpose _App functionality, Account management_.
- App activity → **Other user-generated content** (tasks, stars): collected, purpose _App functionality_.
- No location, photos, contacts, financial, health, device IDs, analytics or ads.
- Ads: **No ads**. Target audience: **18+ (parents)**. The app is set up and managed by parents. Choosing child age groups triggers the Families policy.

## App Store — App Privacy answers

- Data Linked to You: **Contact Info → Name, Email Address**; **User Content → Other User Content**. Purpose: _App Functionality_.
- Used for tracking: **No**. No Data Not Linked to You.
- Sign-in required → add a **demo parent account** (email + password + parent access code) under App Review Information.
- Account deletion: Parent Profile → Delete Account.

## App Store — App Review Information → Notes (copy-paste ready)

Replace the `[...]` values with the real demo account details. Also enter the
email + password in the separate **Sign-in required** fields. Seed the demo
account with 2 kids and a few tasks before submitting — an empty or broken
demo account is a common rejection reason.

```
StarBo is a family chore and reward app. A parent signs in, adds their children, and gives them tasks. Kids earn stars for finished tasks and appear on a monthly family leaderboard.

DEMO ACCOUNT (already set up with sample kids and tasks):
• Email: [demo@yourdomain.com]
• Password: [password]
• Parent PIN (4 digits, needed to open the Parent area): [1234]
• Kid PINs (4 digits, needed to open a kid's task screen):
  - [Kid name 1]: [1111]
  - [Kid name 2]: [2222]

HOW TO TEST:
1. Sign in with the demo account above.
2. Parent area: open the Parent tab and enter the Parent PIN. Here you can add or edit kids, create tasks with subtasks and star values, and give bonus stars or penalties.
3. Kid view: from Home, tap a kid and enter that kid's PIN. Complete a task to see the star celebration.
4. Leaderboard: shows monthly star totals for the family.
5. Language: the app supports English and Arabic (right-to-left). You can switch language in the app settings.
6. Account deletion: Parent Profile → Delete Account. Please don't delete the demo account, because other reviewers may need it.

OTHER INFORMATION:
• No in-app purchases, ads, third-party tracking or analytics.
• The only data collected is the parent's name and email (for the account) and the tasks and stars users create. It is stored in Firebase and used only to run the app.
• An internet connection is needed to sign in and sync.

Contact for review questions: [your phone / email]
```

## App Store — Reply to "Information Needed" (Guideline 2.1)

Reply in **Resolution Center**, answering each point in order. Replace the
`[...]` values (type real credentials into App Store Connect, not this file).
Attach a screen recording made on a **physical iPhone** for point 1. Drop the
EAS Update line in point 4 if updates aren't shipped through EAS.

```
Hello App Review Team,

Thank you for reviewing StarBo. Please find the requested information below.

1. SCREEN RECORDING
We have attached a screen recording made on a physical iPhone. It shows sign-in, the parent area, creating a task, a child completing a task and earning stars, the leaderboard, and account deletion.

2. APP PURPOSE AND TARGET AUDIENCE
StarBo is a family chore and reward app for parents of young children. Parents often find it hard to keep children motivated with daily tasks such as homework, tidying up or brushing teeth. With StarBo, a parent creates tasks for each child and gives each task a star value. Children check off finished tasks, earn stars, and can see their progress on a monthly family leaderboard. Parents can also give bonus stars for good behavior or take stars away as a penalty.

The parent area and each child's screen are protected by their own 4-digit PIN.

3. HOW TO ACCESS AND TEST THE APP
Demo account (already set up with sample children and tasks):
• Email: eanasv@gmail.com
• Password: 112233
• Parent PIN: 6767
• Kid PINs:
  - Adam: 1111
  - Sara: 2222

Steps:
1. Open the app and sign in with the demo account.
2. Parent area: open the Parent tab and enter the Parent PIN. Here you can add children, create tasks with subtasks and star values, and give bonus stars or penalties.
3. Child view: on the Home screen, tap a child and enter that child's PIN. Complete a task to earn stars and see the celebration.
4. Leaderboard: shows each child's star total for the month.
5. Language: the app is available in English and Arabic (right-to-left).
6. Account deletion: Parent Profile > Delete Account.
No sample files or special settings are needed.

4. EXTERNAL SERVICES USED
• Google Firebase Authentication: parent sign-up, sign-in, email verification and password reset.
• Google Cloud Firestore (Firebase): stores the parent's name and email and the children, tasks and stars they create.
• Firebase Hosting: hosts our privacy policy, support and account-deletion pages.
• Expo (EAS Update): delivers app updates and bug fixes.
The app does not use payment processors, advertising, analytics, third-party tracking or AI services. There are no in-app purchases.

5. REGIONAL DIFFERENCES
The app works the same way in every region. There are no features or content specific to any region. The only difference is the language shown (English or Arabic), which the user chooses.

6. REGULATED INDUSTRY / THIRD-PARTY MATERIAL
StarBo does not operate in a regulated industry (such as finance, health, gambling or medicine) and does not include protected third-party content. All artwork and content were created for the app or are used under open-source licenses, which are listed in the app under Licenses.

Please let us know if you need anything else.

Best regards,
Eanas
```
