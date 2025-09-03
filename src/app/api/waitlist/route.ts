import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addToWaitlist, getActiveSubscribers } from '@/lib/database';
import { sendEmail, createWelcomeEmail } from '@/lib/email';

// Validation schema
const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// POST - Add email to waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = waitlistSchema.parse(body);

    // Add to waitlist
    const result = await addToWaitlist(email);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Send welcome email
    const welcomeEmail = createWelcomeEmail();
    const emailResult = await sendEmail(email, welcomeEmail);
    
    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.message);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      emailSent: emailResult.success
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get waitlist stats (for admin use)
export async function GET(request: NextRequest) {
  try {
    // Simple authentication check for admin access
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ADMIN_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscribers = await getActiveSubscribers();
    
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers: subscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        subscribedAt: sub.subscribedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}
