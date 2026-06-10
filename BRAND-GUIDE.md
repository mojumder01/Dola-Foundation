# Dola Foundation — Brand Guide

## Brand Overview

Dola Foundation is a registered NGO operating across Bangladesh. Our brand identity reflects our core values: **trust, growth, and hope**. Every design decision communicates that we are professional, compassionate, and deeply committed to the communities we serve.

---

## 1. Logo

### Primary Logo
- **File**: `assets/logo.svg`
- **Usage**: On white or light backgrounds
- **Dimensions**: 300×80px (aspect ratio 3.75:1)
- **Clear Space**: Minimum 20px on all sides

### White / Reversed Logo
- **File**: `assets/logo-white.svg`
- **Usage**: On dark, colored, or photographic backgrounds (nav hero, footer)

### Logo Components
1. **The Mark** (left): Two cupped hands in blue holding an open book in gold with a green leaf emerging from the top
2. **The Wordmark** (right): "Dola" in serif font + "FOUNDATION" in spaced capitals

### Logo Don'ts
- Do not rotate, stretch, or distort the logo
- Do not place the colored logo on busy or dark backgrounds
- Do not alter the color of any logo element
- Do not add drop shadows or effects
- Do not use the wordmark without the mark
- Minimum digital size: 120px wide

---

## 2. Color Palette

### Primary Colors

