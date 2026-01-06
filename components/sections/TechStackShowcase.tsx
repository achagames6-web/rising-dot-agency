'use client';

import React from 'react';

const techStack = [
  {
    id: 1,
    icon: "⚛️",
    title: "React & Next.js",
    description: "Modern JavaScript frameworks for blazing-fast, SEO-friendly web applications",
    color: "from-[#37AFE1] to-[#31A4DB]"
  },
  {
    id: 2,
    icon: "🎨",
    title: "Tailwind CSS",
    description: "Utility-first CSS framework for rapidly building custom user interfaces",
    color: "from-[#F58122] to-[#FF9E5C]"
  },
  {
    id: 3,
    icon: "🗄️",
    title: "MongoDB",
    description: "Flexible NoSQL database for scalable, high-performance data storage",
    color: "from-[#37AFE1] to-[#F58122]"
  },
  {
    id: 4,
    icon: "🔗",
    title: "API Integration",
    description: "Seamless connections between your tools and platforms",
    color: "from-[#31A4DB] to-[#37AFE1]"
  },
  {
    id: 5,
    icon: "⚡",
    title: "Edge Computing",
    description: "Lightning-fast performance with globally distributed infrastructure",
    color: "from-[#F58122] to-[#37AFE1]"
  },
  {
    id: 6,
    icon: "🔒",
    title: "Enterprise Security",
    description: "Bank-level encryption and security protocols for your data",
    color: "from-[#37AFE1] to-[#F58122]"
  }
];

export default function TechStackShowcase() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/10 px-5 py-2 backdrop-blur-sm">
              <span className="text-xl">⚡</span>
              <span className="text-sm font-medium text-white/90">Technology</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Powered By </span>
            <span className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                    backgroundSize: '300% 100%',
                    animation: 'gradient-shift 4s ease-in-out infinite'
                  }}>
              Cutting-Edge Tech
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We leverage the latest technologies to build scalable, secure, and high-performance solutions
          </p>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech) => (
            <div key={tech.id} className="relative group">
              {/* Gradient Border */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${tech.color} rounded-xl blur opacity-20 group-hover:opacity-100 transition duration-500`}></div>
              
              {/* Card Content */}
              <div className="relative bg-slate-900 rounded-xl p-8 h-full">
                {/* Icon */}
                <div className="text-5xl mb-4">{tech.icon}</div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {tech.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
