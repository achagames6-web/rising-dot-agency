'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { getCloudinaryUrl, isExternalUrl } from '@/components/ui/cloudinary-image';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  category: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
  }>('home', 'blog');

  // Default values
  const eyebrow = sectionContent?.eyebrow || 'Latest Insights';
  const title = sectionContent?.title || 'From Our';
  const titleHighlight = sectionContent?.titleHighlight || 'Blog';
  const subtitle = sectionContent?.subtitle || 'Stay updated with the latest trends, tips, and insights in web development and digital marketing.';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?limit=4');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="w-12 h-12 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  const featuredBlog = blogs.find(b => b.featured) || blogs[0];
  const otherBlogs = blogs.filter(b => b._id !== featuredBlog._id).slice(0, 3);


  return (
    <section className="py-24 px-6 bg-transparent relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#37AFE1]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F58122]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Blog Grid - Unique Bento Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Post - Large Card */}
          <motion.article
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:row-span-2 group"
          >
            <Link href={`/blog/${featuredBlog.slug}`}>
              <div className="relative h-full min-h-[500px] rounded-3xl overflow-hidden border border-slate-800 hover:border-[#37AFE1]/50 transition-all duration-500">
                {/* Background Image */}
                <div className="absolute inset-0">
                  {featuredBlog.thumbnail ? (
                    <Image
                      src={isExternalUrl(featuredBlog.thumbnail) ? featuredBlog.thumbnail : getCloudinaryUrl(featuredBlog.thumbnail, { width: 800, height: 600 })}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#37AFE1]/30 to-[#F58122]/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#F58122] text-white text-xs font-bold rounded-full">
                      FEATURED
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full">
                      {featuredBlog.category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#37AFE1] transition-colors">
                    {featuredBlog.title}
                  </h3>
                  <p className="text-slate-300 mb-4 line-clamp-2">{featuredBlog.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredBlog.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredBlog.readTime || 5} min
                    </span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          </motion.article>

          {/* Other Posts - Smaller Cards */}
          <div className="space-y-6">
            {otherBlogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="flex gap-5 p-4 bg-[#1E293B]/30 rounded-2xl border border-slate-800/50 hover:border-[#37AFE1]/30 hover:bg-[#1E293B]/50 transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden">
                      {blog.thumbnail ? (
                        <Image
                          src={isExternalUrl(blog.thumbnail) ? blog.thumbnail : getCloudinaryUrl(blog.thumbnail, { width: 200, height: 200 })}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#37AFE1]/20 to-[#F58122]/20" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[#37AFE1] text-xs font-medium">{blog.category}</span>
                      <h4 className="text-white font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-[#37AFE1] transition-colors">
                        {blog.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(blog.publishedAt)}</span>
                        <span>•</span>
                        <span>{blog.readTime || 5} min read</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-[#37AFE1] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <ParticleWrapper>
            <Link href="/blog">
              <StarButton
                className="h-12 px-8 text-base font-semibold hover:scale-105 transition-transform"
                duration={2.5}
              >
                View All Posts
                <ArrowRight className="w-5 h-5" />
              </StarButton>
            </Link>
          </ParticleWrapper>
        </motion.div>
      </div>
    </section>
  );
}
