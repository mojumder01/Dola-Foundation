# SEO Strategy & Plan — Dola Foundation

## Executive Summary

This SEO plan is designed to grow Dola Foundation's organic search visibility in Bangladesh and among the Bangladeshi diaspora globally. The goal is to rank on the first page of Google for key NGO and charity-related searches, drive qualified traffic to the website, increase donations, and recruit volunteers.

**Target Timeline**: 6–12 months for significant ranking improvements
**Primary Search Engine**: Google (95%+ market share in Bangladesh)
**Target Geography**: Bangladesh (primary), UK, USA, Canada, Australia (diaspora)

---

## 1. Keyword Research

### Tier 1 — High Priority (Head Terms)

| Keyword | Monthly Searches (BD) | Competition | Target Page |
|---------|----------------------|-------------|-------------|
| NGO Bangladesh | 2,400 | Medium | Homepage |
| charity Bangladesh | 1,800 | Medium | Donate page |
| volunteer Bangladesh | 1,200 | Low | Volunteer page |
| donation Bangladesh | 900 | Medium | Donate page |
| education NGO Bangladesh | 800 | Low | Programs page |
| healthcare NGO Bangladesh | 600 | Low | Programs page |
| flood relief Bangladesh | 2,000+ (seasonal) | Low | Programs page |

### Tier 2 — Medium Priority (Long-tail)

| Keyword | Monthly Searches | Competition | Target Page |
|---------|-----------------|-------------|-------------|
| how to donate to NGO Bangladesh | 400 | Low | Donate page |
| volunteer opportunities Dhaka | 350 | Low | Volunteer page |
| scholarship for poor students Bangladesh | 700 | Low | Programs/Education |
| free medical camp Bangladesh | 300 | Low | Programs/Healthcare |
| orphan care organization Bangladesh | 250 | Low | Programs/Orphan |
| tree planting NGO Bangladesh | 200 | Low | Programs/Environment |
| youth development program Bangladesh | 400 | Low | Programs/Youth |
| bkash donation NGO Bangladesh | 200 | Low | Donate page |

### Tier 3 — Brand & Specific

| Keyword | Target Page |
|---------|-------------|
| Dola Foundation | Homepage |
| Dola Foundation Bangladesh | Homepage |
| Dola Foundation donate | Donate page |
| Dola Foundation volunteer | Volunteer page |
| Md. Abdul Karim NGO | About page |

### Seasonal Keywords (Campaigns)
- Ramadan charity Bangladesh (March–April)
- Eid ul-Adha donation Bangladesh (June–July)
- Flood relief donation Bangladesh (July–September)
- Winter clothes donation Bangladesh (November–December)

---

## 2. On-Page SEO

### Meta Tags — Per Page

#### Homepage (index.html)
```html
<title>Dola Foundation | NGO Bangladesh — Education, Healthcare & Relief</title>
<meta name="description" content="Dola Foundation is a registered NGO transforming lives in Bangladesh through education, healthcare, charity relief, and community development. Donate or volunteer today." />
<meta name="keywords" content="NGO Bangladesh, charity Bangladesh, donate Bangladesh, volunteer Dhaka, education NGO, healthcare NGO" />
```

#### About Page
```html
<title>About Us | Dola Foundation — Our Story, Mission & Team</title>
<meta name="description" content="Learn about Dola Foundation's journey since 2015 — our mission to uplift 5000+ lives through education, healthcare, and sustainable development across 8 districts of Bangladesh." />
```

#### Programs Page
```html
<title>Our Programs | Dola Foundation — Education, Healthcare, Relief & More</title>
<meta name="description" content="Explore Dola Foundation's 6 community programs: education scholarships, free healthcare camps, disaster relief, environment, youth development, and orphan care in Bangladesh." />
```

#### Volunteer Page
```html
<title>Volunteer in Bangladesh | Join Dola Foundation's Mission</title>
<meta name="description" content="Volunteer with Dola Foundation in Bangladesh. Join 500+ volunteers making a real difference through education, healthcare, and community development programs. Apply today." />
```

