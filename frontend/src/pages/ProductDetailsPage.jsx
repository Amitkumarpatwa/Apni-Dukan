import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/zoom";
import { productApi } from "../api/productApi";
import Rating from "../components/Rating";
import ReviewSection from "../components/ReviewSection";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductById(id);
        setProduct(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/600x400?text=No+Image"];

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
      <div className="grid gap-10 rounded-3xl border border-white/5 bg-slate-900/40 p-6 md:grid-cols-2 lg:gap-16 lg:p-10">
        
        {/* Image Gallery */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-950">
          {product.outOfStock && (
            <div className="absolute top-4 left-4 z-10 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
              Out of Stock
            </div>
          )}
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            loop={images.length > 1}
            autoplay={
              images.length > 1
                ? { delay: 3500, disableOnInteraction: false }
                : false
            }
            pagination={{ clickable: true }}
            className="h-full w-full custom-swiper"
          >
            {images.map((image, idx) => (
              <SwiperSlide key={`${image}-${idx}`}>
                <img
                  src={image}
                  alt={`${product.name} - ${idx + 1}`}
                  onClick={() => {
                    setInitialSlide(idx);
                    setLightboxOpen(true);
                  }}
                  className={`h-full w-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-105 ${product.outOfStock ? 'grayscale opacity-70' : ''}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            {product.category || "Premium Quality"}
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {product.name}
          </h1>
          
          <div className="mt-4 flex items-center gap-4">
            {product.rating ? (
              <Rating rating={product.rating} reviewsCount={product.reviewsCount || 0} />
            ) : (
              <span className="text-sm text-slate-500">No reviews</span>
            )}
          </div>
          
          <div className="mt-6 flex items-end gap-3">
            <p className="text-4xl font-bold tracking-tight text-cyan-400">₹{product.price}</p>
          </div>

          <div className="mt-8 space-y-4 text-slate-300">
            <p className="leading-relaxed">
              {product.description || "Detailed description is not available for this product. However, you can expect the finest quality and exceptional performance from our curated collection."}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {product.outOfStock ? (
              <div className="flex flex-1 items-center justify-center rounded-xl bg-slate-800 px-6 py-4 font-bold text-slate-400 cursor-not-allowed border border-white/5">
                Currently Unavailable
              </div>
            ) : (
              <a
                href={`https://wa.me/917565815031?text=${encodeURIComponent(
                  `Hi, I'm interested in buying *${product.name}*.\n\n*Price:* ₹${product.price}\n*Description:* ${product.description ? (product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description) : 'N/A'}\n*Image:* ${images[0]}\n*Product Link:* ${window.location.href}\n\nPlease share more details.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/40"
              >
                <span>Buy via WhatsApp</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            )}
          </div>
          
          {/* Features list (Mock) */}
          <div className="mt-10 border-t border-white/10 pt-6">
            <ul className="grid grid-cols-2 gap-4 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Premium Quality
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Fast Support
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection productId={id} onReviewAdded={(updatedProduct) => setProduct(updatedProduct)} />

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-[110] rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="h-full w-full max-w-7xl p-4 sm:p-8">
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              navigation
              pagination={{ clickable: true }}
              zoom={true}
              initialSlide={initialSlide}
              className="h-full w-full"
            >
              {images.map((image, idx) => (
                <SwiperSlide key={`lightbox-${idx}`}>
                  <div className="swiper-zoom-container h-full w-full flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${product.name} - Fullscreen ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
