import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { TeamMember } from '@/lib/db/models';

// GET - Fetch published team members (public API)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const members = await db
      .collection<TeamMember>('teamMembers')
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
