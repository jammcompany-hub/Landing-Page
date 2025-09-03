import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { removeFromWaitlist } from '@/lib/database';

// Validation schema
const unsubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// POST - Unsubscribe from waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = unsubscribeSchema.parse(body);

    const result = await removeFromWaitlist(email);
    
    return NextResponse.json({
      success: result.success,
      message: result.message
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Unsubscribe via URL (for email links)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const result = await removeFromWaitlist(email);
    
    return NextResponse.json({
      success: result.success,
      message: result.message
    });

  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

