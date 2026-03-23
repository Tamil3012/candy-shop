"use client";

import { useEffect, useState, use, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, Heart, Share2, Star, Minus, Plus, 
  ChevronRight, ChevronLeft, ChevronDown, Facebook, Twitter, Instagram, User
} from "lucide-react";
import { getProductBySlug, getProducts, getStore } from "@/lib/api";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { addToCart, isInCart, addToWishlist, isInWishlist } = useCart();
    const [store, setStore] = useState<any>(null);
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImg, setSelectedImg] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const autoSwipeRef = useRef<NodeJS.Timeout | null>(null);

    const assets = process.env.NEXT_PUBLIC_ASSETS_URL || "";
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeData, prodData, allProds] = await Promise.all([
                    getStore(),
                    getProductBySlug(slug),
                    getProducts()
                ]);
                setStore(storeData);
                setProduct(prodData);
                
                if (prodData) {
                    let related = allProds.filter((p: any) => p.category_id === prodData.category_id && p.id !== prodData.id);
                    if (related.length < 5) {
                        const others = allProds.filter((p: any) => p.id !== prodData.id && p.category_id !== prodData.category_id);
                        related = [...related, ...others].slice(0, 8);
                    } else {
                        related = related.slice(0, 8);
                    }
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Error loading product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const images = product ? [
        product.imageurl_1,
        product.imageurl_2,
        product.imageurl_3,
        product.imageurl_4,
        product.imageurl_5
    ].filter(img => img && img !== "") : [];

    // AUTO SWIPE LOGIC
    useEffect(() => {
        if (images.length > 1) {
            autoSwipeRef.current = setInterval(() => {
                setSelectedImg((prev) => (prev + 1) % images.length);
            }, 5000);
        }
        return () => {
            if (autoSwipeRef.current) clearInterval(autoSwipeRef.current);
        };
    }, [images.length]);

    const resetAutoSwipe = () => {
        if (autoSwipeRef.current) {
            clearInterval(autoSwipeRef.current);
            autoSwipeRef.current = setInterval(() => {
                setSelectedImg((prev) => (prev + 1) % images.length);
            }, 5000);
        }
    };

    const handleImgChange = (index: number) => {
        setSelectedImg(index);
        resetAutoSwipe();
    };

    const nextImg = () => {
        setSelectedImg((prev) => (prev + 1) % images.length);
        resetAutoSwipe();
    };

    const prevImg = () => {
        setSelectedImg((prev) => (prev - 1 + images.length) % images.length);
        resetAutoSwipe();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"
            />
        </div>
    );

    if (!product) return null;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 italic">
            <Navbar store={store} />

            <main className="max-w-7xl mx-auto px-6 pt-44 pb-40">
                {/* BREADCRUMBS */}
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-12">
                    <Link href="/" className="hover:text-rose-600 transition-colors">HOME</Link>
                    <ChevronRight size={10} />
                    <Link href="/shop" className="hover:text-rose-600 transition-colors">SHOP</Link>
                    <ChevronRight size={10} />
                    <span className="text-slate-900">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-32">
                    {/* GALLERY SECTION */}
                    <div className="lg:col-span-7 flex flex-col sm:flex-row gap-6">
                        {/* THUMBNAILS - DESKTOP (LEFT) / MOBILE (BOTTOM) */}
                        <div className="order-2 sm:order-1 flex sm:flex-col gap-4 w-full sm:w-24 overflow-x-auto sm:overflow-y-auto scrollbar-hide pb-2 sm:pb-0">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleImgChange(i)}
                                    className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all p-1 bg-slate-50 shrink-0 w-20 sm:w-full ${selectedImg === i ? "border-rose-600" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={`${assets}${img}`} alt={`Thumb ${i}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>

                        {/* MAIN IMAGE */}
                        <div className="order-1 sm:order-2 flex-1 relative aspect-square bg-[#f4f4f4] rounded-sm overflow-hidden group">
                             <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImg}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={(e, info) => {
                                        if (info.offset.x > 50) prevImg();
                                        else if (info.offset.x < -50) nextImg();
                                    }}
                                >
                                    <img
                                        src={`${assets}${images[selectedImg]}`}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-8 sm:p-12 drop-shadow-2xl cursor-pointer"
                                        onClick={nextImg}
                                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600?text=Product"; }}
                                    />
                                </motion.div>
                             </AnimatePresence>
                             <div className="absolute inset-0 bg-black/0 active:bg-black/5 transition-colors pointer-events-none" />
                        </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{product.categories?.name || "Premium Collection"}</span>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tighter italic">{product.name}</h1>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />)}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">5 customer reviews</span>
                        </div>

                        <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-10 italic tracking-tighter">₹{product.sp}</div>

                        <div className="space-y-8 mb-12">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 translate-x-1">Choice of flavor</label>
                                <div className="relative">
                                    <select className="w-full bg-white border border-slate-200 px-4 py-4 rounded-sm text-xs font-bold appearance-none outline-none focus:border-rose-600 transition-colors uppercase tracking-widest">
                                        <option>Original Artisan</option>
                                        <option>Extra Sweet</option>
                                        <option>Dark Infusion</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 translate-x-1">Custom Packaging</label>
                                <div className="relative">
                                    <select className="w-full bg-white border border-slate-200 px-4 py-4 rounded-sm text-xs font-bold appearance-none outline-none focus:border-rose-600 transition-colors uppercase tracking-widest">
                                        <option>Classic Artisan Box</option>
                                        <option>Eco-Friendly Wrap</option>
                                        <option>Luxury Gift Case (+₹99)</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-12 py-8 border-y border-slate-100 text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="flex flex-col gap-2">
                                <span className="text-slate-300">Availability:</span>
                                <span className={product.quantity > 0 ? "text-rose-600" : "text-red-400 animate-pulse"}>{product.quantity > 0 ? `${product.quantity} units in stock` : "Currently sold out"}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-slate-300">Product SKU:</span>
                                <span className="text-slate-900">{product.sku || "CS-881-ALPHA"}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-12">
                            <div className="bg-slate-50 border border-slate-100 rounded-sm flex items-center h-16 w-36 shadow-sm overflow-hidden">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 flex items-center justify-center hover:bg-white text-slate-400 transition-colors"><Minus size={16} /></button>
                                <span className="flex-1 text-center font-bold text-lg tracking-tighter italic">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="flex-1 flex items-center justify-center hover:bg-white text-slate-400 transition-colors"><Plus size={16} /></button>
                            </div>
                            <button 
                                onClick={() => addToCart({ id: product.id, name: product.name, price: product.sp, image: product.imageurl_1, seo_url: product.seo_url })}
                                className="flex-1 h-16 bg-slate-900 hover:bg-rose-600 text-white rounded-sm font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-rose-100 group active:scale-95 italic"
                            >
                                {isInCart(product.id) ? "VIEW BASKET" : "ADD TO BOX"}
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-50 pt-8">
                            <span className="opacity-60 italic">Share on:</span>
                            <div className="flex items-center gap-6">
                                <Facebook size={16} className="hover:text-rose-600 cursor-pointer transition-colors" />
                                <Twitter size={16} className="hover:text-rose-600 cursor-pointer transition-colors" />
                                <Instagram size={16} className="hover:text-rose-600 cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mb-40 border-t border-slate-100 pt-16">
                    <div className="flex gap-12 border-b border-slate-50 mb-16 overflow-x-auto scrollbar-hide">
                        {[
                          { id: "description", label: "Description" },
                          { id: "reviews", label: "Customer Reviews (5)" },
                          { id: "info", label: "Additional Info" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-6 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? "text-slate-900 italic" : "text-slate-300 hover:text-slate-500"}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeTab === "description" && (
                                <motion.div 
                                  key="desc"
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                  className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
                                >
                                    <div className="lg:col-span-8 space-y-8">
                                        <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">About this treat</h3>
                                        <div className="text-slate-400 text-base font-medium leading-[2.2] uppercase tracking-wider space-y-8 italic">
                                            <p>{product.descp || "Support our artisan workshop by trying our premium treats. Every purchase goes directly to the careful preparation and crafting of these sweet moments."}</p>
                                            <ul className="space-y-6 list-disc pl-5 marker:text-rose-500">
                                                <li>Exclusively handmade with seasonal ingredients</li>
                                                <li>Antique gold-level standard extracts for purity</li>
                                                <li>Semi-precious round smooth flavors with unique finish</li>
                                                <li>Artisan ingredients sourced globally for authenticity</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 space-y-12 bg-slate-50 p-10 rounded-sm">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-rose-200 pb-4 italic">Quick Specs</h3>
                                        <div className="space-y-8">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-300 italic">Dimensions</p>
                                                <p className="text-sm font-black text-slate-800 tracking-widest italic">3x3x3 IN</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-300 italic">Net Weight</p>
                                                <p className="text-sm font-black text-slate-800 tracking-widest italic">0.75 LBS (340G)</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-300 italic">Artisan Batch</p>
                                                <p className="text-sm font-black text-slate-800 tracking-widest uppercase italic">{product.sku || "CS-881-ALPHA"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "reviews" && (
                                <motion.div 
                                  key="reviews"
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                  className="space-y-12"
                                >
                                    {[1, 2, 3].map((r) => (
                                      <div key={r} className="flex gap-8 pb-12 border-b border-slate-50 last:border-0 italic">
                                          <div className="w-16 h-16 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center text-slate-300"><User size={24} /></div>
                                          <div className="space-y-3 flex-1">
                                              <div className="flex justify-between items-center">
                                                  <h4 className="font-black text-sm uppercase tracking-widest text-slate-800">Jessica Doe <span className="text-[10px] text-slate-300 ml-4">12 Oct, 2026</span></h4>
                                                  <div className="flex gap-0.5 text-amber-400">
                                                      {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                                                  </div>
                                              </div>
                                              <p className="text-slate-400 text-sm leading-relaxed uppercase tracking-wider font-medium">"Absolutely fantastic flavor! The packaging was artisanal and the delivery was prompt. Highly recommend these for any special occasion!"</p>
                                          </div>
                                      </div>
                                    ))}
                                    <button className="bg-slate-900 text-white px-10 py-5 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-100 italic transition-all active:scale-95">Write a Review</button>
                                </motion.div>
                            )}

                            {activeTab === "info" && (
                                <motion.div 
                                  key="info"
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                                >
                                    {[
                                      { l: "Portion Size", v: "Artisan Box (6 Pieces)" },
                                      { l: "Shelf Life", v: "15 Days from bake" },
                                      { l: "Allergen Info", v: "Contains Dairy & Nuts" },
                                      { l: "Storage", v: "Keep in cool dry place" },
                                      { l: "Origin", v: "Handcrafted in Sweet District" },
                                      { l: "Premium Extract", v: "Pure Vanilla Bean" }
                                    ].map((item, i) => (
                                      <div key={i} className="p-8 bg-slate-50 rounded-sm border border-slate-100 flex flex-col gap-2 italic">
                                         <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">{item.l}</p>
                                         <p className="text-sm font-black text-slate-800 tracking-tighter uppercase">{item.v}</p>
                                      </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RELATED PRODUCTS CAROUSEL */}
                <section>
                    <div className="flex items-center justify-between mb-16">
                        <div className="space-y-2">
                           <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] block italic">Handpicked for you</span>
                           <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic">You May Also Like</h2>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={prevImg} className="w-14 h-14 rounded-sm border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"><ChevronLeft size={24} /></button>
                            <button onClick={nextImg} className="w-14 h-14 rounded-sm border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"><ChevronRight size={24} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p, i) => (
                            <motion.div 
                              key={p.id} 
                              whileHover={{ y: -10 }}
                              className="group font-sans rounded-sm border border-transparent hover:border-slate-50 p-4 transition-all duration-500"
                            >
                                <Link href={`/product/${p.seo_url}`} className="block relative aspect-square bg-[#f8f8f8] rounded-sm overflow-hidden mb-8 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all">
                                    <img src={`${assets}${p.imageurl_1}`} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 drop-shadow-lg" alt={p.name} />
                                </Link>
                                <div className="space-y-4">
                                    <div className="flex gap-0.5 text-amber-400">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= 4 ? "currentColor" : "none"} />)}
                                    </div>
                                    <Link href={`/product/${p.seo_url}`} className="block text-base font-black uppercase tracking-tighter text-slate-800 hover:text-rose-600 transition-colors italic leading-tight">{p.name}</Link>
                                    <p className="text-rose-600 font-black tracking-tighter text-xl italic">₹{p.sp}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer store={store} />
        </div>
    );
}
