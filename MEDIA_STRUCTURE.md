# Media Files Structure Documentation

> **Last Updated:** December 2024  
> **Status:** ✅ All pages now use LOCAL media files (no external URLs)

This document provides a comprehensive guide to the media folder structure for the Rising Dot Agency website.

---

## 🚀 Quick Reference

### How to Update Any Media

1. **Find the file** using the tables below
2. **Navigate** to `public/media/[page]/[section]/`
3. **Replace** the file with the same filename
4. **Done!** No code changes needed

### Recommended File Sizes

| Type              | Format | Size        | Notes                  |
| ----------------- | ------ | ----------- | ---------------------- |
| Team Photos       | PNG    | 400×600px   | Transparent background |
| Project Images    | JPG    | 1920×1080px | High quality           |
| Case Study Images | JPG    | 1200×800px  | Landscape              |
| Service Images    | JPG    | 800×600px   | Landscape              |
| Hero Videos       | MP4    | 1920×1080px | H.264, <25MB           |
| Tech Logos        | SVG    | Any         | Vector format          |
| Social Icons      | SVG    | 24×24px     | Vector format          |

---

## 📁 Complete Folder Structure

```
public/
├── media/
│   ├── home/                    # Homepage
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── portfolio/               # Portfolio page
│   └── services/                # All service pages
│       ├── chatbot-development/
│       ├── n8n-automations/
│       ├── saas/
│       ├── seo/
│       ├── shopify/
│       ├── web-design/
│       └── wordpress/
└── videos/                      # Global videos
```

---

## 🏠 HOMEPAGE

**Page:** `app/(public)/page.tsx`

### 1. Hero Section

| Property   | Value                          |
| ---------- | ------------------------------ |
| Component  | `components/sections/Hero.tsx` |
| Media Type | CSS-based gradient animation   |
| Folder     | N/A - No media files needed    |

| File       | Purpose                    |
| ---------- | -------------------------- |
| `logo.png` | Site logo (used elsewhere) |

**Note:** Hero section now uses lightweight CSS-based gradient mesh background animation. No media files required.

### 2. Cinematic Showreel (Video)

| Property   | Value                                       |
| ---------- | ------------------------------------------- |
| Component  | `components/sections/CinematicShowreel.tsx` |
| Media Type | Video (MP4)                                 |
| Folder     | `public/videos/`                            |

| File                        | Purpose                 | Size       |
| --------------------------- | ----------------------- | ---------- |
| `showreel_desktop_16-9.mp4` | Desktop video           | 16:9 ratio |
| `showreel_mobile_9-16.mp4`  | Mobile video (optional) | 9:16 ratio |

### 3. Featured Services

| Property   | Value                                      |
| ---------- | ------------------------------------------ |
| Component  | `components/sections/FeaturedServices.tsx` |
| Media Type | Images (JPG)                               |
| Folder     | `public/media/home/featured-services/`     |

| File                      | Service               |
| ------------------------- | --------------------- |
| `n8n-automations.jpg`     | N8N Automations       |
| `chatbot-development.jpg` | Chatbot Development   |
| `web-development.jpg`     | Web Development       |
| `shopify.jpg`             | Shopify Solutions     |
| `wordpress.jpg`           | WordPress Development |
| `seo.jpg`                 | SEO Optimization      |

### 4. Tech Stack Marquee

| Property   | Value                                      |
| ---------- | ------------------------------------------ |
| Component  | `components/sections/TechStackMarquee.tsx` |
| Media Type | SVG Icons                                  |
| Folder     | `public/media/home/tech-stack-marquee/`    |

| File              | Technology   |
| ----------------- | ------------ |
| `react.svg`       | React        |
| `nextjs.svg`      | Next.js      |
| `typescript.svg`  | TypeScript   |
| `tailwindcss.svg` | Tailwind CSS |
| `nodejs.svg`      | Node.js      |
| `shopify.svg`     | Shopify      |
| `wordpress.svg`   | WordPress    |
| `figma.svg`       | Figma        |
| `vercel.svg`      | Vercel       |
| `openai.svg`      | OpenAI       |

### 5. Case Studies Carousel

| Property   | Value                                         |
| ---------- | --------------------------------------------- |
| Component  | `components/sections/CaseStudiesCarousel.tsx` |
| Media Type | Images (JPG)                                  |
| Folder     | `public/media/home/case-studies/`             |

| File                      | Case Study          |
| ------------------------- | ------------------- |
| `ecommerce.jpg`           | E-Commerce Success  |
| `saas-dashboard.jpg`      | SaaS Dashboard      |
| `workflow-automation.jpg` | Workflow Automation |
| `ai-chatbot.jpg`          | AI Chatbot          |

