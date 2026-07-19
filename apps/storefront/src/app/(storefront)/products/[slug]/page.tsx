'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetProduct, useAddCartItem, getGetCartQueryKey, getGetProductQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, ShieldCheck, Truck, AlertCircle, Plus, Minus, Info, Globe, Store } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useGetProduct(slug || '', {
    query: { enabled: !!slug, queryKey: getGetProductQueryKey(slug || '') },
  });
  const addCartItem = useAddCartItem();
  const queryClient = useQueryClient();

  const moq = product?.moq || 1;
  const [quantity, setQuantity] = useState(moq);
  const [activeImage, setActiveImage] = useState(0);

  // Sync quantity once product loads
  if (product && quantity < moq) setQuantity(moq);

  if (isLoading) {
    return (
      <div className="p-24 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <div className="font-bold text-muted-foreground">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-24 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <Link href="/products" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-bold">Back to Products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity < moq) {
      toast.error('Minimum Order Quantity', { description: `You must order at least ${moq} items.` });
      return;
    }
    addCartItem.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        toast.success('Added to cart', { description: `${quantity}x ${product.name} added to your cart.` });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      },
    });
  };

  const allImages = [product.primaryImageUrl, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="pb-16 max-w-[1200px] mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{product.name}</span>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 shadow-sm mb-8">
        {/* Left: Images */}
        <div className="w-full lg:w-[480px] flex-shrink-0">
          <div className="aspect-square bg-white rounded-lg border border-border overflow-hidden mb-4 relative cursor-zoom-in group">
            {allImages.length > 0 ? (
              <img src={allImages[activeImage]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">No images available</div>
            )}
            {product.isPreOrder && (
              <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded font-extrabold text-xs uppercase tracking-wider shadow-sm">
                Pre-Order
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden bg-white ${activeImage === i ? 'border-primary' : 'border-border hover:border-primary/50'} transition-colors`}>
                  <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col min-w-0">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground mb-3 leading-tight">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
            {product.brand && <span>Brand: <span className="font-bold text-foreground">{product.brand}</span></span>}
            <div className="flex items-center gap-1 text-success font-bold"><ShieldCheck size={16} /> Verified Supplier</div>
            <div className="flex items-center gap-1"><Globe size={16} /> Ships Worldwide</div>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-md p-6 mb-8">
            <div className="flex flex-wrap items-end gap-2 mb-1">
              <span className="text-sm font-bold text-muted-foreground pb-1">{product.currency}</span>
              <span className="text-4xl lg:text-5xl font-extrabold text-primary">${product.basePrice.toFixed(2)}</span>
              <span className="text-muted-foreground font-medium pb-1.5 ml-1">/ piece</span>
            </div>
            {product.isPreOrder && (
              <div className="mt-6 pt-5 border-t border-orange-200/60">
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-6">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex justify-between text-sm font-extrabold mb-2">
                      <span className="text-foreground">Pre-Order Funding</span>
                      <span className="text-primary">{Math.min(100, Math.round((product.currentPreOrderCount / (moq * 5)) * 100))}%</span>
                    </div>
                    <div className="w-full bg-orange-100 rounded-md h-2.5 mb-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-md transition-all duration-1000" style={{ width: `${Math.min(100, (product.currentPreOrderCount / (moq * 5)) * 100)}%` }}></div>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">{product.currentPreOrderCount} items backed so far</div>
                  </div>
                  <div className="bg-white border border-orange-200 px-5 py-3 rounded-md text-center shadow-sm">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Min. Order (MOQ)</div>
                    <div className="font-extrabold text-xl text-foreground">{moq} pcs</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-5 mb-8 bg-card border border-card-border p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground w-20">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden shadow-sm h-11">
                <button onClick={() => setQuantity(Math.max(moq, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-r border-border"><Minus size={16} /></button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(moq, parseInt(e.target.value) || moq))} className="w-16 h-full text-center outline-none bg-transparent font-extrabold text-foreground" min={moq} />
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-l border-border"><Plus size={16} /></button>
              </div>
              {quantity < moq && <span className="text-destructive text-sm font-bold flex items-center gap-1"><AlertCircle size={14} /> Below MOQ</span>}
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-5">
              <button onClick={handleAddToCart} disabled={addCartItem.isPending} className="flex-1 bg-white text-primary border-2 border-primary py-3.5 rounded-full font-extrabold text-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button onClick={handleAddToCart} disabled={addCartItem.isPending} className="flex-1 bg-primary text-primary-foreground py-4 rounded-full font-extrabold text-lg hover:bg-primary/90 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                Start Order
              </button>
            </div>
          </div>

          {/* Meta Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-4 border border-card-border rounded-xl bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0"><Truck className="text-primary" size={20} /></div>
              <div>
                <div className="font-bold text-sm mb-1">Estimated Shipping</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{product.estimatedShipDate ? new Date(product.estimatedShipDate).toLocaleDateString() : 'TBD based on factory completion time'}</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-card-border rounded-xl bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0"><ShieldCheck className="text-success" size={20} /></div>
              <div>
                <div className="font-bold text-sm mb-1">Trade Assurance</div>
                <div className="text-xs text-muted-foreground leading-relaxed">Protects your SourceGoods orders from payment to delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-border">
          <div className="px-6 py-4 font-bold text-primary border-b-2 border-primary bg-primary/5 cursor-pointer">Product Details</div>
          <div className="px-6 py-4 font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Supplier Info</div>
          <div className="px-6 py-4 font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Reviews</div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {product.description && (
                <div>
                  <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2"><Info size={20} className="text-muted-foreground" /> Overview</h3>
                  <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{product.description}</div>
                </div>
              )}
              {product.attributes && product.attributes.length > 0 && (
                <div>
                  <h3 className="text-lg font-extrabold mb-4">Specifications</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    {product.attributes.map((attr, idx) => (
                      <div key={idx} className={`flex border-b border-border last:border-0 ${idx % 2 === 0 ? 'bg-muted/30' : 'bg-card'}`}>
                        <div className="w-1/3 p-3 text-sm font-bold text-muted-foreground border-r border-border">{attr.label}</div>
                        <div className="w-2/3 p-3 text-sm font-medium">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="border border-border rounded-xl p-5 bg-muted/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded bg-white border border-border flex items-center justify-center text-primary"><Store size={24} /></div>
                  <div>
                    <h4 className="font-bold leading-tight">Global Sourcing Mfg Co., Ltd.</h4>
                    <span className="text-xs text-muted-foreground">Manufacturer</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm border-t border-border pt-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Response Rate</span><span className="font-bold">98.5%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">On-time delivery</span><span className="font-bold">99.2%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Transactions</span><span className="font-bold">500,000+ USD</span></div>
                </div>
                <button className="w-full mt-5 bg-white border border-border py-2 rounded font-bold hover:border-primary transition-colors text-sm">Visit Store</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
