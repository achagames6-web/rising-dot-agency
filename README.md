# Rising Dot Agency Website

Ultra-advanced, physics-driven, animation-rich website built with Next.js 14, React 18, and TypeScript.

## Features

- 🎨 **Immersive Animations**: GSAP, Framer Motion, Three.js, and custom physics engines
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
- Vercel Postgres credentials
- Vercel KV credentials
- Vercel Blob token
- NextAuth secret and OAuth credentials (optional)

4. Initialize the database:
```bash
npm run db:migrate
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
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations

## Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Run `npm run lint` and `npm run type-check` to ensure code quality
4. Run `npm run format` to format your code
5. Commit your changes (pre-commit hooks will run automatically)
6. Push your branch and create a pull request

## Deployment

The website is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

Vercel will automatically:
- Build the Next.js application
- Set up the Postgres database
- Configure KV caching
- Set up Blob storage
- Deploy to the edge network

## Performance Targets

- **Lighthouse Score**: 95+
- **LCP**: < 1.8s
- **FID**: < 10ms
- **CLS**: < 0.05
- **Desktop FPS**: 60fps
- **Mobile FPS**: 45fps

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
