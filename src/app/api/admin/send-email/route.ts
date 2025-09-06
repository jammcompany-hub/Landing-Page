import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmailToAllSubscribers } from '@/lib/email';

// Validation schema
const emailSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'HTML content is required'),
  text: z.string().optional(),
});

// POST - Send email to all subscribers
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { subject, html, text } = emailSchema.parse(body);

    const result = await sendEmailToAllSubscribers({
      subject,
      html,
      text
    });

    return NextResponse.json({
      success: result.success,
      message: result.message,
      sentCount: result.sentCount
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Send email API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

