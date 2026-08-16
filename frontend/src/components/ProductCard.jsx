import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Rating from "./Rating";
import "swiper/css";
import "swiper/css/pagination";

const ProductCard = ({ product }) => {
  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/400x280?text=No+Image"];

  const productUrl = `${window.location.origin}/products/${product._id}`;
  const whatsappMessage = encodeURIComponent(
    `Hi, I want to buy *${product.name}*.\n\n*Price:* ₹${product.price}\n*Description:* ${product.description ? (product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description) : 'N/A'}\n*Image:* ${images[0]}\n*Product Link:* ${productUrl}\n\nPlease share more details.`
  );

  return (
    <article className={`group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 shadow-sm shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-slate-900/80 hover:shadow-cyan-500/10 ${product.outOfStock ? 'opacity-80' : ''}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {product.outOfStock && (
          <div className="absolute top-3 left-3 z-10 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
            Out of Stock
          </div>
        )}
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={images.length > 1}
          autoplay={
            images.length > 1
              ? { delay: 3000, disableOnInteraction: false }
              : false
          }
          pagination={{ clickable: true }}
          className="h-full w-full custom-swiper"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={`${product._id}-${idx}`}>
              <img
                src={image}
                alt={`${product.name} image ${idx + 1}`}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.outOfStock ? 'grayscale opacity-70' : ''}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-cyan-400" title={product.name}>
            {product.name}
          </h3>
          <span className="shrink-0 rounded-lg bg-cyan-500/10 px-2 py-1 text-sm font-bold text-cyan-400">
            ₹{product.price}
          </span>
        </div>
        
        {product.rating ? (
          <Rating rating={product.rating} reviewsCount={product.reviewsCount || 0} />
        ) : (
          <span className="text-xs text-slate-500">No reviews</span>
        )}
        
        <p className="mt-3 line-clamp-2 text-sm text-slate-400 flex-1">
          {product.description || "Premium quality product tailored to your needs. Discover the best in class features today."}
        </p>
        
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            Details
          </Link>
          {product.outOfStock ? (
            <div className="flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed">
              Sold Out
            </div>
          ) : (
            <a
              href={`https://wa.me/917565815031?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-400"
            >
              Buy Now
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

