// app/(public)/portfolio/[slug]/page.tsx
//
// A server component on purpose: metadata, canonical URLs and JSON-LD have to
// be rendered on the server to be worth anything for search. All the motion
// lives in components/case/CaseBody, which is a client component.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { caseSlugs, getCaseStudy, nextCaseStudy } from '@/lib/case-studies';
import { CaseBody } from '@/components/case/CaseBody';

const SITE = 'https://rising-dot-agency.vercel.app';

export function generateStaticParams() {
  return caseSlugs().map((slug) => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const study = getCaseStudy(params.slug);
  if (!study) return { title: 'Case study not found' };

  const url = `${SITE}/portfolio/${study.slug}`;
  const title = `${study.title} — ${study.kind} | Rising Dot`;

  return {
    title,
    description: study.metaDescription,
    keywords: study.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description: study.metaDescription,
      siteName: 'Rising Dot',
      images: study.image ? [{ url: `${SITE}${study.image}` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: study.metaDescription,
      images: study.image ? [`${SITE}${study.image}`] : undefined,
    },
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  const next = nextCaseStudy(study.slug);

  // Two graphs: the article itself, and a breadcrumb trail so the result
  // shows Home > Portfolio > this project rather than a bare URL.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${study.title} — ${study.kind}`,
        description: study.metaDescription,
        image: study.image ? `${SITE}${study.image}` : undefined,
        datePublished: `${study.year}-01-01`,
        author: { '@type': 'Organization', name: 'Rising Dot', url: SITE },
        publisher: {
          '@type': 'Organization',
          name: 'Rising Dot',
          url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
        },
        mainEntityOfPage: `${SITE}/portfolio/${study.slug}`,
        about: study.keywords,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Portfolio',
            item: `${SITE}/portfolio`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: study.title,
            item: `${SITE}/portfolio/${study.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseBody
        study={study}
        next={{ slug: next.slug, title: next.title, kind: next.kind }}
      />
    </main>
  );
}
