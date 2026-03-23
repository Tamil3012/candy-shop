"use client";

import { Facebook, Instagram, Twitter, Youtube, Send, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer({ store }: { store?: any }) {
  const footerLinks = {
    products: [
      { name: "Prices drop", href: "/shop?sort=discount" },
      { name: "New products", href: "/shop?sort=newest" },
      { name: "Best sales", href: "/shop?sort=bestseller" },
      { name: "Contact us", href: "/contact" },
      { name: "Sitemap", href: "/sitemap" },
    ],
    company: [
      { name: "Delivery", href: "/delivery" },
      { name: "Legal Notice", href: "/legal" },
      { name: "Terms and conditions of use", href: "/terms" },
      { name: "About us", href: "/about" },
      { name: "Secure payment", href: "/payment" },
      { name: "Contact us", href: "/contact" },
      { name: "Stores", href: "/stores" },
    ],
    account: [
      { name: "Addresses", href: "/account/addresses" },
      { name: "Credit slips", href: "/account/credits" },
      { name: "Orders", href: "/account/orders" },
      { name: "Personal info", href: "/account/info" },
    ]
  };

  return (
    <footer className="bg-white border-t border-slate-100 font-sans antialiased">
      {/* NEWSLETTER BAR */}
      <div className="bg-[#c2185b] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-white">
             <div className="w-10 h-10 flex items-center justify-center border-2 border-white/20 rounded-full">
                <Send size={18} />
             </div>
             <div>
                <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">NEWSLETTER</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Get the latest updates & sweet deals</p>
             </div>
          </div>
          <div className="w-full max-w-lg">
             <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="flex-1 bg-white px-6 py-3 rounded-sm text-xs focus:outline-none font-medium placeholder:text-slate-300"
                />
                <button className="bg-slate-900 text-white px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
                  Subscribe
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* STORE INFO */}
        <div className="space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 pb-4 border-b border-rose-100 italic">Store Information</h4>
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm border border-rose-100">
                <Send size={18} />
              </div>
              <span className="text-xl font-black italic">Sweets <span className="text-rose-600">Cake</span></span>
            </Link>
            <div className="space-y-4">
              <div className="flex gap-4 group">
                 <MapPin className="text-rose-500 shrink-0 group-hover:scale-110 transition-transform" size={18} />
                 <p className="text-xs font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                    {store?.address || "Premium Sweets Lane, Cake District 101, London"}
                 </p>
              </div>
              <div className="flex gap-4 group">
                 <Phone className="text-rose-500 shrink-0 group-hover:scale-110 transition-transform" size={18} />
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                    {store?.contact_no || "+1 (888) SWEET-00"}
                 </p>
              </div>
              <div className="flex gap-4 group">
                 <Mail className="text-rose-500 shrink-0 group-hover:scale-110 transition-transform" size={18} />
                 <p className="text-xs font-bold text-slate-400 tracking-widest italic lowercase">
                    {store?.email || "hello@sweetscake.com"}
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 pb-4 border-b border-rose-100 italic">Products</h4>
          <div className="flex flex-col gap-4">
             {footerLinks.products.map((link) => (
               <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors italic">
                  {link.name}
               </Link>
             ))}
          </div>
        </div>

        {/* OUR COMPANY */}
        <div className="space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 pb-4 border-b border-rose-100 italic">Our Company</h4>
          <div className="flex flex-col gap-4 text-slate-400">
             {footerLinks.company.map((link) => (
               <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors italic">
                  {link.name}
               </Link>
             ))}
          </div>
        </div>

        {/* YOUR ACCOUNT */}
        <div className="space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 pb-4 border-b border-rose-100 italic">Your Account</h4>
          <div className="flex flex-col gap-4 text-slate-400">
             {footerLinks.account.map((link) => (
               <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors italic">
                  {link.name}
               </Link>
             ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">
              Powered by {store?.store_name || "Sweets Cake"} Demo Store © 2026
           </p>
           <div className="flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <Facebook size={16} className="cursor-pointer" />
              <Twitter size={16} className="cursor-pointer" />
              <Instagram size={16} className="cursor-pointer" />
              <Youtube size={16} className="cursor-pointer" />
           </div>
           <div className="flex items-center gap-2">
               <div className="w-10 h-6 bg-slate-100 rounded-sm" />
               <div className="w-10 h-6 bg-slate-100 rounded-sm" />
               <div className="w-10 h-6 bg-slate-100 rounded-sm" />
               <div className="w-10 h-6 bg-slate-100 rounded-sm" />
           </div>
        </div>
      </div>
      
      <div className="bg-[#1a1a1a] text-white py-1 px-6 text-[8px] font-medium tracking-[0.5em] text-center uppercase opacity-80">
         Premium Artisan Sweets & Handcrafted Delights
      </div>
    </footer>
  );
}
