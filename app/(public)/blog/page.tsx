'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Hero1 } from '@/components/ui/hero-1';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
}

interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

interface FilterContent {
  categories: string[];
  activeColor: string;
}

interface EmptyStateContent {
  title: string;
  subtitle: string;
}

// Default content
const defaultHeroContent: HeroContent = {
  eyebrow: 'Our Blog',
  title: 'Insights & Ideas',
  subtitle: 'Discover the latest trends, tips, and insights in web development, design, and digital marketing.',
  ctaLabel: 'Latest Posts',
  ctaHref: '#posts',
};

const defaultFilterContent: FilterContent = {
  categories: ['All', 'Development', 'Design', 'Marketing', 'Technology', 'Business', 'Tutorial'],
  activeColor: '#37AFE1',
};

const defaultEmptyStateContent: EmptyStateContent = {
  title: 'No blog posts found in this category.',
  subtitle: 'Check back soon for new content!',
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch CMS content
  const { content: heroContent } = useSiteContent<HeroContent>('blog', 'hero');
  const { content: filterContent } = useSiteContent<FilterContent>('blog', 'filter');
  const { content: emptyStateContent } = useSiteContent<EmptyStateContent>('blog', 'emptyState');

  // Use CMS content with fallback to defaults
  const hero = heroContent || defaultHeroContent;
  const filter = filterContent || defaultFilterContent;
  const emptyState = emptyStateContent || defaultEmptyStateContent;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Uses CMS content with fallback */}
      <Hero1
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
      />

      {/* Blog Content */}
      <section id="posts" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter - Uses CMS content with fallback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {filter.categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'text-white shadow-lg'
                    : 'bg-[#1E293B] text-slate-300 hover:text-white'
                }`}
                style={selectedCategory === category ? {
                  backgroundColor: filter.activeColor,
                  boxShadow: `0 10px 15px -3px ${filter.activeColor}4D`,
                } : {}}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Blog Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-slate-400 text-lg">{emptyState.title}</p>
              <p className="text-slate-500 mt-2">{emptyState.subtitle}</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <div className="bg-[#1E293B]/50 rounded-2xl overflow-hidden border border-slate-800 hover:border-[#37AFE1]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#37AFE1]/10">
                      {/* Thumbnail */}
                      <div className="relative h-52 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] to-transparent z-10" />
                        {blog.thumbnail ? (
                          <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#37AFE1]/20 to-[#F58122]/20" />
                        )}
                        <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-[#37AFE1] text-white text-xs font-medium rounded-full">
                          {blog.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#37AFE1] transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                          {blog.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(blog.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {blog.readTime || 5} min read
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#37AFE1] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