#### Donate Page
```html
<title>Donate to Dola Foundation | Support Education & Healthcare in Bangladesh</title>
<meta name="description" content="Donate to Dola Foundation via bKash, Nagad, or bank transfer. Your donation funds education, healthcare, and disaster relief for vulnerable communities in Bangladesh. 100% goes to programs." />
```

#### Contact Page
```html
<title>Contact Dola Foundation | Dhaka, Bangladesh</title>
<meta name="description" content="Contact Dola Foundation in Dhaka, Bangladesh. Reach us by phone, email, or visit our office for donations, partnerships, volunteering, or program inquiries." />
```

### Header Tag Strategy (H1–H6)
- One H1 per page — contains primary keyword
- H2 for major sections — includes secondary keywords naturally
- H3 for subsections and cards
- Never skip heading levels

### URL Structure
```
dolafoundation.org/                     (Homepage)
dolafoundation.org/about/               (About Us)
dolafoundation.org/programs/            (Programs overview)
dolafoundation.org/programs/education/  (Individual program)
dolafoundation.org/volunteer/           (Volunteer)
dolafoundation.org/donate/              (Donate)
dolafoundation.org/contact/             (Contact)
dolafoundation.org/news/                (Blog/News)
dolafoundation.org/news/[post-slug]/    (Individual posts)
```

### Image SEO
Every image must have:
```html
<img 
  src="programs/education-class.jpg"
  alt="Dola Foundation volunteers teaching children at a rural school in Dhaka"
  width="800"
  height="533"
  loading="lazy"
/>
```

Alt text rules:
- Describe what's happening AND who (Dola Foundation)
- Include location where relevant
- 80–125 characters ideal
- Never keyword-stuff

---

## 3. Technical SEO

### Site Speed (Critical for Rankings)
Target: PageSpeed Insights score 85+ on mobile

Optimization checklist:
- [ ] Enable Hostinger LiteSpeed Cache
- [ ] Compress all images to <200KB (use ShortPixel/Smush)
- [ ] Use WebP image format
- [ ] Minify CSS, JS, HTML
- [ ] Enable browser caching (7-day TTL)
- [ ] Use system font fallback while Google Fonts load (font-display: swap)
- [ ] Defer non-critical JavaScript
- [ ] Preload hero images

### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5 seconds
- **FID/INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

### XML Sitemap
Generated automatically by Yoast SEO at:
`https://dolafoundation.org/sitemap_index.xml`

Submit to:
- Google Search Console
- Bing Webmaster Tools

### robots.txt
```txt
User-agent: *
Allow: /
Disallow: /wp-admin/
Disallow: /wp-includes/

Sitemap: https://dolafoundation.org/sitemap_index.xml
```

### Schema Markup (Structured Data)

#### Organization Schema (add to homepage `<head>`)
```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Dola Foundation",
  "url": "https://dolafoundation.org",
  "logo": "https://dolafoundation.org/assets/logo.svg",
  "description": "Dola Foundation is a registered NGO transforming lives through education, healthcare, and sustainable development across Bangladesh.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Welfare Road",
    "addressLocality": "Dhaka",
    "postalCode": "1205",
    "addressCountry": "BD"
  },
  "telephone": "+8801700000000",
  "email": "info@dolafoundation.org",
  "foundingDate": "2015",
  "areaServed": "Bangladesh",
  "sameAs": [
    "https://facebook.com/dolafoundation",
    "https://instagram.com/dolafoundation",
    "https://twitter.com/dolafoundation"
  ]
}
```

#### FAQ Schema (Contact page / FAQ sections)
Add FAQPage schema for each question-answer pair in the FAQ accordion. This can generate FAQ rich results in Google SERPs.

#### Breadcrumb Schema
Add BreadcrumbList schema to all inner pages.

#### Event Schema
For medical camps, tree planting drives, and other events — use Event schema to appear in Google Events.

---

## 4. Google Search Console Setup

### Step-by-Step Setup
1. Go to `search.google.com/search-console`
2. Click "Add property" → URL prefix → `https://dolafoundation.org`
3. Verify via one of:
   - HTML tag (paste in `<head>` of homepage)
   - Google Analytics (if GA4 already installed)
   - DNS record (via Hostinger DNS management)
4. Submit sitemap: Add Property → Sitemaps → Enter `sitemap_index.xml`

