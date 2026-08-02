# LifeQuest — Engineering Sprint Changelog

## Sprint: Dashboard Redesign — "Consistency over motivation, Standing over XP, Calm over dopamine"

A full presentation-layer redesign of the Dashboard and its supporting shared design tokens. No logic changed: streak calculation, Standing calculation, stores, hooks, and auth are all untouched — confirmed by the full pre-existing test suite passing unmodified in behavior (two tests needed their *selectors* updated to match new markup/copy, not their assertions).

### Hero
Rebuilt around a message-first hierarchy: **"Show Up Today. Become Unbreakable."** as the headline (Space Grotesk), "Your future isn't built tomorrow. It's built today." as a quiet supporting line (Inter), then Standing / Streak / Today's Completion as a calm three-stat row beneath — the actual data, presented with restraint instead of as a HUD. The avatar moved from a hero-dominating element to a small, unobtrusive corner chip — present (nothing was removed), but no longer competing with the message for attention.

### Color system — purple removed as the dominant identity
Redefined the *values* behind the existing `electric`/`cyan`/`magenta` tokens and every shadow/glow utility (kept the token names, so every existing `text-electric-400`, `shadow-glow`, etc. across the whole app inherits the change automatically — a systemic fix, not a file-by-file find-and-replace). New palette: matte black `#0B0B0D` (background) / `#111214` (cards) — both exact values as specified — `rgba(255,255,255,0.06)` borders, restrained amber/gold as the single accent, soft desaturated emerald/red for success/danger states. Also caught and fixed a real leftover: the `wisdom` life-attribute's color was literally `#a855f7` (bright purple) — muted the entire 8-color attribute palette to a cohesive, restrained set in the same pass.

### Background
Removed the grid overlay and the purple/blue/magenta three-layer glow entirely. Replaced with a single radial gradient at ~3.5% white opacity — deliberately close to invisible.

### Typography
Space Grotesk narrowed to exactly three places per spec: hero headline, Standing name, streak number. Section headers (previously also set in Space Grotesk from an earlier sprint) moved back to Inter — a correction, not a new decision.

### Layout & hierarchy
Reordered to the specified flow: Hero → Today's Progress (new dedicated section, promoted out of a subheading into its own calm moment) → Today's Habits → Weekly Progress → Life Quests → Journey/Attributes (secondary, grouped at the bottom). Every panel now shares one card language: `rounded-3xl`, `border-white/[0.06]`, consistent `p-6 sm:p-8` padding, unified header treatment.

### CTA hierarchy
The habit checklist is the visual anchor of its section; "Add habit" demoted to a quiet ghost-style button — text-only, no fill, no shadow.

### Habit cards
More whitespace (`p-4`→`p-5`), softer tap response (`0.88`→`0.96` scale), and the completion moment redesigned: the old "checkmark flies up and away" animation and confetti burst are gone, replaced by a single contained scale-pulse on the checkbox itself. Satisfying without being a celebration — Apple Fitness closing a ring, not Duolingo's confetti cannon.

### Weekly Progress
Added a one-line, calm interpretation of the week's actual completion data ("Consistency is building." / "You're showing up." / "Keep the chain alive.") — purely a presentational read of data the component already receives, not a new calculation feeding back into the store.

### Sidebar
Grouped the same eight nav items (nothing removed) into three labeled, spaced clusters — Overview / Insights / Account — instead of one flat list, with more breathing room around the profile card.

### Motion audit
Reviewed every Dashboard-scoped animation against "fade / translateY / opacity / gentle hover elevation only." Removed: the confetti burst on habit completion, the floating-checkmark fly-away, and an overly bouncy `0.88` tap-scale. Kept: staggered fade-up entrances, one very slow (22s) near-invisible ambient hero highlight, and the count-up number reveal — all of which already matched the "disappears into the experience" standard.

### Responsive audit
Reduced hero headline/stat sizing and stat-row gap on mobile breakpoints, and added right-side clearance so hero text can never run under the corner avatar chip on narrow screens — checked at mobile/tablet/desktop widths.

