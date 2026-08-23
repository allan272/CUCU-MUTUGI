'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bird,
  Check,
  ShoppingBag,
  Truck,
  Syringe,
  Clock,
  MapPin,
  Mail,
  Smartphone,
  Tag,
  ChevronRight,
  Sparkles,
  Loader2,
  BadgeAlert,
} from 'lucide-react';

type PublicProduct = {
  id: string;
  name: string;
  category: string;
  breed?: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  ageRange?: string;
  vaccinated: boolean;
  active: boolean;
};

type OrderState = {
  productId: string;
  customerName: string;
  phone: string;
  county: string;
  qty: string;
  notes: string;
};

const DEFAULT_LOCATIONS = [
  'Embu',
  'Kirinyaga',
  'Meru',
  'Nyeri',
  'Tharaka Nithi',
  'Kitale',
  'Kitui',
  'Machakos',
  'Eldoret',
  'Rongo',
  'Bungoma',
  'Nairobi',
  'Naivasha',
  'Nakuru',
];

export default function ProductsPage() {
  const orderRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [order, setOrder] = useState<OrderState>({
    productId: '',
    customerName: '',
    phone: '',
    county: '',
    qty: '1',
    notes: '',
  });

  useEffect(() => {
    let alive = true;

    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (alive && res.ok && Array.isArray(data.products)) {
          setProducts(data.products);
          setOrder((prev) => ({
            ...prev,
            productId: prev.productId || data.products[0]?.id || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      alive = false;
    };
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === order.productId) || products[0],
    [products, order.productId]
  );

  const quantity = Number(order.qty) || 0;
  const totalKES = selectedProduct ? selectedProduct.price * quantity : 0;

  const selectProduct = (productId: string) => {
    setOrder((prev) => ({ ...prev, productId }));
    orderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) {
      setMessage({ type: 'error', text: 'Please choose a product first.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          qty: Number(order.qty),
          customerName: order.customerName,
          phone: order.phone,
          county: order.county,
          notes: order.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order submission failed.');
      }

      const adminSmsSuccess = Array.isArray(data.adminBroadcast?.sms)
        ? data.adminBroadcast.sms.some((item: { success?: boolean }) => item.success)
        : false;
      const adminWhatsappSuccess = Array.isArray(data.adminBroadcast?.whatsapp)
        ? data.adminBroadcast.whatsapp.some((item: { success?: boolean }) => item.success)
        : false;
      const customerSmsSuccess = Boolean(data.sms?.customer?.success);

      setMessage({
        type: 'success',
        text: `Order received. Reference ${data.order?.id || 'pending'} was created. Admin SMS: ${adminSmsSuccess ? 'sent' : 'not sent'} | WhatsApp: ${adminWhatsappSuccess ? 'sent' : 'not sent'} | Customer SMS: ${customerSmsSuccess ? 'sent' : 'not sent'}.`,
      });

      setProducts((current) =>
        current.map((product) =>
          product.id === selectedProduct.id && typeof data.remainingStock === 'number'
            ? { ...product, stock: data.remainingStock }
            : product
        )
      );

      setOrder((prev) => ({
        ...prev,
        qty: '1',
        notes: '',
      }));
    } catch (error: unknown) {
      const text = error instanceof Error ? error.message : 'We could not place the order right now.';
      setMessage({
        type: 'error',
        text,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFDF0] text-slate-900 min-h-screen pb-20">
      <section className="bg-amber-400 text-slate-950 py-20 px-4 text-center relative overflow-hidden border-b-4 border-amber-500 shadow-md">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.24em] mb-5">
            <Sparkles className="h-4 w-4" /> Order Chicks
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-sm text-slate-950">Select, Order, and Get SMS Confirmation</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-black text-slate-900">
            Choose from the live product list, place your order, and let the admin receive it even when they are offline.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Available Products</h2>
              <p className="text-slate-600 font-medium">These are the active products currently listed in the store.</p>
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl border border-amber-200 shadow-lg p-10 text-center text-slate-600 font-bold flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                Loading products...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {products.map((product, index) => (
                  <article
                    key={product.id}
                    className={`bg-white rounded-3xl border-2 shadow-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl ${
                      index % 3 === 0
                        ? 'border-emerald-300'
                        : index % 3 === 1
                        ? 'border-amber-300'
                        : 'border-blue-300'
                    }`}
                  >
                    <div className={`p-6 ${index % 3 === 0 ? 'bg-gradient-to-br from-emerald-700 to-emerald-500' : index % 3 === 1 ? 'bg-gradient-to-br from-amber-600 to-amber-400' : 'bg-gradient-to-br from-blue-800 to-blue-600'} text-white`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Bird className="h-6 w-6 text-amber-300" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black">{product.name}</h3>
                          <p className={`text-xs font-semibold ${index % 3 === 1 ? 'text-amber-900' : 'text-white/80'}`}>
                            {product.breed || product.category}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1 bg-slate-950/90 text-amber-300 px-3 py-1 rounded-full text-xs font-black">
                        <Tag className="h-3 w-3" /> KES {product.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="text-sm text-slate-600 leading-relaxed min-h-20">
                        {product.description}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                          <div className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1">Stock</div>
                          <div className={`font-black text-lg ${product.stock < 50 ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {product.stock.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                          <div className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1">Status</div>
                          <div className="font-black text-lg text-slate-700">{product.vaccinated ? 'Vaccinated' : 'Available'}</div>
                        </div>
                      </div>

                      {product.ageRange && (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2">
                          <BadgeAlert className="h-4 w-4 text-amber-600" />
                          {product.ageRange}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => selectProduct(product.id)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Select This Product
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-4" ref={orderRef}>
            <div className="sticky top-6 bg-white rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden">
              <div className="bg-slate-950 text-amber-300 p-6">
                <div className="text-xs font-black uppercase tracking-[0.22em] mb-2">Order Form</div>
                <h2 className="text-2xl font-black text-white">Place a Chick Order</h2>
                <p className="text-sm text-slate-300 mt-2">Choose a product, add your details, and submit. The admin receives an SMS alert instantly.</p>
              </div>

              <form onSubmit={submitOrder} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Product</label>
                  <select
                    value={order.productId}
                    onChange={(e) => setOrder((prev) => ({ ...prev, productId: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - KES {product.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={order.customerName}
                      onChange={(e) => setOrder((prev) => ({ ...prev, customerName: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={order.phone}
                      onChange={(e) => setOrder((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="+2547..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">County</label>
                    <input
                      type="text"
                      required
                      value={order.county}
                      onChange={(e) => setOrder((prev) => ({ ...prev, county: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="County"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={order.qty}
                      onChange={(e) => setOrder((prev) => ({ ...prev, qty: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={order.notes}
                    onChange={(e) => setOrder((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Delivery time, age required, or special instructions"
                  />
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Estimated Total</div>
                  <div className="text-2xl font-black text-slate-900">KES {totalKES.toLocaleString()}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selectedProduct ? `${quantity} x ${selectedProduct.name}` : 'Select a product'}
                  </div>
                </div>

                {message && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      message.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : 'border-rose-200 bg-rose-50 text-rose-900'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !selectedProduct}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-black py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Sending Order
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" /> Submit Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-slate-950 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden border-2 border-amber-400">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
            <h2 className="text-3xl font-black mb-4 text-amber-400 relative z-10">Our Commitment</h2>
            <div className="space-y-5 relative z-10 text-slate-200">
              <div className="flex items-start gap-3">
                <Truck className="h-6 w-6 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-extrabold text-white">Free Delivery</p>
                  <p className="text-sm text-slate-300">We deliver throughout Kenya ensuring your chicks arrive safely.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Syringe className="h-6 w-6 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-extrabold text-white">Pre-Vaccinated</p>
                  <p className="text-sm text-slate-300">All chicks are fully vaccinated before delivery for optimal health.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-extrabold text-white">Marketing Days</p>
                  <p className="text-sm text-slate-300">We operate on Wednesday and Thursday for your convenience.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-lg lg:col-span-2">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Service Locations</h2>
            <p className="text-slate-600 mb-6">We serve customers across Kenya, with phone and SMS updates for order follow-up.</p>
            <div className="flex flex-wrap gap-3">
              {DEFAULT_LOCATIONS.map((location) => (
                <div key={location} className="flex items-center gap-2 text-slate-900 bg-amber-50 px-4 py-2 rounded-full border border-amber-300 font-bold hover:border-amber-500 transition-colors cursor-default">
                  <MapPin className="text-amber-600 h-4 w-4" />
                  {location}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-amber-400 text-slate-950 p-12 rounded-3xl text-center shadow-xl border-2 border-amber-500 mt-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Need Help Ordering?</h2>
          <p className="text-lg font-black mb-8">We can take your order by phone, SMS, or WhatsApp.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="mailto:cucumutugipoultry@gmail.com" className="flex items-center justify-center gap-2 bg-slate-950 text-amber-400 hover:bg-slate-900 transition-colors px-6 py-3.5 rounded-full font-extrabold shadow-md">
              <Mail className="h-5 w-5" /> cucumutugipoultry@gmail.com
            </a>
            <a href="tel:0706972161" className="flex items-center justify-center gap-2 bg-slate-950 text-amber-400 hover:bg-slate-900 transition-colors px-6 py-3.5 rounded-full font-extrabold shadow-md">
              <Smartphone className="h-5 w-5" /> 0706 972 161 / 0740 662 799
            </a>
            <Link href="/contact" className="flex items-center justify-center gap-2 bg-slate-950 text-amber-400 hover:bg-slate-900 transition-colors px-6 py-3.5 rounded-full font-extrabold shadow-md">
              <Check className="h-5 w-5" /> Contact Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
