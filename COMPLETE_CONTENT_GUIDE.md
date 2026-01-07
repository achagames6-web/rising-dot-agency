# Rising Dot Agency - Complete Content Management Guide

> **Last Updated:** January 7, 2026  
> **Version:** 2.0.0  
> **Maintainer:** Rising Dot Agency Development Team  
> **Important:** This guide documents WHERE to edit content in local files.  
> Most content stays in code (fast, no database overhead). Only blogs use database for dynamic content.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start Guide](#quick-start-guide)
3. [Admin Dashboard](#admin-dashboard)
4. [Homepage Sections (14 sections)](#homepage-sections)
5. [Service Pages (5 pages)](#service-pages)
6. [Blog System](#blog-system)
7. [Global Elements](#global-elements)
8. [Media Library](#media-library)
9. [Icon Library](#icon-library)
10. [How to Update Content](#how-to-update-content)
11. [Troubleshooting](#troubleshooting)
12. [API Reference](#api-reference)
13. [Development Guide](#development-guide)
14. [Deployment Guide](#deployment-guide)
15. [Appendix](#appendix)

---

## Overview

### Architecture

**Current Technology Stack:**

- **Framework:** Next.js 14.2.33 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4
- **Database:** MongoDB 7.0
- **Authentication:** NextAuth.js 4.24
- **Deployment:** Vercel (Edge Network)
- **CMS:** Custom CMS for selective sections
- **Content Strategy:** Hybrid (Static + Dynamic)
- **Animation:** Framer Motion 11.5
- **Icons:** Lucide React 0.555

### Content Management Philosophy

**Fast Performance Strategy:**

Rising Dot Agency follows a hybrid content management approach optimized for performance:

✅ **Most content in LOCAL FILES** (no database calls)

- ⚡ Faster page loads (no database round-trips)
- 🚀 No API overhead
- ⏱️ Immediate updates with deployments
- 📝 Version control with Git
- 🔒 Security through code review

✅ **Selected sections use CMS** (database-driven)

- 🎯 Hero section
- 💼 Services showcase
- ⚙️ Stack features
- 📚 Case studies
- ⭐ Testimonials
- 🛍️ Service pages (all 5 pages)

✅ **Only BLOGS fully database-driven**

- ✍️ Dynamic content creation
- 📝 Rich text editing
- 🖼️ Image uploads
- 🔍 SEO metadata
- 📅 Publication workflow
- 🏷️ Categories and tags

### Performance Metrics

**Current Performance Scores:**

- Lighthouse Performance: 95+
- First Contentful Paint: < 1.2s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 200ms

**Why This Approach Works:**

1. **Static content** = Instant loads (no database queries)
2. **ISR revalidation** = Fresh CMS content every 30 seconds
3. **Minimal API calls** = Reduced latency
4. **Edge caching** = Worldwide fast delivery via Vercel's CDN
5. **Code splitting** = Load only what's needed
6. **Image optimization** = Next.js automatic optimization

### Folder Structure Overview

```
rising-dot-agency/
├── app/                          # Next.js app router
│   ├── (public)/                 # Public pages
│   │   ├── page.tsx              # Homepage
│   │   ├── about/                # About page
│   │   ├── blog/                 # Blog listing & posts
│   │   ├── contact/              # Contact page
│   │   ├── portfolio/            # Portfolio page
│   │   └── services/             # Service pages
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── sections/                 # Page sections
│   ├── ui/                       # Reusable UI components
│   ├── admin/                    # Admin components
│   └── ...                       # Other component folders
├── lib/                          # Utility libraries
│   ├── db/                       # Database utilities
│   ├── auth/                     # Authentication
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
│   ├── media/                    # Images and videos
│   └── icons/                    # SVG icons
├── types/                        # TypeScript definitions
└── ... (config files)

```

---

## Quick Start Guide

### For Content Editors

**Common Tasks:**

**📝 I want to edit the hero title:**

1. Navigate to `/admin/pages/home`
2. Find "Hero" section card
3. Click to expand editor
4. Edit JSON: Change `title` field
5. Click "Save" button
6. Wait 30 seconds for ISR refresh
7. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
8. Verify changes appear

**✍️ I want to add a blog post:**

1. Go to `/admin/blogs`
2. Click "Create New Post" button
3. Fill in all required fields:
   - Title
   - Content (Markdown supported)
   - Featured image
   - SEO metadata
4. Add tags and categories
5. Click "Publish" button
6. Post appears immediately at `/blog`

**🔗 I want to update social media links:**

1. Open `components/sections/SimpleCTA.tsx` in editor
2. Navigate to lines 45-70
3. Update URLs in the `socialLinks` array
4. Save file
5. Commit changes: `git commit -am "Update social links"`
6. Push: `git push origin main`
7. Deploy automatically via Vercel

**🖼️ I want to add a portfolio project:**

1. Prepare optimized image (1470x980px, < 500KB)
2. Add image to `/public/media/homepage/portfolio/`
3. Open `components/sections/PortfolioGallery.tsx`
4. Navigate to line 9 (galleryData array)
5. Add new project object:

```tsx
{
  id: 10,  // Next available ID
  src: '/media/homepage/portfolio/your-project.jpg',
  alt: 'Your Project Name',
  title: 'Your Project Name',
  span: 'col-span-1',  // Or 'sm:col-span-2' for wider
}
```

6. Save, commit, and push

### For Developers

**Initial Setup:**

**Step 1: Clone Repository**

```bash
# Clone from GitHub
git clone https://github.com/achagames6-web/rising-dot-agency.git
cd rising-dot-agency
```

**Step 2: Install Dependencies**

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Step 3: Environment Setup**

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your preferred editor
```

**Required Environment Variables:**

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Admin Credentials
ADMIN_EMAIL=admin@risingdot.agency
ADMIN_PASSWORD=your-secure-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Step 4: Generate Static Content**

```bash
# Generate static content files
npm run generate:content
```

**Step 5: Run Development Server**

```bash
# Start Next.js dev server
npm run dev

# Server will start on http://localhost:3000
```

**Step 6: Open in Browser**

```bash
# Using your browser, navigate to:
http://localhost:3000         # Homepage
http://localhost:3000/admin   # Admin dashboard
```

**Development Workflow:**

**Daily Workflow:**

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start development server
npm run dev

# 4. Make your changes

# 5. Test your changes
npm run type-check  # TypeScript
npm run lint        # ESLint
npm run test        # Jest tests (if added)

# 6. Commit changes
git add .
git commit -m "Descriptive commit message"

# 7. Push to remote
git push origin your-branch-name

# 8. Create pull request on GitHub
```

**Build and Deploy:**

**Local Build:**

```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Build for production
npm run build

# Test production build locally
npm start
```

**Deploy to Vercel:**

```bash
# Install Vercel CLI (first time only)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Automated Deployment:**

- Push to `main` branch triggers production deployment
- Pull requests create preview deployments
- Vercel handles everything automatically

---

## Admin Dashboard

### Overview

**Access URL:** `/admin`

**Authentication:**

- Protected by NextAuth.js
- Email/password login
- Optional 2FA (recommended for production)
- Session-based authentication

**Features Available:**

- 📄 Page content management (Home, Services)
- ✍️ Blog post management (Create, Edit, Delete)
- 🖼️ Media library (Upload, Organize)
- 🔍 SEO configuration (Meta tags, Schema)
- 📊 Analytics dashboard (Traffic, Engagement)
- 👥 User management (Admin accounts)
- ⚙️ Site settings (Global configuration)

### Accessing the Admin Dashboard

**Login Process:**

1. **Navigate to Login Page:**

   ```
   URL: https://your-domain.com/admin/login
   Local: http://localhost:3000/admin/login
   ```

2. **Enter Credentials:**
   - Email: As set in `.env.local` (ADMIN_EMAIL)
   - Password: As set in `.env.local` (ADMIN_PASSWORD)

3. **Two-Factor Authentication (if enabled):**
   - Enter 6-digit code from authenticator app
   - Or use backup codes

4. **Access Dashboard:**
   - Redirects to `/admin` after successful login
   - Session lasts 30 days by default
   - Auto-logout on browser close (can be configured)

**Default Credentials:**

```
⚠️ IMPORTANT: Change these immediately after first login!
Email: admin@risingdot.agency
Password: Set in environment variables
```

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Security Best Practices:**

1. Use strong, unique password
2. Enable 2FA immediately
3. Don't share credentials
4. Use password manager
5. Rotate passwords regularly
6. Monitor login attempts

### Admin Dashboard Sections

#### 1. Dashboard Home

**Path:** `/admin`

**Overview widgets:**

- Total page views (last 30 days)
- Total blog posts published
- Total media files
- Recent activity log
- Quick actions (Create post, Upload media)
- System status (Database, Storage)

**Quick Stats:**

```
┌─────────────────────────┬─────────────────────────┐
│  📊 Page Views          │  ✍️ Blog Posts          │
│  125,430 (+12.5%)       │  47 (+3 this month)     │
├─────────────────────────┼─────────────────────────┤
│  🖼️ Media Files         │  👥 Active Sessions     │
│  1,234 files (2.3 GB)   │  3 users online         │
└─────────────────────────┴─────────────────────────┘
```

#### 2. Pages Management

**Path:** `/admin/pages`

**Manage CMS-enabled sections:**

**Home Page (`/admin/pages/home`):**

- Hero section
- Services showcase
- Stack features
- Case studies
- Testimonials

**Service Pages (`/admin/pages/services-[slug]`):**

- Chatbot Development (`/admin/pages/services-chatbot`)
- N8N Automations (`/admin/pages/services-automations`)
- Web Design (`/admin/pages/services-web-design`)
- SEO Services (`/admin/pages/services-seo`)
- Shopify Development (`/admin/pages/services-shopify`)

**Other Pages:**

- About page (`/admin/pages/about`)
- Contact page (`/admin/pages/contact`)

**Page Editor Interface:**

```
┌────────────────────────────────────────────────┐
│  Home Page Editor                              │
├────────────────────────────────────────────────┤
│  Section: Hero ▼                               │
│  ┌──────────────────────────────────────────┐  │
│  │ {                                        │  │
│  │   "title": "Transform Your Business",    │  │
│  │   "subtitle": "AI-powered solutions",    │  │
│  │   "cta": {                               │  │
│  │     "text": "Get Started",               │  │
│  │     "link": "/contact"                   │  │
│  │   }                                      │  │
│  │ }                                        │  │
│  └──────────────────────────────────────────┘  │
│  [Cancel] [Save Changes]                       │
└────────────────────────────────────────────────┘
```

**JSON Editor Features:**

- Syntax highlighting
- Auto-completion
- Validation on save
- Error messages
- Preview changes
- Revert to previous version

#### 3. Blog Management

**Path:** `/admin/blogs`

**Full blog CMS with these features:**

**Blog List View:**

```
┌────────────────────────────────────────────────────────────┐
│  Blog Posts                         [+ Create New Post]    │
├────────────────────────────────────────────────────────────┤
│  Search: [                    ] Filter: [All ▼] Sort: [▼]  │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📝 How to Build AI Chatbots                          │  │
│  │ Published • Jan 5, 2026 • 1,234 views                │  │
│  │ [Edit] [Delete] [Preview]                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🚀 Next.js Performance Tips                          │  │
│  │ Draft • Jan 3, 2026 • 0 views                        │  │
│  │ [Edit] [Delete] [Preview]                            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Blog Editor:**

- Rich text editor (Markdown support)
- Live preview
- Featured image upload
- SEO fields (title, description, keywords)
- Tags and categories
- Publish/draft status
- Schedule publishing
- Slug customization

**Creating a New Blog Post:**

1. Click "+ Create New Post"
2. Fill in required fields:

```
Title: *required
Slug: auto-generated (editable)
Content: *required (Markdown editor)
Featured Image: Upload image
Excerpt: Short description
Tags: Add tags (comma-separated)
Category: Select category
SEO Title: Optional (defaults to title)
SEO Description: Optional
Keywords: Optional
```

3. Preview your post
4. Save as draft or publish immediately
5. Schedule for later (optional)

**Markdown Editor Features:**

- Syntax highlighting
- Toolbar shortcuts
- Image insertion
- Code blocks
- Tables
- Links
- Lists
- Headings
- Bold, italic, strikethrough

**Example Markdown:**

````markdown
# Main Heading

## Subheading

This is a paragraph with **bold** and _italic_ text.

### Code Example

```javascript
const example = () => {
  console.log('Hello, World!');
};
```
````

### List

- Item 1
- Item 2
  - Nested item
  - Another nested

[Link text](https://example.com)

![Image alt](https://example.com/image.jpg)

```

#### 4. Media Library
**Path:** `/admin/media`

**Centralized media management:**

**Features:**
- Upload images (JPG, PNG, WebP, GIF)
- Upload videos (MP4, WebM)
- Organize in folders
- Search and filter
- Image optimization
- Generate thumbnails
- Copy URLs
- Delete files
- Bulk operations

**Upload Interface:**
```

┌────────────────────────────────────────────────┐
│ Media Library [Upload Files ▲] │
├────────────────────────────────────────────────┤
│ 📁 Folders │
│ ├─ 📁 homepage │
│ │ ├─ portfolio/ │
│ │ ├─ about/ │
│ │ └─ team/ │
│ ├─ 📁 services │
│ ├─ 📁 blog │
│ └─ 📁 icons │
├────────────────────────────────────────────────┤
│ Files in: homepage/portfolio/ │
│ ┌──────┬──────┬──────┬──────┬──────┐ │
│ │ 🖼️ │ 🖼️ │ 🖼️ │ 🖼️ │ ��️ │ │
│ │img1 │img2 │img3 │img4 │img5 │ │
│ │250KB │180KB │420KB │310KB │290KB │ │
│ └──────┴──────┴──────┴──────┴──────┘ │
└────────────────────────────────────────────────┘

```

**Image Optimization:**
- Auto-resize for web
- Compress images
- Convert to WebP
- Generate responsive sizes
- Maintain aspect ratios
- Preserve metadata (optional)

**Supported Formats:**
- Images: JPG, JPEG, PNG, WebP, GIF, SVG
- Videos: MP4, WebM, MOV
- Documents: PDF (for downloads)

**Storage Integration:**
- Cloudinary (primary)
- Vercel Blob Storage
- Local filesystem (development)

#### 5. SEO Configuration
**Path:** `/admin/seo`

**Global SEO settings and tools:**

**Modules Available:**
1. **Meta Tags Editor** - Default meta tags for all pages
2. **Schema Markup** - Structured data for search engines
3. **Sitemap Generator** - Auto-generate XML sitemaps
4. **Robots.txt Editor** - Control crawler access
5. **Redirect Manager** - Manage 301/302 redirects
6. **Hreflang Manager** - Multi-language SEO
7. **UTM Builder** - Campaign tracking links
8. **Content Readability** - SEO content analysis
9. **Heading Analyzer** - Check heading structure
10. **Image Alt Manager** - Manage alt text
11. **Duplicate Content Detector** - Find duplicate content
12. **Crawl Budget Monitor** - Monitor Googlebot
13. **Lead Magnet Manager** - Email capture popups
14. **Subscribers Manager** - Newsletter subscribers

**Meta Tags Editor:**
```

┌────────────────────────────────────────────────┐
│ Global Meta Tags │
├────────────────────────────────────────────────┤
│ Default Title: Rising Dot Agency │
│ Title Template: %s | Rising Dot Agency │
│ │
│ Default Description: │
│ ┌──────────────────────────────────────────┐ │
│ │ AI-powered chatbots, automation, and │ │
│ │ stunning websites that drive growth. │ │
│ └──────────────────────────────────────────┘ │
│ │
│ Keywords: AI, chatbots, automation, web │
│ │
│ Open Graph Image: │
│ [Upload Image] or enter URL │
│ │
│ Twitter Card: summary_large_image ▼ │
│ │
│ [Save Changes] │
└────────────────────────────────────────────────┘

```

**Schema Markup Generator:**
- Organization schema
- WebSite schema
- LocalBusiness schema
- Article schema (blog posts)
- Product schema (services)
- FAQ schema
- BreadcrumbList schema
- Review schema

#### 6. Analytics
**Path:** `/admin/analytics`

**Performance metrics and insights:**

**Dashboard Widgets:**
```

┌─────────────────────────────────────────────────────────┐
│ Analytics Dashboard Jan 1 - Jan 7, 2026 │
├─────────────────────────────────────────────────────────┤
│ Overview │
│ ┌───────────┬───────────┬───────────┬────────────┐ │
│ │ 📊 Views │ 👥 Users │ ⏱️ Time │ 📉 Bounce │ │
│ │ 15,234 │ 8,901 │ 2m 34s │ 42.3% │ │
│ │ +12.5% │ +8.2% │ +5.1% │ -2.1% │ │
│ └───────────┴───────────┴───────────┴────────────┘ │
├─────────────────────────────────────────────────────────┤
│ 📈 Traffic Chart │
│ │ ╱╲ │
│ │ ╱ ╲ │
│ │ ╱╲ ╱ ╲ │
│ │ ╱╲ ╱ ╲ ╱ ╲ ╱╲ │
│ │ ╱ ╲──────╱ ╲ ╲────╱ ╲ │
│ └─────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────┤
│ Top Pages │ Traffic Sources │
│ 1. / 45.2% │ Direct 38.1% │
│ 2. /blog 18.3% │ Organic 32.5% │
│ 3. /services/\* 15.7% │ Social 15.2% │
│ 4. /contact 8.9% │ Referral 9.8% │
│ 5. /portfolio 6.2% │ Email 4.4% │
└─────────────────────────────────────────────────────────┘

```

**Metrics Tracked:**
- Page views
- Unique visitors
- Session duration
- Bounce rate
- Top pages
- Traffic sources
- Device breakdown
- Geographic data
- Conversion tracking
- Form submissions
- Button clicks
- Link clicks

**Integration:**
- Google Analytics 4
- Plausible Analytics (privacy-friendly)
- Custom event tracking
- Real-time dashboard

---

## Homepage Sections

The homepage consists of 14 distinct sections, each serving a specific purpose in the user journey.

### Section List

1. **Hero Section** - First impression, main CTA
2. **Services Showcase** - Service offerings grid
3. **Portfolio Gallery** - Project showcase
4. **About Section** - Company introduction
5. **Bento Grid** - Interactive service previews
6. **Stack Feature Section** - Technology stack highlights
7. **Tech Stack Marquee** - Technology logos carousel
8. **Case Studies** - Client success stories
9. **Premium Testimonials** - Client reviews
10. **Blog Section** - Latest blog posts
11. **Connect Section** - Engagement prompts
12. **Team Section** - Team member profiles
13. **Contact Section** - Contact form
14. **CTA Section** - Final call-to-action with social links

---

### 1. Hero Section

**📊 Status:** ✅ CMS Enabled

**📁 File Location:**
```

File: components/sections/CleanHero.tsx
Path: /home/runner/work/rising-dot-agency/rising-dot-agency/components/sections/CleanHero.tsx
Full File: Lines 1-250

````

**🎯 Purpose:**
The hero section is the first thing visitors see. It must:
- Capture attention immediately
- Communicate value proposition clearly
- Provide clear call-to-action
- Set visual tone for entire site
- Be responsive across all devices

**📝 Content Breakdown:**

**Badge (Lines 67-75):**
```tsx
<motion.div className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 backdrop-blur-sm">
  <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
    <Sparkles className="h-4 w-4 text-[#F58122]" />
  </motion.div>
  <span className="font-medium text-white/80">✨ Welcome to Rising Dot</span>
  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
</motion.div>
````

**Customization Options:**

- Icon: Any Lucide icon (Sparkles, Zap, Star, etc.)
- Text: Welcome message or announcement
- Colors: Border, background, text colors
- Animation: Rotation speed, pulse timing

**Main Heading (Lines 89-95):**

```tsx
<h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
  <span className="bg-gradient-to-r from-[#37AFE1] via-[#F58122] to-[#37AFE1] bg-clip-text text-transparent">
    Transform Your Business
  </span>
  <br />
  <span className="text-white">with Cutting-Edge Digital Solutions</span>
</h1>
```

**Heading Best Practices:**

- Keep under 10 words if possible
- Lead with benefit, not feature
- Use action words (Transform, Accelerate, Unlock)
- Split into 2 lines for rhythm
- Gradient on first line for emphasis

**Subtitle (Lines 102-108):**

```tsx
<p className="mb-8 text-lg text-slate-400 sm:text-xl md:text-2xl">
  We deliver AI-powered chatbots, automation, and stunning websites that drive
  growth and efficiency for your business.
</p>
```

**Subtitle Guidelines:**

- Expand on the headline
- Mention specific services
- Keep to 2-3 lines maximum
- Use benefit-focused language
- Maintain consistent tone

**Primary CTA Button (Lines 115-120):**

```tsx
<Link href="/contact">
  <StarButton className="h-12 px-8">
    <span className="mr-2">Get Started</span>
    <ArrowRight className="h-5 w-5" />
  </StarButton>
</Link>
```

**CTA Best Practices:**

- Use action verbs (Get, Start, Discover, Explore)
- Create urgency when appropriate
- Make button large and prominent
- Use contrasting colors
- Include icon for visual interest

**Secondary CTA (Lines 125-130):**

```tsx
<Link
  href="/portfolio"
  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
>
  View Projects
</Link>
```

**Secondary CTA Purpose:**

- Provide alternative action
- Less commitment than primary
- Usually informational (View, Learn, Explore)
- Complementary to primary goal

**📊 CMS Editor JSON Structure:**

```json
{
  "hero": {
    "badge": {
      "icon": "Sparkles",
      "text": "✨ Welcome to Rising Dot",
      "showPulse": true
    },
    "heading": {
      "gradientText": "Transform Your Business",
      "plainText": "with Cutting-Edge Digital Solutions",
      "gradient": {
        "from": "#37AFE1",
        "via": "#F58122",
        "to": "#37AFE1"
      }
    },
    "subtitle": {
      "text": "We deliver AI-powered chatbots, automation, and stunning websites that drive growth and efficiency for your business."
    },
    "cta": {
      "primary": {
        "text": "Get Started",
        "link": "/contact",
        "icon": "ArrowRight",
        "variant": "star"
      },
      "secondary": {
        "text": "View Projects",
        "link": "/portfolio",
        "variant": "outline"
      }
    },
    "background": {
      "type": "animated",
      "showParticles": true,
      "showSphere": true
    }
  }
}
```

**How to Edit via CMS:**

1. Navigate to Admin Dashboard: `/admin/pages/home`
2. Find "Hero Section" card
3. Click "Edit" button
4. JSON editor opens
5. Modify values:
   - Change `badge.text` for welcome message
   - Update `heading.gradientText` for main title
   - Edit `subtitle.text` for description
   - Update CTA button text and links
6. Click "Preview" to see changes
7. Click "Save" to publish
8. Wait 30 seconds for ISR revalidation
9. Refresh homepage to see changes

**How to Edit via Code:**

1. Open file: `components/sections/CleanHero.tsx`
2. Locate the content you want to change:
   - Lines 67-75: Badge
   - Lines 89-95: Heading
   - Lines 102-108: Subtitle
   - Lines 115-130: CTAs
3. Edit the text directly
4. Save file
5. Commit: `git add components/sections/CleanHero.tsx`
6. Commit: `git commit -m "Update hero section content"`
7. Push: `git push origin main`
8. Vercel auto-deploys

**🎨 Visual Elements:**

**Background Animation:**

- Type: Animated gradient with 3D sphere
- Component: AnimatedBackground
- File: `components/backgrounds/AnimatedBackground.tsx`
- Features:
  - Rotating 3D sphere
  - Particle system
  - Gradient lights
  - Smooth animations
- Performance: GPU-accelerated

**Particle System:**

- Implementation: Canvas-based
- File: `components/ui/highlighter.tsx`
- Particles: 200 dots
- Size: 2px diameter
- Color: #37AFE1 (blue)
- Animation: Floating, mouse-interactive
- Performance: 60fps on modern devices

**Typography:**

- Heading Font: Montserrat (weights: 600, 700, 800)
- Body Font: Inter (weights: 400, 500)
- Fallbacks: system fonts
- Size Scale: Responsive (mobile to desktop)

**Color Scheme:**

```
Primary Blue:   #37AFE1
Primary Orange: #F58122
Background:     #000000 (black)
Text Primary:   #FFFFFF (white)
Text Secondary: #64748B (slate-400)
Accent Green:   #10B981 (pulse indicator)
```

**Responsive Breakpoints:**

- Mobile: < 640px (text-4xl heading)
- Tablet: 640px - 1024px (text-5xl heading)
- Desktop: > 1024px (text-7xl heading)

**🔧 Advanced Customization:**

**Adding a Video Background:**

1. Add video file to `/public/media/hero/`
2. Edit CleanHero.tsx:

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 h-full w-full object-cover opacity-30"
>
  <source src="/media/hero/background.mp4" type="video/mp4" />
</video>
```

**Adding a Countdown Timer:**

```tsx
import { useState, useEffect } from 'react';

const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

useEffect(() => {
  const targetDate = new Date('2026-02-01');
  const interval = setInterval(() => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

// Display countdown
<div className="flex gap-4 text-center">
  <div>
    <div className="text-4xl font-bold">{timeLeft.days}</div>
    <div className="text-sm">Days</div>
  </div>
  {/* Repeat for hours, minutes, seconds */}
</div>;
```

**Adding Social Proof:**

```tsx
<div className="mt-8 flex items-center justify-center gap-8">
  <div className="text-center">
    <div className="text-3xl font-bold text-[#37AFE1]">500+</div>
    <div className="text-sm text-slate-400">Happy Clients</div>
  </div>
  <div className="text-center">
    <div className="text-3xl font-bold text-[#F58122]">1,000+</div>
    <div className="text-sm text-slate-400">Projects Done</div>
  </div>
  <div className="text-center">
    <div className="text-3xl font-bold text-[#37AFE1]">99%</div>
    <div className="text-sm text-slate-400">Satisfaction</div>
  </div>
</div>
```

**⚡ Performance Optimization:**

**ISR Configuration:**

```tsx
// In app/(public)/page.tsx
export const revalidate = 30; // Seconds
```

**Image Optimization:**

- Use Next.js Image component
- WebP format preferred
- Lazy loading for below-fold
- Priority loading for above-fold

**Animation Performance:**

- Use CSS transforms (GPU-accelerated)
- Avoid layout thrashing
- Use `will-change` sparingly
- Implement reduced motion

**Lazy Loading Strategy:**

```tsx
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-side only if appropriate
});
```

**Bundle Size:**

- Hero component: ~15KB gzipped
- AnimatedBackground: ~12KB gzipped
- Particles: ~6KB gzipped
- Total overhead: ~33KB

**Performance Checklist:**

- ✅ Minimize JavaScript
- ✅ Optimize images
- ✅ Lazy load components
- ✅ Use efficient animations
- ✅ Implement caching
- ✅ Measure with Lighthouse
- ✅ Monitor Core Web Vitals

---

### 2. Services Showcase

**📊 Status:** ✅ CMS Enabled

**📁 File Location:**

```
File: components/sections/ServicesShowcase.tsx
Path: /home/runner/work/rising-dot-agency/rising-dot-agency/components/sections/ServicesShowcase.tsx
Lines: 1-350 (Full file)
Service Array: Lines 78-145
```

**🎯 Purpose:**
Display all service offerings in an engaging, scannable format that:

- Highlights key services
- Links to detailed service pages
- Provides quick overview
- Encourages exploration
- Builds credibility

**📝 Content Structure:**

The services are defined in an array of service objects.

**Service Object Schema:**

```typescript
interface Service {
  id: number;
  icon: string; // Lucide icon name
  title: string; // Service name
  description: string; // Brief description
  link: string; // URL to service page
  color?: string; // Accent color
  features?: string[]; // Key features
  badge?: string; // Optional badge (New, Popular, etc.)
}
```

**Complete Service Configuration:**

```tsx
const services = [
  {
    id: 1,
    icon: 'Bot',
    title: 'AI Chatbots',
    description: 'Deploy intelligent chatbots that understand context, handle complex queries, and provide 24/7 customer support across multiple channels including web, WhatsApp, and Facebook Messenger.',
    link: '/services/chatbot-development',
    color: '#37AFE1',
    features: [
      '24/7 Automated Support',
      'Multi-language Processing',
      'CRM Integration',
      'Analytics Dashboard',
      'Natural Language Understanding',
      'Context-Aware Responses'
    ],
    badge: 'Popular'
  },
  {
    id: 2,
    icon: 'Workflow',
    title: 'N8N Automations',
    description: 'Streamline your workflows with powerful no-code automation. Connect your favorite apps, sync data across platforms, and eliminate repetitive tasks that waste your team's time.',
    link: '/services/n8n-automations',
    color: '#F58122',
    features: [
      'Workflow Automation',
      'API Integration',
      'Data Synchronization',
      'Error Handling',
      'Schedule Triggers',
      'Custom Webhooks'
    ],
    badge: 'New'
  },
  {
    id: 3,
    icon: 'Palette',
    title: 'Web Design',
    description: 'Create stunning, modern websites that captivate your audience. From responsive design to pixel-perfect UI, we craft digital experiences that convert visitors into customers.',
    link: '/services/web-design',
    color: '#37AFE1',
    features: [
      'Responsive Design',
      'Modern UI/UX',
      'Fast Performance',
      'SEO Optimized',
      'Mobile-First',
      'Accessibility'
    ]
  },
  {
    id: 4,
    icon: 'TrendingUp',
    title: 'SEO Services',
    description: 'Boost your online visibility and drive organic traffic. Our comprehensive SEO strategies help you rank higher in search results and attract qualified leads to your business.',
    link: '/services/seo',
    color: '#10B981',
    features: [
      'Keyword Research',
      'On-Page Optimization',
      'Technical SEO',
      'Content Strategy',
      'Link Building',
      'Performance Tracking'
    ]
  },
  {
    id: 5,
    icon: 'ShoppingCart',
    title: 'Shopify Development',
    description: 'Build high-converting e-commerce stores on Shopify. From custom themes to app integrations, we create online stores that drive sales and delight customers.',
    link: '/services/shopify',
    color: '#F58122',
    features: [
      'Custom Themes',
      'App Integration',
      'Payment Setup',
      'Store Optimization',
      'Migration Services',
      'Ongoing Support'
    ]
  }
];
```

**📊 How to Edit via CMS:**

1. Navigate to: `/admin/pages/home`
2. Scroll to "Services Showcase" section
3. Click "Edit"
4. Update JSON:

```json
{
  "services": [
    {
      "icon": "Bot",
      "title": "AI Chatbots",
      "description": "Your description here",
      "link": "/services/chatbot-development",
      "color": "#37AFE1",
      "features": ["Feature 1", "Feature 2"],
      "badge": "Popular"
    }
  ]
}
```

5. Save changes
6. Wait 30s for ISR revalidation

**📝 How to Edit via Code:**

1. Open `components/sections/ServicesShowcase.tsx`
2. Find services array (line 78)
3. Edit existing service:

```tsx
{
  id: 1,
  icon: 'Bot',  // Change icon
  title: 'Your New Title',  // Update title
  description: 'Your new description',  // Update description
  // ... other fields
}
```

4. Add new service:

```tsx
{
  id: 6,  // Next available ID
  icon: 'Code',  // Choose icon from Lucide
  title: 'Custom Development',
  description: 'Bespoke software solutions',
  link: '/services/custom-development',
  color: '#8B5CF6',  // Purple
  features: [
    'Tailored Solutions',
    'Scalable Architecture',
    'Expert Team'
  ]
}
```

5. Save and commit

**🔧 Available Icons:**

**Popular Service Icons (Lucide React):**

| Icon Name    | Use Case                  | Example            |
| ------------ | ------------------------- | ------------------ |
| Bot          | AI, Chatbots, Automation  | `<Bot />`          |
| Workflow     | Process, Automation       | `<Workflow />`     |
| Palette      | Design, Creative          | `<Palette />`      |
| TrendingUp   | Growth, Marketing, SEO    | `<TrendingUp />`   |
| ShoppingCart | E-commerce, Retail        | `<ShoppingCart />` |
| Code         | Development, Programming  | `<Code />`         |
| Zap          | Speed, Performance        | `<Zap />`          |
| Shield       | Security, Protection      | `<Shield />`       |
| Database     | Data, Storage             | `<Database />`     |
| Globe        | Web, International        | `<Globe />`        |
| Smartphone   | Mobile, Apps              | `<Smartphone />`   |
| Mail         | Email, Communication      | `<Mail />`         |
| Search       | SEO, Discovery            | `<Search />`       |
| Settings     | Configuration, Management | `<Settings />`     |
| Cloud        | Cloud Services            | `<Cloud />`        |

**Browse all 1000+ icons:** https://lucide.dev

**Icon Usage in Component:**

```tsx
import { Bot, Workflow, Palette } from 'lucide-react';

// In JSX:
<Bot className="h-8 w-8 text-[#37AFE1]" />
<Workflow className="h-8 w-8 text-[#F58122]" strokeWidth={1.5} />
```

**🎨 Card Layout:**

**Grid Configuration (Line 165):**

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {services.map((service) => (
    <ServiceCard key={service.id} {...service} />
  ))}
</div>
```

**Responsive Breakpoints:**

- Mobile (< 768px): 1 column
- Tablet (768px - 1024px): 2 columns
- Desktop (> 1024px): 3 columns

**Card Structure:**

```
┌─────────────────────────┐
│  🤖 Icon                │
│  Service Title          │
│  Description text here  │
│  that spans multiple    │
│  lines for context.     │
│                         │
│  • Feature 1            │
│  • Feature 2            │
│  • Feature 3            │
│                         │
│  [Learn More →]         │
└─────────────────────────┘
```

**Card Styling (Lines 190-250):**

```tsx
<motion.div
  whileHover={{
    scale: 1.05,
    borderColor: service.color || '#37AFE1',
  }}
  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
>
  {/* Badge (if present) */}
  {service.badge && (
    <span className="absolute right-4 top-4 rounded-full bg-[#F58122]/20 px-3 py-1 text-xs font-semibold text-[#F58122]">
      {service.badge}
    </span>
  )}

  {/* Icon */}
  <div
    className="mb-4 inline-flex rounded-xl p-3"
    style={{ backgroundColor: `${service.color}20` }}
  >
    <Icon className="h-8 w-8" style={{ color: service.color }} />
  </div>

  {/* Title */}
  <h3 className="mb-2 text-2xl font-bold text-white">{service.title}</h3>

  {/* Description */}
  <p className="mb-4 text-slate-400">{service.description}</p>

  {/* Features */}
  {service.features && (
    <ul className="mb-6 space-y-2">
      {service.features.map((feature, idx) => (
        <li
          key={idx}
          className="flex items-center gap-2 text-sm text-slate-300"
        >
          <Check className="h-4 w-4 text-green-400" />
          {feature}
        </li>
      ))}
    </ul>
  )}

  {/* CTA */}
  <Link
    href={service.link}
    className="inline-flex items-center gap-2 text-[#37AFE1] transition-all hover:gap-4"
  >
    Learn More
    <ArrowRight className="h-4 w-4" />
  </Link>
</motion.div>
```

**✨ Hover Effects:**

**Card Hover:**

- Scale: 1.05 (5% larger)
- Shadow: Enhanced glow
- Border: Changes to service color
- Duration: 300ms
- Easing: ease-out

**CTA Hover:**

- Gap increases (arrow moves right)
- Color brightens
- Smooth transition

**Animation Sequence:**

```tsx
// Stagger children for cascade effect
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-100px' }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1, // 100ms delay between each
      },
    },
  }}
>
  {services.map((service) => (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {/* Service card content */}
    </motion.div>
  ))}
</motion.div>
```

**🎨 Color Customization:**

**Predefined Colors:**

```tsx
const serviceColors = {
  blue: '#37AFE1', // Technology, AI
  orange: '#F58122', // Creative, Marketing
  green: '#10B981', // Growth, Eco
  purple: '#8B5CF6', // Premium, Luxury
  pink: '#EC4899', // Design, Beauty
  red: '#EF4444', // Urgent, Important
  yellow: '#F59E0B', // Energy, Caution
  indigo: '#6366F1', // Professional, Trust
};
```

**How Colors Are Applied:**

- Icon background: `{color}20` (20% opacity)
- Icon itself: Full color
- Hover border: Full color
- Badge: `{color}20` background

**Creating Color Harmony:**

```tsx
// Analogous colors (next to each other on color wheel)
service1.color = '#37AFE1'; // Blue
service2.color = '#10B981'; // Green-blue
service3.color = '#8B5CF6'; // Blue-purple

// Complementary colors (opposite on color wheel)
service1.color = '#37AFE1'; // Blue
service2.color = '#F58122'; // Orange

// Triadic colors (evenly spaced on color wheel)
service1.color = '#37AFE1'; // Blue
service2.color = '#F58122'; // Orange
service3.color = '#10B981'; // Green
```

**⚡ Performance Considerations:**

**Lazy Loading:**

```tsx
// Only load visible cards
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

return (
  <div ref={ref}>
    {inView ? <ServiceCard {...service} /> : <CardSkeleton />}
  </div>
);
```

**Image Optimization (if adding images):**

```tsx
<Image
  src={service.image}
  alt={service.title}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

**Bundle Size:**

- Component: ~8KB gzipped
- Icons: ~2KB per icon
- Total for 5 services: ~18KB

**Optimization Tips:**

1. Limit description to 2-3 sentences
2. Maximum 6 features per service
3. Use WebP images if adding visuals
4. Lazy load icons not immediately visible
5. Debounce hover effects

**Accessibility:**

- Proper heading hierarchy (h2 for section, h3 for cards)
- Alt text for all icons (via aria-label)
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast WCAG AA compliant

---
