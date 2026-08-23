import { NextResponse } from 'next/server';
import { getStoredDB, saveStoredDB } from '@/lib/serverStorage';
import { normalizePhoneNumber, sendBrevoSms } from '@/lib/brevoSms';
import type { Order, Product } from '@/lib/seeds';
import { addAuditEntry, addNotification, addTransaction } from '@/lib/serverStorage';
import { broadcastAdminMessage } from '@/lib/outboundMessaging';

function makeOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function safeTrim(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = safeTrim(body.productId);
    const productName = safeTrim(body.productName) || safeTrim(body.product);
    const customerName = safeTrim(body.customerName) || safeTrim(body.farmer) || 'Website Customer';
    const phone = normalizePhoneNumber(safeTrim(body.phone));
    const county = safeTrim(body.county) || 'Kenya';
    const notes = safeTrim(body.notes);
    const requestedQty = Number(body.qty ?? body.quantity ?? 0);

    if (!requestedQty || Number.isNaN(requestedQty) || requestedQty <= 0) {
      return NextResponse.json({ error: 'Quantity must be a positive number.' }, { status: 400 });
    }

    if (!productId && !productName) {
      return NextResponse.json({ error: 'A product must be selected.' }, { status: 400 });
    }

    const db = await getStoredDB();
    const products = db.products || [];
    const product = findProduct(products, productId, productName);

    if (!product) {
      return NextResponse.json({ error: 'Selected product is not available.' }, { status: 404 });
    }

    if (product.active === false) {
      return NextResponse.json({ error: 'Selected product is currently inactive.' }, { status: 400 });
    }

    if (product.stock < requestedQty) {
      return NextResponse.json(
        { error: `Only ${product.stock} units are available for ${product.name}.` },
        { status: 400 }
      );
    }

    const totalKES = product.price * requestedQty;
    const order: Order = {
      id: makeOrderId(),
      farmer: customerName,
      phone: phone || safeTrim(body.phone) || 'Not provided',
      county,
      breed: product.breed || product.name,
      qty: requestedQty,
      totalKES,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      source: 'website',
      notes: [
        'Ordered through website',
        notes,
        `Product: ${product.name}`,
        product.ageRange ? `Age/Stage: ${product.ageRange}` : '',
        `Unit price: KES ${product.price}`,
      ].filter(Boolean).join(' | '),
    };

    const updatedProducts = products.map((item) =>
      item.id === product.id ? { ...item, stock: Math.max(0, item.stock - requestedQty) } : item
    );

    const updatedOrders = [order, ...(db.orders || [])];
    await saveStoredDB({
      products: updatedProducts,
      orders: updatedOrders,
    });
    await addAuditEntry({
      entity: 'order',
      action: 'create',
      summary: `Order ${order.id} created for ${customerName}`,
      actor: customerName,
      metadata: { orderId: order.id, productId: product.id, qty: requestedQty, totalKES },
    });

    const adminMessage =
      `🛒 NEW CHICK ORDER\n` +
      `Customer: ${customerName}\n` +
      `Phone: ${phone || safeTrim(body.phone) || 'N/A'}\n` +
      `County: ${county}\n` +
      `Product: ${product.name}\n` +
      `Breed: ${product.breed || product.name}\n` +
      `Qty: ${requestedQty}\n` +
      `Total: KES ${totalKES.toLocaleString()}\n` +
      `Order ID: ${order.id}`;

    await addTransaction({
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      category: 'Website chick order',
      amount: totalKES,
      paymentMethod: 'Other',
      customerOrVendor: customerName,
      reference: order.id,
      notes: `${product.name} x ${requestedQty} | ${county}`,
    });

    await addNotification({
      title: 'New chick order received',
      body: adminMessage,
      type: 'order',
      url: '/admin?tab=orders',
    }, { broadcast: false });

    const adminBroadcast = await broadcastAdminMessage(adminMessage);

    const customerSms = phone
      ? await sendBrevoSms({
          recipient: phone,
          content:
            `✅ Your Cucu Mutugi order was received.\n` +
            `Order: ${order.id}\n` +
            `Product: ${product.name}\n` +
            `Qty: ${requestedQty}\n` +
            `Total: KES ${totalKES.toLocaleString()}\n` +
            `We will contact you shortly to confirm delivery.`,
        })
      : { success: false, error: 'Customer phone not provided.' };

    return NextResponse.json({
      success: true,
      order,
      remainingStock: updatedProducts.find((item) => item.id === product.id)?.stock ?? product.stock,
      sms: { customer: customerSms },
      adminBroadcast,
      message: 'Order submitted successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    console.error('Orders POST error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function findProduct(products: Product[], productId: string, productName: string): Product | undefined {
  if (productId) {
    const byId = products.find((item) => item.id === productId);
    if (byId) return byId;
  }

  const normalized = productName.toLowerCase();
  return products.find((item) => {
    const nameMatch = item.name.toLowerCase() === normalized;
    const breedMatch = (item.breed || '').toLowerCase() === normalized;
    return nameMatch || breedMatch;
  });
}
