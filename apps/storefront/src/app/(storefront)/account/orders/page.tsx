'use client';

import { useListOrders } from '@workspace/api-client-react';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { data, isLoading } = useListOrders();

  if (isLoading) {
    return <div className="p-24 text-center">Loading orders...</div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto pb-16">
      <h1 className="text-3xl font-extrabold mb-8">My Orders</h1>

      {!data || data.items.length === 0 ? (
        <div className="bg-card border border-card-border rounded-md p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any pre-orders or standard orders yet.</p>
          <Link href="/products" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-bold">Browse Marketplace</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {data.items.map(order => (
            <div key={order.id} className="bg-card border border-card-border rounded-md overflow-hidden shadow-sm">
              <div className="bg-muted/40 border-b border-border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex gap-6">
                  <div>
                    <div className="text-muted-foreground font-medium mb-0.5">Order Placed</div>
                    <div className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-medium mb-0.5">Total Amount</div>
                    <div className="font-bold">${order.total.toFixed(2)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground font-medium mb-0.5">Order Number</div>
                  <div className="font-bold font-mono text-primary">{order.orderNumber}</div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  {order.fulfillmentStatus === 'delivered' ? (
                    <CheckCircle2 className="text-success" size={24} />
                  ) : order.fulfillmentStatus === 'shipped_from_supplier' || order.fulfillmentStatus === 'in_transit' ? (
                    <Truck className="text-primary" size={24} />
                  ) : (
                    <Clock className="text-orange-500" size={24} />
                  )}
                  <h3 className="text-lg font-extrabold capitalize">{order.fulfillmentStatus.replace(/_/g, ' ')}</h3>
                </div>

                <div className="divide-y border-border">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                      <div className="w-20 h-20 bg-muted border border-border rounded overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px]">No img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Link href={`/products/${(item as typeof item & { slug?: string }).slug ?? item.productId}`} className="font-bold hover:text-primary transition-colors text-base mb-1 line-clamp-1">
                          {item.name}
                        </Link>
                        <div className="text-sm text-muted-foreground mb-1">SKU: {item.sku}</div>
                        <div className="text-sm font-bold text-foreground mt-1">{item.quantity} x ${item.unitPrice.toFixed(2)}</div>
                      </div>
                      <div className="hidden sm:block">
                        <button className="text-sm font-bold text-primary border border-primary px-4 py-1.5 rounded hover:bg-primary/5 transition-colors">Track Item</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
