'use client';

import { useGetHomepageData } from '@workspace/api-client-react';
import ProductCard from '@/components/product/ProductCard';
import { ChevronRight, LayoutGrid, Shirt, Home as HomeIcon, Smartphone, Gamepad2, Smile, Watch, Briefcase, Utensils, PenTool, Puzzle, Heart, Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Apparel & Accessories': Shirt,
  'Home & Garden': HomeIcon,
  'Consumer Electronics': Smartphone,
  'Sports & Entertainment': Gamepad2,
  'Beauty & Personal Care': Smile,
  'Jewelry & Watches': Watch,
  'Luggage & Bags': Briefcase,
  'Kitchen & Dining': Utensils,
  'Office & School Supplies': PenTool,
  'Toys & Games': Puzzle,
  'Health & Wellness': Heart,
  'Automotive': Car,
};

export default function HomePage() {
  const { data, isLoading } = useGetHomepageData();

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <div className="text-muted-foreground font-bold">Loading Marketplace...</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { featuredProducts, trendingProducts, recentlyAdded, categories } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Main Top Section */}
      <section className="flex flex-col lg:flex-row gap-4 h-auto lg:h-120">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-60 bg-card border border-card-border rounded-md shrink-0 overflow-y-auto py-2 shadow-sm">
          <div className="px-4 py-2 font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3 mb-2">
            <LayoutGrid size={18} className="text-primary" /> My Markets
          </div>
          <nav className="flex flex-col">
            {categories?.slice(0, 12).map((cat) => {
              const Icon = CATEGORY_ICONS[cat.name] || LayoutGrid;
              return (
                <Link key={cat.id} href={`/products?category=${cat.id}`} className="px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between group font-medium">
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="truncate max-w-35 text-foreground group-hover:text-primary">{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Middle Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Hero Banner */}
          <div className="bg-secondary rounded-md flex-1 relative overflow-hidden flex flex-col justify-center px-8 lg:px-12 py-12 lg:py-0 border border-secondary-border shadow-sm group cursor-pointer">
            <div className="absolute inset-0 bg-linear-to-r from-secondary to-secondary/40 z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-3/4 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8ed7c663be?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            
            <div className="relative z-20 max-w-lg">
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground font-extrabold text-[10px] uppercase tracking-wider rounded-md mb-4 shadow-sm">
                Factory Direct Pre-Orders
              </span>
              <h1 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Discover manufacturers & pre-order deals
              </h1>
              <p className="text-gray-300 mb-8 text-sm lg:text-base max-w-md">
                Source directly from verified suppliers. Access wholesale pricing before items hit the shelves.
              </p>
              <Link href="/products" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3.5 rounded-md font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary/20">
                Explore Marketplace <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>

          {/* Sub-tabs Row */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0">
            <Link href="/products?isPreOrder=true" className="bg-card border border-card-border rounded-md px-6 py-4 flex-1 min-w-[220px] flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all group">
              <div>
                <div className="font-bold text-lg mb-1 text-foreground group-hover:text-primary transition-colors">Pre-order deals</div>
                <div className="text-xs font-medium text-muted-foreground">Up to 40% off retail</div>
              </div>
              <div className="w-12 h-12 rounded-md bg-orange-100 flex items-center justify-center text-orange-500 text-2xl shadow-inner">📦</div>
            </Link>
            <Link href="/products?status=published" className="bg-card border border-card-border rounded-md px-6 py-4 flex-1 min-w-[220px] flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all group">
              <div>
                <div className="font-bold text-lg mb-1 text-foreground group-hover:text-primary transition-colors">Ready to Ship</div>
                <div className="text-xs font-medium text-muted-foreground">In stock inventory</div>
              </div>
              <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-500 text-2xl shadow-inner">✈️</div>
            </Link>
            <Link href="/products" className="bg-card border border-card-border rounded-md px-6 py-4 flex-1 min-w-[220px] flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all group">
              <div>
                <div className="font-bold text-lg mb-1 text-foreground group-hover:text-primary transition-colors">New arrivals</div>
                <div className="text-xs font-medium text-muted-foreground">Fresh from factory</div>
              </div>
              <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center text-green-500 text-2xl shadow-inner">✨</div>
            </Link>
          </div>
        </div>

        {/* Right Hot Picks */}
        <aside className="w-full lg:w-70 bg-white border border-orange-200 rounded-md flex-shrink-0 flex flex-col overflow-hidden shadow-sm relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-md blur-3xl opacity-50 pointer-events-none"></div>
          <div className="p-5 border-b border-orange-100 relative z-10">
            <h3 className="font-extrabold text-xl text-foreground flex items-center gap-2">
              <span className="text-2xl animate-pulse">🔥</span> Hot Picks
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Trending items right now</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5 relative z-10">
            {trendingProducts?.slice(0, 4).map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="flex gap-4 group items-center">
                <div className="w-16 h-16 rounded-md bg-muted border border-border overflow-hidden flex-shrink-0">
                  {product.primaryImageUrl ? (
                    <img src={product.primaryImageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</span>
                  <span className="text-primary font-extrabold text-sm mt-1">${product.basePrice.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {/* 2. Curated category card row */}
      <section className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-4">
          {[
            {
              href: '/products?category=apparel',
              heading: 'Shop Fashion for less',
              cards: [
                { label: 'Jeans under $50', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
                { label: 'Tops under $25', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
                { label: 'Dresses under $30', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
                { label: 'Shoes under $50', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
              ],
              footer: 'See all deals',
            },
            {
              href: '/products?category=home',
              heading: 'New home arrivals under $50',
              cards: [
                { label: 'Kitchen & Dining', image: 'https://images.unsplash.com/photo-1506265142947-99ae2b6a2ee6?auto=format&fit=crop&w=900&q=80' },
                { label: 'Home Improvement', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80' },
                { label: 'Décor', image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&q=80' },
                { label: 'Bedding & Bath', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
              ],
              footer: 'Shop the latest from Home',
            },
            {
              href: '/products?category=kitchen',
              heading: 'Top categories in Kitchen appliances',
              cards: [
                { label: 'Cooker', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', fullWidth: true },
                { label: 'Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
                { label: 'Pots and Pans', image: 'https://images.unsplash.com/photo-1515548211986-64f3cf64bb46?auto=format&fit=crop&w=900&q=80' },
                { label: 'Kettles', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80' },
              ],
              footer: 'Explore all products in Kitchen',
            },
            {
              href: '/products?category=apparel',
              heading: 'Fashion trends you like',
              cards: [
                { label: 'Dresses', image: 'https://images.unsplash.com/photo-1520975910495-35f1b48e2f28?auto=format&fit=crop&w=900&q=80' },
                { label: 'Knits', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
                { label: 'Jackets', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
                { label: 'Jewelry', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' },
              ],
              footer: 'Explore more',
            },
          ].map((group) => (
            <Link key={group.heading} href={group.href} className="group block overflow-hidden rounded-md border border-card-border bg-white shadow-sm transition hover:shadow-md">
              <div className="px-5 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{group.heading}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50">
                {group.cards.map((card) => (
                  <div key={card.label} className={card.fullWidth ? 'col-span-2 overflow-hidden rounded-md' : 'overflow-hidden rounded-md'}>
                    <div className="relative h-32 overflow-hidden rounded-md">
                      <img src={card.image} alt={card.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs font-semibold text-white rounded-b-md">
                        {card.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-card-border px-5 py-4">
                <span className="text-sm font-bold text-primary">{group.footer}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-max">
            {trendingProducts?.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="shrink-0 w-72 overflow-hidden rounded-md border border-card-border bg-white shadow-sm transition hover:-translate-y-0.5"
              >
                <div className="relative h-44 overflow-hidden rounded-md">
                  {product.primaryImageUrl ? (
                    <img
                      src={product.primaryImageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">{product.category}</p>
                  <h3 className="font-bold text-sm text-foreground line-clamp-2">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <section className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-foreground">Explore Categories</h2>
          <Link href="/products" className="text-primary hover:underline text-sm font-bold flex items-center">View All <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.slice(0, 12).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name] || LayoutGrid;
            return (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="bg-card border border-card-border rounded-md p-6 text-center hover:border-primary/50 hover:shadow-md transition-all group flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{cat.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="bg-card border border-card-border rounded-md p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <h2 className="text-2xl font-extrabold text-foreground">Discover Marketplace</h2>
          <Link href="/products" className="text-primary hover:underline text-sm font-bold">View More</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featuredProducts?.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Recently Added */}
      {recentlyAdded && recentlyAdded.length > 0 && (
        <section className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-foreground">Recently Added</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {recentlyAdded.map((product) => (
              <div key={product.id} className="min-w-50 max-w-50 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. How Pre-Order Works */}
      <section className="bg-white border-2 border-primary/20 rounded-xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-50 to-transparent pointer-events-none"></div>
        <div className="text-center md:text-left md:w-1/3 relative z-10">
          <h2 className="text-3xl font-extrabold text-foreground mb-3">How Pre-Order Works</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Secure inventory before it's manufactured. Back pre-order products to reach the Minimum Order Quantity (MOQ) and unlock direct-from-factory wholesale rates.
          </p>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-8 w-full relative z-10">
          {[
            { step: 1, title: 'Browse & Back', desc: 'Find items and place a pre-order' },
            { step: 2, title: 'MOQ Reached', desc: 'Factory begins production' },
            { step: 3, title: 'Receive & Profit', desc: 'Items shipped directly to you', primary: true },
          ].map((s, i) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-3 flex-1">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl ${s.primary ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary border-2 border-primary'}`}>
                {s.step}
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground">{s.title}</div>
                <div className="text-xs text-muted-foreground mt-1 px-4">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