### 6. Premium Testimonials

| Property   | Value                                    |
| ---------- | ---------------------------------------- |
| Component  | `components/ui/premium-testimonials.tsx` |
| Media Type | Avatar Images (JPG)                      |
| Folder     | `public/media/home/testimonials/`        |

| File                  | Person          |
| --------------------- | --------------- |
| `sarah-chen.jpg`      | Sarah Chen      |
| `marcus-johnson.jpg`  | Marcus Johnson  |
| `elena-rodriguez.jpg` | Elena Rodriguez |
| `david-kim.jpg`       | David Kim       |
| `lisa-thompson.jpg`   | Lisa Thompson   |

### 7. Holographic Team

| Property   | Value                                     |
| ---------- | ----------------------------------------- |
| Component  | `components/sections/HolographicTeam.tsx` |
| Media Type | Team Photos (PNG)                         |
| Folder     | `public/media/home/team/`                 |

| File         | Team Member |
| ------------ | ----------- |
| `alex.png`   | Alex        |
| `sarah.png`  | Sarah       |
| `marcus.png` | Marcus      |
| `emily.png`  | Emily       |
| `david.png`  | David       |
| `lisa.png`   | Lisa        |

---

## 👥 ABOUT PAGE

**Page:** `app/(public)/about/page.tsx`

### 1. Agency Showreel (Video)

| Property   | Value                                        |
| ---------- | -------------------------------------------- |
| Component  | `components/sections/AgencyShowreel.tsx`     |
| Media Type | Video (MP4)                                  |
| Folder     | `public/media/about/agency-showreel/videos/` |

| File           | Purpose               |
| -------------- | --------------------- |
| `showreel.mp4` | Agency showreel video |

### 2. Social Links

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Component  | `components/ui/social-links.tsx`   |
| Media Type | SVG Icons                          |
| Folder     | `public/media/about/social-links/` |

| File            | Platform  |
| --------------- | --------- |
| `instagram.svg` | Instagram |
| `linkedin.svg`  | LinkedIn  |
| `twitter.svg`   | Twitter/X |
| `facebook.svg`  | Facebook  |

### 3. Team Section

| Property | Value                      |
| -------- | -------------------------- |
| Folder   | `public/media/about/team/` |
| Files    | Same as Homepage team      |

### 4. Testimonials

| Property | Value                              |
| -------- | ---------------------------------- |
| Folder   | `public/media/about/testimonials/` |
| Files    | Same as Homepage testimonials      |

---

## 💼 PORTFOLIO PAGE

**Page:** `app/(public)/portfolio/page.tsx`

### 1. Hero Accordion

| Property   | Value                                           |
| ---------- | ----------------------------------------------- |
| Component  | `components/ui/interactive-image-accordion.tsx` |
| Media Type | Images (JPG)                                    |
| Folder     | `public/media/portfolio/hero/`                  |

| File              | Category    |
| ----------------- | ----------- |
| `ecommerce.jpg`   | E-Commerce  |
| `web-design.jpg`  | Web Design  |
| `ai-chatbots.jpg` | AI Chatbots |
| `automation.jpg`  | Automation  |
| `seo.jpg`         | SEO         |

### 2. Featured Projects Carousel

| Property   | Value                                              |
| ---------- | -------------------------------------------------- |
| Component  | `components/sections/FeaturedProjectsCarousel.tsx` |
| Media Type | Images (JPG)                                       |
| Folder     | `public/media/portfolio/featured-projects/`        |

| File                     | Project                 |
| ------------------------ | ----------------------- |
| `ecommerce-platform.jpg` | E-Commerce Platform     |
| `ai-chatbot.jpg`         | AI Chatbot Integration  |
| `saas-dashboard.jpg`     | SaaS Dashboard          |
| `wordpress-blog.jpg`     | WordPress Blog Platform |
| `n8n-workflow.jpg`       | N8N Workflow Automation |
| `seo-campaign.jpg`       | SEO Campaign Success    |

### 3. Portfolio Features

| Property   | Value                                        |
| ---------- | -------------------------------------------- |
| Component  | `components/sections/PortfolioFeatures.tsx`  |
| Media Type | Image (JPG)                                  |
| Folder     | `public/media/portfolio/portfolio-features/` |

| File           | Purpose             |
| -------------- | ------------------- |
| `showcase.jpg` | Main showcase image |

---

## 🛠️ SERVICE PAGES

All service pages follow the same structure with 3 media folders:

- `case-studies/` - Case study images
- `services/` - Service card images (Shopify, WordPress, Web Design only)
- `video/` - Hero video

---

### Chatbot Development

**Page:** `app/(public)/services/chatbot-development/page.tsx`

#### Video Section