### Regressions caught and fixed before finishing
A full lint/build/test pass surfaced two real test breaks caused by the redesign itself: a header now uses a typographic curly apostrophe (`Today’s Habits`) that a test regex expected as straight; and a test located the habit-completion button by matching specific CSS classes (`rounded-xl`, `border-2`) that the redesign changed. Fixed the first by updating the regex to match the (correct, more premium) typography rather than reverting it; fixed the second properly rather than papering over it — added a real `aria-label` to the completion toggle (a genuine accessibility gap that existed before, now closed) and pointed the test at that instead of implementation-detail class names, so future visual changes won't break it again.

### Verified
`npm run lint` (0/0) → `npm run build` (clean) → `npm run test` (11/11, confirmed stable across 3 consecutive full runs after one transient timing flake unrelated to any code change) — repeated against a completely fresh clone, plus a live preview-server check confirming the new hero copy and styling are present in the actual shipped `Dashboard` chunk.

---

## Sprint: Dashboard Hero Redesign — first-impression polish only

Scoped strictly to the Dashboard's opening moment, as requested — no new features, no functional changes, no app-wide redesign. Every change below is presentation-only; all underlying data, logic, and store calls are untouched.

### What changed
- **New hero surface**: replaced the old two-card grid (a small avatar card sitting next to a "Next Standing" card) with a single, considered hero (`DashboardHero.jsx`). The avatar is now a quiet secondary chip rather than competing for attention with the headline.
- **Sophisticated dark background, no purple**: added a bespoke `.hero-surface` treatment in `index.css` — a neutral graphite gradient (`#131316` → `#0c0c0e` → `#08080a`) with soft directional highlights, scoped specifically to this hero via a new CSS class. The rest of the app's existing ambient background (which does use purple) is untouched — this was a deliberate choice to keep the change scoped to "the Dashboard's first impression" rather than reworking the app's whole visual language.
- **Typography**: the Standing name is now the clear headline (`text-5xl`/`6xl`, tight tracking, confident weight) with a proper eyebrow/label hierarchy above it, matching how Linear/Apple Fitness/Arc treat a primary stat. Section headers below (Today's Habits, This Week, Active Life Quests, Life Attributes) got a consistent, slightly more refined treatment (display font, tighter tracking) and consistent spacing rhythm (`mb-5` everywhere, `p-5 sm:p-6` panel padding) — previously these varied slightly panel to panel.
- **Refined progress bar**: the standing-progress fill moved from the app's busy orange→purple→cyan rainbow gradient to a single restrained warm-neutral tone (`.hero-progress-fill`) — quieter, more premium, and avoids purple in this specific "first impression" surface as asked.
- **Subtle premium animation**: a staggered entrance (label → headline → progress → caption, ~80ms apart, eased) instead of everything appearing at once; one slow, barely-there ambient highlight drift in the background (22s cycle, very low opacity — restrained on purpose, not a decoration that calls attention to itself); and a count-up animation for the streak number (`AnimatedNumber.jsx`), the kind of detail Apple Fitness/Linear use for stat reveals. The count-up correctly respects the app's existing Settings → Animations toggle rather than introducing a new preference.
- **Removed now-dead code**: `NextStandingCard.jsx` was fully superseded by the new hero and had no other usages anywhere in the app (confirmed via grep before deleting) — removed rather than left behind, consistent with this project's established "no unused logic" standard from earlier sprints.

### Deliberately not touched
Per "do not redesign the entire app": the global body background, Topbar, Sidebar, and every other page's visual language are unchanged. Per "do not add new features": no new data, no new interactions, no new settings — `AnimatedNumber` and the hero's ambient motion both read from data/settings that already existed.

### Verified
`npm run lint` (0/0) → `npm run build` (clean) → `npm run test` (11/11) after the change, then a full fresh-clone repeat of all three, plus a live preview-server check confirming the new hero's markup and styling are actually present in the shipped, code-split `Dashboard` chunk (not just sitting in source).

---

## Sprint: Logo Redesign — "The Ascent Line" (flame concept rejected, redesigned from scratch)

The previous flame-based mark was rejected outright — too close to gaming/RPG iconography. Redesigned from a clean slate around the brief's actual territory: a path, a horizon, a compass, quiet upward direction.

### Process
Explored and rejected two literal concepts before converging:
- **Horizon + rising sun** (a semicircle sitting on a horizontal bar): legible even at 16px, but it's one of the most well-worn pictograms in existence (weather apps, sunrise-alarm apps, countless wellness brands already use almost exactly this). Fully symmetric and static — no sense of the "subtle upward movement" the brief asked for. Discarded.
- **Three ascending bars** (a growth-chart glyph): the clearest possible semantic read of "progress," and also the single most generic one — it's the default "Analytics" tab icon in half the apps on Earth. Reads as a UI icon, not a brand mark. Discarded.

Converged on **a single tapered stroke following one gentle, continuous arc** — thick and grounded at the lower-left, thinning as it rises to the upper-right. It's built as a short segment of one large-radius circle (not a tight S-curve), so the curvature stays quiet and architectural rather than "swoosh"-like. One gesture reads simultaneously as a path, a horizon curving away, and a compass bearing, without any of them being drawn literally — closer to how the Nike swoosh or an Airbnb Bélo works (an abstract gesture, not an assembled pictogram of parts).

### Verification without reliable visual rendering feedback this session
Design iteration tools weren't returning inspectable visual output reliably mid-session, so every construction decision was verified **quantitatively** instead of by eye: bounding-box aspect ratio (locked to ~0.92–1.0, ideal for square icon framing), centroid-vs-bounding-box-center offset (the mark is intentionally asymmetric — grounded on one end, tapered on the other — so it's optically centered in the icon by centroid, not naive bounding-box centering), polygon signed-area sanity checks, and a connected-components/enclosed-holes analysis (via `scipy.ndimage`) confirming the rendered shape is a single clean silhouette with zero fragments or holes at 512px, 32px, and 16px. A real construction bug was caught this way — an earlier version of the rounded end-cap had an ambiguous 180° sweep direction that produced a 16-unit discontinuity (a self-intersecting "bowtie" fold); rebuilt with explicit direction vectors instead of interpolated angles, verified down to a sub-pixel-at-render-scale 3.5-unit segment (which turned out to just be the intentional flat tip width, not a defect).

