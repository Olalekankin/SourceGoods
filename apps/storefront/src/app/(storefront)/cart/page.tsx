'use client';

import { useGetCart, useUpdateCartItem, useRemoveCartItem, getGetCartQueryKey, useCreateOrder } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useGetCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="p-24 text-center">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12 mb-24 bg-card border border-card-border rounded-md p-12 text-center shadow-sm">
        <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={40} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-extrabold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any products to your pre-order cart yet.</p>
        <Link href="/products" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-transform">
          Start Sourcing
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    updateItem.mutate({ productId, data: { quantity: newQty } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() }),
    });
  };

  const handleRemove = (productId: string) => {
    removeItem.mutate({ productId }, {
      onSuccess: () => {
        toast.success('Item removed');
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      },
    });
  };

  const handleCheckout = () => {
    createOrder.mutate({
      data: {
        items: cart.items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod: 'stripe',
        shippingAddress: {
          fullName: 'Test User',
          line1: '123 Fake St',
          city: 'San Francisco',
          country: 'US',
          postalCode: '94105',
        },
      },
    }, {
      onSuccess: (order) => {
        toast.success('Order created successfully!', { description: `Order #${order.orderNumber}` });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        router.push('/account/orders');
      },
      onError: () => {
        toast.error('Checkout failed', { description: 'Please make sure you are logged in.' });
      },
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-16">
      <h1 className="text-3xl font-extrabold mb-8">Shopping Cart <span className="text-lg font-medium text-muted-foreground font-normal ml-2">({cart.itemCount} items)</span></h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          <div className="bg-card border border-card-border rounded-md shadow-sm overflow-hidden">
            <div className="bg-muted/30 border-b border-border p-4 grid grid-cols-12 gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:grid">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            <div className="divide-y border-border">
              {cart.items.map((item) => (
                <div key={item.productId} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="col-span-1 sm:col-span-6 flex items-start gap-4">
                    <div className="w-20 h-20 bg-muted rounded border border-border overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.productName} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px]">No img</div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <Link href={`/products/${item.slug}`} className="font-bold text-sm hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {item.productName}
                      </Link>
                      {item.isPreOrder && (
                        <span className="inline-block bg-accent text-accent-foreground text-[10px] uppercase font-extrabold px-2 py-0.5 rounded mt-2 w-max">Pre-Order Item</span>
                      )}
                      <button onClick={() => handleRemove(item.productId)} className="text-xs text-destructive hover:underline flex items-center gap-1 mt-auto pt-2 w-max">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:block text-center text-sm font-bold">
                    <span className="sm:hidden text-muted-foreground">Price: </span>${item.unitPrice.toFixed(2)}
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:block text-center">
                    <span className="sm:hidden text-muted-foreground text-sm font-bold">Qty: </span>
                    <div className="flex items-center justify-center border border-border rounded bg-background overflow-hidden w-24 mx-auto">
                      <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 hover:bg-muted"><Minus size={14} /></button>
                      <span className="flex-1 text-sm font-bold text-center">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 hover:bg-muted"><Plus size={14} /></button>
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex justify-between sm:block text-right font-extrabold text-primary">
                    <span className="sm:hidden text-muted-foreground text-sm font-bold">Total: </span>${(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-card border border-card-border rounded-md p-6 shadow-sm sticky top-4">
            <h2 className="font-extrabold text-xl mb-6 border-b border-border pb-4">Order Summary</h2>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items subtotal ({cart.itemCount})</span>
                <span className="font-bold">${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping estimate</span>
                <span className="font-bold">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="text-3xl font-extrabold text-primary">${cart.subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={createOrder.isPending}
              className="w-full bg-primary text-primary-foreground py-4 rounded-md font-extrabold text-lg hover:bg-primary/90 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-4"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-success bg-success/10 py-2 rounded-md">
              <ShieldCheck size={16} /> Secure checkout provided by SourceGoods
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