### Key Reports to Monitor Weekly
- **Performance**: Impressions, clicks, average position, CTR
- **Coverage**: Index status, crawl errors, excluded pages
- **Core Web Vitals**: LCP, CLS, INP scores
- **Mobile Usability**: Mobile-specific errors
- **Links**: External links pointing to your site

### Search Console Actions (Monthly)
- Review top performing queries — are they relevant?
- Identify pages with high impressions but low CTR → improve meta titles/descriptions
- Fix any crawl errors immediately
- Request indexing for new/updated pages
- Monitor for manual actions (penalties)

---

## 5. Google Analytics 4 Setup

### Property Setup
1. Go to `analytics.google.com`
2. Create property: "Dola Foundation Website"
3. Get Measurement ID: `G-XXXXXXXXXX`
4. Install via "Site Kit by Google" WordPress plugin OR manually in HTML `<head>`

### Key Events to Configure

#### Custom Conversions (Mark as Conversions in GA4)
- `donation_submitted` — fires on donation form success
- `volunteer_registered` — fires on volunteer form success
- `newsletter_subscribed` — fires on newsletter form success
- `contact_submitted` — fires on contact form success

#### Custom Events to Track
```javascript
// Donation button clicks
gtag('event', 'donate_button_click', {
  'button_location': 'homepage_hero'
});

// Volunteer button clicks
gtag('event', 'volunteer_cta_click', {
  'button_location': 'volunteer_page'
});

// Program page views
gtag('event', 'program_view', {
  'program_name': 'education'
});
```

### GA4 Audiences to Create
- Donors (completed donation conversion)
- Volunteers (completed volunteer registration)
- High-intent visitors (visited donate page, 60+ seconds, no conversion)
- Returning visitors (2+ sessions)

### Monthly GA4 Report Template
Track monthly:
- Total users, new vs. returning
- Top 5 traffic sources
- Top 5 pages by views
- Conversion rates by source
- Mobile vs. desktop split
- Average session duration

---

## 6. Local SEO

### Google Business Profile
1. Go to `business.google.com`
2. Create profile:
   - Business name: Dola Foundation
   - Category: Non-profit organization
   - Address: 123 Welfare Road, Dhaka-1205
   - Phone: +880 1700-000000
   - Website: dolafoundation.org
   - Hours: Sun–Thu 9am–5pm
3. Upload photos: office, programs, team
4. Add description with keywords
5. Verify via postcard or phone

### Local Citations (Bangladesh)
List Dola Foundation on:
- Bangladesh NGO Bureau directory
- GuideStar Bangladesh (if available)
- Idealist.org (international NGO directory)
- NGO Connect Bangladesh
- AllNGO.com
- Local newspaper websites (Prothom Alo, Daily Star business listings)

Ensure NAP consistency (Name, Address, Phone) across all listings.

---

## 7. Content Marketing & Blogging

### Blog Structure
URL: `dolafoundation.org/news/`

### Editorial Calendar (Monthly)

#### Weekly Blog Topics
- **Week 1**: Impact story (real beneficiary story with photos)
- **Week 2**: Program update (what happened this month in a specific program)
- **Week 3**: Educational/informational post (related to poverty, education, health in Bangladesh)
- **Week 4**: Campaign/appeal (upcoming event, donation drive, volunteer recruitment)

### High-Value Blog Post Ideas

**Education**
- "How Scholarship Programs Are Transforming Education in Rural Bangladesh"
- "5 Barriers to Girls' Education in Bangladesh (And How We're Fighting Them)"
- "Digital Literacy for Rural Children: Our 2024 Initiative"

**Healthcare**
- "Free Medical Camps: How We Reach 8,500 Patients Every Year"
- "Maternal Health Crisis in Bangladesh: What You Can Do"
- "Interview with Dr. Imran Hossain: Healthcare on the Frontlines"

**Donation & Volunteering**
- "What Your ৳1,000 Donation Actually Does"
- "A Day in the Life of a Dola Foundation Volunteer"
- "How to Donate to a Bangladesh NGO from Abroad"

