/**
 * SEO Utilities
 * Provides functions for SEO optimization and metadata generation
 */

export interface MetaTags {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * Generates meta tags for SEO
 */
export function generateMetaTags(meta: MetaTags): string {
  const tags: string[] = [];
  
  // Basic meta tags
  tags.push(`<title>${escapeHtml(meta.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  
  if (meta.keywords) {
    tags.push(`<meta name="keywords" content="${escapeHtml(meta.keywords)}" />`);
  }
  
  if (meta.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  }
  
  // Open Graph tags
  tags.push(`<meta property="og:title" content="${escapeHtml(meta.ogTitle || meta.title)}" />`);
  tags.push(`<meta property="og:description" content="${escapeHtml(meta.ogDescription || meta.description)}" />`);
  
  if (meta.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`);
  }
  
  if (meta.ogUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(meta.ogUrl)}" />`);
  }
  
  tags.push(`<meta property="og:type" content="website" />`);
  
  // Twitter Card tags
  tags.push(`<meta name="twitter:card" content="${meta.twitterCard || 'summary_large_image'}" />`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(meta.twitterTitle || meta.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(meta.twitterDescription || meta.description)}" />`);
  
  if (meta.twitterImage || meta.ogImage) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(meta.twitterImage || meta.ogImage || '')}" />`);
  }
  
  return tags.join('\n');
}

/**
 * Generates Schema.org structured data
 */
export function generateStructuredData(data: StructuredData): string {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
}

/**
 * Creates Organization structured data
 */
export function createOrganizationSchema(org: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}): StructuredData {
  const schema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
  };
  
  if (org.logo) {
    schema.logo = org.logo;
  }
  
  if (org.description) {
    schema.description = org.description;
  }
  
  if (org.address) {
    schema.address = {
      '@type': 'PostalAddress',
      ...org.address,
    };
  }
  
  if (org.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      ...org.contactPoint,
    };
  }
  
  if (org.sameAs) {
    schema.sameAs = org.sameAs;
  }
  
  return schema;
}

/**
 * Creates Service structured data
 */
export function createServiceSchema(service: {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider.name,
      url: service.provider.url,
    },
    ...(service.areaServed && { areaServed: service.areaServed }),
    ...(service.serviceType && { serviceType: service.serviceType }),
  };
}

/**
 * Creates Review structured data
 */
export function createReviewSchema(review: {
  itemReviewed: {
    name: string;
    type: string;
  };
  author: {
    name: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
  };
  reviewBody: string;
  datePublished?: string;
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': review.itemReviewed.type,
      name: review.itemReviewed.name,
    },
    author: {
      '@type': 'Person',
      name: review.author.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating.ratingValue,
      bestRating: review.reviewRating.bestRating || 5,
    },
    reviewBody: review.reviewBody,
    ...(review.datePublished && { datePublished: review.datePublished }),
  };
}

/**
 * Generates XML sitemap
 */
export function generateSitemap(urls: {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}[]): string {
  const urlEntries = urls.map((url) => {
    let entry = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`;
    
    if (url.lastmod) {
      entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }
    
    if (url.changefreq) {
      entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority !== undefined) {
      entry += `\n    <priority>${url.priority}</priority>`;
    }
    
    entry += '\n  </url>';
    return entry;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generates robots.txt content
 */
export function generateRobotsTxt(config: {
  userAgent?: string;
  allow?: string[];
  disallow?: string[];
  sitemap?: string;
  crawlDelay?: number;
}): string {
  const lines: string[] = [];
  
  lines.push(`User-agent: ${config.userAgent || '*'}`);
  
  if (config.allow) {
    config.allow.forEach((path) => {
      lines.push(`Allow: ${path}`);
    });
  }
  
  if (config.disallow) {
    config.disallow.forEach((path) => {
      lines.push(`Disallow: ${path}`);
    });
  }
  
  if (config.crawlDelay) {
    lines.push(`Crawl-delay: ${config.crawlDelay}`);
  }
  
  if (config.sitemap) {
    lines.push('');
    lines.push(`Sitemap: ${config.sitemap}`);
  }
  
  return lines.join('\n');
}

/**
 * Optimizes image alt text for SEO
 */
export function generateImageAlt(context: {
  subject: string;
  action?: string;
  location?: string;
  keywords?: string[];
}): string {
  const parts: string[] = [];
  
  if (context.action) {
    parts.push(context.action);
  }
  
  parts.push(context.subject);
  
  if (context.location) {
    parts.push(`in ${context.location}`);
  }
  
  let alt = parts.join(' ');
  
  // Add keywords naturally if provided
  if (context.keywords && context.keywords.length > 0) {
    const keyword = context.keywords[0];
    if (!alt.toLowerCase().includes(keyword.toLowerCase())) {
      alt += ` - ${keyword}`;
    }
  }
  
  return alt;
}

/**
 * Validates SEO meta tags
 */
export function validateSEO(html: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;
  
  // Check for title tag
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) {
    errors.push('Missing <title> tag');
    score -= 20;
  } else {
    const titleLength = titleMatch[1].length;
    if (titleLength < 30) {
      warnings.push('Title is too short (< 30 characters)');
      score -= 5;
    } else if (titleLength > 60) {
      warnings.push('Title is too long (> 60 characters)');
      score -= 5;
    }
  }
  
  // Check for meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (!descMatch) {
    errors.push('Missing meta description');
    score -= 20;
  } else {
    const descLength = descMatch[1].length;
    if (descLength < 120) {
      warnings.push('Meta description is too short (< 120 characters)');
      score -= 5;
    } else if (descLength > 160) {
      warnings.push('Meta description is too long (> 160 characters)');
      score -= 5;
    }
  }
  
  // Check for canonical URL
  if (!html.match(/<link\s+rel=["']canonical["']/i)) {
    warnings.push('Missing canonical URL');
    score -= 5;
  }
  
  // Check for Open Graph tags
  if (!html.match(/<meta\s+property=["']og:title["']/i)) {
    warnings.push('Missing Open Graph title');
    score -= 5;
  }
  
  if (!html.match(/<meta\s+property=["']og:description["']/i)) {
    warnings.push('Missing Open Graph description');
    score -= 5;
  }
  
  if (!html.match(/<meta\s+property=["']og:image["']/i)) {
    warnings.push('Missing Open Graph image');
    score -= 5;
  }
  
  // Check for structured data
  if (!html.match(/<script\s+type=["']application\/ld\+json["']/i)) {
    warnings.push('Missing structured data (Schema.org)');
    score -= 10;
  }
  
  // Check for images without alt text
  const imgMatches = html.match(/<img[^>]*>/gi);
  if (imgMatches) {
    imgMatches.forEach((img) => {
      if (!img.match(/alt=["'][^"']*["']/i)) {
        warnings.push('Image missing alt text');
        score -= 2;
      }
    });
  }
  
  // Ensure score doesn't go below 0
  score = Math.max(0, score);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score,
  };
}

/**
 * Helper function to escape HTML
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Helper function to escape XML
 */
function escapeXml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
