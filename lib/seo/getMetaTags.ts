import { Metadata } from 'next';

const defaultMeta: Record<string, Partial<Metadata>> = {
  '/': {
    title: 'Rising Dot Agency | Digital Excellence Delivered',
    description:
      'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.',
  },
  '/about': {
    title: 'About Us | Rising Dot Agency',
    description:
      'Meet the team behind Rising Dot Agency — passionate developers, designers, and strategists dedicated to exceptional digital experiences.',
  },
  '/services': {
    title: 'Our Services | Rising Dot Agency',
    description:
      'Comprehensive digital solutions including web design, chatbot development, N8N automations, WordPress, Shopify, and SEO services.',
  },
  '/portfolio': {
    title: 'Our Work | Rising Dot Agency',
    description:
      'Explore our portfolio of successful projects and see how we have helped businesses transform their digital presence.',
  },
  '/contact': {
    title: 'Contact Us | Rising Dot Agency',
    description:
      'Get in touch with Rising Dot Agency. Let us discuss your project and how we can help you achieve your digital goals.',
  },
  '/blog': {
    title: 'Blog | Rising Dot Agency',
    description:
      'Insights, tips, and news about web development, automation, AI, and digital marketing from the Rising Dot team.',
  },
};

export async function getMetaTags(path: string): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';

  const defaults = defaultMeta[path] || {};
  const title = (defaults.title as string) || 'Rising Dot Agency';
  const description = (defaults.description as string) || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'Rising Dot Agency',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
  };
}