### Blog SEO Best Practices
- Each post: 1,000–2,000 words
- Include relevant keywords naturally (1–2% density)
- Add internal links to related programs/donate pages
- Use images with descriptive alt text
- Add FAQ section at end of relevant posts (enables FAQ schema)
- Share on all social channels within 24 hours of publishing

---

## 8. Link Building

### High-Quality Link Targets

#### Government & NGO Directories
- Bangladesh NGO Affairs Bureau website
- UN Bangladesh website (partner news)
- UNICEF Bangladesh news/partners section

#### Media Outreach
- The Daily Star (bangladesh)
- Prothom Alo (feature stories)
- Dhaka Tribune
- bdnews24.com
- The Business Standard Bangladesh

Strategy: Press releases for major milestones (5,000 lives, new program launch, annual report).

#### Academic & Research
- BRAC Institute (research citations)
- University of Dhaka social work department

#### Diaspora Publications
- Bangla community newspapers in UK, USA, Canada
- Sylheti community websites

### Link Building Tactics
1. **PR Outreach**: Send press releases for major events
2. **Guest Posts**: Write for development sector blogs
3. **Partnerships**: Exchange links with partner NGOs
4. **Event Coverage**: Invite journalists to medical camps, tree planting
5. **Resource Pages**: Create valuable resources (e.g., "Guide to NGO volunteering in Bangladesh") that other sites will link to

---

## 9. Social Media SEO

### Platform Strategy

#### Facebook (Primary — Bangladesh)
- Post frequency: 4–5 times per week
- Content mix: 40% stories, 30% program updates, 20% campaigns, 10% general awareness
- Use Bangladesh-relevant hashtags: #NGOBangladesh #CharityBD #VolunteerBD
- Facebook ads: Boosted donation campaigns during Ramadan, Eid

#### Instagram
- Visual storytelling: Behind-the-scenes, field photos, team photos
- Reels: Short program impact videos
- Stories: Daily updates during active events
- Hashtags: #Bangladesh #NGO #SocialImpact #Community #GiveBack

#### YouTube
- Content: Program documentaries, field footage, donor testimonials
- SEO: Keyword-rich titles, descriptions, transcripts/captions
- Playlists: By program area

#### LinkedIn
- Audience: Donors, corporate partners, press, international NGOs
- Content: Impact statistics, organizational milestones, job/volunteer postings
- Frequency: 2–3 times per week

---

## 10. Measurement & Reporting

### Monthly KPI Dashboard

| Metric | Target (6 months) | Target (12 months) |
|--------|------------------|-------------------|
| Organic Sessions | 500/month | 2,000/month |
| Domain Authority | 15 | 25 |
| Indexed Pages | 50+ | 100+ |
| Google Business Reviews | 20+ | 50+ |
| Backlinks (referring domains) | 20 | 50 |
| Homepage ranking for "NGO Bangladesh" | Top 20 | Top 10 |
| Donation page conversion rate | 3% | 5% |
| Volunteer form conversion rate | 8% | 12% |

### Quarterly SEO Audit
- Check all title tags and meta descriptions (are they optimized?)
- Review keyword rankings (SEMrush free / Ubersuggest)
- Analyze top-performing content (GA4)
- Review competitor rankings
- Update content on key pages
- Check for broken links (Screaming Frog free, up to 500 URLs)
- Review Core Web Vitals

---

## 11. Tools & Resources

### Free Tools
| Tool | Use |
|------|-----|
| Google Search Console | Rankings, impressions, errors |
| Google Analytics 4 | Traffic, conversions, user behavior |
| Google Business Profile | Local SEO |
| Google PageSpeed Insights | Speed & Core Web Vitals |
| Yoast SEO plugin | On-page optimization |
| Ubersuggest (limited free) | Keyword research |
| Answer The Public | Content ideas from search questions |
| Screaming Frog (free, 500 URLs) | Technical audit |

### Paid Tools (Optional)
| Tool | Monthly Cost | Use |
|------|-------------|-----|
| Ahrefs / SEMrush | $99–$119 | Full keyword + backlink analysis |
| Canva Pro | $13 | Social media graphics |
| Mailchimp Standard | $20 | Email marketing |

---

*SEO Plan Version 1.0 — Dola Foundation*
*Review quarterly and update based on performance data*
*Contact: digital@dolafoundation.org*
