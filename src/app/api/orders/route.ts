import { NextResponse } from 'next/server';
import { getStoredDB, saveStoredDB } from '@/lib/serverStorage';
import { normalizePhoneNumber, sendBrevoSms } from '@/lib/brevoSms';
import { sendBrevoEmail } from '@/lib/brevoEmail';
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
    const requestedOrderId = safeTrim(body.orderId || body.id);
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
    const orderId = requestedOrderId || makeOrderId();
    const order: Order = {
      id: orderId,
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

    const isTestOrder =
      order.id.startsWith('SMS-TEST') ||
      customerName.toUpperCase().includes('TEST') ||
      product.name.toUpperCase().includes('TEST');

    const adminMessage =
      `CUCU MUTUGI POULTRY\n\n` +
      `NEW CHICKS ORDER\n` +
      `Order: ${order.id}\n` +
      `Customer: ${customerName}\n` +
      `Phone: ${phone || safeTrim(body.phone) || 'N/A'}\n` +
      `Product: ${product.name}\n` +
      `Quantity: ${requestedQty}\n` +
      `Total: KES ${totalKES.toLocaleString()}` +
      (isTestOrder ? `\n\nThis is a Brevo SMS integration test.` : '');

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
      scope: 'admin',
      url: '/admin?tab=orders',
    }, { broadcast: false });

    // Send real Brevo SMS to admin recipients (Main + Secondary Admins)
    const adminBroadcast = await broadcastAdminMessage(adminMessage, {
      orderId: order.id,
      customerName,
    });

    // Send Brevo Transactional Email Alert to Admin
    const emailResult = await sendBrevoEmail({
      subject: `🛒 NEW CHICKS ORDER: ${order.id} - ${customerName}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #b45309; margin: 0; font-size: 22px;">🐔 CUCU MUTUGI POULTRY</h1>
            <p style="color: #475569; margin: 4px 0 0 0; font-size: 14px; font-weight: bold;">New Website Order Received</p>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
              <tr><td style="padding: 6px 0; font-weight: bold; width: 130px;">Order ID:</td><td style="color: #0284c7; font-weight: bold;">${order.id}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Customer:</td><td>${customerName}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td><a href="tel:${phone}" style="color: #059669; font-weight: bold; text-decoration: none;">${phone || 'Not provided'}</a></td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">County:</td><td>${county}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Product:</td><td>${product.name}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Quantity:</td><td>${requestedQty}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Total:</td><td style="font-weight: 800; color: #b45309;">KES ${totalKES.toLocaleString()}</td></tr>
              ${notes ? `<tr><td style="padding: 6px 0; font-weight: bold;">Notes:</td><td>${notes}</td></tr>` : ''}
            </table>
          </div>
          <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 10px; padding: 14px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: bold;">⚡ Order updated in Admin Panel (/admin?tab=orders)</p>
          </div>
        </div>
      `,
    });

    // Send customer confirmation SMS if phone is provided
    const customerSms = phone
      ? await sendBrevoSms({
          recipient: phone,
          content:
            `CUCU MUTUGI POULTRY\n` +
            `Order ${order.id} received!\n` +
            `Product: ${product.name} (Qty: ${requestedQty})\n` +
            `Total: KES ${totalKES.toLocaleString()}.\n` +
            `We will contact you shortly to confirm delivery.`,
          orderId: order.id,
          customerName,
        })
      : { success: false, error: 'Customer phone not provided.' };

    return NextResponse.json({
      success: true,
      order,
      remainingStock: updatedProducts.find((item) => item.id === product.id)?.stock ?? product.stock,
      email: emailResult,
      sms: { customer: customerSms },
      adminBroadcast,
      message: 'Order submitted successfully.',
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    console.error('[Orders POST] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function findProduct(products: Product[], productId: string, productName: string): Product | undefined {
  if (productId) {
    const byId = products.find((item) => item.id.toLowerCase() === productId.toLowerCase());
    if (byId) return byId;
  }

  const normalized = productName.toLowerCase();
  const matched = products.find((item) => {
    const nameMatch = item.name.toLowerCase() === normalized;
    const breedMatch = (item.breed || '').toLowerCase() === normalized;
    return nameMatch || breedMatch;
  });

  if (matched) return matched;

  // Fallback for test products
  if (normalized.includes('test') || (productId && productId.toLowerCase().includes('test'))) {
    return {
      id: productId || 'test-chicks',
      name: productName || 'Test Chicks',
      category: 'Test',
      breed: 'Test Chicks',
      price: 120,
      stock: 9999,
      image: '',
      description: 'Controlled test order product',
      ageRange: '1 day old',
      vaccinated: true,
      active: true,
      createdAt: new Date().toISOString(),
    };
  }

  return undefined;
}

