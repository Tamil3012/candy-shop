"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { getStore } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const assets = process.env.NEXT_PUBLIC_ASSETS_URL || "";

  useEffect(() => {
    getStore().then(data => {
      setStore(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar store={store} />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 italic text-pink-500">My Wishlist</h1>
            <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-pink-500">Wishlist</span>
            </div>
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlist.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group bg-slate-50 rounded-[2.5rem] p-6 border-2 border-transparent hover:border-pink-500/20 hover:bg-white transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(236,72,153,0.1)]"
                >
                  <div className="relative aspect-square mb-6 bg-white rounded-3xl p-4 overflow-hidden">
                    <img 
                      src={`${assets}${item.image}`} 
                      alt={item.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=Wishlist"; }}
                    />
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter leading-tight">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-800 tracking-tighter">₹{item.price}</span>
                      <button 
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item.id);
                        }}
                        className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-sky-500 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-6">
                <Heart size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Your Wishlist is Empty</h3>
              <p className="text-slate-400 font-bold uppercase text-xs mb-8">Save your favorite treats for later!</p>
              <Link href="/shop" className="bg-pink-500 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-200">
                Start Exploring
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer store={store} />
    </div>
  );
}
