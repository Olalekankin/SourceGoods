import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#131921] text-[#D1D5DB] pt-12 pb-6 text-sm mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">About SourcedGoods</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Sitemap</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Corporate Responsibility</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Help Center</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Report Abuse</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Submit a Dispute</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Policies & Rules</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/products?category=apparel" className="hover:text-white hover:underline transition-colors">Apparel & Accessories</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-white hover:underline transition-colors">Consumer Electronics</Link></li>
              <li><Link href="/products?category=home" className="hover:text-white hover:underline transition-colors">Home & Garden</Link></li>
              <li><Link href="/products" className="hover:text-white hover:underline transition-colors">See All Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Trust & Safety</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Trade Assurance</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Secure Payment</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Verified Suppliers</Link></li>
              <li><Link href="/" className="hover:text-white hover:underline transition-colors">Order Protection</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col lg:flex-row items-center justify-between text-xs gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="light" />
            <p className="text-sm text-[#D1D5DB]">&copy; {new Date().getFullYear()} SourcedGoods. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
            <Link href="/" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Do Not Sell My Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
