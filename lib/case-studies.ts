// lib/case-studies.ts
//
// The long form behind each project. The homepage carries a sentence; this
// carries the story, and it is what search engines actually index.
//
// Every field is written from work that shipped. Where a number appears it is
// one we can point at - there are no invented percentages here, because a
// case study is the last place a reader forgives an exaggeration.

export type CaseSection = {
  heading: string;
  body: string[];
};

export type CaseStudy = {
  slug: string;
  /** Matches the title in lib/hero/journey WORK, so the two never diverge. */
  title: string;
  kind: string;
  year: string;
  /** One line, used on cards and as the meta description seed. */
  summary: string;
  /** Search-facing: 150-160 characters, written for a result page. */
  metaDescription: string;
  keywords: string[];
  image?: string;
  /** The service page this work belongs to. */
  service: { label: string; href: string };
  stack: string[];
  /** What it was like before, and after. Drives the shift block. */
  before: string[];
  after: string[];
  /** The build, in order. */
  steps: { title: string; body: string }[];
  /** Longer prose sections. */
  sections: CaseSection[];
  /** Honest outcomes. No percentages we cannot evidence. */
  outcomes: { value: string; label: string }[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'curbside-laundry',
    title: 'Curbside Laundry',
    kind: 'SaaS · Toronto',
    year: '2025',
    summary:
      'A pickup and delivery laundry platform, with an operations dashboard that runs the whole business.',
    metaDescription:
      'Case study: a Toronto pickup and delivery laundry platform with online booking and an owner dashboard for orders, drivers, routes, payments and inventory.',
    keywords: [
      'laundry pickup and delivery software',
      'laundry booking web app',
      'operations dashboard development',
      'custom SaaS development',
    ],
    image: '/Projects/curbside-laundry.jpg',
    service: { label: 'SaaS development', href: '/services/saas' },
    stack: ['Next.js', 'Web app', 'CRM dashboard', 'Payments'],
    before: [
      'Orders arrived by phone and messages, at any hour',
      'Driver routes were worked out by hand each morning',
      'Payments were chased one customer at a time',
      'Nobody could answer "how many orders are open" without counting',
    ],
    after: [
      'Customers book a pickup themselves in a few minutes',
      'Drivers, routes and service areas are managed in one place',
      'Payments, promo codes and inventory sit in the same dashboard',
      'Open orders, revenue and processing time are visible at a glance',
    ],
    steps: [
      {
        title: 'Booking that finishes',
        body: 'A short multi-step flow: address, schedule, service, payment. Each step validates before the next, so a customer never reaches the end and discovers the slot was unavailable.',
      },
      {
        title: 'The operations dashboard',
        body: 'Total orders, pending orders, customers, revenue, active drivers and average processing time on one screen, with a live activity feed underneath.',
      },
      {
        title: 'Driver and route management',
        body: 'Scheduling, assignment and service-area rules, so dispatch stops being a manual decision made twice a day.',
      },
      {
        title: 'The commercial layer',
        body: 'Payments, promo codes, inventory and pickup queues, plus customer communications, all in the same interface rather than four separate tools.',
      },
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Laundry pickup is a simple promise and a complicated operation. The customer wants a time slot and a price. The owner needs to know which orders are open, which driver is nearest, what has been paid for, and what is sitting in the building.',
          'Before this build, all of that lived in messages, notebooks and the owner\u2019s memory. The business could not grow without the owner being awake.',
        ],
      },
      {
        heading: 'What we built',
        body: [
          'Two halves of one system. A customer-facing booking flow that takes a few minutes and is honest about price and turnaround, and a dashboard that gives the owner control of the entire operation.',
          'The dashboard is the part that mattered. Orders, driver scheduling and assignments, service areas, payments, promo codes, inventory and pickup queues, with a recent-activity feed so the state of the business is legible at a glance.',
        ],
      },
      {
        heading: 'Why it holds up',
        body: [
          'Booking and operations were designed together rather than bolted to each other. A change to service areas immediately changes what a customer can book, because both read the same source.',
          'The owner can answer any question about the business from one screen. That is the difference between a website and a system.',
        ],
      },
    ],
    outcomes: [
      { value: '24–48h', label: 'Stated turnaround, end to end' },
      { value: '1', label: 'Dashboard replacing four tools' },
      { value: '0', label: 'Orders taken by phone at 2am' },
    ],
  },

  {
    slug: 'dredd-ai',
    title: 'DREDD AI',
    kind: 'AI · Blockchain risk',
    year: '2025',
    summary:
      'Paste a token address, get a readable verdict. On-chain data through risk heuristics, then a fine-tuned model.',
    metaDescription:
      'Case study: an AI blockchain risk analysis platform. Paste a token address and get a readable verdict from live on-chain data across five chains.',
    keywords: [
      'AI crypto risk analysis',
      'token risk checker',
      'blockchain AI chatbot development',
      'n8n AI workflow',
    ],
    image: '/Projects/dredd-ai.jpg',
    service: {
      label: 'AI chatbot development',
      href: '/services/chatbot-development',
    },
    stack: ['Chat dashboard', 'n8n backend', 'Fine-tuned LLM', 'Multi-chain'],
    before: [
      'Checking a token meant opening four explorers at once',
      'Holder concentration and liquidity read manually, chart by chart',
      'The answer was a guess dressed up as research',
    ],
    after: [
      'One address, one answer, in conversation',
      'Heuristics applied the same way to every token',
      'Five chains supported behind a single input',
    ],
    steps: [
      {
        title: 'The conversation, not a form',
        body: 'A chat dashboard rather than a report generator: paste an address, get a verdict, ask a follow-up. Two response modes, Standard and Psycho, for people who want the analysis blunt.',
      },
      {
        title: 'The workflow behind it',
        body: 'A submitted token triggers an n8n workflow that pulls live on-chain data, rather than an application calling an API and hoping.',
      },
      {
        title: 'Risk heuristics',
        body: 'Holder concentration, liquidity, contract issues and suspicious transfer patterns, evaluated consistently for every token so two checks are comparable.',
      },
      {
        title: 'The readable part',
        body: 'The evaluation is fed to a fine-tuned model that turns it into a human answer inside the same conversation, instead of leaving the user to interpret raw numbers.',
      },
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'On-chain data is public and almost useless to a non-specialist. The information that tells you whether a token is dangerous is spread across explorers, and it takes experience to weigh it.',
          'The gap was never access to data. It was interpretation.',
        ],
      },
      {
        heading: 'What we built',
        body: [
          'A conversational dashboard with an automation backend. The interface is deliberately plain: an address goes in, an analysis comes back, and the conversation continues.',
          'Behind it, an n8n workflow gathers live chain data, runs it against risk heuristics, and hands the result to a fine-tuned model for the write-up. Ethereum, BSC, Polygon, Solana and PulseChain are supported.',
        ],
      },
      {
        heading: 'Why the architecture matters',
        body: [
          'Putting the analysis in a workflow rather than in application code means a heuristic can be changed, retried or rerun without redeploying the product.',
          'It also means each stage is inspectable. When a verdict looks wrong, you can see which step produced it.',
        ],
      },
    ],
    outcomes: [
      { value: '5', label: 'Chains supported' },
      { value: '2', label: 'Response modes' },
      { value: '1', label: 'Input: the token address' },
    ],
  },

  {
    slug: 'seo-command-center',
    title: 'SEO Command Center',
    kind: 'Platform · Internal',
    year: '2025',
    summary:
      'Product SEO for e-commerce at catalogue scale, with a review queue so nothing publishes unseen.',
    metaDescription:
      'Case study: an SEO automation platform that scores and drafts product-page SEO for Shopify catalogues, with a review queue before anything publishes.',
    keywords: [
      'ecommerce SEO automation',
      'Shopify product SEO tool',
      'n8n SEO workflow',
      'bulk product page optimisation',
    ],
    image: '/Projects/seo-command-center.jpg',
    service: { label: 'SEO services', href: '/services/seo' },
    stack: ['Dashboard', 'n8n', 'Google Gemini', 'Supabase'],
    before: [
      'Product pages edited one at a time, when someone had an afternoon',
      'No consistent standard between one product and the next',
      'No way to know what still needed work',
    ],
    after: [
      'The whole catalogue scored automatically',
      'Generated copy waits in a review queue',
      'A dashboard shows pending, needs-review, completed and published',
    ],
    steps: [
      {
        title: 'Intake',
        body: 'A webhook receives product data, an init step normalises it, and routing logic decides whether the item is new or already known.',
      },
      {
        title: 'Source and research',
        body: 'Product data is fetched from the live store feeds, then a research and prompt-preparation step assembles the context the model will work from.',
      },
      {
        title: 'Generation',
        body: 'Google Gemini produces the SEO content, which is parsed and built into final HTML rather than pasted as raw model output.',
      },
      {
        title: 'Store and review',
        body: 'Results are written to Supabase and surfaced in the dashboard, where the team reviews, approves and publishes. Nothing reaches the storefront unreviewed.',
      },
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Product SEO at catalogue scale is a volume problem disguised as a writing problem. Two hundred products need two hundred descriptions that are consistent, accurate and worth indexing.',
          'Done by hand it is never finished. Done fully automatically it publishes things you would not stand behind.',
        ],
      },
      {
        heading: 'What we built',
        body: [
          'A pipeline and a dashboard, deliberately in that order. The pipeline scores products, generates optimised content and stores the result. The dashboard is where a person decides what ships.',
          'The overview shows total reports, completed, needs review, published and weekly activity, with a review queue, per-product scores, analytics and bulk import.',
        ],
      },
      {
        heading: 'Built for ourselves first',
        body: [
          'This platform runs our own storefront catalogues. That is the reason the review queue exists: when it is your own shop, publishing something wrong is not a support ticket, it is your listing.',
          'Every client build inherits that constraint.',
        ],
      },
    ],
    outcomes: [
      { value: '2', label: 'Live stores processed' },
      { value: '100%', label: 'Reviewed before publish' },
      { value: '1', label: 'Queue instead of a spreadsheet' },
    ],
  },

  {
    slug: 'content-pipeline',
    title: 'Content Pipeline',
    kind: 'n8n · mytechguide.io',
    year: '2025',
    summary:
      'Nine independent sub-workflows producing around five SEO articles a day, with per-stage rerun.',
    metaDescription:
      'Case study: a modular n8n content automation pipeline producing around five SEO-optimised articles a day, draft-first, with per-stage rerun on failure.',
    keywords: [
      'n8n content automation',
      'AI SEO content pipeline',
      'automated WordPress publishing',
      'DataForSEO workflow',
    ],
    image: '/Projects/mytechguide-n8n.jpg',
    service: { label: 'n8n automation', href: '/services/n8n-automations' },
    stack: ['n8n', 'OpenAI', 'DataForSEO', 'WordPress REST', 'Rank Math'],
    before: [
      'Keyword research by hand, one topic at a time',
      'Competitor pages opened and read manually',
      'Drafts written, then reformatted for SEO afterwards',
      'Images sourced, resized and uploaded one at a time',
    ],
    after: [
      'Keywords and real SERP structure pulled automatically',
      'Draft, schema and internal links generated together',
      'Images produced, optimised and uploaded as WebP',
      'Everything lands as a WordPress draft, waiting for a human',
    ],
    steps: [
      {
        title: 'Orchestrator and registry',
        body: 'A control layer with a shared database and content registry, so the pipeline knows what exists, what is in flight and what has already been covered.',
      },
      {
        title: 'Keywords and SERP analysis',
        body: 'DataForSEO supplies real top-ranking pages. Their headings, FAQ and table structures are extracted, and gaps identified, so the brief reflects what is actually ranking.',
      },
      {
        title: 'Generation and optimisation',
        body: 'Content is generated against that brief, with schema markup and internal and affiliate linking handled as part of the same step rather than bolted on later.',
      },
      {
        title: 'Media and publishing',
        body: 'Two to four images per article, generated or sourced, optimised and uploaded as WebP. Rank Math fields are populated automatically. Publishing is draft-first, always.',
      },
      {
        title: 'Quality gate and rerun',
        body: 'A duplicate and quality gate sits before publication, and every stage can be rerun on its own. A failure at step six costs step six, not the whole run.',
      },
    ],
    sections: [
      {
        heading: 'Why nine workflows instead of one',
        body: [
          'A single monolithic flow is easy to build and miserable to operate. When step six fails at two in the morning, you restart everything and pay for all of it again.',
          'Splitting the system into M0 to M8, each with clear inputs and outputs, means a failure is contained. That decision shaped everything else.',
        ],
      },
      {
        heading: 'Draft first, on purpose',
        body: [
          'Nothing publishes on its own. Articles arrive in WordPress as drafts, with SEO title, meta description, focus keyword and FAQ schema already populated, and wait for approval.',
          'It is slower on day one. It is the reason nothing has had to be retracted.',
        ],
      },
      {
        heading: 'Delivered and proven',
        body: [
          'Handover included five complete articles produced end to end, and a deliberate failed-stage rerun test to demonstrate recovery, along with documentation.',
          'The client can operate and extend it without us.',
        ],
      },
    ],
    outcomes: [
      { value: '~5', label: 'Articles drafted per day' },
      { value: '9', label: 'Independent sub-workflows' },
      { value: '0', label: 'Auto-published without review' },
    ],
  },

  {
    slug: 'image-pipeline',
    title: 'Image Pipeline',
    kind: 'n8n · Async',
    year: '2025',
    summary:
      'Text and images in, finished assets out. Composed by one model, rendered by another, stored automatically.',
    metaDescription:
      'Case study: an asynchronous n8n image generation pipeline using Cloudflare R2, OpenRouter and Replicate, with polling, error handling and automatic storage.',
    keywords: [
      'n8n image generation workflow',
      'automated AI image pipeline',
      'Cloudflare R2 automation',
      'Replicate API workflow',
    ],
    image: '/Projects/image-pipeline.jpg',
    service: { label: 'n8n automation', href: '/services/n8n-automations' },
    stack: ['n8n', 'Cloudflare R2', 'OpenRouter', 'Replicate'],
    before: [
      'A prompt written by hand for every asset',
      'The render watched, then downloaded',
      'The file uploaded to storage manually',
    ],
    after: [
      'The prompt composed by a model from your input',
      'Rendered, then polled until it succeeds',
      'Stored back automatically, with failures handled',
    ],
    steps: [
      {
        title: 'Intake and upload',
        body: 'Text and image inputs are received and assets uploaded to Cloudflare R2, so nothing depends on a temporary URL surviving the run.',
      },
      {
        title: 'Prompt composition',
        body: 'Claude Sonnet via OpenRouter composes the final generation prompt from the inputs, rather than passing raw user text to an image model.',
      },
      {
        title: 'Render and poll',
        body: 'Seedream on Replicate handles generation. The workflow polls for status rather than blocking, so a slow render never holds the pipeline open.',
      },
      {
        title: 'Store and respond',
        body: 'Finished images are written back to R2 and the result returned. Failed and processing states are handled explicitly, not treated as success.',
      },
    ],
    sections: [
      {
        heading: 'The problem with image generation in a pipeline',
        body: [
          'Generation is slow and unreliable in a way that ordinary API calls are not. A synchronous design either blocks for minutes or gives up too early.',
          'Treating it as an asynchronous job with explicit states is the difference between a demo and something you can run daily.',
        ],
      },
      {
        heading: 'What we built',
        body: [
          'A modular workflow with clean node boundaries, environment-secured credentials, custom error handling and a README written for someone else to deploy.',
          'Status checks return processing, failed or succeeded, and each is handled rather than assumed.',
        ],
      },
    ],
    outcomes: [
      { value: '3', label: 'Services orchestrated as one job' },
      { value: 'Async', label: 'Polled, never blocking' },
      { value: '~0.6s', label: 'Typical status check' },
    ],
  },

  {
    slug: 'vape-brothers',
    title: 'Vape Brothers',
    kind: 'Shopify · Pakistan',
    year: '2025',
    summary:
      'A custom Shopify storefront for a 200+ product catalogue, with local delivery and payment rails wired in.',
    metaDescription:
      'Case study: a custom Shopify store for a Pakistani retailer with a 200+ product catalogue, product finder quiz, flash sales, TCS delivery and JazzCash payments.',
    keywords: [
      'custom Shopify theme development',
      'Shopify store Pakistan',
      'JazzCash Shopify integration',
      'Shopify product quiz',
    ],
    image: '/Projects/vape-brothers.jpg',
    service: { label: 'Shopify development', href: '/services/shopify' },
    stack: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
    before: [
      'A template storefront that did not match how the shop sells',
      'International payment options local customers do not use',
      'Shoppers unsure which product suits them, and leaving',
    ],
    after: [
      'A custom theme built around the catalogue',
      'TCS delivery and JazzCash payments wired in',
      'A fit quiz that narrows 200+ products to a recommendation',
    ],
    steps: [
      {
        title: 'The storefront',
        body: 'A dark, high-contrast interface with glassmorphism surfaces, built as a custom theme rather than a configured template.',
      },
      {
        title: 'Finding the right product',
        body: 'A "find your perfect vape" quiz that turns a 200+ item catalogue into a short recommendation, which is the difference between browsing and buying.',
      },
      {
        title: 'Urgency that is real',
        body: 'Live flash-sale modules with countdown timers and stock counters, tied to actual inventory rather than a decorative timer that resets.',
      },
      {
        title: 'Local rails',
        body: 'TCS for delivery and JazzCash for payment, plus WhatsApp and Instagram integration, because that is how customers in this market actually transact.',
      },
    ],
    sections: [
      {
        heading: 'Why local integration is the whole job',
        body: [
          'Anyone can style a dark storefront. The part a template cannot give a Pakistani retailer is the checkout and delivery path their customers already trust.',
          'Wiring TCS and JazzCash into Shopify, alongside WhatsApp contact, is what made the store usable rather than impressive.',
        ],
      },
      {
        heading: 'Built for a large catalogue',
        body: [
          'Over two hundred products, organised into brand-based collections, with quick-view cards and animated marquees so browsing does not become a chore.',
          'Fully responsive, because most of this traffic arrives on a phone.',
        ],
      },
    ],
    outcomes: [
      { value: '200+', label: 'Products in the catalogue' },
      { value: '2', label: 'Local rails integrated' },
      { value: '1', label: 'Quiz replacing a category wall' },
    ],
  },

  {
    slug: 'south-bay-living',
    title: 'South Bay Living',
    kind: 'WordPress · California',
    year: '2025',
    summary:
      'Static pages rebuilt as a site the owner can edit, with a real blog and a community calendar.',
    metaDescription:
      'Case study: static HTML rebuilt as a dynamic WordPress site for a South Bay real estate brand, with a custom child theme, ACF blocks and an events calendar.',
    keywords: [
      'static HTML to WordPress conversion',
      'custom WordPress child theme',
      'ACF Gutenberg blocks',
      'real estate website development',
    ],
    image: '/Projects/south-bay-living.jpg',
    service: { label: 'WordPress development', href: '/services/wordpress' },
    stack: ['WordPress', 'Custom child theme', 'ACF', 'Gutenberg'],
    before: [
      'Static HTML pages, edited by a developer',
      'A blog list that had to be updated by hand',
      'Events maintained separately from the site',
    ],
    after: [
      'The same design, now editable by the owner',
      'A blog that pulls real posts, with proper single-post templates',
      'A community calendar running on its own post type',
    ],
    steps: [
      {
        title: 'Preserve the design',
        body: 'A lightweight custom child theme reproduces the original pages exactly, so nothing about the look changed in the move.',
      },
      {
        title: 'Expose the editable parts',
        body: 'Gutenberg and ACF surface the sections that should be editable, and only those, so the owner cannot accidentally break the layout.',
      },
      {
        title: 'Make the content real',
        body: 'The blog list pulls actual posts and single-post templates display meta and images properly, instead of being hand-maintained HTML.',
      },
      {
        title: 'The calendar',
        body: 'Community events run on a custom post type, alongside neighbourhood guides and seller resources.',
      },
    ],
    sections: [
      {
        heading: 'The brief nobody enjoys',
        body: [
          'Converting static pages to WordPress usually means the design quietly degrades. The theme imposes itself and the client accepts a worse version of what they had.',
          'The requirement here was the opposite: identical design, fully editable.',
        ],
      },
      {
        heading: 'Built to survive updates',
        body: [
          'A child theme rather than a modified parent, so updates do not overwrite the work, and ACF for structured fields rather than free-form page builders.',
          'Fast, responsive, and editable by someone who does not write code.',
        ],
      },
    ],
    outcomes: [
      { value: '1:1', label: 'Design preserved' },
      { value: '0', label: 'Developer needed to publish' },
      { value: '3', label: 'Content types: posts, events, guides' },
    ],
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);

export const caseSlugs = () => CASE_STUDIES.map((c) => c.slug);

/** Next study in the list, wrapping, so a reader always has somewhere to go. */
export const nextCaseStudy = (slug: string) => {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug);
  return CASE_STUDIES[(i + 1) % CASE_STUDIES.length];
};
