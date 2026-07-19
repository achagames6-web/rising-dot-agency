import { NextRequest, NextResponse } from 'next/server';

// Static blog posts — edit here to update your blog section
const staticBlogs = [
  {
    _id: '1',
    title: 'How We Built a Custom Shopify Store That Tripled Conversions',
    slug: 'shopify-store-triple-conversions',
    excerpt:
      'A deep dive into how thoughtful UX design and strategic product layouts turned a struggling Shopify store into a revenue machine.',
    thumbnail:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1470&auto=format&fit=crop',
    author: 'Ahmad',
    category: 'Shopify',
    publishedAt: '2025-06-15T00:00:00.000Z',
    readTime: 6,
    featured: true,
  },
  {
    _id: '2',
    title: 'N8N Automation: Save 20+ Hours a Week on Repetitive Tasks',
    slug: 'n8n-automation-save-time',
    excerpt:
      'We walk through 5 real automation workflows we built for clients using N8N that eliminated manual work and reduced errors.',
    thumbnail:
      'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1474&auto=format&fit=crop',
    author: 'Ahmad',
    category: 'Automation',
    publishedAt: '2025-05-28T00:00:00.000Z',
    readTime: 8,
    featured: true,
  },
  {
    _id: '3',
    title: 'WordPress vs Shopify: Which Platform Is Right for Your Business?',
    slug: 'wordpress-vs-shopify-2025',
    excerpt:
      'We break down the pros, cons, and ideal use cases for both platforms so you can make the right choice for your business.',
    thumbnail:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1474&auto=format&fit=crop',
    author: 'Ahmad',
    category: 'Web Design',
    publishedAt: '2025-05-10T00:00:00.000Z',
    readTime: 5,
    featured: false,
  },
  {
    _id: '4',
    title: 'SEO in 2025: What Actually Moves the Needle',
    slug: 'seo-strategies-2025',
    excerpt:
      'AI-generated content, Core Web Vitals, and topical authority — here is what is actually working in SEO right now.',
    thumbnail:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop',
    author: 'Ahmad',
    category: 'SEO',
    publishedAt: '2025-04-22T00:00:00.000Z',
    readTime: 7,
    featured: false,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const featured = searchParams.get('featured');
  const category = searchParams.get('category');

  let blogs = [...staticBlogs];

  if (featured === 'true') {
    blogs = blogs.filter((b) => b.featured);
  }

  if (category) {
    blogs = blogs.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (limitParam) {
    blogs = blogs.slice(0, parseInt(limitParam));
  }

  return NextResponse.json(blogs);
}
