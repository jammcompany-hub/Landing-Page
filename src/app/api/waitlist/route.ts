import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addToWaitlist, getActiveSubscribers } from '@/lib/database';
import { sendEmail, createWelcomeEmail, isEmailConfigured } from '@/lib/email';

// Validation schema
const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// POST - Add email to waitlist
export async function POST(request: NextRequest) {
  try {
    // Check if email is configured (optional for waitlist, required for email sending)
    const emailConfigured = isEmailConfigured();
    if (!emailConfigured) {
      console.warn('Email not configured - emails will not be sent');
    }

    const body = await request.json();
    console.log('Received request body:', body);
    
    const { email } = waitlistSchema.parse(body);
    console.log('Parsed email:', email);

    // Add to waitlist
    const result = await addToWaitlist(email);
    console.log('Add to waitlist result:', result);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Send welcome email (only if email is configured)
    let emailResult = { success: false, message: 'Email not configured' };
    if (emailConfigured) {
      const welcomeEmail = createWelcomeEmail();
      emailResult = await sendEmail(email, welcomeEmail);
      console.log('Email send result:', emailResult);
      
      if (!emailResult.success) {
        console.error('Failed to send welcome email:', emailResult.message);
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Waitlist API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.errors[0].message,
          debug: process.env.NODE_ENV === 'development' ? error.errors : undefined
        },
        { status: 400 }
      );
    }

    const debugInfo = process.env.NODE_ENV === 'development'
      ? (error instanceof Error ? error.message : JSON.stringify(error))
      : undefined;

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        debug: debugInfo
      },
      { status: 500 }
    );
  }
}

// GET - Get waitlist stats (for admin use)
export async function GET(request: NextRequest) {
  try {
    // Simple authentication check for admin access
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // For now, we'll accept any non-empty token as valid
    // In a real app, you'd verify the token against a database
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
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
