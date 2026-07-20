import { NextRequest, NextResponse } from 'next/server';
import { sendSubscribeNotification } from '@/lib/email/resend';

// POST - newsletter signup. The footer form posted here before this route
// existed, so every subscribe attempt was landing on a 404.
export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set; subscribe cannot be recorded');
      return NextResponse.json(
        { error: 'Signups are not configured yet. Please email us instead.' },
        { status: 503 }
      );
    }

    await sendSubscribeNotification({ email, source: source || 'unknown' });

    return NextResponse.json(
      { success: true, message: 'Subscribed. Talk soon.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Could not subscribe right now. Please try again.' },
      { status: 500 }
    );
  }
}
