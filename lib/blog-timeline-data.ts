export const getBlogTimelineData = () => [
  {
    title: "2025",
    content: (
      <div>
        <p className="text-neutral-300 text-sm mb-4">
          Launched Rising Dot Agency with focus on AI automation and modern web solutions
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#37AFE1]">
            ✅ AI Chatbot Services
          </div>
          <div className="flex items-center gap-2 text-sm text-[#37AFE1]">
            ✅ N8N Automation Solutions
          </div>
          <div className="flex items-center gap-2 text-sm text-[#37AFE1]">
            ✅ Custom Web Design
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Services",
    content: (
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-[#37AFE1]/10 border border-[#37AFE1]/20">
          <h4 className="text-[#37AFE1] font-semibold mb-1">AI Solutions</h4>
          <p className="text-neutral-400 text-sm">Intelligent chatbots & automation</p>
        </div>
        <div className="p-3 rounded-lg bg-[#F58122]/10 border border-[#F58122]/20">
          <h4 className="text-[#F58122] font-semibold mb-1">Web Development</h4>
          <p className="text-neutral-400 text-sm">Modern, responsive designs</p>
        </div>
      </div>
    ),
  },
  {
    title: "Tech Stack",
    content: (
      <div className="grid grid-cols-2 gap-2">
        {['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'MongoDB', 'N8N'].map((tech) => (
          <div key={tech} className="px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-center text-sm text-neutral-300">
            {tech}
          </div>
        ))}
      </div>
    ),
  },
];
