'use client';
import Link from 'next/link';
import { Product } from '@workspace/api-client-react';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block bg-card rounded-xl border border-card-border overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-200">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {product.primaryImageUrl ? (
          <img 
            src={product.primaryImageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm bg-muted/50">No Image</div>
        )}
        {product.isPreOrder && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] uppercase tracking-wider font-extrabold px-2 py-1 rounded shadow-sm">
            Pre-Order
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 text-foreground mb-1 group-hover:text-primary transition-colors min-h-[40px] leading-tight">
          {product.name}
        </h3>
        <div className="font-extrabold text-lg text-foreground flex items-baseline gap-1">
          <span className="text-sm font-bold text-muted-foreground">{product.currency}</span>
          ${product.basePrice.toFixed(2)}
        </div>
        {product.isPreOrder && product.moq && (
          <div className="text-xs text-muted-foreground mt-1 font-medium">{product.moq} Pieces (MOQ)</div>
        )}
        <div className="text-[10px] uppercase tracking-wider font-bold text-success mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Verified Supplier
        </div>
      </div>
    </Link>
  );
}
