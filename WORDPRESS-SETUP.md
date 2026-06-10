# WordPress + Hostinger Setup Guide — Dola Foundation

## Overview

This guide covers the complete setup of Dola Foundation's WordPress website on Hostinger hosting, including theme configuration, essential plugins, GiveWP donation system, security, performance optimization, and ongoing maintenance.

---

## 1. Hostinger Hosting Setup

### Recommended Plan
- **Plan**: Business or Premium (supports multiple websites)
- **Reason**: Comes with free SSL, daily backups, 100 GB SSD, and LiteSpeed cache
- **Domain**: Register `dolafoundation.org` (or `.org.bd` for Bangladesh)

### Initial Server Setup

1. Log in to Hostinger hPanel at `hpanel.hostinger.com`
2. Navigate to **Hosting → Manage**
3. Set PHP version to **8.2** (WordPress 6.x recommended)
4. Enable **SSL Certificate** (free Let's Encrypt via hPanel)
5. Set up email accounts: `info@`, `donate@`, `volunteer@`, `partnerships@`

### WordPress Installation via hPanel
1. Go to **Websites → Auto Installer → WordPress**
2. Fill in: Site Title = "Dola Foundation", Admin Username (not "admin"), strong password
3. Select language: **English**
4. Click Install — WordPress installs in ~2 minutes
5. Log in at `yourdomain.org/wp-admin`

---

## 2. Initial WordPress Configuration

### General Settings
- **Site Title**: Dola Foundation
- **Tagline**: Transforming Lives, Building Futures
- **Site Address**: https://dolafoundation.org (with www redirect)
- **Timezone**: Asia/Dhaka (UTC+6)
- **Date Format**: F j, Y | **Time Format**: g:i a
- **Week starts on**: Sunday

### Permalinks
- Go to **Settings → Permalinks**
- Select: **Post name** (`/%postname%/`)
- Click Save Changes (this generates correct `.htaccess`)

### Reading Settings
- Set homepage to a **Static page**: create "Home" and "Blog" pages
- **Blog pages show at most**: 10 posts

### Discussion Settings
- Uncheck "Allow people to submit comments on new posts" (for NGO site)
- Enable moderation for any comments

---

## 3. Essential Theme

### Recommended Theme: Astra or GeneratePress

#### Astra (Recommended for NGO)
1. Go to **Appearance → Themes → Add New → Search "Astra"**
2. Install and Activate
3. Install **Astra Pro** plugin for advanced features (annual license ~$49)

#### Configure Astra for Dola Foundation
1. Go to **Appearance → Customize**
2. **Global Colors**:
   - Primary: `#1B4F8A`
   - Secondary: `#2E8B57`
   - Accent: `#D4A017`
3. **Typography**:
   - Body Font: Inter, 16px, weight 400
   - Heading Font: Playfair Display, weight 700
4. **Header**:
   - Upload logo from `assets/logo.svg`
   - Set header height to 72px
   - Enable sticky header
5. **Footer**:
   - Set footer background: `#1A1A2E`
   - Configure 4-column footer layout

---

## 4. Essential Plugins

### Must-Have Plugins

#### A. GiveWP — Donation Management
**Plugin**: GiveWP (Free + Premium add-ons)
- Install: Plugins → Add New → Search "GiveWP"
- **Setup wizard**:
  1. Set base country: Bangladesh
  2. Currency: BDT (৳)
  3. Create test donation form

**GiveWP Configuration**:
```
Give → Settings → General
- Currency: Bangladeshi Taka (BDT)
- Currency symbol: ৳
- Currency Position: Before Amount
- Thousands separator: ,
- Decimal separator: .
```

**Creating Donation Forms**:
1. Give → Donation Forms → Add New
2. Set minimum donation: 100 BDT
3. Set suggested amounts: 500, 1000, 2500, 5000
4. Enable multi-level donation
5. Add goal (optional, for campaigns)

**GiveWP Payment Gateways** (Premium Add-ons needed):
- bKash Integration: Use SSLCommerz or ShurjoPay gateway add-ons
- PayPal: Built-in with GiveWP free
- Stripe: Requires Stripe add-on (~$99/year)

**Recommended Payment Gateway for Bangladesh**:
- **SSLCommerz** (`sslcommerz.com`) — accepts bKash, Nagad, Rocket, all banks
- Plugin: WooCommerce SSLCommerz or direct GiveWP integration
- Register at `sslcommerz.com/registration` (free for NGOs)

#### B. Yoast SEO
- Install: Search "Yoast SEO" → Install → Activate
- Run setup wizard
- Connect to Google Search Console
- Configure: Organization → Dola Foundation
- Upload logo for structured data
- Set up XML sitemap: `yourdomain.org/sitemap_index.xml`

#### C. LiteSpeed Cache
- Already available on Hostinger (LiteSpeed server)
- Install "LiteSpeed Cache" plugin
- Enable: Page Cache, Browser Cache, CSS/JS minification
- Configure CDN if needed (Hostinger includes Cloudflare)

#### D. Wordfence Security
- Install Wordfence Security (free version)
- Run initial scan
- Enable firewall
- Set up email alerts for malware/brute-force
- Enable two-factor authentication for admin account
- Block: XML-RPC, REST API for unauthenticated users (if not needed)

#### E. UpdraftPlus Backup
- Install UpdraftPlus (free)
- Configure: Daily backups to Google Drive or Dropbox
- Retention: 30 days
- Before any major update, manual backup first

#### F. Contact Form 7 or WPForms
- **WPForms Lite** (recommended for NGO ease of use)
- Create forms: Contact Us, Volunteer Application, Newsletter Signup
- Connect to Mailchimp or Sendinblue for email marketing
- Enable reCAPTCHA on all forms

#### G. Fluent SMTP
- Prevents emails going to spam
- Configure with Hostinger SMTP or SendGrid free tier
- Test all form submission emails

#### H. TablePress
- For displaying donation records, program statistics, impact tables
- Import data from CSV easily

#### I. WP Super Table / Elementor (Optional)
- If not using custom HTML theme, Elementor Free is excellent for page building
- Compatible with Astra theme
- Drag-and-drop: No coding needed for content updates

---

## 5. Creating Pages in WordPress

### Pages to Create
Match the HTML file structure:

| Page | Slug | Template |
|------|------|----------|
| Home | `/` | Front Page |
| About Us | `/about/` | Default |
| Our Programs | `/programs/` | Default |
| Volunteer | `/volunteer/` | Default |
| Donate | `/donate/` | GiveWP or Default |
| Contact | `/contact/` | Default |
| Blog / News | `/news/` | Blog |

### Navigation Menu
1. **Appearance → Menus → Create New Menu**: "Main Navigation"
2. Add pages: Home, About, Programs, Volunteer, Contact
3. Add custom button: "Donate Now" → link to `/donate/`
4. Add CSS class to Donate button: `donate-btn`
5. Add CSS: `.donate-btn > a { background: #D4A017; color: #1A1A2E; padding: 8px 20px; border-radius: 50px; }`
6. Assign to: Primary Menu location

---

## 6. GiveWP Advanced Setup

### Donation Form Settings
```
Title: "Support Dola Foundation"
Goal Amount: 500,000 BDT (monthly goal optional)
Donation Levels:
  - ৳500 — School supplies for one child
  - ৳1,000 — Medical camp medicines for a family
  - ৳2,500 — Ramadan food package
  - ৳5,000 — Annual scholarship for one student
  - Custom Amount: enabled, minimum ৳100

Recurring Donations: Enable (requires GiveWP Recurring add-on)
  - Options: Monthly (most promoted), Quarterly, Annually

Thank You Page: Create custom page with impact message
Email Receipts:
  - From Name: Dola Foundation
  - From Email: donate@dolafoundation.org
  - Receipt subject: "Thank you for your generous gift, {name}!"
```

### Donor Management
- **Give → Donors** — View all donor records
- Export to CSV for reporting
- Send follow-up emails via Give's email system
- Annual report to donors (use Mailchimp integration)

### GiveWP Reporting
- **Give → Reports** — View donation totals by date, form, source
- Connect to Google Analytics for conversion tracking
- Monthly reports: export and send to board/trustees

---

## 7. SEO Configuration (Yoast)

### Site-Wide Schema
```
Organization Name: Dola Foundation
Logo: [upload logo]
Social Profiles:
  - Facebook: https://facebook.com/dolafoundation
  - Instagram: https://instagram.com/dolafoundation
  - Twitter: https://twitter.com/dolafoundation
```

### Homepage SEO
```
SEO Title: Dola Foundation | Transforming Lives in Bangladesh
Meta Description: Dola Foundation is a registered NGO working to uplift communities through education, healthcare, and sustainable development across Bangladesh. Donate or volunteer today.
Focus Keyword: NGO Bangladesh
```

### Per-Page SEO
Configure for each page following the SEO-PLAN.md guidelines.

---

## 8. Security Hardening

### WordPress Hardening Checklist

```bash
# In wp-config.php (Hostinger file manager or FTP):

# Change default database prefix (during install, change wp_ to df_ or similar)
$table_prefix = 'df_';

# Disable file editing
define('DISALLOW_FILE_EDIT', true);

# Force SSL for admin
define('FORCE_SSL_ADMIN', true);

# Limit login attempts (use Wordfence plugin)

# Security Keys (generate new at: https://api.wordpress.org/secret-key/1.1/salt/)
define('AUTH_KEY', 'generate-unique-key');
```

### Additional Security Steps
1. Change admin username (not "admin")
2. Use strong password (20+ chars, mix of all)
3. Enable 2FA on admin account (Wordfence or Google Authenticator plugin)
4. Disable XML-RPC: Add to `.htaccess`:
   ```apache
   <Files xmlrpc.php>
     Order Deny,Allow
     Deny from all
   </Files>
   ```
5. Hide WordPress version: Add to `functions.php`:
   ```php
   remove_action('wp_head', 'wp_generator');
   ```
6. Install SSL certificate (Hostinger free Let's Encrypt)
7. Enable HTTPS redirect in `.htaccess`
8. Set up Cloudflare (free) for DDoS protection and CDN

---

## 9. Performance Optimization

### LiteSpeed Cache Settings
```
Page Cache: ✓ Enable
Browser Cache: ✓ Enable
  - Cache TTL: 604800 (7 days)
CSS Minify: ✓ Enable
JS Minify: ✓ Enable
HTML Minify: ✓ Enable
Combine CSS: ✓ Enable
Combine JS: ✓ Enable (test carefully)
Image Lazy Load: ✓ Enable
WebP Image Format: ✓ Enable (if supported)
```

### Image Optimization
- Plugin: **ShortPixel** or **Smush** for automatic image compression
- Target: All images under 200KB
- Use WebP format where supported
- Add `loading="lazy"` to all non-hero images

### Database Optimization
- Plugin: **WP-Optimize** — clean revisions, spam, transients weekly
- Database cleanup schedule: Weekly automated

### Target Performance Scores
- Google PageSpeed (Mobile): 80+
- Google PageSpeed (Desktop): 90+
- Core Web Vitals: All Green

---

## 10. Email Marketing Setup

### Mailchimp Integration (Free up to 500 contacts)
1. Create Mailchimp account at `mailchimp.com`
2. Create list: "Dola Foundation Newsletter"
3. Install WP plugin: "MC4WP: Mailchimp for WordPress"
4. Connect API key
5. Embed signup forms on homepage, footer, and volunteer page

### Automated Emails to Set Up
- Welcome email on newsletter signup
- Thank-you email after donation (via GiveWP)
- Volunteer application acknowledgment (via WPForms)
- Monthly newsletter (create in Mailchimp)
- Donor anniversary email ("It's been 1 year since your first gift!")

---

## 11. Analytics Setup

### Google Analytics 4
1. Create GA4 property at `analytics.google.com`
2. Get Measurement ID (format: G-XXXXXXXXXX)
3. Install plugin: "Site Kit by Google" (official, handles GA4 + Search Console)
4. Verify ownership via Site Kit

### Key Events to Track
- Donation form submission
- Newsletter signup
- Volunteer form submission
- Contact form submission
- Program page views
- Donate button clicks (event tracking)

---

## 12. Ongoing Maintenance Schedule

### Daily (Automated)
- Backups (UpdraftPlus)
- Security scan (Wordfence)
- Uptime monitoring (use UptimeRobot free)

### Weekly
- Check WordPress, theme, plugin updates
- Review Wordfence security log
- Moderate any comments
- Check GiveWP donation reports

### Monthly
- Apply all WordPress/plugin updates (test on staging first)
- Database cleanup (WP-Optimize)
- Review Google Analytics data
- Send newsletter to subscribers
- Update content as needed

### Quarterly
- Full security audit
- Performance audit (PageSpeed)
- Review and refresh program content
- Update donation goals and impact statistics
- Check all external links work

### Annually
- Review and renew hosting plan
- Renew SSL if not auto-renewed
- Full website content review
- Update team photos and bios
- Publish Annual Impact Report page

---

## 13. Staging Environment

Before any major update, use Hostinger's staging feature:
1. hPanel → Websites → Your site → **Staging**
2. Create staging site
3. Test updates on staging
4. Push to live only when verified working

---

## 14. Support Resources

- **Hostinger Support**: Live chat 24/7 at hpanel.hostinger.com
- **WordPress Codex**: developer.wordpress.org
- **GiveWP Docs**: givewp.com/documentation
- **Yoast Academy**: yoast.com/academy (free SEO training)
- **Wordfence Forum**: wordfence.com/wordpress-security

---

*Setup Guide Version 1.0 — Dola Foundation Technical Team*
*Last Updated: 2024 | Contact: tech@dolafoundation.org*
