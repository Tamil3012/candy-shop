"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Truck, Heart, CreditCard, RotateCcw, 
  ShoppingCart, Star, Clock, ShieldCheck, Mail, Send 
} from "lucide-react";
import { getStore, getCategories, getProducts, getImageUrl } from "@/lib/api";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Category = {
    id: string;
    name: string;
    imageurl: string;
};

type Product = {
    id: string;
    name: string;
    imageurl_1: string;
    status: string;
    sp: number;
    mrp: number;
    seo_url: string;
    categories?: {
        name: string;
    };
};

export default function Home() {
    const { addToCart, addToWishlist, isInWishlist } = useCart();
    const [store, setStore] = useState<any>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("feature");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeData, catData, prodData] = await Promise.all([
                    getStore(),
                    getCategories(),
                    getProducts()
                ]);
                setStore(storeData);
                setCategories(catData || []);
                setProducts(prodData || []);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const activeProducts = products.filter(p => p.status === "1");

    if (loading) return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"
          />
      </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-slate-900 selection:bg-rose-100 selection:text-rose-900">
            <Navbar store={store} />

            {/* HERO SECTION */}
            <header className="relative pt-44 lg:pt-56 pb-24 lg:pb-32 bg-[#f4f4f4] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      className="flex-1 text-center lg:text-left z-10"
                    >
                        <span className="text-rose-500 text-sm font-black uppercase tracking-[0.3em] block mb-6 italic">Celebration With <span className="underline decoration-rose-200">Cake Store</span></span>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-10 uppercase italic">
                          Find Best <br /> <span className="text-rose-600">Pastries</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-lg mb-12 mx-auto lg:mx-0 font-medium leading-relaxed italic">
                          Indulge in our collection of handcrafted cakes and artisan sweets, baked fresh every morning with the finest ingredients.
                        </p>
                        <Link href="/shop" className="bg-[#c2185b] hover:bg-slate-900 text-white px-12 py-5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-rose-100 inline-block active:scale-95">
                            VIEW MORE
                        </Link>
                    </motion.div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative z-10 w-full flex items-center justify-center"
                        >
                            <img
                                src={getImageUrl(activeProducts[0]?.imageurl_1)}
                                alt="Main Cake"
                                className="w-full max-w-lg drop-shadow-[0_45px_65px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-100/40 rounded-full blur-[100px] -z-0" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-24 space-y-32 lg:space-y-48">
                
                {/* CATEGORIES CIRCLE GRID */}
                <section className="flex justify-center flex-wrap gap-8 lg:gap-16">
                    {categories.slice(0, 6).map((cat, i) => (
                      <Link key={cat.id} href={`/shop?category=${cat.id}`} className="flex flex-col items-center group">
                         <motion.div 
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.1 }}
                           viewport={{ once: true }}
                           className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-50 border border-slate-100 rounded-full overflow-hidden flex items-center justify-center p-4 group-hover:shadow-2xl group-hover:shadow-rose-100 group-hover:-translate-y-2 transition-all duration-500 mb-6 group-hover:bg-white"
                         >
                            <img 
                              src={getImageUrl(cat.imageurl)} 
                              alt={cat.name} 
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                            />
                         </motion.div>
                         <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-rose-600 transition-colors">{cat.name}</h3>
                      </Link>
                    ))}
                </section>

                {/* TRENDING PRODUCTS WITH TABS */}
                <section>
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-800 italic flex items-center justify-center gap-6">
                           <div className="h-px w-20 bg-slate-100" />
                           Trending Products
                           <div className="h-px w-20 bg-slate-100" />
                        </h2>
                        <div className="flex justify-center gap-4">
                           {["FEATURE", "BESTSELLER", "SPECIAL"].map((tab) => (
                             <button
                               key={tab}
                               onClick={() => setActiveTab(tab.toLowerCase())}
                               className={`px-8 py-3 rounded-sm text-[10px] font-black tracking-widest transition-all ${activeTab === tab.toLowerCase() ? "bg-[#c2185b] text-white shadow-xl shadow-rose-100" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"}`}
                             >
                               {tab}
                             </button>
                           ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {activeProducts.slice(0, 4).map((prod, i) => (
                           <motion.div 
                             key={prod.id}
                             initial={{ opacity: 0, y: 20 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="group bg-white border border-slate-50 p-6 rounded-sm hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500"
                           >
                              <Link href={`/product/${prod.seo_url}`} className="block relative aspect-square bg-slate-50/50 rounded-sm mb-6 overflow-hidden">
                                 <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-[8px] font-black px-3 py-1.5 rounded-sm tracking-widest uppercase italic">NEW</div>
                                  <img src={getImageUrl(prod.imageurl_1)} alt={prod.name} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 drop-shadow-lg" />
                              </Link>
                              <div className="text-center space-y-3">
                                 <div className="flex gap-0.5 justify-center text-amber-400">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= 4 ? "currentColor" : "none"} />)}
                                 </div>
                                 <Link href={`/product/${prod.seo_url}`} className="block text-sm font-black uppercase tracking-tighter text-slate-800 hover:text-rose-600 transition-colors italic">{prod.name}</Link>
                                 <p className="text-rose-600 font-black text-lg">₹{prod.sp}</p>
                              </div>
                           </motion.div>
                        ))}
                    </div>
                </section>

                {/* SERVICE BANNERS */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Truck, t: "Free Shipping", d: "On all orders above ₹999. Fast & reliable delivery." },
                        { icon: Clock, t: "24/7 Online Support", d: "We are here to help you anytime with your orders." },
                        { icon: ShieldCheck, t: "Money Guarantee", d: "Safe payments and 30-day money back guarantee." },
                    ].map((s, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, scale: 0.95 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         className="relative h-64 bg-slate-900 group overflow-hidden flex flex-col items-center justify-center text-center p-8 text-white rounded-sm"
                       >
                          <div className="absolute inset-0 bg-rose-600/0 group-hover:bg-rose-600/10 transition-colors duration-500" />
                          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 border-dashed group-hover:border-rose-400 group-hover:text-rose-400 transition-all">
                             <s.icon size={28} />
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-widest mb-3 italic">{s.t}</h4>
                          <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">{s.d}</p>
                       </motion.div>
                    ))}
                </section>

                {/* TESTIMONIAL SECTION */}
                <section className="py-20 bg-slate-50/50 rounded-sm text-center">
                    <div className="max-w-3xl mx-auto px-6 space-y-10 font-sans italic">
                        <div className="flex justify-center mb-8">
                           <div className="h-px w-20 bg-slate-200" />
                           <h2 className="text-2xl font-black uppercase tracking-widest mx-6 text-slate-800">Testimonial</h2>
                           <div className="h-px w-20 bg-slate-200" />
                        </div>
                        <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed uppercase tracking-wide italic">
                           "Simply the best artisan sweets I've ever had. Every bite is a burst of flavor and nostalgia. Handcrafted perfection for every single occasion!"
                        </p>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-slate-200 mb-6 overflow-hidden border-4 border-white shadow-xl">
                               <img src="https://placehold.co/100x100?text=JD" alt="User" />
                            </div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 italic">Jessica Doe</h4>
                           <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1 italic">Designer @ Artisan Home</p>
                        </div>
                    </div>
                </section>

                {/* LATEST NEWS / BLOG */}
                <section>
                    <div className="text-center mb-16 underline decoration-slate-100 underline-offset-8">
                       <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-800 italic flex items-center justify-center gap-6">
                           <div className="h-px w-20 bg-slate-100" />
                           NEWS
                           <div className="h-px w-20 bg-slate-100" />
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[1, 2, 3].map((i) => (
                           <motion.div 
                             key={i} 
                             whileHover={{ y: -10 }} 
                             className="group bg-white border border-slate-100 p-2 rounded-sm"
                           >
                              <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden mb-8">
                                  <img src={`https://placehold.co/400x250?text=Cake+Blog+${i}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="News" />
                                 <div className="absolute inset-0 bg-rose-600/0 group-hover:bg-rose-600/10 transition-colors" />
                              </div>
                              <div className="px-4 py-4 text-center space-y-4">
                                 <h4 className="text-sm font-black uppercase tracking-[0.1em] text-slate-800 italic group-hover:text-rose-600 transition-colors">This is Latest post for wibblog</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 12 Sept, 2026 by Websearch Infotech</p>
                              </div>
                           </motion.div>
                        ))}
                    </div>
                </section>

                {/* PARTNER LOGOS */}
                <section className="py-20 border-y border-slate-50 flex flex-wrap justify-between items-center gap-12 lg:gap-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="text-lg font-black tracking-widest text-slate-400 italic">BRAND LOGO {i}</div>
                    ))}
                </section>

            </main>

            <Footer store={store} />
        </div>
    );
}
