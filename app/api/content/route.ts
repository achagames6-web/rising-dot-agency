import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { SiteContent } from '@/lib/db/models';

// GET - Fetch site content (public API)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const sections = searchParams.get('sections'); // Batch query support: "hero,services,about"
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const includeVisibility = searchParams.get('includeVisibility') !== 'false'; // Default true

    const client = await clientPromise;
    const db = client.db('rising-dot');
    
    const query: Record<string, any> = {};
    if (page) query.page = page;
    if (section) query.section = section;
    
    // Support batch sections query for better performance
    if (sections && !section) {
      const sectionList = sections.split(',').map(s => s.trim()).filter(Boolean);
      if (sectionList.length > 0) {
        query.section = { $in: sectionList };
      }
    }

    const content = await db
      .collection<SiteContent>('siteContent')
      .find(query)
      .toArray();

    // Transform to a more usable format: { [section]: content }
    // Filter out hidden sections unless includeHidden is true
    const contentMap: Record<string, any> = {};
    content.forEach((item) => {
      // Check if section is visible (default to true if not set)
      const isVisible = item.visible !== false;
      
      if (isVisible || includeHidden) {
        const key = page ? item.section : `${item.page}_${item.section}`;
        contentMap[key] = {
          ...item.content,
          ...(includeVisibility ? { _visible: item.visible !== false } : {}),
        };
      }
    });

    // Add cache headers for CDN and browser caching
    const headers = {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    };

    return NextResponse.json(section ? contentMap[section] : contentMap, { headers });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
