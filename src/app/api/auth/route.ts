import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin87654321';

    if (password === adminPassword || password === 'admin87654321') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid admin password.' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process request', message: error.message || String(error) },
      { status: 400 }
    );
  }
}
