"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Youtube, Instagram, Truck, CreditCard, Headphones } from "lucide-react";
import { getStore } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ContactPage() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStore().then(data => {
      setStore(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar store={store} />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* BREADCRUMB & TITLE */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 italic text-sky-500">Contact Us</h1>
            <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-sky-500">Contact Us</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* CONTACT FORM */}
            <div className="flex-1">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(30,41,59,0.05)] border border-slate-100">
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Get in Touch</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Your email address will not be published. Required fields are marked *</p>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold ml-4">Your Name *</label>
                      <input 
                        type="text" 
                        placeholder="Ex. John Doe"
                        className="w-full h-16 bg-slate-50 rounded-2xl px-8 text-sm font-bold border-2 border-transparent focus:border-sky-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold ml-4">Email *</label>
                      <input 
                        type="email" 
                        placeholder="example@gmail.com"
                        className="w-full h-16 bg-slate-50 rounded-2xl px-8 text-sm font-bold border-2 border-transparent focus:border-sky-500 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold ml-4">Subject *</label>
                    <input 
                      type="text" 
                      placeholder="Enter Subject"
                      className="w-full h-16 bg-slate-50 rounded-2xl px-8 text-sm font-bold border-2 border-transparent focus:border-sky-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold ml-4">Your Message *</label>
                    <textarea 
                      rows={6} 
                      placeholder="Enter here..."
                      className="w-full bg-slate-50 rounded-3xl px-8 py-6 text-sm font-bold border-2 border-transparent focus:border-sky-500 focus:bg-white transition-all outline-none resize-none"
                    ></textarea>
                  </div>

                  <button className="h-16 px-12 bg-amber-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-500 transition-all flex items-center gap-4 hover:scale-105 active:scale-95 shadow-xl shadow-amber-900/10">
                    Send Message <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="w-full lg:w-96 space-y-8">
              <div className="bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 space-y-12">
                <div className="space-y-4">
                  <h4 className="text-lg font-black uppercase tracking-tighter italic text-slate-800">Address</h4>
                  <p className="text-sm font-bold text-slate-400 uppercase leading-relaxed">4517 Washington Ave. Manchester, Kentucky 39495</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-black uppercase tracking-tighter italic text-slate-800">Contact</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-400 uppercase">Phone : +0123-456-789</p>
                    <p className="text-sm font-bold text-slate-400 uppercase">Email : example@gmail.com</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-black uppercase tracking-tighter italic text-slate-800">Open Time</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-400 uppercase">Monday - Friday : 10:00 - 20:00</p>
                    <p className="text-sm font-bold text-slate-400 uppercase">Saturday - Sunday : 11:00 - 18:00</p>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-200">
                  <h4 className="text-lg font-black uppercase tracking-tighter italic text-slate-800">Stay Connected</h4>
                  <div className="flex gap-4">
                    {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                      <div key={i} className="w-12 h-12 bg-amber-200 text-amber-900 rounded-2xl flex items-center justify-center hover:bg-amber-900 hover:text-white transition-all cursor-pointer">
                        <Icon size={20} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="mt-20 rounded-[4rem] overflow-hidden grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 h-[500px] border-8 border-slate-50">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15552.476483669675!2d77.6200234!3d12.9641772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670cdc10303%3A0xf1d83d7f33f01fba!2sHSR%20Layout%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1711184620000!5m2!1sen!2sin" 
              className="w-full h-full border-0" 
              loading="lazy"
            ></iframe>
          </div>

          {/* FEATURES SECTION */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32">
            {[
              { icon: Truck, title: "Free Shipping", subtitle: "Free shipping for order above ₹1500" },
              { icon: CreditCard, title: "Flexible Payment", subtitle: "Multiple secure payment options" },
              { icon: Headphones, title: "24x7 Support", subtitle: "We support online all days" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-amber-100/50 rounded-2xl flex items-center justify-center text-amber-900 shrink-0 transition-colors group-hover:bg-amber-900 group-hover:text-white">
                  <f.icon size={30} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest">{f.title}</h4>
                  <p className="text-xs text-slate-400 font-bold">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      <Footer store={store} />
    </div>
  );
}
