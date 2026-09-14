import { useEffect, useState } from "react";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import axios from "axios";

const LimitedStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLimitedStock = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/limited-stock"
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.log(
          "Error fetching limited stock products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLimitedStock();
  }, []);

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">

        {/* Header skeleton */}
        <div className="mb-10">
          <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200" />

          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Product skeletons */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl bg-gray-50"
            >
              <div className="aspect-square animate-pulse bg-gray-200" />

              <div className="p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                <div className="mt-5 h-10 w-full animate-pulse rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

      </section>
    );
  }

  // --------------------------------
  // No products
  // --------------------------------

  if (!products.length) {
    return null;
  }

  // Homepage-il 4 products mathram
  const displayProducts = products.slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-10 flex items-end justify-between gap-4">

        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-red-500">
            Almost gone
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Limited Stock
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Grab them before they're gone.
          </p>
        </div>

        {/* View All */}
        <a
          href="/products/limited-stock"
          className="hidden items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-red-500 sm:flex"
        >
          View All
          <ArrowRight size={18} />
        </a>

      </div>

      {/* =====================================
          PRODUCTS
      ===================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {displayProducts.map((product) => {

          const image =
            product.variant?.images?.[0] ||
            product.images?.[0] ||
            "";

          const stock = product.limitedStock || product.variant?.stock || 0;

          const price = product.variant?.price || 0;

          const discountPercent =
            product.variant?.discountPercent || 0;

          const finalPrice =
            price -
            (price * discountPercent) / 100;

          return (
            <div
              key={product._id}
              className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* =====================================
                  IMAGE
              ===================================== */}

              <div className="relative aspect-square overflow-hidden bg-gray-50">

                {image && (
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Limited Stock Badge */}
                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                  ONLY {stock} LEFT
                </span>

                {/* Wishlist */}
                <button
                  type="button"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-all hover:bg-red-500 hover:text-white"
                >
                  <Heart size={17} />
                </button>

              </div>

              {/* =====================================
                  PRODUCT INFO
              ===================================== */}

              <div className="p-5">

                {/* Product Name */}
                <h3 className="line-clamp-2 min-h-[48px] font-semibold text-gray-900">
                  {product.name}
                </h3>

                {/* Variant */}
                {product.variant?.name && (
                  <p className="mt-1 text-xs text-gray-500">
                    {product.variant.name}
                  </p>
                )}

                {/* Price */}
                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span className="text-lg font-bold text-gray-900">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>

                  {discountPercent > 0 && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-xs font-semibold text-[#00e603]">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}

                </div>

                {/* Stock Warning */}
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-500">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Hurry! Limited availability
                </div>

                {/* View Product */}
                <a
                  href={`/products/${product._id}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                >
                  <ShoppingBag size={16} />
                  View Product
                </a>

              </div>

            </div>
          );
        })}

      </div>

      {/* =====================================
          MOBILE VIEW ALL
      ===================================== */}

      <div className="mt-8 flex justify-center sm:hidden">

        <a
          href="/products/limited-stock"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-red-500"
        >
          View All
          <ArrowRight size={18} />
        </a>

      </div>

    </section>
  );
};

export default LimitedStock;