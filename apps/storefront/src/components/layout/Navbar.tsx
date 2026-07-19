'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, Package } from 'lucide-react';
import { useGetMe, useGetCart, getGetMeQueryKey } from '@workspace/api-client-react';
import Logo from './Logo';

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('sg_token');
  const { data: user } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      enabled: hasToken,
      retry: false,
      refetchOnWindowFocus: false,
    }
  });
  const { data: cart } = useGetCart();
  const [showBanner, setShowBanner] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="w-full flex flex-col relative z-50">
      {/* Announcement Bar */}
      {showBanner && (
        <div className="bg-secondary text-secondary-foreground text-xs py-1.5 px-4 flex justify-between items-center">
          <div className="max-w-350 mx-auto w-full flex justify-between items-center px-4 lg:px-8">
            <span className="font-medium">Welcome to SourceGoods – The Pre-Order Marketplace</span>
            <button onClick={() => setShowBanner(false)} className="hover:text-primary transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-background border-b border-border py-4 px-4 lg:px-8 shadow-sm">
        <div className="max-w-350 mx-auto flex items-center justify-between gap-4 lg:gap-8">

          <Link href="/" className="flex items-center shrink-0">
            <Logo variant="dark" />
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-3xl flex items-center">
            <div className="flex w-full rounded-full border-2 border-primary overflow-hidden bg-white focus-within:shadow-md transition-shadow">
              <select className="bg-muted px-4 py-2 text-sm border-r border-border outline-none hidden md:block w-36 text-muted-foreground focus:ring-0 cursor-pointer">
                <option>Products</option>
                <option>Suppliers</option>
              </select>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for manufacturers and pre-order goods..."
                className="flex-1 px-4 py-2 outline-none text-sm text-foreground bg-white"
              />
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <Link href={user ? "/account/orders" : "/auth/login"} className="flex items-center gap-2 hover:text-primary transition-colors text-sm group">
              <User size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="hidden md:flex flex-col">
                <span className="text-xs text-muted-foreground">{user ? 'Welcome back' : 'Sign in'}</span>
                <span className="font-bold leading-none text-foreground group-hover:text-primary transition-colors">{user ? user.name : 'Account'}</span>
              </div>
            </Link>

            <Link href="/account/orders" className="flex items-center gap-2 hover:text-primary transition-colors text-sm hidden sm:flex group">
              <Package size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Returns</span>
                <span className="font-bold leading-none text-foreground group-hover:text-primary transition-colors">& Orders</span>
              </div>
            </Link>

            <Link href="/cart" className="flex items-center gap-2 hover:text-primary transition-colors text-sm relative group">
              <div className="relative">
                <ShoppingCart size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                {(cart?.itemCount ?? 0) > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cart?.itemCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs text-muted-foreground">My</span>
                <span className="font-bold leading-none text-foreground group-hover:text-primary transition-colors">Cart</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Nav */}
      <div className="bg-background border-b border-border py-2 px-4 lg:px-8 overflow-x-auto whitespace-nowrap">
        <div className="max-w-350 mx-auto flex items-center gap-6 text-sm font-medium text-foreground">
          <Link href="/products" className="flex items-center gap-2 hover:text-primary font-bold"><Menu size={16} /> All Categories</Link>
          <Link href="/products?isPreOrder=true" className="hover:text-primary transition-colors">Pre-Order Deals</Link>
          <Link href="/products?status=published" className="hover:text-primary transition-colors">Ready to Ship</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Verified Suppliers</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Order Protection</Link>
        </div>
      </div>
    </header>
  );
}
