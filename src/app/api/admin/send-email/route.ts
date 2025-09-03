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
    // Simple authentication check (you should implement proper auth)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ADMIN_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
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

