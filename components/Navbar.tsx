"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, Search, Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function Navbar({ store }: { store?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "WOMAN", href: "/shop?category=woman" },
    { name: "COOKIES", href: "/shop?category=cookies" },
    { name: "CHERY", href: "/shop?category=chery" },
    { name: "CREAM", href: "/shop?category=cream" },
    { name: "CAKE ROLL", href: "/shop?category=cake-roll" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] font-sans antialiased">
        {/* TOP ANNOUNCEMENT BAR */}
        <div className="bg-[#c2185b] text-white py-2 px-6 flex justify-between items-center text-[10px] font-bold tracking-widest transition-all duration-300 overflow-hidden h-9">
          <div className="flex items-center gap-4">
             <span className="hidden sm:inline opacity-80 uppercase tracking-widest">Wants to explore upcoming Deals on Weekend?</span>
             <Link href="/shop" className="underline hover:no-underline">SHOP NOW</Link>
          </div>
          <div className="flex items-center gap-6 divide-x divide-white/20">
             <div className="flex items-center gap-1 cursor-pointer hover:opacity-100 opacity-80">USD <ChevronDown size={10} /></div>
             <div className="flex items-center gap-1 pl-4 cursor-pointer hover:opacity-100 opacity-80 uppercase tracking-widest">English <ChevronDown size={10} /></div>
          </div>
        </div>

        {/* MAIN NAVBAR */}
        <nav className={`transition-all duration-500 bg-white border-b border-slate-50 ${scrolled ? "py-2 shadow-xl" : "py-6 shadow-sm"}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between gap-8 mb-4 lg:mb-6">
              {/* SEARCH BAR */}
              <div className="hidden lg:flex flex-1 max-w-sm">
                 <div className="relative w-full group">
                    <input 
                      type="text" 
                      placeholder="Search our catalog..." 
                      className="w-full bg-slate-50 border border-slate-100 pl-4 pr-10 py-2.5 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-rose-200 transition-all font-medium"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-rose-500 transition-colors" size={16} />
                 </div>
              </div>

              {/* LOGO */}
              <div className="flex-1 flex justify-start lg:justify-center">
                <Link href="/" className="flex flex-col items-center group">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 lg:w-12 lg:h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-sm border border-rose-100">
                        <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xl lg:text-2xl font-black text-slate-800 leading-none tracking-tighter italic">Sweets <span className="text-rose-600">Cake</span></span>
                        <span className="text-[8px] font-black tracking-[0.4em] text-slate-300 uppercase mt-1">THE BEST ARTISAN SHOP</span>
                     </div>
                  </div>
                </Link>
              </div>

              {/* ACTION ICONS */}
              <div className="flex-1 flex justify-end items-center gap-4 lg:gap-8 text-slate-600">
                <div className="hidden sm:flex items-center gap-6">
                   <Link href="/wishlist" className="hover:text-rose-600 transition-colors relative">
                      <Heart size={20} />
                      {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />}
                   </Link>
                   <Link href="/account" className="hover:text-rose-600 transition-colors">
                      <User size={20} />
                   </Link>
                </div>
                
                <Link href="/cart" className="flex items-center gap-3 group relative pl-4 border-l border-slate-100">
                  <div className="relative">
                     <ShoppingCart size={24} className="group-hover:text-rose-600 transition-colors" />
                     <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">{cartCount}</span>
                  </div>
                  <div className="hidden lg:flex flex-col items-start leading-none group-hover:opacity-80">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-0.5">Your Basket</span>
                     <span className="text-xs font-black text-rose-600">ITEMS GO</span>
                  </div>
                </Link>

                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-slate-800 hover:text-rose-600 transition-colors">
                  <Menu size={28} />
                </button>
              </div>
            </div>

            {/* NAV LINKS (DESKTOP) */}
            <div className="hidden lg:flex items-center justify-center gap-12 mt-4 pt-4 border-t border-slate-50">
               {navLinks.map((link) => (
                 <Link 
                   key={link.name} 
                   href={link.href} 
                   className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-rose-600 transition-all relative overflow-hidden group pb-1"
                 >
                   {link.name}
                   <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                 </Link>
               ))}
            </div>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[320px] bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                 <Link href="/" className="text-xl font-black italic">SWEETS <span className="text-rose-600">CAKE</span></Link>
                 <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                    <X size={28} />
                 </button>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto">
                 <div className="flex flex-col gap-8">
                    {["HOME", "COLLECTIONS", "BEST SELLERS", "OUR STORY", "CONTACT"].map((item) => (
                      <Link 
                        key={item} 
                        href={item === "HOME" ? "/" : `/shop`} 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-black tracking-tighter uppercase italic text-slate-800 hover:text-rose-600 transition-colors"
                      >
                         {item}
                      </Link>
                    ))}
                 </div>

                 <div className="mt-16 pt-16 border-t border-slate-50 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Categories</h4>
                    <div className="flex flex-col gap-4">
                       {navLinks.map((link) => (
                         <Link 
                           key={link.name} 
                           href={link.href} 
                           onClick={() => setIsMenuOpen(false)}
                           className="text-sm font-black text-slate-600 hover:text-rose-600 transition-colors"
                         >
                            {link.name}
                         </Link>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                 <div className="flex items-center gap-6 justify-center">
                    <Link href="/wishlist" className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
                       <Heart size={20} />
                    </Link>
                    <Link href="/account" className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
                       <User size={20} />
                    </Link>
                    <button className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
                       <Search size={20} />
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
