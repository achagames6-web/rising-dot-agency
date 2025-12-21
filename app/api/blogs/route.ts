import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    
    const client = await clientPromise;
    const db = client.db('rising-dot');
    
    const query: any = { published: true };
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    let cursor = db
      .collection('blogs')
      .find(query)
      .sort({ publishedAt: -1 });
    
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }
    
    const blogs = await cursor.toArray();
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
