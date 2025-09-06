import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Check if password matches the admin token
    const expectedPassword = process.env.ADMIN_TOKEN;
    
    if (!expectedPassword) {
      return NextResponse.json(
        { success: false, message: 'Admin not configured' },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate a temporary session token (valid for 1 hour)
    const sessionToken = randomBytes(32).toString('hex');
    
    // In a real app, you'd store this in a database with expiration
    // For now, we'll just return it and the client will store it
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: sessionToken
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
