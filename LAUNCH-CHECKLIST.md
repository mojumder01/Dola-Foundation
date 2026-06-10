# Pre-Launch Checklist — Dola Foundation Website

## Overview
Use this checklist before launching the Dola Foundation website live. Go through every item. Do not skip sections. Check each item only when fully verified, not just reviewed.

**Target Launch Date**: _______________
**Last Updated**: _______________
**Reviewed By**: _______________

---

## Phase 1: Content & Copy

### All Pages
- [ ] All 6 HTML pages are complete (index, about, programs, volunteer, donate, contact)
- [ ] No placeholder text ("Lorem ipsum", "Coming soon", "Add content here") anywhere
- [ ] All contact information is accurate (address, phone numbers, email addresses)
- [ ] Founder name, team names, and titles are confirmed and approved
- [ ] All program names and descriptions are reviewed and approved by Program Director
- [ ] All statistics (5000+ lives, 12 programs, 8 districts, 500+ volunteers) are verified as accurate
- [ ] All testimonials are real, have been approved by the individuals quoted
- [ ] Impact figures on donate page (৳500/৳1000/৳2500/৳5000) are accurate and approved
- [ ] Payment details (bKash number, Nagad number, bank account) are verified
- [ ] Footer copyright year is current
- [ ] All social media links point to real, active accounts (or are removed if not yet set up)
- [ ] Office address is correct and matches Google Maps listing

### About Page
- [ ] Founder biography is accurate and approved
- [ ] All team member names, titles, and bios are approved
- [ ] Founding year (2015) is confirmed correct
- [ ] Mission and vision statements are board-approved

### Volunteer Page
- [ ] Registration form fields match what the volunteer team actually needs
- [ ] District list in dropdown is complete and accurate
- [ ] Current opportunity listings are current and positions actually open
- [ ] Form submission goes to the correct email/database

### Donate Page
- [ ] All donation amounts tested and working
- [ ] bKash/Nagad numbers tested and receiving
- [ ] Bank account details verified with bank
- [ ] Donation receipt/confirmation email tested
- [ ] Donor wall names have been approved for display
- [ ] GiveWP (or equivalent) donation system is live and tested

### Contact Page
- [ ] Contact form tested — emails arrive at info@dolafoundation.org
- [ ] FAQ answers reviewed and approved
- [ ] Map placeholder linked to correct Google Maps location
- [ ] Phone numbers are active and answered
- [ ] Response time stated in FAQ matches team capacity

---

## Phase 2: Technical

### HTML/CSS/JS
- [ ] All HTML pages validate (W3C Validator: validator.w3.org)
- [ ] No broken links (test with W3C Link Checker or Screaming Frog)
- [ ] All internal links work correctly
- [ ] All relative paths are correct (css/style.css, js/main.js, assets/)
- [ ] Logo loads correctly on all pages (both light and white versions)
- [ ] Font Awesome icons display correctly (CDN accessible)
- [ ] Google Fonts load correctly (Inter + Playfair Display)
- [ ] CSS file loads without errors in browser console
- [ ] JavaScript has no console errors on any page

### Responsive Design
- [ ] Homepage tested on mobile (375px width — iPhone SE)
- [ ] Homepage tested on tablet (768px)
- [ ] Homepage tested on desktop (1280px+)
- [ ] All 5 inner pages tested on mobile
- [ ] Navigation hamburger works correctly on mobile
- [ ] Mobile menu closes when a link is tapped
- [ ] All forms are usable on mobile (no text overflow, easy to fill)
- [ ] Donation amount buttons display correctly on mobile
- [ ] Footer displays correctly on mobile (stacked)

### Browser Testing
- [ ] Chrome (latest) — Windows/Mac
- [ ] Firefox (latest) — Windows/Mac
- [ ] Safari (latest) — Mac/iOS
- [ ] Edge (latest) — Windows
- [ ] Chrome on Android
- [ ] Safari on iPhone

### Functionality
- [ ] Sticky nav activates correctly on scroll
- [ ] Logo switches from white to colored on scroll (or vice versa)
- [ ] Number counters animate when scrolled into view
- [ ] Scroll-to-top button appears after scrolling 300px
- [ ] Smooth scroll works for anchor links
- [ ] Accordion (FAQ) opens and closes correctly
- [ ] Donation frequency toggle works
- [ ] Donation amount selector works
- [ ] Payment method switcher shows correct detail panels
- [ ] All forms show validation errors correctly
- [ ] Newsletter form shows success message
- [ ] Volunteer form shows success message after submit
- [ ] Contact form shows success message after submit

---

## Phase 3: SEO

### Meta Tags
- [ ] Each page has a unique, keyword-optimized `<title>` tag
- [ ] Each page has a unique `<meta name="description">` (150–160 chars)
- [ ] All pages have proper Open Graph tags (og:title, og:description, og:image)
- [ ] Canonical tags present on all pages
- [ ] No duplicate title or description tags

### Technical SEO
- [ ] robots.txt file created and accessible at /robots.txt
- [ ] XML sitemap created (sitemap.xml) and submitted to Google Search Console
- [ ] Google Search Console verified and sitemap submitted
- [ ] Google Analytics 4 tracking code installed and verified (test mode)
- [ ] Google Business Profile created and verified
- [ ] All images have descriptive alt text
- [ ] All images are compressed and optimized
- [ ] Page load time under 3 seconds on 4G mobile (test with PageSpeed Insights)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1
- [ ] HTTPS enforced — HTTP redirects to HTTPS
- [ ] www redirects to non-www (or vice versa, consistently)
- [ ] Structured data (Organization schema) added to homepage

### Schema
- [ ] Organization schema markup on homepage (tested with Google Rich Results Test)
- [ ] Breadcrumb schema on inner pages
- [ ] FAQ schema on contact page
- [ ] No schema errors in Google's testing tool

