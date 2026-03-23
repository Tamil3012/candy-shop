"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, Heart, Search, Filter, X, 
  SlidersHorizontal, ChevronDown, ChevronUp, Check, ChevronRight 
} from "lucide-react";
import { getStore, getCategories, getProducts } from "@/lib/api";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  imageurl_2?: string;
  status: string;
  sp: number;
  mrp: number;
  seo_url: string;
  category_id: string;
  quantity: number;
  categories?: {
    name: string;
  };
};

export default function ShopPage() {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const router = useRouter();

  const [store, setStore] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [availability, setAvailability] = useState<string>("all");
  const [sortBy, setSortBy] = useState("popularity");
  
  // Mobile Modals
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Collapsible sections
  const [openSections, setOpenSections] = useState({ availability: true, categories: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeData, catData, prodData] = await Promise.all([
          getStore(),
          getCategories(),
          getProducts(),
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

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => p.status === "1");

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => String(p.category_id) === String(selectedCategory));
    }

    if (availability === "in-stock") {
      filtered = filtered.filter((p) => p.quantity > 0);
    } else if (availability === "out-of-stock") {
      filtered = filtered.filter((p) => p.quantity <= 0);
    }

    const sorted = [...filtered];
    if (sortBy === "price-low") sorted.sort((a, b) => a.sp - b.sp);
    else if (sortBy === "price-high") sorted.sort((a, b) => b.sp - a.sp);
    else if (sortBy === "newest") sorted.sort((a, b) => Number(b.id) - Number(a.id));
    
    return sorted;
  }, [products, selectedCategory, availability, sortBy]);

  const clearAll = () => {
    setSelectedCategory("all");
    setAvailability("all");
    setSortBy("popularity");
  };

  const assets = process.env.NEXT_PUBLIC_ASSETS_URL || "";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-rose-100 italic">
      <Navbar store={store} />

      {/* MOBILE STICKY HEADER */}
      <div className="lg:hidden sticky top-20 z-40 bg-white border-b border-slate-100 flex divide-x divide-slate-50 shadow-sm mt-32">
        <button onClick={() => setIsSortOpen(true)} className="flex-1 py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
           <SlidersHorizontal size={14} className="rotate-90" /> Sort
        </button>
        <button onClick={() => setIsFilterOpen(true)} className="flex-1 py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
           <Filter size={14} /> Filter
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-44 lg:pt-56 pb-40">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-12">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
               <h2 className="text-xl font-black italic">Filter</h2>
               <button onClick={clearAll} className="text-[10px] font-black uppercase tracking-widest text-rose-600 underline hover:no-underline">Clear All</button>
            </div>

            {/* Availability */}
            <div className="space-y-6">
              <button onClick={() => setOpenSections(s => ({...s, availability: !s.availability}))} className="w-full flex items-center justify-between group">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-rose-600 transition-colors">Availability</h3>
                 {openSections.availability ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {openSections.availability && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-4 overflow-hidden">
                    {[
                      { l: "In Stock", v: "in-stock" },
                      { l: "Out of Stock", v: "out-of-stock" }
                    ].map((opt) => (
                      <label key={opt.v} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={availability === opt.v} onChange={() => setAvailability(opt.v)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${availability === opt.v ? "border-rose-600 bg-rose-600" : "border-slate-200 group-hover:border-rose-300"}`}>
                           {availability === opt.v && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-800">{opt.l}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Categories */}
            <div className="space-y-6 border-t border-slate-100 pt-10">
              <button onClick={() => setOpenSections(s => ({...s, categories: !s.categories}))} className="w-full flex items-center justify-between group">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-rose-600 transition-colors">Categories</h3>
                 {openSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {openSections.categories && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-4 overflow-hidden">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={selectedCategory === "all"} onChange={() => setSelectedCategory("all")} className="hidden" />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedCategory === "all" ? "border-[#7c9d32] bg-[#7c9d32]" : "border-slate-200 group-hover:border-[#7c9d32]"}`}>
                         {selectedCategory === "all" && <Check className="text-white" size={14} />}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-800 italic">All Items</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={selectedCategory === cat.id} onChange={() => setSelectedCategory(cat.id)} className="hidden" />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedCategory === cat.id ? "border-[#7c9d32] bg-[#7c9d32]" : "border-slate-200 group-hover:border-[#7c9d32]"}`}>
                           {selectedCategory === cat.id && <Check className="text-white" size={14} />}
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-800 italic">{cat.name}</span>
                      </label>
                    ))}
                    <button className="text-[10px] font-black uppercase tracking-widest text-[#7c9d32] mt-4 flex items-center gap-2 hover:translate-x-1 transition-transform">Show More (+{categories.length}) <ChevronRight size={12} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* PRODUCT GRID SECTION */}
          <div className="flex-1">
             <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
               {filteredProducts.map((prod) => (
                 <ProductCard key={prod.id} product={prod} assets={assets} addToCart={addToCart} addToWishlist={addToWishlist} isInWishlist={isInWishlist} />
               ))}
             </div>
             {filteredProducts.length === 0 && (
               <div className="py-40 text-center">
                  <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-100 shadow-sm"><Filter size={32} /></div>
                  <h3 className="text-2xl font-black italic uppercase mb-2">No Treats Found</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjust your filters to see more delicious options</p>
               </div>
             )}
          </div>
        </div>
      </main>

      <Footer store={store} />

      {/* MOBILE SORT DRAWER */}
      <AnimatePresence>
        {isSortOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSortOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-white z-[110] rounded-t-3xl p-8 flex flex-col gap-8 shadow-2xl">
               <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                  <h3 className="text-xl font-black italic">Sort by</h3>
                  <button onClick={() => setIsSortOpen(false)}><X size={24} /></button>
               </div>
               <div className="flex flex-col gap-8">
                  {[
                    { l: "Popularity", v: "popularity" },
                    { l: "New Arrival", v: "newest" },
                    { l: "Price: High to Low", v: "price-high" },
                    { l: "Price: Low to High", v: "price-low" }
                  ].map((s) => (
                    <label key={s.v} className="flex items-center justify-between cursor-pointer group">
                       <span className={`text-sm font-black uppercase tracking-widest ${sortBy === s.v ? "text-slate-900" : "text-slate-400"}`}>{s.l}</span>
                       <input type="radio" checked={sortBy === s.v} onChange={() => { setSortBy(s.v); setIsSortOpen(false); }} className="hidden" />
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${sortBy === s.v ? "border-[#7c9d32]" : "border-slate-200"}`}>
                          {sortBy === s.v && <div className="w-3 h-3 bg-[#7c9d32] rounded-full" />}
                       </div>
                    </label>
                  ))}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-white z-[110] rounded-t-3xl h-[80vh] overflow-y-auto p-8 flex flex-col gap-8">
               <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                  <h3 className="text-xl font-black italic">Filter</h3>
                  <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
               </div>
               
               <div className="space-y-12">
                  {/* Reuse sidebar components here logic */}
                  <div className="space-y-6">
                    <button className="w-full flex items-center justify-between"><h3 className="text-[11px] font-black uppercase tracking-widest">Availability</h3> <ChevronDown size={14} /></button>
                    {/* ... (Mobile Availability UI) */}
                  </div>
                  <div className="space-y-6">
                    <button className="w-full flex items-center justify-between"><h3 className="text-[11px] font-black uppercase tracking-widest">Categories</h3> <ChevronUp size={14} /></button>
                    <div className="flex flex-col gap-4">
                       {categories.map((cat) => (
                         <label key={cat.id} className="flex items-center gap-4">
                            <input type="checkbox" className="w-5 h-5 accent-[#7c9d32]" checked={selectedCategory === cat.id} onChange={() => setSelectedCategory(cat.id)} />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{cat.name} ({Math.floor(Math.random() * 20)})</span>
                         </label>
                       ))}
                    </div>
                  </div>
               </div>
               
               <button onClick={() => setIsFilterOpen(false)} className="mt-auto bg-slate-900 text-white py-5 rounded-sm font-black text-xs uppercase tracking-widest">Apply Filters</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, assets, addToCart, addToWishlist, isInWishlist }: any) {
  const inWishlist = isInWishlist(product.id);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      viewport={{ once: true }}
      className="group relative"
    >
       <div className="relative aspect-square bg-slate-50 rounded-sm overflow-hidden mb-6 border border-slate-50">
          <div className="absolute top-0 left-0 z-10 bg-[#fbb03b] text-white text-[8px] font-black px-4 py-2 rounded-br-lg uppercase tracking-widest italic shadow-sm">
             Earth-Friendly Choices
          </div>
          
          <Link href={`/product/${product.seo_url}`} className="block w-full h-full p-6">
             <img src={`${assets}${product.imageurl_1}`} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
          </Link>

          <button 
            onClick={() => addToWishlist({ id: product.id, name: product.name, price: product.sp, image: product.imageurl_1, seo_url: product.seo_url })}
            className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group/heart hover:scale-110 transition-all"
          >
             <Heart size={20} className={`transition-colors ${inWishlist ? "text-rose-500 fill-rose-500" : "text-slate-300 group-hover/heart:text-rose-500"}`} />
          </button>
          
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/80 backdrop-blur-md">
             <button 
               onClick={() => addToCart({ id: product.id, name: product.name, price: product.sp, image: product.imageurl_1, seo_url: product.seo_url })}
               className="w-full bg-[#7c9d32] text-white py-3 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-lg"
             >
                Add To Box
             </button>
          </div>
       </div>

       <div className="space-y-4">
          <div className="space-y-1">
             <Link href={`/product/${product.seo_url}`} className="block text-sm lg:text-base font-black uppercase tracking-tighter text-slate-950 hover:text-[#7c9d32] transition-colors leading-tight italic truncate">
                {product.name}
             </Link>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 italic">
                {product.categories?.name || "Premium Collection"}
             </p>
          </div>
          <p className="text-slate-900 font-black text-xl italic tracking-tighter">₹{product.sp}</p>
       </div>
    </motion.div>
  );
}
