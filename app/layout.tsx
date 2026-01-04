import type { Metadata } from 'next';
import { Montserrat, Inter, Fira_Code } from 'next/font/google';
import dynamic from 'next/dynamic';
import '@/components/framer/styles.css';
import './globals.css';

// Dynamic imports for client-only components
const MagneticCursor = dynamic(() => import('@/components/MagneticCursor'), {
  ssr: false,
});

const GlobalBackground = dynamic(
  () => import('@/components/GlobalBackground'),
  {
    ssr: false,
  }
);

const CookieConsent = dynamic(
  () =>
    import('@/components/security/CookieConsent').then(
      (mod) => mod.CookieConsent
    ),
  { ssr: false }
);

const AnalyticsTracker = dynamic(
  () => import('@/components/analytics/AnalyticsTracker'),
  {
    ssr: false,
  }
);

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rising Dot Agency',
  description:
    'Premium digital solutions provider specializing in N8N Automations, Chatbot Development, Web Design, WordPress, Shopify, and SEO services.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    // Resource hints for performance
    preconnect: 'https://fonts.googleapis.com',
    'dns-prefetch': 'https://fonts.gstatic.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${firaCode.variable}`}
    >
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-[#0F172A] font-inter">
        <GlobalBackground />
        <MagneticCursor />
        {children}
        <CookieConsent />
        <AnalyticsTracker />
        <ChatWidget />
      </body>
    </html>
  );
}
