# Dola Foundation — Design System Reference

This document describes the visual design of the Next.js app (`/nextjs-app`) exactly as implemented in code: colors, shapes/curves, layout, and page-by-page differences — for **frontend (public site)** and **admin panel** separately. Use this as the source of truth before changing any styling, so changes are made consistently instead of per-page.

Structure:
1. **Global / Common** — tokens and shared classes used everywhere. Change these once, they apply everywhere.
2. **Frontend — page by page**
3. **Admin — page by page**
4. **Known inconsistencies** — real deviations found in the code that should eventually be cleaned up or deliberately standardized.

---

## 1. GLOBAL / COMMON (defined once, used everywhere)

### 1.1 Brand colors (CSS variables, `app/globals.css` + `tailwind.config.ts`)

These four are the **only true brand tokens**. They're stored as CSS variables (RGB triplets) so the admin **Settings page** can override them per-deployment at runtime.

| Token | Tailwind class | Default hex | CSS var |
|---|---|---|---|
| Primary (blue) | `bg-primary` / `text-primary` | `#0F3D8C` | `--tw-primary: 15 61 140` |
| Gold (accent) | `bg-gold` / `text-gold` | `#F4B400` | `--tw-gold: 244 180 0` |
| Green | `bg-green` / `text-green` | `#1F9D55` | `--tw-green: 31 157 85` |
| Dark | `bg-dark` / `text-dark` | `#1A1A2E` | `--tw-dark: 26 26 46` |

Each also has a full 50–900 tint/shade scale in `tailwind.config.ts` (e.g. `primary-700 = #0B2E6A`, `gold-500 = #C49000`, `green-600 = #187D44`) for hover states.

Admin's `app/(admin)/layout.tsx` re-injects these same three vars from the `siteSettings` DB row, falling back to the defaults above. **This means brand color can be changed live from Settings → Branding without a code deploy** — both frontend and admin pick it up automatically since they read the same CSS vars.

shadcn/ui structural colors (background, border, ring, muted, etc.) are separate HSL tokens, mostly grayscale, used by UI primitives (Input, Select, Dialog) — not brand colors, don't change these for branding.

### 1.2 Background grays (not formal tokens, but used everywhere)

- `#F8FAFC` — the de facto "soft section background." Used as `bg-background` (frontend alt sections) and as a **hardcoded arbitrary value `bg-[#F8FAFC]`** in ~10 places across admin (stat boxes, page shell, contact detail pane). **Not currently a named token** — see Inconsistencies §4.1.
- `gray-50` through `gray-400` — standard Tailwind grays for body text (`text-gray-600`), borders (`border-gray-100`), muted labels (`text-gray-400`/`text-gray-500`).

### 1.3 Status/semantic colors (badges)

Defined once in `components/ui/badge.tsx`, reused by every status badge in both admin and frontend wherever applicable:

| Variant | Classes | Used for |
|---|---|---|
| `pending` | `bg-yellow-100 text-yellow-800` | Draft, Pending donation, Upcoming project |
| `approved` | `bg-green-100 text-green-800` | Published, Active, Ongoing, Completed donation |
| `rejected` | `bg-red-100 text-red-800` | Failed donation, rejected role |
| `active` / `completed` | `bg-blue-100 text-blue-800` | Completed project, Active role |
| `gold` | `bg-gold text-dark` | one-off accent badge |
| `green` | `bg-green text-white` | one-off accent badge |
| `default` | `bg-primary text-white` | generic |

⚠️ Several of these variants render **identically** despite meaning different things (see §4.2) — that's a code issue, not a doc error.

### 1.4 Typography

- **Headings (h1–h6):** Poppins (`font-poppins font-bold`), line-height 1.2.
  - h1: `text-4xl md:text-5xl lg:text-6xl`
  - h2: `text-3xl md:text-4xl`
  - h3: `text-2xl md:text-3xl`
  - h4: `text-xl md:text-2xl`
- **Body:** Inter (`font-inter`), line-height 1.7, base color `text-gray-600` for paragraphs.
- Section heading pattern: `.section-title` (`font-poppins text-3xl md:text-4xl font-bold text-dark`) + `.section-subtitle` (`font-inter text-gray-600 text-lg mt-4`).

