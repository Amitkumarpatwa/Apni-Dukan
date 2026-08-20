import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import { productApi } from "../api/productApi";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await productApi.getProducts({ limit: 24 });
        setProducts(response.data.data.items);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center sm:p-16">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]"></div>
        
        <div className="relative mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Mangalsutra <span className="text-cyan-400">Collection</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 sm:text-xl">
            Discover our premium selection of products, designed to elevate your everyday experience.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white">Latest Arrivals</h2>
          <span className="text-sm font-medium text-slate-400">{products.length} Products</span>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={`skeleton-${idx}`} />)
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
          
          {!loading && products.length === 0 && !error && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/40 py-24 sm:py-32">
              <div className="mb-6 rounded-full bg-cyan-500/10 p-6 text-cyan-400 shadow-inner shadow-cyan-500/20">
                <svg className="h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">No Products Yet</h3>
              <p className="mt-2 text-center max-w-md text-sm text-slate-400 sm:text-base">
                We're currently restocking our shelves with amazing new items. Please check back soon for our latest collection!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;

