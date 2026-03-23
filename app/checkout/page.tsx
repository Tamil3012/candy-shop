"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, MapPin, Phone, User, Send, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { getStore } from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile: ""
  });

  useEffect(() => {
    getStore().then(data => {
      setStore(data);
      setLoading(false);
    });
  }, []);

  const shipping = 0;
  const taxes = cartTotal * 0.05;
  const total = cartTotal + shipping + taxes;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.mobile) {
      alert("Please fill in all details to proceed.");
      return;
    }

    // Format WhatsApp Message
    const orderItems = cart.map(item => `• ${item.name} (x${item.quantity || 1}) - ₹${item.price}`).join("\n");
    const message = `*🍰 SWEET CAKE - NEW ORDER *\n\n` +
                    `*👤 CLIENT DETAILS*\n` +
                    `*Name:* ${formData.name}\n` +
                    `*Mobile:* ${formData.mobile}\n` +
                    `*Address:* ${formData.address}\n\n` +
                    `*🛒 ORDER SUMMARY*\n` +
                    `${orderItems}\n\n` +
                    `*💰 TOTAL AMOUNT:* ₹${total.toFixed(0)}\n\n` +
                    `_Thank you for shopping with us!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919100850712?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"
            />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-rose-100 italic">
      <Navbar store={store} />

      <main className="pt-44 pb-40 lg:pt-56">
        <div className="max-w-7xl mx-auto px-6">
          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-20">
             <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-6 underline decoration-rose-500/10 decoration-8 underline-offset-8">Checkout</h1>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                <Link href="/" className="hover:text-rose-500 transition-colors">HOME</Link>
                <ChevronRight size={10} />
                <Link href="/cart" className="hover:text-rose-500 transition-colors">MY BASKET</Link>
                <ChevronRight size={10} />
                <span className="text-rose-500">WHATSAPP ORDER</span>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-20">
            {/* ORDER FORM */}
            <div className="flex-1">
              <div className="bg-[#f8f8f8] p-10 md:p-16 rounded-[4rem] border border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 text-rose-500/5">
                   <Send size={150} className="-rotate-12" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-12 border-b border-white pb-6 flex items-center gap-4">
                     <User className="text-rose-500" size={28} /> Delivery Details
                  </h3>
                  
                  <form onSubmit={handlePlaceOrder} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Full Name</label>
                          <div className="relative">
                             <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                             <input 
                               type="text" 
                               required
                               placeholder="ENTER YOUR NAME"
                               className="w-full h-18 bg-white rounded-[1.5rem] pl-16 pr-8 text-xs font-black uppercase tracking-widest border-2 border-transparent focus:border-rose-500 transition-all outline-none shadow-sm placeholder:text-slate-200 py-6"
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Mobile Number</label>
                          <div className="relative">
                             <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                             <input 
                               type="tel" 
                               required
                               placeholder="+91-00000-00000"
                               className="w-full h-18 bg-white rounded-[1.5rem] pl-16 pr-8 text-xs font-black uppercase tracking-widest border-2 border-transparent focus:border-rose-500 transition-all outline-none shadow-sm placeholder:text-slate-200 py-6"
                               value={formData.mobile}
                               onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Delivery Address</label>
                       <div className="relative">
                          <MapPin className="absolute left-6 top-8 text-slate-300" size={18} />
                          <textarea 
                             required
                             rows={4}
                             placeholder="FLAT NO, STREET, AREA, CITY, PINCODE"
                             className="w-full bg-white rounded-[2rem] pl-16 pr-8 py-7 text-xs font-black uppercase tracking-widest border-2 border-transparent focus:border-rose-500 transition-all outline-none shadow-sm placeholder:text-slate-200 resize-none"
                             value={formData.address}
                             onChange={(e) => setFormData({...formData, address: e.target.value})}
                          ></textarea>
                       </div>
                    </div>

                    <div className="pt-8 flex items-center gap-4 bg-white/40 p-8 rounded-[2rem] border border-white">
                        <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
                           <CheckCircle2 size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                           All your details are securely processed. We will contact you via WhatsApp to confirm the order delivery slot.
                        </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* SUMMARY SECTION */}
            <div className="w-full lg:w-[450px]">
               <div className="bg-slate-900 text-white p-12 rounded-[4rem] sticky top-32 shadow-2xl relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 p-12 text-white/5 pointer-events-none">
                     <ShoppingBag size={200} />
                  </div>
                  
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-12 border-b border-white/10 pb-6 flex items-center gap-4 relative z-10">
                     <ShoppingBag className="text-rose-500" size={28} /> Order Summary
                  </h3>
                  
                  <div className="relative z-10 space-y-8 mb-12 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide">
                     {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center group">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-rose-400 transition-colors italic">{item.name}</span>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Quantity: {item.quantity || 1}</span>
                           </div>
                           <span className="font-black italic text-rose-500">₹{item.price}</span>
                        </div>
                     ))}
                  </div>
                  
                  <div className="relative z-10 space-y-6 pt-12 border-t border-white/10 mb-12">
                     <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Pantry Total</span>
                        <span className="font-black italic text-white text-lg tracking-tighter">₹{cartTotal}</span>
                     </div>
                     <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Shipping Fee</span>
                        <span className="text-[10px] font-black uppercase text-rose-500 italic">FREE DELIVERY</span>
                     </div>
                     <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px] font-black uppercase tracking-widest italic">GST (Estimated)</span>
                        <span className="font-black italic text-white tracking-tighter">₹{taxes.toFixed(0)}</span>
                     </div>
                  </div>

                  <div className="relative z-10 pt-12 border-t border-white/10 mb-12 flex justify-between items-center">
                     <span className="text-lg font-black uppercase tracking-widest text-slate-400 italic leading-none">Total Amount</span>
                     <span className="text-5xl font-black text-rose-500 tracking-tighter italic leading-none">₹{total.toFixed(0)}</span>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    className="relative z-10 w-full h-20 bg-rose-600 hover:bg-white hover:text-rose-600 text-white rounded-[2.5rem] font-black text-base uppercase tracking-[0.2em] transition-all shadow-2xl shadow-rose-900/40 active:scale-95 flex items-center justify-center gap-4 italic"
                  >
                     PLACE WHATSAPP ORDER <Send size={20} className="rotate-12" />
                  </button>

                  <p className="relative z-10 mt-8 text-center text-[8px] font-black uppercase tracking-widest text-slate-500 leading-relaxed italic">
                     By placing this order, you will be redirected to WhatsApp <br /> to confirm your details with our team.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer store={store} />
    </div>
  );
}
