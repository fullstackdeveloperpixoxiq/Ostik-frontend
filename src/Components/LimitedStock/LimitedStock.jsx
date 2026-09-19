import { useEffect, useState } from "react";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LimitedStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // WISHLIST STATE
  // =====================================
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  const navigate = useNavigate();

  // =====================================
  // FETCH LIMITED STOCK PRODUCTS
  // =====================================
  useEffect(() => {
    const fetchLimitedStock = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product/limited-stock`
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

  // =====================================
  // FETCH USER WISHLIST
  // =====================================
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const products = response.data.wishlist?.products || [];

        setWishlistProducts(
          products
            .map((product) =>
              typeof product === "string"
                ? product
                : product?._id
            )
            .filter(Boolean)
        );
      } catch (error) {
        console.log("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  // =====================================
  // CHECK PRODUCT IN WISHLIST
  // =====================================
  const isInWishlist = (productId) => {
    return wishlistProducts.includes(productId);
  };

  // =====================================
  // HANDLE WISHLIST
  // =====================================
  const handleWishlist = async (product) => {
    const token = localStorage.getItem("token");

    // User not logged in
    if (!token) {
      toast.error("Please login to add products to wishlist");
      navigate("/login");
      return;
    }

    const productId = product._id;

    setWishlistLoadingId(productId);

    try {
      // =====================================
      // REMOVE FROM WISHLIST
      // =====================================
      if (isInWishlist(productId)) {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlistProducts((prev) =>
          prev.filter((id) => id !== productId)
        );

        toast.success(
          response.data.message || "Removed from wishlist"
        );
      }

      // =====================================
      // ADD TO WISHLIST
      // =====================================
      else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wishlist`,
          {
            productId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWishlistProducts((prev) => [
          ...prev,
          productId,
        ]);

        toast.success(
          response.data.message || "Added to wishlist"
        );
      }
    } catch (error) {
      console.log("Wishlist error:", error);

      // =====================================
      // TOKEN EXPIRED / UNAUTHORIZED
      // =====================================
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setWishlistProducts([]);

        toast.error("Session expired. Please login again");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again"
        );
      }
    } finally {
      setWishlistLoadingId(null);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10">

        {/* Header skeleton */}
        <div className="mb-10">
          <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200" />

          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Product skeletons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
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

  // =====================================
  // NO PRODUCTS
  // =====================================

  if (!products.length) {
    return null;
  }

  // Homepage-il 4 products mathram
  const displayProducts = products.slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-8 flex items-end justify-between gap-3 sm:mb-10 sm:gap-4">

        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-red-500">
            Almost gone
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
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

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

        {displayProducts.map((product) => {

          const image =
            product.variant?.images?.[0] ||
            product.images?.[0] ||
            "";

          const stock =
            product.limitedStock ||
            product.variant?.stock ||
            0;

          const price =
            product.variant?.price || 0;

          const discountPercent =
            product.variant?.discountPercent || 0;

          const finalPrice =
            price -
            (price * discountPercent) / 100;

          const productInWishlist =
            isInWishlist(product._id);

          const wishlistIsLoading =
            wishlistLoadingId === product._id;

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

                <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
                  ONLY {stock} LEFT
                </span>

                {/* Wishlist */}

                <button
                  type="button"
                  onClick={() => handleWishlist(product)}
                  disabled={wishlistIsLoading}
                  className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all sm:right-4 sm:top-4 sm:h-9 sm:w-9 ${
                    productInWishlist
                      ? "bg-[#00ff03] text-white"
                      : "bg-white text-gray-700 hover:bg-red-500 hover:text-white"
                  } ${
                    wishlistIsLoading
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                  aria-label={
                    productInWishlist
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Heart
                    size={15}
                    fill={
                      productInWishlist
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

              </div>

              {/* =====================================
                  PRODUCT INFO
              ===================================== */}

              <div className="p-3 sm:p-5">

                {/* Product Name */}

                <h3 className="line-clamp-2 min-h-[42px] text-sm font-semibold leading-5 text-gray-900 sm:min-h-[48px] sm:text-base sm:leading-6">
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

                  <span className="text-sm font-bold text-gray-900 sm:text-lg">
                    ₹{Math.round(finalPrice).toLocaleString("en-IN")}
                  </span>

                  {discountPercent > 0 && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{Math.round(price).toLocaleString("en-IN")}
                      </span>

                      <span className="text-xs font-semibold text-[#00e603]">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}

                </div>

                {/* Stock Warning */}

                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-red-500 sm:mt-4 sm:gap-2 sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Hurry! Limited availability
                </div>

                {/* View Product */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-gray-900 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-500 sm:mt-5 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <ShoppingBag size={16} />
                  View Product
                </button>

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
