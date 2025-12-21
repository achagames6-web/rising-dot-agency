'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Tag, User, Share2 } from 'lucide-react';
import { Timeline } from '@/components/ui/timeline-animation';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
}

// Parse blog content into timeline sections
function BlogTimeline({ content }: { content: string }) {
  const timelineData = useMemo(() => {
    const sections: { title: string; content: React.ReactNode }[] = [];
    const parts = content.split(/^# /m).filter(Boolean);
    
    parts.forEach((part) => {
      const lines = part.split('\n');
      const title = lines[0]?.trim() || 'Section';
      const sectionContent = lines.slice(1).join('\n').trim();
      
      sections.push({
        title,
        content: (
          <div className="text-slate-300 space-y-4">
            {sectionContent.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-white mt-6 mb-3">
                    {paragraph.slice(3)}
                  </h3>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h4 key={idx} className="text-lg font-semibold text-[#37AFE1] mt-4 mb-2">
                    {paragraph.slice(4)}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="space-y-2 ml-4">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#F58122] mt-1">✓</span>
                        <span>{item.slice(2)}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ),
      });
    });
    
    // If no sections found, create a single section
    if (sections.length === 0) {
      sections.push({
        title: 'Content',
        content: (
          <div className="text-slate-300 leading-relaxed">
            {content}
          </div>
        ),
      });
    }
    
    return sections;
  }, [content]);

  return <Timeline data={timelineData} />;
}

export default function SingleBlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${params.slug}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
        fetchRelatedBlogs(data.category);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category: string) => {
    try {
      const res = await fetch(`/api/blogs?category=${category}&limit=3`);
      const data = await res.json();
      setRelatedBlogs(data.filter((b: BlogPost) => b.slug !== params.slug).slice(0, 2));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
        <p className="text-slate-400 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link
          href="/blog"
          className="flex items-center gap-2 text-[#37AFE1] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {blog.coverImage || blog.thumbnail ? (
            <>
              <Image
                src={blog.coverImage || blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#37AFE1]/10 to-black" />
          )}
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-[#37AFE1] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Category */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 bg-[#37AFE1] text-white text-sm font-medium rounded-full mb-6"
          >
            {blog.category}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            {blog.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-slate-400"
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {blog.readTime || 5} min read
            </span>
            <button
              onClick={sharePost}
              className="flex items-center gap-2 hover:text-[#37AFE1] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </motion.div>
        </div>
      </section>


      {/* Content with Timeline */}
      <section className="py-12">
        <BlogTimeline content={blog.content} />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-slate-800"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-4 h-4 text-slate-500" />
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#1E293B] text-slate-300 text-sm rounded-full hover:bg-[#37AFE1]/20 hover:text-[#37AFE1] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 px-6 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-10 text-center"
            >
              Related <span className="text-[#37AFE1]">Posts</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.article
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${relatedBlog.slug}`}>
                    <div className="bg-[#1E293B]/50 rounded-xl overflow-hidden border border-slate-800 hover:border-[#37AFE1]/50 transition-all duration-300 group">
                      <div className="relative h-40 overflow-hidden">
                        {relatedBlog.thumbnail ? (
                          <Image
                            src={relatedBlog.thumbnail}
                            alt={relatedBlog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#37AFE1]/20 to-[#F58122]/20" />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#37AFE1] transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{relatedBlog.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
