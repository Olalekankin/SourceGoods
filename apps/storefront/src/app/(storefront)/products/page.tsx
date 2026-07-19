'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useListProducts, useListCategories } from '@workspace/api-client-react';
import ProductCard from '@/components/product/ProductCard';
import { Filter, Search as SearchIcon, X } from 'lucide-react';
import Link from 'next/link';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const q = searchParams.get('search') || undefined;
  const isPreOrder = searchParams.get('isPreOrder') === 'true' ? true : undefined;

  const statusParam = searchParams.get('status') as any;
  const status = ['draft', 'published', 'archived'].includes(statusParam) ? statusParam : undefined;

  const { data: categoryData } = useListCategories();
  const { data, isLoading } = useListProducts({
    category,
    search: q,
    isPreOrder,
    status,
    limit: 40,
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-12">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between bg-card border border-card-border p-4 rounded-xl">
        <h1 className="font-bold text-lg">Products</h1>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-sm font-bold border border-border px-3 py-1.5 rounded bg-muted"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Filters Sidebar */}
      <aside className={`fixed inset-0 z-50 bg-background md:bg-transparent md:static md:w-64 flex-shrink-0 transition-transform ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="bg-card md:border border-card-border rounded-xl h-full md:h-auto overflow-y-auto sticky top-4">
          <div className="p-4 border-b border-border flex items-center justify-between md:hidden">
            <h2 className="font-bold text-lg">Filters</h2>
            <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
          </div>

          <div className="p-5 space-y-8">
            <div>
              <h3 className="text-sm font-extrabold text-foreground mb-3 uppercase tracking-wider">Categories</h3>
              <div className="space-y-1">
                <Link href="/products" className={`block px-2 py-1.5 rounded text-sm transition-colors ${!category ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  All Categories
                </Link>
                {categoryData?.map(c => (
                  <Link href={`/products?category=${c.id}`} key={c.id} className={`block px-2 py-1.5 rounded text-sm transition-colors ${category === c.id ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                    {c.name} <span className="text-xs opacity-60">({c.productCount})</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-extrabold text-foreground mb-3 uppercase tracking-wider">Product Type</h3>
              <div className="space-y-2">
                <Link href="/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${!isPreOrder && !status ? 'bg-primary border-primary' : 'border-muted-foreground group-hover:border-primary'}`}>
                    {!isPreOrder && !status && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  Any Type
                </Link>
                <Link href="/products?isPreOrder=true" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isPreOrder ? 'bg-primary border-primary' : 'border-muted-foreground group-hover:border-primary'}`}>
                    {isPreOrder && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  Pre-Order Only
                </Link>
                <Link href="/products?status=published" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${status === 'published' ? 'bg-primary border-primary' : 'border-muted-foreground group-hover:border-primary'}`}>
                    {status === 'published' && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  Ready to Ship (In Stock)
                </Link>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-extrabold text-foreground mb-3 uppercase tracking-wider">Supplier Features</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer group">
                  <input type="checkbox" className="rounded border-muted-foreground text-primary focus:ring-primary accent-primary" defaultChecked />
                  Verified Supplier
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer group">
                  <input type="checkbox" className="rounded border-muted-foreground text-primary focus:ring-primary accent-primary" defaultChecked />
                  Trade Assurance
                </label>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main List */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-card border border-card-border p-4 rounded-md gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            {q && <SearchIcon size={20} className="text-muted-foreground" />}
            {q ? `Results for "${q}"` : categoryData?.find(c => c.id === category)?.name || 'All Marketplace Products'}
            <span className="text-muted-foreground text-sm font-medium ml-1">({data?.total || 0} items)</span>
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
            <select className="text-sm border border-border rounded-md px-3 py-1.5 bg-background font-medium outline-none focus:border-primary cursor-pointer">
              <option>Best Match</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(category || q || isPreOrder || status) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground mr-1 font-medium">Active filters:</span>
            {q && (
              <Link href="/products" className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-primary/20 transition-colors">
                Search: {q} <X size={12} />
              </Link>
            )}
            {category && (
              <Link href="/products" className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-primary/20 transition-colors">
                Category <X size={12} />
              </Link>
            )}
            {isPreOrder && (
              <Link href="/products" className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-primary/20 transition-colors">
                Pre-Order Only <X size={12} />
              </Link>
            )}
            {status && (
              <Link href="/products" className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-primary/20 transition-colors">
                Status: {status} <X size={12} />
              </Link>
            )}
            <Link href="/products" className="text-xs text-muted-foreground hover:text-foreground font-medium hover:underline ml-2">Clear all</Link>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-5 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-24 bg-card border border-card-border rounded-xl shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <SearchIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-extrabold mb-2 text-foreground">No products found</h3>
            <p className="text-muted-foreground max-w-md">We couldn't find any products matching your current filters and search query. Try broadening your criteria.</p>
            <Link href="/products" className="mt-6 text-primary font-bold hover:underline">Clear all filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data?.items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <div className="text-muted-foreground font-bold">Loading Products...</div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