### Shipped
- `src/components/common/LogoMark.jsx` replaced with the new mark (same `currentColor`-inheriting component interface, so all 6 existing usage sites — `LoadingScreen`, `GatewayScreen`, `AuthShell`, `Topbar`, `Sidebar`, `Landing` — picked it up automatically with no per-file changes needed).
- Full icon set regenerated from the same verified geometry: `favicon.svg`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`, `favicon-32.png`.

### Also fixed this sprint: dependency vulnerabilities
A fresh `npm install` (regenerating `package-lock.json`) surfaced 10 high-severity advisories that weren't present in the previous lockfile — newly disclosed/published since the last sprint, not caused by this sprint's changes. Investigated and resolved properly rather than blindly running `npm audit fix --force`:
- **`brace-expansion` DoS** (via a transitive `vite-plugin-pwa` → `workbox-build` → ... chain): fixed with a surgical `"overrides": { "brace-expansion": "^5.0.8" }` in `package.json`, patching the vulnerable package everywhere in the tree without downgrading `vite-plugin-pwa` and losing its features.
- **`react-router-dom`**: discovered that *every* currently-published version has some high-severity advisory — versions below 7.18.0 carry a large set of older XSS/open-redirect/DoS issues (some relevant to plain client-side `Link`/`useNavigate` usage), while 7.18.1 fixes all of those but is newly flagged for an "RSC Mode CSRF Bypass." Confirmed via exhaustive grep that LifeQuest contains zero usage of React Router's RSC/data-router/server-action APIs (`loader`, `action`, `unstable_`, `createBrowserRouter`, `<Form>`) anywhere — it's a plain client-rendered SPA using only `BrowserRouter`/`Routes`/`Route`/`Link`/`Navigate`/`useNavigate`/`useLocation`. Pinned to the exact version `7.18.1` (latest) as the correct tradeoff: fixes the broader, actually-applicable advisory set; the one remaining flagged CVE requires a feature this codebase never touches.

### Verified
Fresh-clone `npm install` → `npm run lint` (0/0) → `npm run build` (clean) → `npm run test` (11/11).

---

## Sprint: Brand Identity Implementation ("The Ascent")

Implemented the new LifeQuest brand mark across the entire codebase, replacing the placeholder `Swords` icon (lucide-react) used since the project's earliest scaffold.

### What shipped
- **`src/components/common/LogoMark.jsx`** — the production brand mark as a reusable `currentColor`-inheriting SVG React component (clean 18-point path, 24×24 viewBox matching the lucide icon grid so it drops in wherever the placeholder icon was).
- Replaced every brand-mark usage across the app: `LoadingScreen`, `GatewayScreen`, `AuthShell` (Login/Signup/Reset), `Topbar`, `Sidebar`, `Landing`. Confirmed zero remaining references to the old icon anywhere in `src/` (one unrelated `Swords` reference remains in `constants.js` — that's an achievement *badge* icon, a different design decision, not the brand logo, and intentionally left alone).
- **Full icon set regenerated and deployed**: `favicon.svg`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (with the extra safe-zone padding maskable icons require), `apple-touch-icon.png`, `favicon-32.png` — all built from the same source geometry as the React component, so the mark is pixel-consistent everywhere it appears.
- **Manifest/theme colors corrected**: both `vite.config.js`'s PWA manifest and `index.html`'s `theme-color` meta tag were still on the old navy palette (`#0a0d1f`/`#05060f`) from before an earlier "deep charcoal" background sprint — updated to the brand's actual matte black (`#0B0B0D`) so the OS-level chrome (browser tab, Android splash, task switcher) matches the icon precisely instead of a slightly-off navy.
- The Gateway Screen (the app's daily opening/splash moment) and `LoadingScreen` — the two places a "splash screen" concept actually lives in this app — both now show the real mark instead of the placeholder.

### Verified
Fresh-clone `npm install` (0 vulnerabilities) → `npm run lint` (0/0) → `npm run build` (clean, 44 PWA precache entries) → `npm run test` (11/11) → live preview server smoke test (all 6 icon files return 200, manifest JSON confirmed serving `#0B0B0D` for both theme and background color, and the mark's actual path data confirmed present in the shipped JS bundle rather than just existing as an unused source file).

---


A full architectural migration, not a patch: LifeQuest no longer has an XP economy. Progression is now governed by one rule — **discipline is binary**. Complete every due habit today, or the streak resets to zero. No partial credit, no protection, no second chances.

### Removed completely
- **XP**: `totalXp`, `xpValue` (per-habit), `xpReward` (daily/weekly quests), the entire exponential leveling curve (`utils/xp.js` deleted outright).
- **Levels**: every "Level N" display, the `deriveLevel`/`deriveAttributeLevel` functions, level-based cosmetic unlocks.
- **Coins**: `player.coins`, `coinGain`/`coinReward` on every completion/quest/achievement, the coin badge in Topbar/Sidebar/Profile/exports.
- **XP animations**: the floating "+XP" popup, the XP bar fill, the "Level Up!" modal.
- The old `RecentActivity` feed and its underlying `activity`/`extractActivity` tracking — fully removed, not just hidden.

### New core system
- **`utils/standing.js`** — `computeStreakInfo()` is a pure, fully-derived calculation from `habits` + `completions`: a day only extends the streak if *every* habit due that day was completed (checked retroactively via a new `isHabitDueOn(habit, date)` helper in `dateHelpers.js`). Days with zero due habits (e.g. a weekly habit's off-days) are neutral — they neither extend nor break the chain. This is never stored as an independently-mutated counter, so it can never drift out of sync with what actually happened.
- **The Standing Ladder**: Awakened (1) → Pathfinder (7) → Iron Will (30) → Vanguard (50) → Ascendant (100) → Warden (200) → Mythic (365) → Titan (500) → Living Legend (1000). Replaces "Level" everywhere: Sidebar, Topbar, Profile, Settings/PDF export.
- **`gameStore._recalculateStreak()`** is the single source of truth, called after every mutation that could affect it (habit completion, creation, edits, deletion). It also detects and surfaces two transient events: a Standing tier-up (`lastStandingUp`, shown via the new `StandingUpModal`) and a streak break (`lastStreakBreak`, shown via the new `StreakResetNotice`).
- **Streak-reset message**: respectful, not punitive — "The streak ended. The journey didn't." / "Every legend has restarted. Begin again." (randomly chosen, shown once per break).
- **Life attributes** kept (they suit "forging discipline" well) but rebuilt on `utils/attributes.js` — a simple linear mastery scale with qualitative tiers (Emerging/Developing/Established/Mastered), no XP curve underneath.
- **Cosmetics** (avatars, themes) now unlock by consecutive-day streak thresholds instead of level.
- **Achievements** are pure badges now — no `xp`/`coins` fields at all. Streak-based achievement thresholds mirror the Standing ladder directly for cohesion.
- **Dashboard** rebuilt: the XP hero is gone, replaced by a `NextStandingCard` (Current Standing → Next Standing with an animated day-based progress line) and a new `YourJourney` panel (Current Streak, Longest Streak, Standing, Today's Completion, Next Standing, Days Remaining) — this is what replaced Recent Activity.
- **Per-habit streaks** (shown on each habit card) are kept as a secondary, informational stat — still correctly reset on a gap via the existing `calculateStreak` helper — but they no longer drive progression; the global binary streak is the only thing that does.

### Copy pass
Every user-facing string that promised XP/leveling was rewritten: Landing page hero and feature cards, page title, meta description, PWA manifest name/description, Settings/Habits empty-state copy, and the Guild Master coach's suggestions/predictions (now framed around Standing and unbroken streaks instead of "leveling up").

### Testing
Extended the automated suite to 11 tests, including a dedicated regression test (`'has no XP, levels, or coins anywhere in player state'`) that asserts `player.totalXp` and `player.coins` are `undefined` — a permanent guarantee this migration can't quietly regress — plus a habit-completion test asserting the new streak actually increments to 1 on a fully-completed day.

### Verified
Fresh-clone `npm install` (0 vulnerabilities) → `npm run lint` (0/0) → `npm run build` (clean) → `npm run test` (11/11) → live preview server smoke test (all routes 200, Standing terminology confirmed present in the shipped JS bundle).

### Explicitly out of scope this sprint
Per direct instruction, this pass was scoped to *finishing the migration only* — no further redesign. The following ideas from the original "Tomorrow's Mission" brief are **not yet implemented** and remain honest, tracked gaps:
- Time-of-day atmosphere theming (`utils/timeOfDay.js` exists with periods/greetings/color tokens defined, but is not yet wired into the Dashboard or Gateway Screen).
- Gateway Screen time-based backgrounds (sunrise/sunset/stars).
- Global text-selection disabling (except inputs).

---

Lead-engineer pass: root-cause bug fixes, architecture review, motion design, performance, and polish. Every change below was verified with a fresh `npm install` → `npm run lint` → `npm run build` → `npm run test`, plus a live runtime smoke test against the production preview server.

---

## Priority 1 — Runtime bugs

### Fixed: "Maximum update depth exceeded" in LifeQuestForm (Habits/Quests crash)
**Root cause:** `LifeQuestForm.jsx` selected state from Zustand like this:
```js
const habits = useGameStore((s) => s.habits.filter((h) => h.status === 'active'));
```
`.filter()` returns a **new array reference every single call**. Zustand compares selector output by reference, so the store looked "changed" on every render, which triggered another render, which called the selector again — an infinite loop. Because `LifeQuestForm` is mounted unconditionally by the Quests page (the `Modal` component only hides its content visually via `AnimatePresence`; the parent component's hooks still run), the loop fired the instant the Quests page mounted. The resulting uncaught error very likely tripped the app's root `ErrorBoundary`, which stays in its crashed state until a manual reload — explaining why Habits *also* appeared broken afterward, even though it doesn't use `LifeQuestForm` at all.

**Fix:** select the raw, stable `habits` array and derive the filtered list with `useMemo`:
```js
const allHabits = useGameStore((s) => s.habits);
const habits = useMemo(() => allHabits.filter((h) => h.status === 'active'), [allHabits]);
```

**Verification:** Added a permanent regression suite (`npm run test`, 10 tests) including:
- A test that reproduces the *exact* reported crash (confirmed it throws "Maximum update depth exceeded" against the old code, confirmed it's silent against the fix).
- Full click-through interaction tests: opening the New Life Quest modal, linking a habit, submitting; opening the New Habit form, creating a habit, and completing it — not just mounting pages, but exercising the actual reported user flow.
- Smoke tests for every screen: Dashboard, Habits, Quests, Analytics, Achievements, Profile, Settings, Guild Master.

### Fixed: auth listener leak
`authStore.init()` registered a new Supabase `onAuthStateChange` listener every time it ran, with no unsubscribe. React 19's StrictMode double-invokes effects in development specifically to catch this class of bug — it would have registered two listeners and double-fired auth updates. Added a guard so `init()` only runs once, and it now returns an unsubscribe function that `App.jsx` wires into its effect cleanup.

---

## Priority 2 — Architecture review

Systematically audited every component's store usage. Fixed the following unnecessary-rerender and architecture issues:

- **`HabitCard`** (rendered once per habit, in lists on both Dashboard and Habits): was subscribing to the *entire* game store, so completing any one habit re-rendered every habit card on screen. Now selects only its own completion status (a primitive boolean — safe for reference-equality checks) and stable action references. Wrapped in `React.memo`.
- **`LifeQuestCard`**: same treatment, wrapped in `React.memo`.
- **`Habits.jsx` / `Dashboard.jsx`**: stabilized the `onEdit`/`onDelete` callbacks passed into `HabitCard` with `useCallback` (and a shared `noop` constant on Dashboard) — without this, `React.memo` on `HabitCard` would have been silently defeated by a fresh function reference every render.
- **`Dashboard.jsx`, `Quests.jsx`, `Analytics.jsx`, `Achievements.jsx`, `Profile.jsx`, `Settings.jsx`, `GuildMaster.jsx`, `Sidebar.jsx`**: converted from whole-store destructuring (`const { a, b, c } = useGameStore()`) to targeted per-field selectors, and memoized derived arrays (`filtered`, `activeQuests`, etc.) with `useMemo`. Whole-store subscriptions meant these pages re-rendered on *every* mutation anywhere in the app (a weekly challenge ticking over, an achievement unlocking elsewhere), not just changes relevant to what they display.
- **`App.jsx`**: same fix at the very top of the tree — this was the highest-impact instance, since it meant the entire router re-evaluated on every single store mutation.
- **Timer cleanup**: added a `useRef` + cleanup effect to `GatewayScreen`'s dismiss timer so a fast unmount can't fire a stale callback. (`LevelUpModal` and `AchievementToastQueue` already cleaned up their timers correctly — verified, not changed.)

**Known, intentionally out of scope:** `Login.jsx`, `Signup.jsx`, and `ResetPassword.jsx` still use whole-store `useAuthStore()` destructuring. These are single-purpose, low-traffic, pre-auth forms with no large lists or expensive children — the cost of this pattern here is not perceptible, so it was left as-is rather than spending time on a change with no real payoff.

---

## Priority 3 — Gateway Screen polish

- Added subtle **cursor-driven parallax** on the background gradient orbs (desktop only — touch devices simply never fire `pointermove`, so the autonomous drift carries the effect there).
- Added a **film grain texture** (SVG `feTurbulence`, ~3.5% opacity, overlay blend) so the gradients read as cinematic light rather than a flat digital glow.
- Added a soft **breathing glow** behind the logo mark.
- Refined quote typography (lighter weight, relaxed leading) for a more editorial, less "gamer HUD" feel.
- Added the 400 (regular) weight for Space Grotesk to Google Fonts, since the quote now uses it.
- Symmetrical "tap anywhere to continue" hint with matching pulse dots either side.

---

## Priority 4 — Motion design

- **Navigation:** replaced the sidebar's abrupt active-state background swap with a shared-layout animated pill (`layoutId`) that smoothly slides between nav items on route change. Added a matching sliding active-dot indicator to the mobile bottom nav.
- **Quest completion:** `LifeQuestCard` now detects the actual moment a quest crosses into "completed" (via a ref-tracked previous-status check, not on every render) and fires a confetti burst plus a brief scale-pulse — previously a quest just silently gained a badge.
- **Buttons:** added tactile `active:scale-90` press feedback to the quest progress +/− and delete controls, matching the press feedback already present on primary/secondary buttons.
- **Progress bars:** unified the easing on `LifeQuestCard`'s progress fill to the same cubic-bezier used elsewhere (`HabitCard`, `Topbar` XP bar) instead of a generic `transition-all`.
- Cleaned up a stray duplicate/invalid Tailwind class (`w-4.5 h-4.5 w-[18px] h-[18px]`) on sidebar nav icons found while touching that file.

*(Button press, page transitions, XP-gain popup, and progress-bar animation from the prior sprint were reviewed and left as-is — already solid.)*

---

## Priority 5 — Performance & startup

- **Route-based code splitting:** every page (`Dashboard`, `Habits`, `Quests`, `Analytics`, `Achievements`, `Profile`, `Settings`, `GuildMaster`, plus the pre-auth pages) is now loaded via `React.lazy` behind a single `Suspense` boundary, instead of being bundled into one monolithic chunk regardless of whether the page is ever visited.
  - **Before:** main JS chunk ≈154 KB (42 KB gzipped), with every page — including Analytics' Recharts usage — parsed and executed on first load.
  - **After:** main JS chunk ≈80 KB (26 KB gzipped). Each page is now its own small chunk (1–11 KB), and the 423 KB Recharts vendor bundle is fetched only if the person actually opens Analytics.
- All render-related fixes in Priority 2 double as performance fixes (fewer components re-rendering per state change, memoized derivations instead of recomputing/reallocating arrays every render).

---

## Priority 6 — Polish

- Removed the invalid duplicate Tailwind width/height class on sidebar icons (cosmetic no-op before, now clean).
- Verified no stray references to the old Orbitron font remain anywhere in the codebase after the Space Grotesk migration.
- Added the missing 400-weight font declaration that the Gateway Screen's new typography needed (would otherwise have silently fallen back to a heavier synthesized weight).

---

## Testing infrastructure (new)

Added a real, permanent automated test suite — not just manual verification:
- **Vitest + jsdom + React Testing Library + user-event**, configured in `vitest.config.js` / `src/test/setup.js`.
- `npm test` runs 10 tests: a regression test for the exact reported crash, full click-through flows for creating/completing habits and creating/linking life quests, and mount-smoke tests for all 8 app screens.
- jsdom polyfills added for `ResizeObserver` (Recharts), `matchMedia`, and a full fake Canvas 2D context (`canvas-confetti`) so the suite runs cleanly with zero unhandled errors.
- This suite is what proves the Priority 1 fix is real and durable — it's not just "it worked when I clicked around," it's a test that fails loudly against the old code and passes against the fix.

---

## Final verification (fresh-clone simulation)

Performed against a completely fresh copy of the project (deleted `node_modules`, `dist`, `package-lock.json`, reinstalled from scratch) — exactly what a new developer would experience:

| Step | Result |
|---|---|
| `npm install` | ✅ 0 vulnerabilities |
| `npm run lint` | ✅ 0 warnings, 0 errors |
| `npm run build` | ✅ clean, PWA assets generated (44 precache entries) |
| `npm run test` | ✅ 10/10 passing |
| App launches (`npm run preview`) | ✅ `/` → 200 |
| Navigation (deep links) | ✅ `/app/habits`, `/app/analytics` → 200 via SPA fallback |
| PWA | ✅ manifest, service worker, all 5 icon files → 200 |

---

## Known remaining issues / honest scope notes

- **Login/Signup/ResetPassword** still use whole-store auth subscriptions (see Priority 2 note above) — low priority, no perceptible cost, left alone deliberately.
- **`lucide-react` vendor chunk is ~630 KB** (156 KB gzipped) because several components need to look up icons dynamically by name (user-selected habit icons, achievement icons) via a namespace import (`import * as Icons from 'lucide-react'`), which defeats tree-shaking for those specific files. This is now isolated in its own cached vendor chunk and only affects first-visit cost, not subsequent navigation — a deliberate tradeoff for the dynamic-icon-picker feature, not an oversight.
- **Supabase debounced sync** uses a single module-level timer; extremely rapid account switching (logout, then a different login, within the ~1.2s debounce window) could theoretically drop the first account's final sync. Only relevant when Supabase is actually configured (the app ships in local Demo Mode by default) and is a very narrow edge case — noted rather than fixed this sprint.
- The Guild Master "AI coach" remains rule-based/local rather than calling an external LLM (as previously documented) — unchanged this sprint.
