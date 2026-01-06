'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: number;
  badge: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  link: string;
  reverse?: boolean;
}

const services: Service[] = [
  {
    id: 1,
    badge: "Automation",
    icon: "⚡",
    title: "N8N Automations",
    description: "Streamline your business workflows with powerful N8N automation solutions. We build custom integrations that connect your apps, automate repetitive tasks, and save you countless hours.",
    image: "/media/home/featured-services/n8n-automations.jpg",
    features: [
      "Custom workflow design",
      "API integrations",
      "Real-time monitoring",
      "Scalable solutions"
    ],
    link: "/services/n8n-automations"
  },
  {
    id: 2,
    badge: "AI Solutions",
    icon: "🤖",
    title: "Chatbot Development",
    description: "AI-powered conversational interfaces that engage users and provide instant support 24/7. Create intelligent chatbots that understand context and deliver personalized experiences.",
    image: "/media/home/featured-services/chatbot-development.jpg",
    features: [
      "Natural language processing",
      "Multi-platform support",
      "Custom training",
      "Analytics dashboard"
    ],
    link: "/services/chatbot-development",
    reverse: true
  },
  {
    id: 3,
    badge: "Design",
    icon: "🎨",
    title: "Web Design",
    description: "Beautiful, responsive websites that captivate visitors and drive conversions. We combine stunning aesthetics with intuitive user experiences to create digital masterpieces.",
    image: "/media/home/featured-services/web-design.jpg",
    features: [
      "Responsive design",
      "UI/UX optimization",
      "Brand identity",
      "Performance focused"
    ],
    link: "/services/web-design"
  }
];

export default function ServicesShowcase() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F58122]/30 bg-[#F58122]/10 px-5 py-2 backdrop-blur-sm">
              <span className="text-xl">✨</span>
              <span className="text-sm font-medium text-white/90">What We Offer</span>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Premium </span>
            <span className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                    backgroundSize: '300% 100%',
                    animation: 'gradient-shift 4s ease-in-out infinite'
                  }}>
              Digital Services
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive solutions tailored to elevate your digital presence and drive measurable results
          </p>
        </div>

        {/* Services Grid - Alternating Layout */}
        <div className="space-y-24">
          {services.map((service) => (
            <div key={service.id} 
                 className={`flex flex-col ${service.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
              
              {/* Image Card */}
              <div className="lg:w-1/2">
                <div className="relative group">
                  {/* Gradient Border Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#37AFE1] to-[#F58122] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  
                  {/* Image Container */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-1">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-[400px] object-cover rounded-xl"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-6">
                      <span className="text-white font-semibold text-lg">View Details →</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-4 backdrop-blur-sm">
                  <span className="text-xl">{service.icon}</span>
                  <span className="text-sm font-medium text-white/80">{service.badge}</span>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#37AFE1] to-[#F58122] flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={service.link}
                   className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#37AFE1] to-[#F58122] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#37AFE1]/50 transition-all duration-300 group">
                  Learn More
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
