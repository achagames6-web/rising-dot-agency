# Rising Dot Agency - Comprehensive Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Frontend - Public Pages](#frontend---public-pages)
   - [Global Components](#global-components)
   - [Home Page](#home-page)
   - [About Page](#about-page)
   - [Portfolio Page](#portfolio-page)
   - [Blog Page](#blog-page)
   - [Contact Page](#contact-page)
   - [Service Pages](#service-pages)
4. [Admin CMS Dashboard](#admin-cms-dashboard)
5. [Media Management](#media-management)
6. [CMS Content System](#cms-content-system)
7. [API Reference](#api-reference)

---

## Project Overview

Rising Dot Agency is a premium digital agency website built with Next.js 14, featuring a fully-functional CMS dashboard for content management. The website showcases services including Web Design, Shopify Development, WordPress, N8N Automations, Chatbot Development, and SEO services.

### Key Features

- Modern, animated UI with Framer Motion and GSAP
- Full CMS for managing all website content
- Cloudinary integration for media management
- AI-powered live chat with Groq integration
- Comprehensive SEO tools
- Analytics dashboard
- User authentication with NextAuth.js
- MongoDB database for content storage

---

## Technology Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| Framework      | Next.js 14 (App Router) |
| Language       | TypeScript              |
| Styling        | Tailwind CSS            |
| Animation      | Framer Motion, GSAP     |
| 3D Graphics    | Three.js                |
| Database       | MongoDB                 |
| Authentication | NextAuth.js             |
| Media Storage  | Cloudinary              |
| AI/Chat        | Groq API                |
| Email          | Resend                  |
| Deployment     | Vercel                  |

---

## Frontend - Public Pages

### Global Components

#### Header (`components/Header.tsx`)

**Description:** Floating navigation header with magnetic hover effects, services dropdown, and mobile responsive menu.

**Features:**

- Floating pill-style navigation
- Magnetic hover effects on nav links
- Services dropdown with animated transitions
- Mobile hamburger menu
- Auto-hide on scroll down, show on scroll up
- CTA button with particle effects

**CMS Integration:**

- Logo: Managed via Navigation Settings (`/admin/navigation`)
- Nav Links: Configurable order, labels, and visibility
- Service Links: Dropdown items managed in Navigation Settings
- CTA Button: Label, href, and enabled state

**How to Edit:**

1. Go to Admin Dashboard → Navigation
2. Header tab allows editing:
   - Logo path
   - Navigation links (add/remove/reorder)
   - Services dropdown links
   - CTA button text and link

**Images Location:** `/public/logo.png`

---

#### Footer (`components/Footer.tsx`)

**Description:** Full-width footer with company info, link columns, newsletter subscription, and social links.

**Features:**

- Company logo and description
- Dynamic link columns (configurable)
- Newsletter subscription form
- Social media icons (10 platforms supported)
- Copyright text with auto-year

**CMS Integration:**

- All content managed via Navigation Settings (`/admin/navigation`)
- Footer tab in Navigation page

**How to Edit:**

1. Go to Admin Dashboard → Navigation
2. Footer tab allows editing:
   - Footer logo
   - Description text
   - Copyright text (use `{year}` for auto-year)
   - Newsletter toggle
   - Link columns (add/remove columns and links)

**Social Links Configuration:**

- Facebook, Instagram, TikTok, YouTube, Twitter/X
- LinkedIn, Telegram, Discord, Pinterest, GitHub
- Each can be enabled/disabled with custom URL

---

### Home Page

**File:** `app/(public)/page.tsx`

**Layout:** Single-page with 14 sections, each wrapped in `SectionWrapper` for CMS visibility control.

#### Section 1: Hero (`components/sections/Hero.tsx`)

**Description:** Single-column centered hero with animated text and modern gradient mesh background animation.

**Features:**

- Animated gradient text title
- Modern gradient mesh background with smooth CSS animations
- Animated CTA button with star effect
- Scroll indicator
- Optimized performance with GPU-accelerated transforms

**CMS Content Keys:**

- Page: `home`, Section: `hero`
- Fields: `eyebrow`, `title`, `subtitle`, `ctaText`, `ctaLink`, `scrollText`

**How to Edit:**

1. Go to Admin Dashboard → Pages → Home
2. Edit Hero section content
3. Change eyebrow text, main title, subtitle, CTA button text/link

**Images/Media:**

- Background uses CSS-based gradient animation (no media files needed)

---

#### Section 2: Cinematic Showreel (`components/sections/CinematicShowreel.tsx`)

**Description:** Video showreel with GSAP parallax scrolling, play/pause controls, and moving border animation.

**Features:**

- Responsive video (desktop 16:9, mobile 9:16)
- Play/pause on hover
- Volume toggle with fade animation
- Moving gradient border
- GSAP ScrollTrigger parallax

**How to Edit:**

1. Replace video files in `/public/videos/`
   - Desktop: `showreel_desktop_16-9.mp4`
   - Mobile: `showreel_mobile_9-16.mp4`

**Videos Location:** `/public/videos/`

---

#### Section 3: Featured Services (`components/sections/FeaturedServices.tsx`)

**Description:** Sticky scroll cards showcasing 6 main services with images and CTAs.

**Features:**

- Sticky scroll effect (cards stack as you scroll)
- Alternating image/text layout
- Animated gradient titles
- Star button CTAs

**CMS Content Keys:**

- Page: `home`, Section: `featuredServices`
- Fields: `eyebrow`, `title`, `titleHighlight`, `subtitle`, `services[]`

**Services Array Structure:**

```typescript
{
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  ctaText: string;
}
```

**How to Edit:**

1. Go to Admin Dashboard → Pages → Home
2. Edit Featured Services section
3. Modify service cards, images, descriptions, and links

**Images Location:** `/public/media/home/featured-services/`

---

#### Section 4: Value Proposition (`components/sections/ValueProposition.tsx`)

**Description:** Interactive service icons grid with particle effects and connection lines on hover.

**Features:**

- 6 service icons in responsive grid
- Particle burst on hover
- Connection lines between related services
- Glow card effects

**CMS Content Keys:**

- Page: `home`, Section: `valueProposition`
- Fields: `eyebrow`, `title`, `titleHighlight`, `subtitle`, `services[]`, `colors`

**How to Edit:**

1. Go to Admin Dashboard → Pages → Home
2. Edit Value Proposition section
3. Customize service icons, descriptions, and colors

---

#### Section 5: Service Cards (`components/sections/ServiceCards.tsx`)

**Description:** 6 service cards with 3D tilt effect, particle emissions, and magnetic cursor interaction.

**Features:**

- 3D tilt on mouse move
- Particle emission on hover
- Glow card with animated border
- Feature bullet points
- Learn More links

**CMS Content Keys:**

- Page: `home`, Section: `serviceCards`
- Fields: `eyebrow`, `title`, `titleHighlight`, `subtitle`, `cards[]`, `colors`

**Cards Array Structure:**

```typescript
{
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  features: string[];
}
```

**How to Edit:**

1. Go to Admin Dashboard → Pages → Home
2. Edit Service Cards section
3. Modify card content, icons, features, and colors

---

#### Section 6: Stack Feature Section (`components/ui/stack-feature-section.tsx`)

**Description:** Tech stack orbit animation with floating technology icons.

**Features:**

- Orbital animation of tech icons
- Central CTA area
- Responsive layout

**CMS Content Keys:**

- Page: `home`, Section: `stackFeature`

---

#### Section 7: Tech Stack Marquee (`components/sections/TechStackMarquee.tsx`)

**Description:** Infinite scrolling marquee of technology logos with sparkle effects.

**Features:**

- Infinite horizontal scroll
- Grayscale logos that brighten on hover
- Sparkle particle effect below
- Gradient glow background

**CMS Content Keys:**

- Page: `home`, Section: `techStack`
- Fields: `eyebrow`, `title`, `titleHighlight`

**Logos Location:** `/public/media/home/tech-stack-marquee/`

- react.svg, nextjs.svg, typescript.svg, tailwindcss.svg
- nodejs.svg, shopify.svg, wordpress.svg, figma.svg
- vercel.svg, openai.svg

---

#### Section 8: Case Studies Carousel (`components/sections/CaseStudiesCarousel.tsx`)

**Description:** Auto-advancing carousel with progress indicators and case study cards.

**Features:**

- Auto-advance with progress bar
- 4 case study slides
- Image with gradient overlay
- Bottom navigation tabs

**CMS Content Keys:**

- Page: `home`, Section: `caseStudies`
- Fields: `eyebrow`, `title`, `titleHighlight`, `subtitle`, `studies[]`

**Studies Array Structure:**

```typescript
{
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}
```

**Images Location:** `/public/media/home/case-studies/`

---

#### Section 9: Premium Testimonials (`components/ui/premium-testimonials.tsx`)

**Description:** Animated testimonial cards with ratings, results, and submit testimonial modal.

**Features:**

- Animated card carousel
- Star ratings
- Results/metrics display
- "Submit Your Testimonial" modal
- Pending testimonial approval system

**CMS Integration:**

- Testimonials managed via Admin Dashboard → Testimonials
- Supports pending/approved/rejected status

**How to Edit:**

1. Go to Admin Dashboard → Testimonials
2. Add/edit/delete testimonials
3. Toggle featured status
4. Approve pending submissions

**Avatar Images Location:** `/public/media/home/testimonials/`

---

#### Section 10: Blog Section (`components/sections/BlogSection.tsx`)

**Description:** Latest blog posts in bento grid layout with featured post highlight.

**Features:**

- Featured post (large card)
- 3 recent posts (smaller cards)
- Category badges
- Read time and date
- "View All Posts" CTA

**CMS Integration:**

- Blog posts managed via Admin Dashboard → Blog Posts
- Fetches latest 4 posts from API

**How to Edit:**

1. Go to Admin Dashboard → Blog Posts
2. Create/edit blog posts
3. Set featured flag for highlight

---

#### Section 11: Connect (`components/sections/Connect.tsx`)

**Description:** Interactive contact section with animated service tags and contact options.

**Features:**

- Animated pointer following service tags
- Email and WhatsApp quick links
- Book a call CTA
- Particle background

**CMS Content Keys:**

- Page: `home`, Section: `connect`
- Fields: `title`, `subtitle`, `ctaText`, `ctaLink`, `email`, `whatsapp`, `services[]`

---

#### Section 12: Holographic Team (`components/sections/HolographicTeam.tsx`)

**Description:** 3D carousel of team members with holographic effects and text scramble.

**Features:**

- 3D perspective carousel
- Holographic image effects (scanlines, RGB shift)
- Text scramble animation
- Drag/swipe navigation
- Auto-advance on mobile

**CMS Integration:**

- Team members managed via Admin Dashboard → Team Members
- Falls back to default team if no CMS data

**How to Edit:**

1. Go to Admin Dashboard → Team Members
2. Add/edit team members
3. Set name, role, and image path

**Team Images Location:** `/public/team/`

---

#### Section 13: Holographic Contact (`components/sections/HolographicContact.tsx`)

**Description:** WebGL globe with city markers and conversational contact form.

**Features:**

- Three.js globe with city markers
- Animated arcs connecting cities
- Conversational form (fill-in-the-blank style)
- Custom dropdown components
- Form submission to API

**CMS Content Keys:**

- Page: `home`, Section: `contact`
- Fields: `eyebrow`, `title`, `titleHighlight`, `subtitle`

**Form Fields:**

- Name, Company (optional), Email
- Service selection, Budget selection
- Message textarea

---

#### Section 14: Simple CTA (`components/sections/SimpleCTA.tsx`)

**Description:** Final call-to-action section with stats and social links.

**Features:**

- Gradient background orbs
- Primary and secondary CTAs
- 4 stats counters
- Social media links

**CMS Content Keys:**

- Page: `home`, Section: `cta`
- Fields: `eyebrow`, `title`, `titleHighlight`, `subtitle`, `ctaText`, `ctaLink`, `secondaryCtaText`, `secondaryCtaLink`, `stats[]`

---

### About Page

**File:** `app/(public)/about/page.tsx`

#### Sections:

1. **Hero** - Hero1 component with CMS content
2. **Agency Showreel** - Scroll-animated video
3. **Holographic Team** - Team carousel (shared component)
4. **Skills Visualization** - Interactive skill bars
5. **Company Timeline** - Milestone timeline
6. **Office Tour** - 360° virtual tour
7. **Testimonials** - Premium testimonials (shared)
8. **CTA** - MiniCTA component

**CMS Content Keys:**

- Page: `about`, Sections: `hero`, `team`, `skills`, `timeline`, `officeTour`, `cta`

---

### Portfolio Page

**File:** `app/(public)/portfolio/page.tsx`

#### Sections:

1. **Interactive Image Accordion Hero** - Expandable image categories
2. **Featured Projects Carousel** - Horizontal scroll projects
3. **Tag Cloud** - Draggable technology tags
4. **Project Grid** - Filterable project cards
5. **Case Studies Carousel** - Portfolio-specific case studies
6. **Portfolio Features** - Feature highlights
7. **CTA** - MiniCTA component

**CMS Content Keys:**

- Page: `portfolio`, Sections: `hero`, `filters`, `grid`, `projects`, `caseStudies`, `cta`

**Projects Management:**

1. Go to Admin Dashboard → Projects
2. Add/edit projects with:
   - Title, Client, Description
   - Thumbnail and gallery images
   - Tags and metrics
   - Featured/Published status

**Images Location:** `/public/media/portfolio/`

---

### Blog Page

**File:** `app/(public)/blog/page.tsx`

#### Features:

- Category filter tabs
- Blog post grid
- Individual blog post pages (`/blog/[slug]`)

**CMS Content Keys:**

- Page: `blog`, Sections: `hero`, `filter`, `emptyState`

**Blog Management:**

1. Go to Admin Dashboard → Blog Posts
2. Create posts with:
   - Title, Excerpt, Content (Markdown)
   - Thumbnail and cover image
   - Category and tags
   - Author
   - Featured/Published status

---

### Contact Page

**File:** `app/(public)/contact/page.tsx`

#### Sections:

1. **Hero** - Hero1 component
2. **Contact Form** - Full contact form
3. **Contact Information** - Email, phone, address, hours
4. **Map** - Location map
5. **CTA** - MiniCTA component

**CMS Content Keys:**

- Page: `contact`, Sections: `hero`, `form`, `info`, `map`, `cta`

**Contact Submissions:**

- Stored in MongoDB
- Viewable in Admin Dashboard → Contacts

---

### Service Pages

Each service has a dedicated page with unique interactive components:

#### Chatbot Development (`/services/chatbot-development`)

**File:** `app/(public)/services/chatbot-development/page.tsx`

**Sections:**

1. Floating Icons Hero - Platform icons (WhatsApp, Slack, Discord, etc.)
2. Video Section
3. Chat Demo - Interactive chat interface
4. Learning Animation - Neural network visualization
5. Accuracy Chart - Performance metrics
6. Case Studies
7. Tech Stack
8. CTA

**CMS Content Keys:** Page: `services-chatbot`

---

#### N8N Automations (`/services/n8n-automations`)

**File:** `app/(public)/services/n8n-automations/page.tsx`

**Sections:**

1. Flux Card Hero - Animated cards
2. Video Section
3. Workflow Builder - Interactive node editor
4. Before/After Slider - Manual vs Automated comparison
5. Performance Metrics - Animated gauges
6. API Integration - Database visualization
7. Case Studies
8. Tech Stack
9. CTA

**CMS Content Keys:** Page: `services-n8n`

---

#### SEO Services (`/services/seo`)

**File:** `app/(public)/services/seo/page.tsx`

**Sections:**

1. Web3 Media Hero
2. Video Section
3. SERP Ranking - Animated ranking visualization
4. Keyword Cloud - Interactive keyword tags
5. Traffic Growth - Animated chart
6. Competitor Analysis - Comparison bars
7. Case Studies
8. Tech Stack
9. CTA

**CMS Content Keys:** Page: `services-seo`

---

#### Shopify (`/services/shopify`)

**File:** `app/(public)/services/shopify/page.tsx`

**Sections:**

1. Services Hero Section
2. Video Section
3. Conversion Funnel - Animated funnel visualization
4. Product Preview - 3D product rotation
5. Dashboard - Real-time metrics
6. Mobile Experience - Phone mockup
7. Case Studies
8. Tech Stack
9. CTA

**CMS Content Keys:** Page: `services-shopify`

---

#### WordPress (`/services/wordpress`)

#### Web Design (`/services/web-design`)

Similar structure with service-specific components.

---

## Admin CMS Dashboard

**Access:** `/admin` (requires authentication)

**Authentication:**

- NextAuth.js with credentials provider
- Roles: `admin`, `editor`, `viewer`
- Session timeout warning component

### Dashboard Layout

**File:** `app/admin/layout.tsx`

**Components:**

- `AdminSidebar` - Left navigation
- `AdminHeader` - Top bar with user info
- `SessionTimeoutWarning` - Security component

---

### Dashboard Home (`/admin`)

**File:** `app/admin/page.tsx`

**Features:**

- Welcome message with user name
- Dashboard stats (Projects, Contacts, Services, Page Views)
- Recent activity feed
- Quick actions panel

**Stats Component:** `components/admin/DashboardStats.tsx`

- Total Projects count
- Contact Messages (with new count)
- Active Services
- Page Views (from analytics)

---

### Pages Management (`/admin/pages`)

**File:** `app/admin/pages/page.tsx`

**Features:**

- List all CMS-managed pages
- Edit page sections
- Toggle section visibility
- Preview changes

**Page Editor:** `app/admin/pages/[id]/page.tsx`

**Editable Pages:**

- Home (14 sections)
- About (8 sections)
- Portfolio (7 sections)
- Contact (5 sections)
- Blog (3 sections)
- Service pages (7-9 sections each)

**How to Edit Page Content:**

1. Go to Admin Dashboard → Pages
2. Select page to edit
3. Expand section to edit
4. Modify JSON content
5. Save changes

---

### Blog Posts (`/admin/blogs`)

**File:** `app/admin/blogs/page.tsx`

**Features:**

- List all blog posts with search
- Create/Edit/Delete posts
- Toggle publish status
- Toggle featured status
- Category filtering

**Blog Post Fields:**
| Field | Type | Description |
|-------|------|-------------|
| title | string | Post title |
| slug | string | URL slug (auto-generated) |
| excerpt | string | Short description |
| content | string | Full content (Markdown) |
| thumbnail | string | Thumbnail image URL |
| coverImage | string | Cover image URL |
| author | string | Author name |
| category | string | Post category |
| tags | string[] | Post tags |
| featured | boolean | Featured flag |
| published | boolean | Publish status |

**API Endpoints:**

- `GET /api/admin/blogs` - List all
- `POST /api/admin/blogs` - Create
- `GET /api/admin/blogs/[id]` - Get one
- `PUT /api/admin/blogs/[id]` - Update
- `DELETE /api/admin/blogs/[id]` - Delete

---

### Projects (`/admin/projects`)

**File:** `app/admin/projects/page.tsx`

**Features:**

- List all portfolio projects
- Create/Edit/Delete projects
- Toggle publish/featured status
- Manage project images and metrics

**Project Fields:**
| Field | Type | Description |
|-------|------|-------------|
| title | string | Project title |
| slug | string | URL slug |
| client | string | Client name |
| description | string | Project description |
| thumbnail | string | Thumbnail URL |
| images | string[] | Gallery images |
| tags | string[] | Technology tags |
| metrics | object[] | Performance metrics |
| featured | boolean | Featured flag |
| published | boolean | Publish status |

**API Endpoints:**

- `GET /api/admin/projects` - List all
- `POST /api/admin/projects` - Create
- `PUT /api/admin/projects/[id]` - Update
- `DELETE /api/admin/projects/[id]` - Delete

---

### Services (`/admin/services`)

**File:** `app/admin/services/page.tsx`

**Features:**

- List all services
- Create/Edit/Delete services
- Drag to reorder
- Toggle publish status

**Service Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | string | Service name |
| slug | string | URL slug |
| description | string | Full description |
| shortDescription | string | Card description |
| icon | string | Emoji icon |
| features | string[] | Feature list |
| published | boolean | Publish status |
| order | number | Display order |

---

### Team Members (`/admin/team`)

**File:** `app/admin/team/page.tsx`

**Features:**

- List all team members
- Create/Edit/Delete members
- Drag to reorder
- Toggle publish status

**Team Member Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | string | Member name |
| role | string | Job title |
| image | string | Photo URL |
| order | number | Display order |
| published | boolean | Publish status |

**Image Path:** `/team/member-name.png`

---

### Testimonials (`/admin/testimonials`)

**File:** `app/admin/testimonials/page.tsx`

**Features:**

- List all testimonials
- Pending review tab (user submissions)
- Approve/Reject submissions
- Create/Edit/Delete testimonials
- Toggle featured status

**Testimonial Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | string | Client name |
| email | string | Client email |
| role | string | Job title |
| company | string | Company name |
| avatar | string | Photo URL |
| text | string | Testimonial text |
| rating | number | 1-5 stars |
| results | string[] | Achievement metrics |
| featured | boolean | Featured flag |
| published | boolean | Publish status |
| status | string | pending/approved/rejected |

---

### Contacts (`/admin/contacts`)

**File:** `app/admin/contacts/page.tsx`

**Features:**

- List all contact form submissions
- Filter by status (new/read/replied/archived)
- View contact details
- Reply via email
- Mark as replied/archived
- Delete contacts

**Contact Fields:**
| Field | Type | Description |
|-------|------|-------------|
| name | string | Sender name |
| email | string | Sender email |
| phone | string | Phone number |
| company | string | Company name |
| service | string | Service interested |
| message | string | Message content |
| status | string | new/read/replied/archived |
| createdAt | date | Submission date |

---

### Analytics (`/admin/analytics`)

**File:** `app/admin/analytics/page.tsx`

**Features:**

- Overview dashboard
- Google Analytics integration
- Search Console integration
- Real-time metrics
- Traffic charts

**Sub-pages:**

- `/admin/analytics/google` - Google Analytics
- `/admin/analytics/search-console` - Search Console

---

### SEO & Marketing (`/admin/seo`)

**File:** `app/admin/seo/page.tsx`

**Comprehensive SEO toolkit with 19 tools organized in 3 categories:**

#### On-Page SEO

| Tool        | Component               | Description                            |
| ----------- | ----------------------- | -------------------------------------- |
| Meta Tags   | `MetaTagsEditor`        | Edit page meta titles and descriptions |
| SEO Audit   | `SEOAudit`              | Full site SEO analysis                 |
| Keywords    | `KeywordTracker`        | Track keyword rankings                 |
| Schema      | `SchemaMarkupGenerator` | Generate structured data               |
| Headings    | `HeadingAnalyzer`       | Analyze heading structure              |
| Image Alt   | `ImageAltManager`       | Manage image alt texts                 |
| Readability | `ContentReadability`    | Content readability scores             |

#### Technical SEO

| Tool           | Component                  | Description              |
| -------------- | -------------------------- | ------------------------ |
| Sitemap        | `SitemapGenerator`         | Generate XML sitemap     |
| Robots.txt     | `RobotsEditor`             | Edit robots.txt          |
| Redirects      | `RedirectManager`          | Manage 301/302 redirects |
| Internal Links | `InternalLinkAnalyzer`     | Analyze link structure   |
| Broken Links   | `BrokenLinkChecker`        | Find broken links        |
| Duplicates     | `DuplicateContentDetector` | Find duplicate content   |
| Hreflang       | `HreflangManager`          | Multi-language tags      |
| Crawl Budget   | `CrawlBudgetMonitor`       | Monitor crawl stats      |
| Page Speed     | `PageSpeedInsights`        | Performance metrics      |

#### Marketing

| Tool           | Component            | Description           |
| -------------- | -------------------- | --------------------- |
| Social Preview | `SocialPreview`      | Preview social shares |
| UTM Builder    | `UTMBuilder`         | Create tracking URLs  |
| Subscribers    | `SubscribersManager` | Manage email list     |
| Lead Magnets   | `LeadMagnetManager`  | Manage lead magnets   |

---

### Design & Customization (`/admin/design`)

**File:** `app/admin/design/page.tsx`

**Tabs:**

#### Theme Settings (`ThemeSettings`)

- Color scheme customization
- Typography settings
- Spacing and layout

#### Navigation Editor (`NavigationEditor`)

- Header navigation
- Footer links
- Mobile menu

#### Custom CSS/JS (`CustomCodeInjection`)

- Add custom CSS
- Add custom JavaScript
- Head/Body injection

---

### Navigation Settings (`/admin/navigation`)

**File:** `app/admin/navigation/page.tsx`

**Comprehensive navigation management with 3 tabs:**

#### Header Tab

- Logo path
- CTA button (label, href, enabled)
- Navigation links (add/remove/reorder/enable)
- Services dropdown links

#### Footer Tab

- Footer logo
- Description text
- Copyright text
- Newsletter toggle
- Link columns (dynamic)

#### Social Links Tab

- 10 social platforms
- URL and enabled toggle for each
- Facebook, Instagram, TikTok, YouTube
- Twitter/X, LinkedIn, Telegram, Discord
- Pinterest, GitHub

---

### Live Chat (`/admin/live-chat`)

**File:** `app/admin/live-chat/page.tsx`

**Features:**

- List all chat conversations
- Filter by status (all/waiting/ai/human/resolved)
- Real-time polling (5 second intervals)
- Audio notification for new waiting chats
- View conversation details
- Reply to customers
- Mark as resolved
- Delete conversations

**Chat Statuses:**
| Status | Description |
|--------|-------------|
| ai | Being handled by AI |
| waiting | Waiting for human agent |
| human | Human agent responding |
| resolved | Conversation closed |

**Conversation View:** `/admin/live-chat/[id]`

- Full message history
- Send replies
- Change status
- Customer info

**AI Chat Integration:**

- Groq API for AI responses
- Knowledge base: `/data/agency-knowledge.md`
- Automatic escalation to human

---

### Media Library (`/admin/media`)

**File:** `app/admin/media/page.tsx`

**Features:**

- Cloudinary integration
- Folder navigation (breadcrumb)
- Grid/List view toggle
- Image/Video filter
- Search files
- Drag & drop upload
- File details panel
- Copy URL
- Delete files

**Folder Structure:**

```
/rising-dot
  /home
  /about
  /portfolio
  /services
  /blog
  /team
```

**Upload Process:**

1. Drag files to upload zone or click "Upload Files"
2. Files upload to current folder
3. Cloudinary processes and optimizes
4. URL available for use in CMS

---

### Users Management (`/admin/users`)

**File:** `app/admin/users/page.tsx`

**Features (Admin only):**

- List all users
- Create/Edit/Delete users
- Assign roles
- Enable/Disable accounts

**User Roles:**
| Role | Permissions |
|------|-------------|
| admin | Full access |
| editor | Content management |
| viewer | Read-only access |

---

### Settings (`/admin/settings`)

**File:** `app/admin/settings/page.tsx`

**Features (Admin only):**

- Site settings
- API configurations
- Security settings
- Backup/Export

---

## Media Management

### Image Locations

| Content Type  | Location                   |
| ------------- | -------------------------- |
| Logo          | `/public/logo.png`         |
| Admin Logo    | `/public/adminlogo.png`    |
| Team Photos   | `/public/team/`            |
| Service Icons | `/public/icons/`           |
| Home Page     | `/public/media/home/`      |
| About Page    | `/public/media/about/`     |
| Portfolio     | `/public/media/portfolio/` |
| Services      | `/public/media/services/`  |
| Blog          | `/public/media/blog/`      |
| Contact       | `/public/media/contact/`   |

### Cloudinary Integration

**Configuration:** `.env`

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Usage in Components:**

```typescript
import {
  getCloudinaryUrl,
  isExternalUrl,
} from '@/components/ui/cloudinary-image';

// Get optimized URL
const url = getCloudinaryUrl('/path/to/image.jpg', { width: 800, height: 600 });
```

### Video Files

| Video            | Location                                   |
| ---------------- | ------------------------------------------ |
| Showreel Desktop | `/public/videos/showreel_desktop_16-9.mp4` |
| Showreel Mobile  | `/public/videos/showreel_mobile_9-16.mp4`  |
| Service Videos   | `/public/media/services/[service]/video/`  |

---

## CMS Content System

### How Content is Stored

Content is stored in MongoDB with the following structure:

```typescript
{
  page: string; // e.g., "home", "about", "services-chatbot"
  section: string; // e.g., "hero", "cta", "testimonials"
  content: object; // JSON content for the section
  visible: boolean; // Section visibility toggle
  updatedAt: Date;
}
```

### useSiteContent Hook

**File:** `lib/hooks/useSiteContent.ts`

**Usage:**

```typescript
const { content, loading, error } = useSiteContent<ContentType>(
  'page',
  'section'
);
```

**Example:**

```typescript
const { content: heroContent } = useSiteContent<{
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}>('home', 'hero');

// Use with fallback
const title = heroContent?.title || 'Default Title';
```

### SectionWrapper Component

**File:** `components/sections/SectionWrapper.tsx`

Wraps sections to enable CMS visibility control:

```tsx
<SectionWrapper page="home" section="hero">
  <Hero />
</SectionWrapper>
```

---

## API Reference

### Public APIs

| Endpoint            | Method | Description          |
| ------------------- | ------ | -------------------- |
| `/api/blogs`        | GET    | List published blogs |
| `/api/blogs/[slug]` | GET    | Get blog by slug     |
| `/api/contact`      | POST   | Submit contact form  |
| `/api/content`      | GET    | Get page content     |
| `/api/testimonials` | GET    | List testimonials    |
| `/api/team`         | GET    | List team members    |
| `/api/chat/start`   | POST   | Start chat session   |
| `/api/chat/message` | POST   | Send chat message    |
| `/api/subscribe`    | POST   | Newsletter subscribe |

### Admin APIs

| Endpoint                  | Method   | Description            |
| ------------------------- | -------- | ---------------------- |
| `/api/admin/blogs`        | CRUD     | Blog management        |
| `/api/admin/projects`     | CRUD     | Project management     |
| `/api/admin/services`     | CRUD     | Service management     |
| `/api/admin/team`         | CRUD     | Team management        |
| `/api/admin/testimonials` | CRUD     | Testimonial management |
| `/api/admin/contacts`     | CRUD     | Contact management     |
| `/api/admin/navigation`   | GET/POST | Navigation settings    |
| `/api/admin/media`        | CRUD     | Media management       |
| `/api/admin/chat`         | CRUD     | Chat management        |
| `/api/admin/seo/*`        | Various  | SEO tools              |
| `/api/admin/analytics`    | GET      | Analytics data         |
| `/api/admin/stats`        | GET      | Dashboard stats        |

---

## Quick Reference: Editing Content

### To Change Homepage Hero:

1. Admin → Pages → Home → Hero section
2. Edit eyebrow, title, subtitle, CTA text/link
3. Save

### To Add a Blog Post:

1. Admin → Blog Posts → New Post
2. Fill in title, content, category, thumbnail
3. Toggle "Publish Now"
4. Save

### To Add Team Member:

1. Admin → Team Members → Add Member
2. Enter name, role, image path
3. Save
4. Add image to `/public/team/`

### To Change Navigation:

1. Admin → Navigation
2. Header tab: Edit nav links, CTA
3. Footer tab: Edit columns, links
4. Social tab: Add social URLs
5. Save Changes

### To Upload Media:

1. Admin → Media Library
2. Navigate to appropriate folder
3. Drag & drop files or click Upload
4. Copy URL for use in CMS

### To Manage SEO:

1. Admin → SEO & Marketing
2. Select tool (Meta Tags, Sitemap, etc.)
3. Make changes
4. Save/Generate

---

## Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# AI Chat
GROQ_API_KEY=your_groq_key

# Email
RESEND_API_KEY=your_resend_key

# Analytics (optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXX
```

---

_Documentation generated for Rising Dot Agency website. Last updated: December 2024_
