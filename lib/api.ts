import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "";

const getHeaders = () => ({
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
});

const isConfigured = () => {
    if (!BASE_URL || !API_KEY || !STORE_ID) {
        console.warn("⚠️ API Configuration is missing! Ensure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY), and NEXT_PUBLIC_STORE_ID are set in environment variables.");
        return false;
    }
    return true;
};

export const getStore = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/stores?select=*&id=eq.${STORE_ID}`,
            { headers: getHeaders() }
        );
        return res.data[0];
    } catch (error) {
        console.error("Error fetching store:", error);
        return null;
    }
};

export const getCategories = async () => {
    if (!isConfigured()) return [];
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/categories?select=*&store_id=eq.${STORE_ID}&order=sortorder.asc`,
            { headers: getHeaders() }
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getProducts = async () => {
    if (!isConfigured()) return [];
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/products?select=*,categories:category_id(name,seo_url)&store_id=eq.${STORE_ID}&order=created_at.desc`,
            { headers: getHeaders() }
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductBySlug = async (slug: string) => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/products?select=*,categories:category_id(name,seo_url)&seo_url=eq.${slug}&store_id=eq.${STORE_ID}`,
            { headers: getHeaders() }
        );
        return res.data[0];
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
};
