import { NextResponse } from 'next/server';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from '@/lib/serverStorage';

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error('Transactions GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, transaction, id, updates } = body;

    if (action === 'add' || action === 'create') {
      const transactions = await addTransaction(transaction || body);
      return NextResponse.json({ success: true, transactions });
    }

    if (action === 'update') {
      const targetId = id || body.id;
      const transactions = await updateTransaction(targetId, updates || body.updates);
      return NextResponse.json({ success: true, transactions });
    }

    if (action === 'delete') {
      const targetId = id || body.id;
      const transactions = await deleteTransaction(targetId);
      return NextResponse.json({ success: true, transactions });
    }

    // Default: treat raw body as transaction object to add
    if (body.amount && body.category) {
      const transactions = await addTransaction(body);
      return NextResponse.json({ success: true, transactions });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Transactions POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save transaction' }, { status: 500 });
  }
}
