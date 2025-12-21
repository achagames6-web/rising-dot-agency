import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { Testimonial } from '@/lib/db/models';

// GET - Fetch published testimonials (public API)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');
    
    const testimonials = await db
      .collection<Testimonial>('testimonials')
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
