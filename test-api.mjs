import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "";

const getHeaders = () => ({
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
});

const testFetch = async () => {
    try {
        const res = await axios.get(
            `${BASE_URL}/rest/v1/products?select=*,categories:category_id(name,seo_url)&store_id=eq.${STORE_ID}&order=created_at.desc`,
            { headers: getHeaders() }
        );
        console.log("Products count:", res.data.length);
        if (res.data.length > 0) {
            console.log("First product imageurl_1:", res.data[0].imageurl_1);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};

testFetch();
