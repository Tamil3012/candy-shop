"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, Truck, CreditCard, Headphones, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { getStore } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const assets = process.env.NEXT_PUBLIC_ASSETS_URL || "";

  useEffect(() => {
    getStore().then(data => {
      setStore(data);
      setLoading(false);
    });
  }, []);

  const shipping = cart.length > 0 ? 0 : 0;
  const taxes = cartTotal * 0.05; // 5% GST for candy
  const discount = cart.length > 0 ? 100 : 0;
  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const total = cartTotal + shipping + taxes - discount;

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full"
            />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar store={store} />

      <main className="pt-32 pb-40">
        <div className="max-w-7xl mx-auto px-6">
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-24 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />
             
             <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 underline decoration-sky-500/20">Shopping Cart</h1>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                <Link href="/" className="hover:text-sky-500 transition-colors">HOME</Link>
                <ChevronRight size={10} />
                <span className="text-sky-500">CART COLLECTION</span>
             </div>
          </div>

          {cart.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-20">
              {/* CART LIST */}
              <div className="flex-1">
                <div className="hidden md:grid grid-cols-12 bg-amber-400/90 text-white p-6 rounded-[2rem] mb-10 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-amber-100 italic">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>

                <div className="space-y-10">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 py-10 border-b border-slate-50 last:border-0 relative group"
                      >
                         <button 
                            onClick={() => removeFromCart(item.id)}
                            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 p-2 text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X size={24} />
                          </button>

                        <div className="col-span-12 md:col-span-6 flex items-center gap-8">
                          <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] p-4 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
                            <img 
                              src={`${assets}${item.image}`} 
                              alt={item.name} 
                              className="max-w-full max-h-full object-contain drop-shadow-lg"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=Candy"; }}
                            />
                          </div>
                          <div className="space-y-1">
                             <Link href={`/product/${item.seo_url || ""}`}>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight hover:text-sky-500 transition-colors">{item.name}</h3>
                             </Link>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.category || "ARTISAN COLLECTION"}</p>
                          </div>
                        </div>

                        <div className="col-span-4 md:col-span-2 text-center">
                            <p className="text-[10px] font-black text-slate-300 md:hidden uppercase mb-2">Price</p>
                            <span className="text-lg font-black text-slate-500 italic">₹{item.price}</span>
                        </div>

                        <div className="col-span-4 md:col-span-2 flex flex-col items-center">
                            <p className="text-[10px] font-black text-slate-300 md:hidden uppercase mb-2">Qty</p>
                            <div className="flex items-center bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] h-12 px-2 gap-4">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-slate-300 hover:text-sky-500 transition-colors"><Minus size={14} /></button>
                              <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-slate-300 hover:text-sky-500 transition-colors"><Plus size={14} /></button>
                            </div>
                        </div>

                        <div className="col-span-4 md:col-span-2 text-center">
                            <p className="text-[10px] font-black text-slate-300 md:hidden uppercase mb-2">Total</p>
                            <span className="text-xl font-black text-slate-900 tracking-tighter italic">₹{item.price * item.quantity}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* COUPON & ACTIONS */}
                <div className="mt-20 flex flex-col xl:flex-row items-center justify-between gap-12">
                   <div className="flex items-center gap-4 w-full xl:w-auto">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="PROMO CODE" 
                          className="w-full xl:w-80 h-16 pl-8 pr-4 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest outline-none border-2 border-transparent focus:border-sky-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <button className="h-16 px-10 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-sky-500 transition-all shadow-xl shadow-slate-200">
                        Apply
                      </button>
                   </div>
                   <button 
                     onClick={clearCart}
                     className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-red-500 transition-all italic underline underline-offset-[12px] decoration-slate-100"
                   >
                     Clear Shopping Cart
                   </button>
                </div>
              </div>

              {/* SIDEBAR SUMMARY */}
              <div className="w-full lg:w-[400px]">
                 <div className="bg-slate-50 p-10 lg:p-12 rounded-[4rem] border border-slate-100 sticky top-32">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-12 border-b border-white pb-6">Your Order</h3>
                    
                    <div className="space-y-6 mb-12">
                       <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100/50">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Items</span>
                          <span className="font-black italic">{itemsCount}</span>
                       </div>
                       <div className="flex justify-between items-center px-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub Total</span>
                          <span className="font-black text-lg italic tracking-tighter">₹{cartTotal}</span>
                       </div>
                       <div className="flex justify-between items-center px-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping</span>
                          <span className="font-black text-xs uppercase text-sky-500">Free</span>
                       </div>
                       <div className="flex justify-between items-center px-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax (GST)</span>
                          <span className="font-black italic">₹{taxes.toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl text-pink-500">
                          <span className="text-[10px] font-black uppercase tracking-widest italic">Coupon Save</span>
                          <span className="font-black italic">-₹{discount}</span>
                       </div>
                    </div>

                    <div className="pt-8 border-t-4 border-double border-white mb-12 flex justify-between items-center px-4">
                       <span className="text-sm font-black uppercase tracking-[0.2em] italic">Total Due</span>
                       <span className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{total.toFixed(0)}</span>
                    </div>

                    <Link href="/checkout">
                       <button className="w-full h-20 bg-slate-900 hover:bg-sky-500 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-4">
                          PROCEED TO PAY <ArrowRight size={20} />
                       </button>
                    </Link>
                 </div>
              </div>
            </div>
          ) : (
            <div className="py-40 text-center flex flex-col items-center">
              <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center text-sky-500 mb-10 border-4 border-white shadow-2xl">
                <ShoppingCart size={64} strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Nothing Sweet Here</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">Your cart is feeling a bit lonely.</p>
              <Link href="/shop" className="bg-sky-500 text-white px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-sky-100 hover:scale-105 transition-transform active:scale-95">
                Start Tasting
              </Link>
            </div>
          )}

          {/* TRUST BADGES */}
          <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 border-t border-slate-50 pt-24 px-10">
              {[
                { icon: Truck, t: "Flash Shipping", d: "Next day delivery across India." },
                { icon: CreditCard, t: "Secure Vault", d: "100% encrypted payment processing." },
                { icon: Headphones, t: "Sweet Support", d: "Concierge service for your cravings." },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-6 group cursor-default">
                   <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm border border-amber-100">
                      <b.icon size={32} />
                   </div>
                   <div className="space-y-2">
                     <h4 className="font-black text-sm uppercase tracking-widest group-hover:text-sky-500 transition-colors">{b.t}</h4>
                     <p className="text-[10px] font-black text-slate-300 uppercase leading-relaxed">{b.d}</p>
                   </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      <Footer store={store} />
    </div>
  );
}