### 1.5 Border-radius scale (the "curve" system)

Base radius variable: `--radius: 0.75rem` (12px), used by shadcn's `rounded-lg/md/sm` tokens. On top of that, the app has its own informal scale used directly via Tailwind utility classes:

| Class | Px (approx) | Used for |
|---|---|---|
| `rounded-full` | pill/circle | All buttons (`Button` component), all badges, social icon circles, filter pills, toggle switches |
| `rounded-3xl` | 24px | Hero "blob" frame on homepage, big feature panels (Donation/Volunteer CTA, Mission/Vision cards, Founder card, login card) |
| `rounded-2xl` | 16px | **The dominant card radius** — almost every card, panel, table container, modal (`Dialog`), image tile uses this |
| `rounded-xl` | 12px | Inputs, textareas, selects (`Input`/`Textarea`/`Select` primitives), icon chips, smaller info/alert boxes |
| `rounded-lg` | 8px | Icon-only action buttons (edit/delete), nested elements inside an already-rounded-xl/2xl parent (e.g. `SelectItem` inside `SelectContent`) |
| `rounded` (plain) | ~4px | Inline `<code>` snippets only |

One genuinely unique shape: the homepage hero image frame uses a custom blob `rounded-[3rem_6rem_3rem_6rem]` (HeroSection.tsx) — this exists nowhere else in the app and should stay homepage-only by design (it's the one "signature" shape).

The homepage also has the only SVG wave-divider (3 layered paths transitioning into the next section) — also homepage-exclusive.

### 1.6 Shared button styles

All real buttons go through `components/ui/button.tsx` (cva-based), always `rounded-full`, with `hover:-translate-y-0.5 active:translate-y-0` lift animation:

| Variant | Style |
|---|---|
| `default` | gold bg, dark text, `shadow-gold` |
| `primary` | primary bg, white text, `shadow-blue` |
| `green` | green bg, white text, `shadow-green` |
| `outline` | 2px primary border, transparent bg → fills primary on hover |
| `outline-white` | 2px white border (for dark backgrounds) |
| `destructive` | red |
| `secondary` / `ghost` / `link` | neutral utility variants |

Equivalent CSS-class versions exist in `globals.css` for non-React-component usage: `.btn-primary` (gold), `.btn-secondary` (primary blue), `.btn-green`, `.btn-outline-white`.

**Separately**, every admin manager page hand-rolls its own small **icon-only action buttons** (edit/delete/toggle) that do NOT use the `Button` component — these are bare `<button>` elements styled `p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg` (edit) / `hover:text-red-500 hover:bg-red-50 rounded-lg` (delete). This is a deliberate second button family for compact table-row actions — keep it that way, just keep the colors/radius consistent (see §4.3 for where it currently isn't).

### 1.7 Shared card/input styles

- `.card-base` (CSS class): `bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300` — used directly as a className string almost everywhere instead of the `Card` React component (which exists but is barely used).
- `.input-base`: `border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/10` — the documented spec. The actual `Input`/`Textarea`/`Select` components use `focus:ring-primary/20` (double the documented opacity) — a tiny but real drift between the doc-intent and the shipped component.
- `.label-base`: `text-sm font-medium text-gray-700 mb-1.5`.

### 1.8 Shadows

| Class | Use |
|---|---|
| `shadow-card` | default card elevation: `0 4px 24px rgba(15,61,140,0.08)` |
| `shadow-card-hover` | hover elevation: `0 8px 40px rgba(15,61,140,0.16)` |
| `shadow-gold` / `shadow-blue` / `shadow-green` | colored glow under matching buttons |

### 1.9 Motion conventions (frontend only — admin has none)

- Scroll-reveal: `initial{opacity:0,y:20-30} → whileInView{opacity:1,y:0}`, `viewport:{once:true}`, `duration:0.5-0.6s`.
- Stagger: `delay: index * 0.08–0.1s` for grids of cards.
- Hover: `hover:-translate-y-1` (cards), `scale-110` (images/icons).
- Hero-only: floating blob loops (`y:[0,-12,0]`, 5–6s `Infinity`), entrance animation on page load instead of viewport trigger.
- Admin pages use **zero** framer-motion — everything is CSS `transition-all`/`transition-colors` only. This is intentional and fine — don't add motion to admin without a reason.

---

## 2. FRONTEND — PAGE BY PAGE

> Only what differs from §1 is listed. Anything not mentioned uses the global pattern.

### Home (`/`)
- **Hero gradient/blob:** signature blob frame + 3-layer SVG wave divider (homepage-exclusive, see §1.5).
- **Program card gradients (unique palette, 6 colors):** blue `from-blue-500 to-blue-700`, green `from-green-500 to-green-700`, gold `from-yellow-500 to-orange-600`, teal `from-emerald-500 to-teal-700`, purple `from-purple-500 to-purple-700`, pink `from-pink-500 to-rose-600`.
- Stat strip with vertical `w-px h-8 bg-gray-100` dividers.
- SuccessStories: giant watermark `Quote` icon at `text-primary/10`, literal `★` star characters (not an icon).
- Gallery preview: hover slide-up captions, `grid-cols-2 sm:grid-cols-3 md:grid-cols-5`.
- DonationCTA: ৳ amount selector chips.

### About (`/about`)
- Hero: 3-stop gradient `from-primary via-[#0d3578] to-green` (the *via* mid-stop is unique to this page).
- Avatar fallbacks: initials on solid color from a 6-color rotation (`bg-primary/green/gold/purple-600/pink-500/teal-500`).
- Emoji stat icons (🏛️❤️📍👥) instead of lucide icons.
- No framer-motion except the shared `SectionHeader`.

### Contact (`/contact`)
- Hero: 2-stop `from-dark to-primary` (no green — the only page besides Blog using this combo).
- Real brand colors for social icons: Facebook `#1877f2`, Twitter `#1da1f2`, YouTube `#ff0000`, Instagram `from-pink-500 to-orange-400` — intentionally NOT the site's gold/green/primary palette, since these represent external brands.
- Compact padding (`py-12`) vs. the site's usual `py-16 md:py-24` — Contact is deliberately tighter.
- Static — no animation at all.

### Donate (`/donate`)
- Hero badge has a border (`bg-gold/20 border-gold/30 text-gold`) — every other page's hero badge is borderless white.
- Payment-method swatches: BKASH pink-50, NAGAD orange-50, ROCKET purple-50, BANK_TRANSFER blue-50, STRIPE indigo-50, PAYPAL sky-50 — one-off colors per payment brand, selected state always flips to solid `bg-primary text-white`.
- Widest grid on the site: impact stats `grid-cols-2 md:grid-cols-3 lg:grid-cols-6`.
- Only page with a fixed-position auto-dismiss `Toast` (5s) on the frontend.

### Programs (list `/programs` + detail `/programs/[slug]`)
- Hero: `from-primary to-green` (2-stop, no via).
- Uses the same 6-color gradient palette as Home's `ProgramCard`, but **list page re-implements cards inline** rather than importing the shared `ProgramCard.tsx` component (see §4.4).
- Detail page: gradient Donate CTA vs. plain Volunteer CTA side by side — deliberate visual hierarchy (donate = primary action).

### Projects (list `/projects` + detail `/projects/[slug]`)
- Hero: `from-primary to-[#1a4da0]` (a distinct navy, also used on Donate's card header).
- List page has a unique filter-pill bar between hero and grid (`py-8 border-b`), not present on Programs list.
- Detail-only: milestone checklist with green `#22c55e` (done) / gray `#d1d5db` (pending) dots — a one-off pair not tied to the brand green token.
- Like Programs, the list page doesn't reuse `ProjectCard.tsx` — builds cards inline.

### Blog (list `/blog` + post `/blog/[slug]`)
- Hero: `from-dark to-primary` (matches Contact).
- Post page: category badge `bg-gold text-dark`; sidebar solid `bg-primary`; share buttons in real brand colors (`#1877f2`, `#1da1f2`).
- Uses `.prose-content` for CMS HTML body.

### Gallery (`/gallery`)
- **CSS column masonry**, not a grid: `columns-2 md:columns-3 lg:columns-4`.
- No lightbox/click-to-expand — hover-reveal only (`scale-110` zoom + slide-up caption).
- Sticky filter bar (`sticky top-20`).

### Volunteer (`/volunteer`)
- Hero: `from-green to-primary` (reversed order — the only page that leads with green).
- Multi-select chips use **two different accent colors for two different chip groups on the same form**: skills → primary blue when selected, interests → green when selected. This is intentional (visually separates the two question groups), not a bug.
- Narrowest form on the site (`max-w-3xl`).

### Privacy Policy / Terms of Use
- Structurally identical template (CMS-driven by slug).
- Only page with a heading underline flourish: `w-16 h-1 bg-primary rounded`.

---

## 3. ADMIN — PAGE BY PAGE

### 3.0 Shared Admin Shell (applies to every admin page)
- Root: `flex h-screen bg-[#F8FAFC] overflow-hidden`.
- **Sidebar:** fixed `w-64`, `bg-dark` (#1A1A2E), white text. Active nav item: `bg-primary text-white shadow-blue`. Inactive: `text-gray-400 hover:bg-white/10 hover:text-white`. Nav is grouped into collapsible sections (Content / Fundraising / Community / Site / Admin Access), not flat.
- Sign-out is the only red-tinted item in the dark sidebar: `hover:bg-red-500/20 hover:text-red-400`.
- **No top bar** — each page renders its own `<h1 className="font-poppins font-bold text-2xl text-dark">` + gray subtitle directly inside the padded content area (`p-6 md:p-8`).
- Page-level error banners: `bg-red-50 border border-red-200 text-red-600 rounded-xl p-4`. Inline form errors use the same triad but smaller padding (`p-3`).

### 3.1 Login (`/admin/login`)
- Breaks the shell entirely (full-page, no sidebar).
- Background: `bg-gradient-to-br from-primary via-[#0d3578] to-green`.
- Card: `rounded-3xl shadow-2xl` — heavier than the standard admin card (`rounded-2xl shadow-card`), deliberately so since it's the entry point.

### 3.2 Dashboard (`/admin`)
- Stat cards (`StatsCard.tsx`): `bg-white rounded-2xl shadow-card p-6`, 48px icon chip `rounded-xl` with caller-supplied tint pair (gold→`bg-yellow-50`, green→`bg-green-50`, primary→`bg-blue-50`, plus a one-off purple→`bg-purple-50`/`text-purple-500` for one stat).
- Charts (Recharts): hardcoded 5-color palette `["#0F3D8C","#F4B400","#1F9D55","#EF4444","#8B5CF6"]` — brand 3 plus a one-off red/purple for pie slices. Bars use `radius={[4,4,0,0]}` (top-rounded only) — a chart-specific curve rule not used anywhere else.
- Currency shown as ৳ (BDT) via `formatCurrency` — same helper used in Donations and frontend Donate.

### 3.3 CRUD manager pages (Programs, Projects, Blog, Team, Testimonials, Videos, Users, FAQ, Content Sections, Payment Methods, Donation Impact)
All follow one template: `page.tsx` (server data loader) + `XManager.tsx` (client component), and a shared `Dialog`-based modal for create/edit.

- **List container:** `bg-white rounded-2xl shadow-card overflow-hidden`, header strip `p-5 border-b border-gray-100` with a primary-colored icon + title.
- **Table-style managers** (Programs, Projects, Users, Blog): `<th>` = `text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase`, rows `divide-y divide-gray-50`, hover `hover:bg-gray-50/50`, row actions = icon buttons (`rounded-lg`, blue-50/red-50 hover per §1.6).
- **Card-grid managers** (Team, Testimonials, Videos): `grid sm:grid-cols-2 lg:grid-cols-4 gap-4`, each card `bg-white rounded-2xl shadow-card p-5`, action icons appear on hover (`opacity-0 group-hover:opacity-100`).
- **Flat list-row managers** (Content Sections, Payment Methods, Donation Impact, FAQ): `divide-y divide-gray-50` rows with an inline `ToggleLeft`/`ToggleRight` (green-500 when on) instead of a checkbox, plus edit/delete icons.
- Modal: `Dialog` with `max-w-lg max-h-[90vh] overflow-y-auto`, form fields stacked `space-y-4`.
- Checkbox toggles for "Published"/"Active" elsewhere are a plain unstyled `<input type="checkbox" className="w-4 h-4 rounded">` — visually inconsistent with the pill toggle switch used in Settings (see §4.6).

### 3.4 Contacts (`/admin/contacts`)
- Unique split-pane layout: `grid lg:grid-cols-2 gap-6`. Left = scrollable message list (`max-h-[600px]`), unread rows tinted `bg-yellow-50/50` with a `w-2 h-2 bg-primary` dot; selected row `bg-blue-50 border-l-4 border-primary`. Right = detail pane with a `bg-[#F8FAFC] rounded-xl p-4` sender-info block and a "Reply via Email" `bg-primary text-white rounded-xl` mailto button.

### 3.5 Donations (`/admin/donations`)
- Read-only, server-rendered, no manager component.
- 3 highlight stat tiles use translucent brand tints — `bg-gold/10 border-gold/20`, `bg-blue-50`, `bg-green-50` — a different visual treatment from `StatsCard`'s solid icon-chip pattern on the Dashboard.
- Status badges: `PENDING→pending, COMPLETED→approved, FAILED→rejected, REFUNDED→upcoming`.

### 3.6 Volunteers (`/admin/volunteers`)
- The richest admin page: its own 4-tile mini-dashboard (`bg-blue-50/yellow-50/green-50/red-50`, solid not translucent), filter-pill tabs, CSV export, and row actions as colored mini-pills (`bg-green-100 text-green-700`, `bg-red-100 text-red-600`, `bg-yellow-100 text-yellow-700`) instead of icon buttons.
- The **only** place with a bottom-right slide-in `Toast` (`bg-green-600`/`bg-red-500`, `rounded-2xl`, `animate-in slide-in-from-bottom-4`).

### 3.7 Gallery (`/admin/gallery`)
- Masonry image grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`, square tiles `aspect-square rounded-2xl`, hover overlay `bg-black/50` + delete icon, category badge overlay `bg-black/70 text-white rounded-full`.
- Upload tile: dashed drop-zone `border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary hover:bg-blue-50/50`.
- Static tip banner: `bg-blue-50 border-blue-100 rounded-2xl p-5`.

### 3.8 Payment Methods
- Masked account numbers (`••••••••`).
- Security-note banner uses **amber** (`bg-amber-50 border-amber-200 text-amber-800`) — the only place amber appears instead of yellow for a warning state.

### 3.9 Pages (Privacy Policy / Terms — `/admin/pages`)
- Master-detail layout (`lg:grid-cols-3`): left = selectable page list (`border-2 border-primary bg-blue-50` when selected), right = a raw HTML `<textarea rows={20} font-mono>` editor — **not** the rich-text Tiptap editor used by Blog (a real editing-paradigm inconsistency, §4.7).

### 3.10 Settings (`/admin/settings`)
By far the most distinct admin page — a single long form, not a CRUD list.
- ~11 sections, each its own `bg-white rounded-2xl shadow-card p-6` block, with a sticky in-page jump-nav of pill links (`bg-gray-100 hover:bg-primary hover:text-white rounded-full`) at the top.
- Native `<input type="color">` swatches (40×64px, `rounded-lg`) + monospace hex readout — only place raw color pickers are used (this is what lets admins change the 3 brand tokens at runtime, see §1.1).
- Custom pill toggle switch (`w-11 h-6 bg-gray-200 rounded-full` track, `peer-checked:bg-primary`) for booleans (Announcement on/off, Donations enabled) — the only "real" switch in the app; everywhere else uses a plain checkbox or a `ToggleLeft/Right` icon button.
- `<input type="range" accent-primary>` slider for hero banner overlay opacity.
- Fixed floating Save button bottom-right; save confirmation/error toast fixed **top-right** — a second, different toast idiom from Volunteers' bottom-right one (§4.8).

### 3.11 Error boundary (`/admin/error.tsx`)
- Centered `bg-white rounded-2xl shadow-card p-10 max-w-md` card, `w-16 h-16 rounded-full bg-red-100` circular icon badge — the only fully-circular (not rounded-xl chip) icon badge in the admin.

---

## 4. KNOWN INCONSISTENCIES (real, found in code — fix or formally accept these)

1. **`#F8FAFC` is used as a raw hardcoded hex in ~10 places** (admin shell, several stat boxes, contact detail pane) instead of being a named Tailwind color/CSS var. Recommendation: add it to `tailwind.config.ts` as e.g. `surface: "#F8FAFC"` and replace the arbitrary-value usages.

2. **Badge variants collide in meaning:** `upcoming` and `pending` render identically (yellow-100/800); `ongoing` and `approved` render identically (green-100/800); `completed` and `active` render identically (blue-100/800). The `active` variant exists but is never used — Content Sections reuses `approved`/`pending` for its Active/Disabled toggle instead. Recommendation: either accept the color reuse as intentional (same severity = same color is defensible) or rename/split variants for clarity.

3. **Three different border-radius values for "a dropdown":** the shared `Select` component uses `rounded-xl`; `ProjectsManager`'s native `<select>` uses `rounded-md`; `SettingsForm`'s native `<select>` uses `rounded-lg`. Pick one (recommend `rounded-xl` to match `Input`) and migrate the two native `<select>` usages to the shared `Select` component.

4. **`Label` component has no default text color**, unlike the documented `.label-base` (`text-gray-700`). Settings compensates by manually adding `className="label-base"` to every `<Label>`; Projects/Programs/Content managers don't, so their labels render with no explicit color. Recommendation: bake `text-gray-700` into the `Label` component itself so every page gets it automatically.

5. **Icon-button hover background isn't consistent:** Edit/Delete buttons everywhere use `hover:bg-blue-50` / `hover:bg-red-50`, but Settings' reorder-chevron buttons use `hover:bg-white`, and the Content-section toggle button has no hover background at all.

6. **Two different toast/notification idioms:** Volunteers uses a bottom-right slide-in toast; Settings uses a top-right fixed toast. Pick one position/style and standardize (recommend bottom-right, matching the frontend Donate page's toast).

7. **Two different long-text editing paradigms:** Blog posts use the Tiptap rich-text editor; Pages (Privacy/Terms) use a raw `<textarea>` with HTML. If both content types are meant to support rich formatting, Pages should probably also use Tiptap.

8. **`DataTable` and `Card` shared components are largely unused** — every manager hand-rolls equivalent markup instead of importing them. Not visually broken (the inline markup matches what `DataTable`/`Card` would produce), but it's duplicated code and any future global table/card tweak has to be repeated by hand in 8+ files instead of one.

9. **List pages don't reuse their own card components:** `/programs` doesn't use `ProgramCard.tsx`, `/projects` doesn't use `ProjectCard.tsx` — both rebuild equivalent cards inline (only the Home page sections use the real shared components). Low risk since they currently look the same, but a future style tweak to `ProgramCard.tsx` won't propagate to the `/programs` list page.

10. **Focus-ring opacity drift:** the documented `.input-base` spec says `focus:ring-primary/10`; the actual `Input`/`Textarea`/`Select` components ship `focus-visible:ring-primary/20`. Cosmetic, but worth aligning one way or the other.

---

## 5. HOW TO USE THIS DOCUMENT

- Changing a **brand color** (primary/gold/green/dark)? Change it in **Settings → Branding** (admin) — it propagates everywhere via CSS vars, no code change needed. Only touch `tailwind.config.ts`/`globals.css` defaults if you want to change the *fallback* value.
- Changing a **shape/curve** site-wide (e.g. make all cards `rounded-3xl` instead of `rounded-2xl`)? Search for `rounded-2xl` across `components/` and `app/` — there's no single token to edit because it's applied via literal Tailwind classes, not a CSS variable. This is the biggest reason the curve system feels hard to manage consistently (see §4 above).
- Changing something for **one page only**: edit that page's own file — per §2/§3 above, each page's component is self-contained and doesn't inherit page-specific styling from anywhere else. Only the items in §1 are truly global.
- Before adding a new color/shape/component variant, check §4 first — there's a good chance something similar already exists under a slightly different name.
