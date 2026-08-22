import { NextResponse } from 'next/server';
import { getStoredDB } from '@/lib/serverStorage';

export async function GET() {
  try {
    const db = await getStoredDB();
    const products = (db.products || []).filter((product) => product.active !== false);
    return NextResponse.json({ products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    console.error('Products GET error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
