export const getBlogTimelineData = () => [
  {
    title: '2025',
    content: (
      <div>
        <p className="mb-4 text-sm text-neutral-300">
          Launched Rising Dot Agency with focus on AI automation and modern web
          solutions
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
    title: 'Services',
    content: (
      <div className="space-y-3">
        <div className="rounded-lg border border-[#37AFE1]/20 bg-[#37AFE1]/10 p-3">
          <h4 className="mb-1 font-semibold text-[#37AFE1]">AI Solutions</h4>
          <p className="text-sm text-neutral-400">
            Intelligent chatbots & automation
          </p>
        </div>
        <div className="rounded-lg border border-[#F58122]/20 bg-[#F58122]/10 p-3">
          <h4 className="mb-1 font-semibold text-[#F58122]">Web Development</h4>
          <p className="text-sm text-neutral-400">Modern, responsive designs</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Tech Stack',
    content: (
      <div className="grid grid-cols-2 gap-2">
        {[
          'Next.js',
          'React',
          'TypeScript',
          'TailwindCSS',
          'MongoDB',
          'N8N',
        ].map((tech) => (
          <div
            key={tech}
            className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-center text-sm text-neutral-300"
          >
            {tech}
          </div>
        ))}
      </div>
    ),
  },
];