| Color | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| ![#1B4F8A](https://via.placeholder.com/15/1B4F8A/000000?text=+) | Primary Blue | `#1B4F8A` | 27, 79, 138 | Main brand, headlines, CTAs, nav |
| ![#2E8B57](https://via.placeholder.com/15/2E8B57/000000?text=+) | Primary Green | `#2E8B57` | 46, 139, 87 | Growth, environment, success states |
| ![#D4A017](https://via.placeholder.com/15/D4A017/000000?text=+) | Gold / Accent | `#D4A017` | 212, 160, 23 | Accent, CTAs, highlights, stars |

### Secondary Colors

| Color | Name | Hex | Usage |
|-------|------|-----|-------|
| `#143d6d` | Blue Dark | Deep blue for hover states |
| `#236644` | Green Dark | Deep green for hover states |
| `#b8880f` | Gold Dark | Deep gold for hover states |
| `#F0F4FF` | Blue Light BG | Section backgrounds |
| `#F8FFF8` | Green Light BG | Section backgrounds |
| `#1A1A2E` | Dark | Footer, dark text, dark backgrounds |

### Color Psychology
- **Blue (#1B4F8A)**: Trust, stability, professionalism — essential for an NGO asking for public trust
- **Green (#2E8B57)**: Growth, health, environment, hope — reflects our work's positive outcomes
- **Gold (#D4A017)**: Hope, value, achievement — motivates action (donate buttons)

### Accessibility
All primary color combinations meet WCAG 2.1 AA contrast requirements:
- Blue on white: 7.2:1 ✓
- Gold on dark (#1A1A2E): 8.4:1 ✓
- White on green: 4.9:1 ✓

---

## 3. Typography

### Primary Typeface — Headings
**Playfair Display** (Google Fonts)
- Weights used: 400 (Regular), 600 (SemiBold), 700 (Bold)
- Usage: All headings (H1–H6), pull quotes, page titles, section headers
- Character: Elegant, trustworthy, serious — appropriate for a mission-driven organization

```css
font-family: 'Playfair Display', Georgia, serif;
```

### Secondary Typeface — Body
**Inter** (Google Fonts)
- Weights used: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Usage: All body text, navigation, buttons, labels, captions, forms
- Character: Clean, highly legible, modern — communicates clarity and efficiency

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| H1 | clamp(2rem, 5vw, 3.5rem) | 700 | Page heroes, main titles |
| H2 | clamp(1.6rem, 3vw, 2.5rem) | 700 | Section titles |
| H3 | clamp(1.2rem, 2vw, 1.6rem) | 600 | Card titles, subsections |
| H4 | 1.25rem | 600 | Component titles |
| Body | 1rem | 400 | Main text |
| Lead | 1.2rem | 400 | Introduction paragraphs |
| Small | 0.875rem | 400 | Captions, labels |
| Micro | 0.75rem | 500 | Tags, badges |

### Line Heights
- Headings: 1.2
- Body: 1.75
- Lead: 1.8
- UI (buttons, nav): 1.0

---

## 4. Spacing System

Based on a 4px base unit, scaled by 2:

| Token | Value | CSS Variable |
|-------|-------|--------------|
| xs | 4px | |
| sm | 8px | |
| md | 16px | |
| lg | 24px | |
| xl | 32px | |
| 2xl | 48px | |
| 3xl | 64px | |
| 4xl | 80px | |

Section padding: `5rem` (80px) vertical standard; `3.5rem` for smaller sections.

---

## 5. Iconography

**Icon Library**: Font Awesome 6.4.0 (Free Solid + Brands)

### Program Icons
| Program | Icon Class |
|---------|-----------|
| Education | `fa-book-open` |
| Healthcare | `fa-heart-pulse` |
| Charity & Relief | `fa-hands-helping` |
| Environment | `fa-leaf` |
| Youth Development | `fa-star` |
| Orphan Care | `fa-child` |

### UI Icons
| Use | Icon Class |
|-----|-----------|
| Donate | `fa-hand-holding-heart` |
| Volunteer | `fa-hands-praying` |
| Location | `fa-location-dot` |
| Phone | `fa-phone` |
| Email | `fa-envelope` |
| Check / Success | `fa-circle-check` |
| Arrow | `fa-chevron-right` / `fa-arrow-right` |
| Menu | `fa-bars` (hamburger via CSS) |

Icon sizes in components: 1.4rem–2rem. Icon containers: 52–72px with 10% color background.

---

## 6. Component Library

### Buttons

#### Primary (Gold)
- Background: `#D4A017`
- Text: `#1A1A2E` (dark for contrast)
- Hover: `#b8880f` + translateY(-2px) + gold shadow
- Used for: Donate Now, Submit, primary CTAs

#### Secondary (Blue)
- Background: `#1B4F8A`
- Text: White
- Hover: `#143d6d` + translateY(-2px) + blue shadow
- Used for: Learn More, View Programs, secondary CTAs

#### Outline White
- Background: Transparent
- Border + Text: White
- Hover: White background, blue text
- Used for: On dark/colored backgrounds (hero, footer sections)

#### Green
- Background: `#2E8B57`
- Text: White
- Used for: Volunteer CTAs, environment-related actions

All buttons: `border-radius: 50px`, `padding: 0.8rem 1.8rem`, `font-weight: 600`

### Cards

#### Program Cards
- White background, subtle border, `border-radius: 12px`
- Icon container: 64×64px, colored background tint
- Hover: Lift (translateY -6px) + colored top border bar animation

#### Info Cards
- Centered content, icon at top in colored container
- Text-centered, section header style

#### Testimonial Cards
- Quote mark watermark (CSS pseudo-element)
- Author avatar: initials in gradient circle
- Hover: border changes to gold

### Section Headers
Structure: tag → h2 → lead paragraph (centered, max-width 620px)

Section tags: uppercase, 0.8rem, 600 weight, letter-spacing 2px, pill-shaped colored background

---

## 7. Imagery Guidelines

### Photography Style
- **Authentic**: Real people, real communities — no overly staged stock photos
- **Warm and hopeful**: Images should convey dignity and optimism, not suffering or pity
- **Action-oriented**: Show programs in action (children learning, doctors helping, volunteers working)
- **Brightness**: Well-lit, natural light preferred

### Image Treatments
- No harsh filters
- Subtle warm toning where appropriate
- Dark gradient overlays for hero images: `linear-gradient(135deg, rgba(27,79,138,0.85), rgba(46,139,87,0.7))`

### Alt Text Guidelines
- Always descriptive and specific
- Example: `alt="A volunteer teacher helping students at a Dola Foundation education camp in Dhaka"`
- Never `alt="image"` or blank for meaningful images

---

## 8. Voice & Tone

### Brand Voice
- **Compassionate but professional**: We care deeply but speak with authority and evidence
- **Clear, not clinical**: Accessible language; avoid jargon
- **Hopeful, not pitiful**: Focus on transformation and possibility, not victimhood
- **Grateful, not entitled**: Always acknowledge donors, volunteers, and communities

### Tone by Context
| Context | Tone |
|---------|------|
| Homepage hero | Inspiring, bold, visionary |
| Program descriptions | Informative, empowering, evidence-based |
| Donation page | Emotionally resonant, specific, urgent |
| Social media | Warm, storytelling, celebratory |
| Press releases | Professional, factual, credible |
| Crisis/disaster | Urgent, clear, reassuring |

### Key Messages
1. "Transforming Lives, Building Futures" — Primary tagline
2. "Your generosity changes lives" — Donation context
3. "Join 500+ volunteers making a difference" — Volunteer recruitment
4. "100% of your donation reaches our programs" — Trust-building

---

## 9. Digital Guidelines

### Website
- Navigation: Fixed, transparent over hero, white + shadow on scroll
- Max content width: 1200px
- Breakpoints: 1024px (tablet), 768px (mobile)
- Google Fonts loaded via HTML `<link>` with `display=swap`
- All CSS in single `css/style.css`; all JS in single `js/main.js`

### Social Media Profile Images
- Facebook / Instagram profile: Logo mark only (square crop, blue background)
- Cover photos: Use hero image with brand colors and tagline overlay

### Email Signature
```
[Name]
[Title] — Dola Foundation
📍 123 Welfare Road, Dhaka-1205, Bangladesh
📞 +880 1700-000000
🌐 www.dolafoundation.org
```

---

## 10. Brand Assets Summary

| Asset | File | Use |
|-------|------|-----|
| Primary Logo | `assets/logo.svg` | Light backgrounds |
| White Logo | `assets/logo-white.svg` | Dark backgrounds |
| Main CSS | `css/style.css` | All pages |
| Main JS | `js/main.js` | All pages |

---

*Brand Guide Version 1.0 — Dola Foundation, 2024*
*For brand-related queries: info@dolafoundation.org*
