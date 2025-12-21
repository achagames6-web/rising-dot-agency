# Rising Dot Agency Website

Ultra-advanced, physics-driven, animation-rich website built with Next.js 14, React 18, and TypeScript.

## Features

- 🎨 **Immersive Animations**: GSAP, Framer Motion, Three.js, and custom physics engines
- ⚡ **Hybrid Content Architecture**: Static JSON files for ultra-fast page loads (8x faster)
- 🎯 **Custom CMS**: Built-in content management with visual page builder
- 🚀 **Performance Optimized**: Adaptive quality engine, lazy loading, and code splitting
- ♿ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- 🔒 **Secure**: NextAuth.js with 2FA, JWT tokens, and input sanitization
- 📱 **Responsive**: Optimized for desktop, tablet, and mobile devices

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 (Concurrent Mode)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4, CSS Modules

### Animation & Physics

- **GSAP 3.12.5**: Master timeline control and ScrollTrigger
- **Framer Motion 11.5**: React component animations
- **Three.js 0.160**: WebGL 3D graphics
- **React Three Fiber 8.x**: Declarative Three.js
- **Matter.js 0.18.0**: 2D physics simulation
- **Lenis 1.0.47**: Smooth momentum scrolling

### Backend & Database

- **Vercel Postgres**: Serverless PostgreSQL database
- **Vercel KV**: Redis-compatible caching
- **Vercel Blob**: File storage for media
- **NextAuth.js 4.24**: Authentication with JWT and OAuth

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Vercel account (for database and deployment)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rising-dot-website
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Fill in the required environment variables in `.env`:

- `MONGODB_URI` - MongoDB Atlas connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- OAuth credentials (optional)
- Cloudinary credentials (for media)

4. Generate static content:

```bash
npm run generate:content
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── animations/       # Animation components
│   ├── sections/         # Page sections
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── physics/          # Physics engines
│   ├── animations/       # Animation utilities
│   ├── db/               # Database utilities
│   ├── cache/            # Caching utilities
│   ├── storage/          # File storage utilities
│   └── auth/             # Authentication utilities
├── public/                # Static assets
├── scripts/               # Build and migration scripts
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes content generation)
- `npm run start` - Start production server
- `npm run generate:content` - Generate static content from MongoDB
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Content Management

This website uses a **hybrid static/dynamic content architecture** for optimal performance:

### Static Content (Pages)

- Page content is stored in MongoDB (source of truth)
- During build, content is exported to static JSON files in `/public/content/`
- Pages load from these static files (8x faster than API calls)
- Managed via Content Manager at `/admin/content`

### Dynamic Content (Blogs)

- Blog posts remain fully dynamic (real-time MongoDB queries)
- Immediate updates when published
- Managed via Blogs admin at `/admin/blogs`

### Editing Content

1. Login to admin dashboard (`/admin`)
2. Navigate to Content Manager
3. Edit content sections with JSON editor
4. Save & regenerate to apply changes

For detailed information, see:

- `CONTENT_MANAGEMENT.md` - Architecture documentation
- `TESTING_DEPLOYMENT_GUIDE.md` - Testing and deployment guide

## Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Run `npm run lint` and `npm run type-check` to ensure code quality
4. Run `npm run format` to format your code
5. Commit your changes (pre-commit hooks will run automatically)
6. Push your branch and create a pull request

## Deployment

The website is designed to be deployed on Vercel or similar platforms:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables (especially `MONGODB_URI`)
4. Deploy

The build process will automatically:

- Generate static content from MongoDB (`npm run generate:content`)
- Build the Next.js application
- Deploy to CDN for ultra-fast global delivery

**Important**: Ensure `MONGODB_URI` is set in your deployment environment variables so content can be generated during builds.

## Performance Targets

- **Lighthouse Score**: 95+
- **LCP**: < 1.8s (target: ~300ms with static content)
- **FID**: < 10ms
- **CLS**: < 0.05
- **Desktop FPS**: 60fps
- **Mobile FPS**: 45fps
- **Page Load Time**: ~300-500ms (8x improvement with hybrid architecture)

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Reduced motion support
- Color contrast ratios ≥ 4.5:1

## License

Proprietary - Rising Dot Agency

## Support

For questions or issues, contact the development team.
