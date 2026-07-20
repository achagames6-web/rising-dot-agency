import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification } from '@/lib/email/resend';

// POST - Submit contact form (email only, no database needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set; contact email cannot be sent');
      return NextResponse.json(
        { error: 'Email is not configured yet. Please try another channel.' },
        { status: 503 }
      );
    }

    await sendContactNotification({
      name,
      email,
      company: company || undefined,
      service: service || undefined,
      message,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