| Folder | `public/media/services/chatbot-development/video/` |
| ------ | -------------------------------------------------- |
| File   | `hero-video.mp4`                                   |

#### Case Studies

| Folder | `public/media/services/chatbot-development/case-studies/` |
| ------ | --------------------------------------------------------- |

| File                         | Case Study             |
| ---------------------------- | ---------------------- |
| `customer-support-bot.jpg`   | Customer Support Bot   |
| `sales-assistant.jpg`        | Sales Assistant        |
| `whatsapp-commerce.jpg`      | WhatsApp Commerce      |
| `internal-knowledge-bot.jpg` | Internal Knowledge Bot |

---

### N8N Automations

**Page:** `app/(public)/services/n8n-automations/page.tsx`

#### Video Section

| Folder | `public/media/services/n8n-automations/video/` |
| ------ | ---------------------------------------------- |
| File   | `hero-video.mp4`                               |

#### Case Studies

| Folder | `public/media/services/n8n-automations/case-studies/` |
| ------ | ----------------------------------------------------- |

| File                      | Case Study           |
| ------------------------- | -------------------- |
| `data-sync.jpg`           | Data Sync Automation |
| `lead-processing.jpg`     | Lead Processing      |
| `report-generation.jpg`   | Report Generation    |
| `ecommerce-workflows.jpg` | E-Commerce Workflows |

---

### SaaS Development

**Page:** `app/(public)/services/saas/page.tsx`

#### Hero Image

| Folder | `public/media/services/saas/hero/` |
| ------ | ---------------------------------- |
| File   | `saas-dashboard.jpg`               |

#### Video Section

| Folder | `public/media/services/saas/video/` |
| ------ | ----------------------------------- |
| File   | `hero-video.mp4`                    |

#### Case Studies

| Folder | `public/media/services/saas/case-studies/` |
| ------ | ------------------------------------------ |

| File                     | Case Study                        |
| ------------------------ | --------------------------------- |
| `project-management.jpg` | CRM Platform / Project Management |
| `inventory-system.jpg`   | Inventory System                  |
| `hr-payroll.jpg`         | HR & Payroll                      |

---

### SEO Services

**Page:** `app/(public)/services/seo/page.tsx`

#### Video Section

| Folder | `public/media/services/seo/video/` |
| ------ | ---------------------------------- |
| File   | `hero-video.mp4`                   |

#### Case Studies

| Folder | `public/media/services/seo/case-studies/` |
| ------ | ----------------------------------------- |

| File                   | Case Study          |
| ---------------------- | ------------------- |
| `local-business.jpg`   | Local Business SEO  |
| `ecommerce-seo.jpg`    | E-Commerce SEO      |
| `technical-seo.jpg`    | Technical SEO Audit |
| `content-strategy.jpg` | Content Strategy    |

---

### Shopify Development

**Page:** `app/(public)/services/shopify/page.tsx`

#### Video Section

| Folder | `public/media/services/shopify/video/` |
| ------ | -------------------------------------- |
| File   | `hero-video.mp4`                       |

#### Case Studies

| Folder | `public/media/services/shopify/case-studies/` |
| ------ | --------------------------------------------- |

| File                    | Case Study               |
| ----------------------- | ------------------------ |
| `fashion-boutique.jpg`  | Fashion Boutique         |
| `electronics-store.jpg` | Electronics Store        |
| `subscription-box.jpg`  | Subscription Box         |
| `marketplace.jpg`       | Multi-vendor Marketplace |

#### Service Cards

| Folder | `public/media/services/shopify/services/` |
| ------ | ----------------------------------------- |

| File                          | Service                 |
| ----------------------------- | ----------------------- |
| `custom-themes.jpg`           | Custom Themes           |
| `store-setup.jpg`             | Store Setup             |
| `app-integration.jpg`         | App Integration         |
| `conversion-optimization.jpg` | Conversion Optimization |
| `payment-setup.jpg`           | Payment Setup           |
| `migration.jpg`               | Store Migration         |

---

### Web Design

**Page:** `app/(public)/services/web-design/page.tsx`

#### Video Section

| Folder | `public/media/services/web-design/video/` |
| ------ | ----------------------------------------- |
| File   | `hero-video.mp4`                          |

#### Case Studies

| Folder | `public/media/services/web-design/case-studies/` |
| ------ | ------------------------------------------------ |

| File                     | Case Study         |
| ------------------------ | ------------------ |
| `saas-landing.jpg`       | SaaS Landing Page  |
| `corporate-rebrand.jpg`  | Corporate Rebrand  |
| `creative-portfolio.jpg` | Creative Portfolio |
| `mobile-app-ui.jpg`      | Mobile App UI      |

#### Service Cards

