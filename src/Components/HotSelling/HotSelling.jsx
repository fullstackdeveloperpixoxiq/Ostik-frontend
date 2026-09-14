import { useEffect, useState } from "react";
import { Heart, ArrowRight, Star } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HotSelling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate= useNavigate();

  useEffect(() => {
    const fetchHotSelling = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/hot-selling"
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.log("Error fetching hot selling products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotSelling();
  }, []);

  // --------------------------------
  // Get variant to display
  // --------------------------------

  const getDisplayVariant = (product) => {
    const activeVariants = (product.variants || []).filter(
      (variant) => variant.isActive
    );

    if (!activeVariants.length) {
      return null;
    }

    return activeVariants.reduce((lowest, current) => {
      const currentFinalPrice =
        current.price -
        (current.price * current.discountPercent) / 100;

      const lowestFinalPrice =
        lowest.price -
        (lowest.price * lowest.discountPercent) / 100;

      return currentFinalPrice < lowestFinalPrice ? current : lowest;
    });
  };

  // --------------------------------
  // Get highest discount
  // --------------------------------

  const getMaxDiscount = (product) => {
    const activeVariants = (product.variants || []).filter(
      (variant) => variant.isActive
    );

    if (!activeVariants.length) {
      return 0;
    }

    return Math.max(
      ...activeVariants.map(
        (variant) => variant.discountPercent || 0
      )
    );
  };

  // --------------------------------
  // Calculate final price
  // --------------------------------

  const getFinalPrice = (variant) => {
    if (!variant) return 0;

    return (
      variant.price -
      (variant.price * variant.discountPercent) / 100
    );
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#76B900]">
            Trending now
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            🔥 Hot Selling
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            The products everyone's reaching for.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="h-[500px] animate-pulse rounded-3xl bg-gray-100" />

          <div className="grid grid-cols-1 gap-5">
            <div className="h-[240px] animate-pulse rounded-3xl bg-gray-100" />
            <div className="h-[240px] animate-pulse rounded-3xl bg-gray-100" />
          </div>
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

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">

      {/* Header */}
      <div className="mb-10 flex items-end justify-between gap-4">

        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#00e603]">
            Trending now
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            🔥 Hot Selling
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            The products everyone's reaching for.
          </p>
        </div>

        <a
          href="/products"
          className="hidden items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#76B900] sm:flex"
          onClick={()=>navigate("/products")}
        >
          Explore All Products
          <ArrowRight size={18} />
        </a>
      </div>

      {/* Products Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* =====================================
            LARGE FEATURED PRODUCT
        ===================================== */}

        {products[0] &&
          (() => {
            const product = products[0];
            const variant = getDisplayVariant(product);
            const finalPrice = getFinalPrice(variant);
            const maxDiscount = getMaxDiscount(product);

            const image =
              variant?.images?.[0] ||
              product.images?.[0] ||
              "";

            return (
              <div className="group relative overflow-hidden rounded-3xl bg-gray-50">

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">

                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Save Discount Badge */}
                  {maxDiscount > 0 && (
                    <span className="absolute left-5 top-5 rounded-full bg-[#00e603] px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm">
                      SAVE UP TO {maxDiscount}%
                    </span>
                  )}

                  {/* Wishlist */}
                  <button
                    type="button"
                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-all hover:bg-[#00e603] hover:text-white"
                  >
                    <Heart size={19} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">

                  {/* Rating */}
                  <div className="mb-2 flex items-center gap-1 text-sm">

                    <Star
                      size={15}
                      fill="currentColor"
                      className="text-yellow-400"
                    />

                    <span className="font-medium text-gray-700">
                      {product.ratingAverage?.toFixed(1) || "0.0"}
                    </span>

                    <span className="text-gray-400">
                      ({product.ratingCount || 0})
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h3>

                  {/* Price */}
                  {variant && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">

                      <span className="text-lg font-bold text-gray-900">
                        From ₹{finalPrice.toLocaleString("en-IN")}
                      </span>

                      {variant.discountPercent > 0 && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{variant.price.toLocaleString("en-IN")}
                          </span>

                          <span className="text-xs font-semibold text-[#00e603]">
                            {variant.discountPercent}% OFF
                          </span>
                        </>
                      )}

                    </div>
                  )}

                  {/* View Product */}
                  <a
                    href={`/products/${product._id}`}
                    className="mt-5 block w-full rounded-full bg-gray-900 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#00ff03]"
                  >
                    View Product
                  </a>

                </div>
              </div>
            );
          })()}

        {/* =====================================
            RIGHT SIDE PRODUCTS
        ===================================== */}

        <div className="grid grid-cols-1 gap-5">

          {products.slice(1, 3).map((product) => {
            const variant = getDisplayVariant(product);
            const finalPrice = getFinalPrice(variant);
            const maxDiscount = getMaxDiscount(product);

            const image =
              variant?.images?.[0] ||
              product.images?.[0] ||
              "";

            return (
              <div
                key={product._id}
                className="group relative flex overflow-hidden rounded-3xl bg-gray-50"
              >

                {/* Image */}
                <div className="relative w-2/5 overflow-hidden">

                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Save Discount Badge */}
                  {maxDiscount > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#00e603] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                      SAVE UP TO {maxDiscount}%
                    </span>
                  )}

                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col justify-center p-5">

                  {/* Rating */}
                  <div className="mb-2 flex items-center gap-1 text-xs">

                    <Star
                      size={13}
                      fill="currentColor"
                      className="text-yellow-400"
                    />

                    <span className="font-medium text-gray-700">
                      {product.ratingAverage?.toFixed(1) || "0.0"}
                    </span>

                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>

                  {/* Price */}
                  {variant && (
                    <div className="mt-2">

                      <span className="font-bold text-gray-900">
                        From ₹{finalPrice.toLocaleString("en-IN")}
                      </span>

                      {variant.discountPercent > 0 && (
                        <div className="mt-1 flex items-center gap-2">

                          <span className="text-xs text-gray-400 line-through">
                            ₹{variant.price.toLocaleString("en-IN")}
                          </span>

                          <span className="text-xs font-semibold text-[#00e603]">
                            {variant.discountPercent}% OFF
                          </span>

                        </div>
                      )}

                    </div>
                  )}

                  {/* View Product */}
                  <a
                    href={`/products/${product._id}`}
                    className="mt-4 flex w-fit items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#76B900]"
                  >
                    View Product
                    <ArrowRight size={16} />
                  </a>

                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  className="absolute right-4 top-4 hidden h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm group-hover:flex"
                >
                  <Heart size={17} />
                </button>

              </div>
            );
          })}

        </div>
      </div>

      {/* Mobile Explore Link */}
      <div className="mt-8 flex justify-center sm:hidden">

        <a
          href={`/products/${products._id}`}
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#76B900]"
        >
          Explore All Products
          <ArrowRight size={18} />
        </a>

      </div>

    </section>
  );
};

export default HotSelling;