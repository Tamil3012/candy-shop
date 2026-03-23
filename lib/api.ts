import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
};

export const getStore = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/stores?select=*&id=eq.${STORE_ID}`,
            { headers }
        );
        return res.data[0];
    } catch (error) {
        console.error("Error fetching store:", error);
        return null;
    }
};

export const getCategories = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/categories?select=*&store_id=eq.${STORE_ID}&order=sortorder.asc`,
            { headers }
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getProducts = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/products?select=*,categories:category_id(name,seo_url)&store_id=eq.${STORE_ID}&order=created_at.desc`,
            { headers }
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductBySlug = async (slug: string) => {
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/products?select=*,categories:category_id(name,seo_url)&seo_url=eq.${slug}&store_id=eq.${STORE_ID}`,
            { headers }
        );
        return res.data[0];
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }
};