| Folder | `public/media/services/web-design/services/` |
| ------ | -------------------------------------------- |

| File                     | Service            |
| ------------------------ | ------------------ |
| `landing-pages.jpg`      | Landing Pages      |
| `corporate-websites.jpg` | Corporate Websites |
| `portfolio-sites.jpg`    | Portfolio Sites    |
| `ui-ux-design.jpg`       | UI/UX Design       |
| `responsive-design.jpg`  | Responsive Design  |
| `brand-identity.jpg`     | Brand Identity     |

---

### WordPress Development

**Page:** `app/(public)/services/wordpress/page.tsx`

#### Video Section

| Folder | `public/media/services/wordpress/video/` |
| ------ | ---------------------------------------- |
| File   | `hero-video.mp4`                         |

#### Case Studies

| Folder | `public/media/services/wordpress/case-studies/` |
| ------ | ----------------------------------------------- |

| File                    | Case Study        |
| ----------------------- | ----------------- |
| `blog-platform.jpg`     | Blog Platform     |
| `woocommerce-store.jpg` | WooCommerce Store |
| `corporate-site.jpg`    | Corporate Site    |
| `membership-portal.jpg` | Membership Portal |

#### Service Cards

| Folder | `public/media/services/wordpress/services/` |
| ------ | ------------------------------------------- |

| File                     | Service            |
| ------------------------ | ------------------ |
| `custom-themes.jpg`      | Custom Themes      |
| `plugin-development.jpg` | Plugin Development |
| `woocommerce.jpg`        | WooCommerce        |
| `speed-optimization.jpg` | Speed Optimization |
| `security.jpg`           | Security Hardening |
| `maintenance.jpg`        | Maintenance Plans  |

---

## 📋 COMPONENT → FILE MAPPING

Quick reference to find which component uses which files:

| Component                         | Folder Path                     |
| --------------------------------- | ------------------------------- |
| `Hero.tsx`                        | `home/hero/`                    |
| `CinematicShowreel.tsx`           | `videos/`                       |
| `FeaturedServices.tsx`            | `home/featured-services/`       |
| `TechStackMarquee.tsx`            | `home/tech-stack-marquee/`      |
| `CaseStudiesCarousel.tsx`         | `home/case-studies/`            |
| `premium-testimonials.tsx`        | `home/testimonials/`            |
| `HolographicTeam.tsx`             | `home/team/`                    |
| `AgencyShowreel.tsx`              | `about/agency-showreel/videos/` |
| `social-links.tsx`                | `about/social-links/`           |
| `interactive-image-accordion.tsx` | `portfolio/hero/`               |
| `FeaturedProjectsCarousel.tsx`    | `portfolio/featured-projects/`  |
| `PortfolioFeatures.tsx`           | `portfolio/portfolio-features/` |

---

## ✅ CHECKLIST: All Media Files

### Homepage ✅

- [x] Hero logo & 3D scene
- [x] Showreel video
- [x] Featured services images (6)
- [x] Tech stack SVGs (10)
- [x] Case studies images (4)
- [x] Testimonial avatars (5)
- [x] Team photos (6)

### About Page ✅

- [x] Agency showreel video
- [x] Social link icons (4)
- [x] Team photos (6)
- [x] Testimonial avatars (5)

### Portfolio Page ✅

- [x] Hero accordion images (5)
- [x] Featured projects images (6)
- [x] Portfolio features showcase (1)

### Service Pages ✅

- [x] Chatbot: video + 4 case studies
- [x] N8N: video + 4 case studies
- [x] SaaS: hero + video + 3 case studies
- [x] SEO: video + 4 case studies
- [x] Shopify: video + 4 case studies + 6 services
- [x] Web Design: video + 4 case studies + 6 services
- [x] WordPress: video + 4 case studies + 6 services

---

## 🔄 HOW TO UPDATE MEDIA

### Replace an Image

```
1. Find the file in this document
2. Go to: public/media/[folder]/[file]
3. Replace with new file (SAME FILENAME)
4. Refresh browser
```

### Replace a Video

```
1. Find the video in this document
2. Go to: public/media/[folder]/video/ or public/videos/
3. Replace with new MP4 (SAME FILENAME)
4. Recommended: H.264 codec, <25MB
```

### Add New Media

```
1. Add file to appropriate folder
2. Update the component to reference new file
3. Component paths start with: /media/...
```

---

## 📝 NOTES

- All folders contain `.gitkeep` files to preserve structure in Git
- Videos should be MP4 format with H.264 codec for best compatibility
- Images should be optimized for web (use tools like TinyPNG)
- Team photos work best with transparent PNG backgrounds
- All external URLs (Unsplash, Pexels) have been replaced with local files