---

## Phase 4: Security & Performance

### Security
- [ ] SSL certificate installed and active (padlock shows in browser)
- [ ] HTTPS forced via .htaccess or hosting settings
- [ ] No sensitive information in HTML comments
- [ ] No admin credentials, API keys, or passwords in any public file
- [ ] Contact and volunteer forms have spam protection (honeypot or reCAPTCHA)
- [ ] File upload functionality (if any) limited to safe file types
- [ ] Server does not expose directory listings (test: visit /assets/ in browser)

### Performance
- [ ] Google PageSpeed Insights score: 80+ mobile, 90+ desktop
- [ ] All images using correct formats (WebP for photos where supported)
- [ ] No render-blocking resources (defer/async JS, preload critical CSS)
- [ ] Browser caching headers configured
- [ ] CDN configured (Cloudflare or Hostinger CDN)

---

## Phase 5: Accessibility

- [ ] All images have meaningful alt text (or alt="" for decorative)
- [ ] Color contrast ratio meets WCAG 2.1 AA (use WebAIM Contrast Checker)
- [ ] All form inputs have associated `<label>` elements
- [ ] Skip-to-content link present (for keyboard users)
- [ ] Focus indicators visible when navigating by keyboard (Tab key)
- [ ] Buttons have descriptive aria-labels where needed
- [ ] Navigation has `aria-label` attributes
- [ ] Interactive elements reachable by keyboard
- [ ] Page language declared (`<html lang="en">`)
- [ ] No content relies solely on color to convey meaning

---

## Phase 6: Legal & Compliance

- [ ] Privacy Policy page created (linked from footer)
- [ ] Terms of Use page created (linked from footer)
- [ ] Cookie consent notice added (if using tracking cookies)
- [ ] NGO registration number displayed in footer (if required by BD law)
- [ ] Donor data collection has appropriate consent on forms
- [ ] Volunteer data collection has appropriate consent on forms
- [ ] All testimonials have written consent from individuals
- [ ] All photographs used have rights/permissions documented
- [ ] Financial information (bank account) is correct and authorized for publication

---

## Phase 7: Email & Communication

- [ ] All email addresses are active and receiving messages
- [ ] Contact form emails arrive in inbox (not spam folder)
- [ ] Volunteer form emails arrive in volunteer coordinator's inbox
- [ ] Donation confirmation emails working (via GiveWP or similar)
- [ ] SPF, DKIM, DMARC records configured for dolafoundation.org email
- [ ] Email signature template created for all staff
- [ ] Auto-responder set for info@ email (acknowledges receipt)

---

## Phase 8: Analytics & Tracking

- [ ] Google Analytics 4 installed and tracking (verify in Realtime report)
- [ ] Key conversion events configured (donation, volunteer, contact, newsletter)
- [ ] Google Search Console connected and sitemap submitted
- [ ] Google Business Profile active and verified
- [ ] Analytics property has at least 2 admin users (prevent lockout)
- [ ] Baseline data note created: "Site launched [date]" as GA4 annotation
- [ ] Facebook Pixel installed (if running Facebook ads)

---

## Phase 9: Backup & Hosting

- [ ] Hosting plan confirmed active and paid for at least 1 year
- [ ] Domain registered and pointing to correct hosting nameservers
- [ ] Domain auto-renewal enabled
- [ ] SSL certificate auto-renewal enabled
- [ ] Full site backup taken before launch
- [ ] Backup storage location confirmed (Google Drive, Dropbox, or Hostinger backup)
- [ ] Recovery process documented and tested

---

## Phase 10: Launch Preparation

### Pre-Launch (48 hours before)
- [ ] Staging site fully tested — all issues resolved
- [ ] Final backup taken of staging site
- [ ] Team members notified of launch date and time
- [ ] Social media posts drafted and scheduled for launch day
- [ ] Email announcement to existing contacts/donors prepared
- [ ] Press release drafted (for media outreach)

### Launch Day
- [ ] Push live site from staging to production
- [ ] Test all pages one more time on live URL
- [ ] Test all forms on live URL
- [ ] Test donation flow end-to-end
- [ ] Verify Google Analytics is tracking live traffic
- [ ] Verify SSL is active on live URL
- [ ] Submit sitemap to Google Search Console
- [ ] Post launch announcement on all social media channels
- [ ] Send email announcement to mailing list
- [ ] Share with volunteer and partner network

### Post-Launch (24–72 hours)
- [ ] Monitor Google Analytics for traffic and errors
- [ ] Monitor Search Console for crawl errors
- [ ] Monitor email inbox for issues reported by visitors
- [ ] Check server error logs for 404s and 500s
- [ ] Fix any issues discovered immediately
- [ ] Take screenshot of Google Analytics for baseline record

---

## Phase 11: Post-Launch SEO

### Week 1 After Launch
- [ ] Request indexing for all key pages in Search Console
- [ ] Google Search Console shows no manual actions
- [ ] All pages indexed (check Coverage report)
- [ ] Homepage ranking checked for brand name
- [ ] Share site URL with partner organizations for backlinks

### Month 1 After Launch
- [ ] First blog post published
- [ ] Google Business Profile has first photos uploaded
- [ ] Newsletter sent to announce website launch
- [ ] First monthly GA4 report reviewed
- [ ] Any content gaps identified and addressed

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Executive Director | | | |
| Program Director | | | |
| Tech/Website Lead | | | |
| Volunteer Coordinator | | | |

---

**Note**: Do not launch until all Phases 1–9 are fully completed and checked. Any pending items in Phase 10 (pre-launch) should be documented as known issues with a resolution deadline.

---

*Checklist Version 1.0 — Dola Foundation*
*Contact: info@dolafoundation.org*
