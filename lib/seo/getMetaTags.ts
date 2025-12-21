import clientPromise from '@/lib/db/mongodb';
import { Metadata } from 'next';

interface PageMeta {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
}

const defaultMeta: Record<string, Partial<PageMeta>> = {
  '/': {
    title: 'Rising Dot Agency | Digital Excellence Delivered',
    description: 'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.',
  },
  '/about': {
    title: 'About Us | Rising Dot Agency',
    description: 'Meet the team behind Rising Dot Agency. We are passionate developers, designers, and strategists dedicated to creating exceptional digital experiences.',
  },
  '/services': {
    title: 'Our Services | Rising Dot Agency',
    description: 'Comprehensive digital solutions including web design, chatbot development, N8N automations, WordPress, Shopify, and SEO services.',
  },
  '/portfolio': {
    title: 'Our Work | Rising Dot Agency',
    description: 'Explore our portfolio of successful projects and see how we have helped businesses transform their digital presence.',
  },
  '/contact': {
    title: 'Contact Us | Rising Dot Agency',
    description: 'Get in touch with Rising Dot Agency. Let us discuss your project and how we can help you achieve your digital goals.',
  },
  '/blog': {
    title: 'Blog | Rising Dot Agency',
    description: 'Insights, tips, and news about web development, automation, AI, and digital marketing from the Rising Dot team.',
  },
};

export async function getMetaTags(path: string): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';
  
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');
    
    const meta = await db.collection('seoMeta').findOne({ path }) as PageMeta | null;
    const defaults = defaultMeta[path] || {};

    const title = meta?.title || defaults.title || 'Rising Dot Agency';
    const description = meta?.description || defaults.description || '';
    const ogTitle = meta?.ogTitle || title;
    const ogDescription = meta?.ogDescription || description;
    const ogImage = meta?.ogImage || `${baseUrl}/og-image.jpg`;
    const canonicalUrl = meta?.canonicalUrl || `${baseUrl}${path}`;

    const robots: string[] = [];
    if (meta?.noIndex) robots.push('noindex');
    if (meta?.noFollow) robots.push('nofollow');

    return {
      title,
      description,
      keywords: meta?.keywords || '',
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: 'Rising Dot Agency',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: meta?.twitterCard || 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: robots.length > 0 ? robots.join(', ') : undefined,
    };
  } catch (error) {
    console.error('Error fetching meta tags:', error);
    
    // Return defaults on error
    const defaults = defaultMeta[path] || {};
    return {
      title: defaults.title || 'Rising Dot Agency',
      description: defaults.description || '',
    };
  }
}
