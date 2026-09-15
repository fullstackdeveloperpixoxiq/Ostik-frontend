import { useEffect, useState } from "react";
import { Heart, ArrowRight, Star } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // WISHLIST STATE
  // =====================================
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  const navigate = useNavigate();

  // =====================================
  // FETCH LATEST PRODUCTS
  // =====================================
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product`
        );

        // Backend already sorts by createdAt DESC
        const latestProducts = response.data.products || [];

        // Only show latest 4
        setProducts(latestProducts.slice(0, 4));
      } catch (error) {
        console.log("Error fetching latest products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
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
              typeof product === "string" ? product : product?._id
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

        setWishlistProducts((prev) => [...prev, productId]);

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
  // GET VARIANT DATA
  // =====================================
  const getDisplayVariant = (product) => {
    const activeVariants = (product.variants || []).filter(
      (variant) => variant.isActive
    );

    if (!activeVariants.length) {
      return null;
    }

    // Find variant with lowest final price
    return activeVariants.reduce((lowest, current) => {
      const currentFinalPrice =
        current.price -
        (current.price * current.discountPercent) / 100;

      const lowestFinalPrice =
        lowest.price -
        (lowest.price * lowest.discountPercent) / 100;

      return currentFinalPrice < lowestFinalPrice
        ? current
        : lowest;
    });
  };

  // =====================================
  // FETCH VARIANTS FOR EACH PRODUCT
  // =====================================
  useEffect(() => {
    const fetchVariants = async () => {
      if (!products.length) return;

      try {
        const productsWithVariants = await Promise.all(
          products.map(async (product) => {
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/variant/product/${product._id}`
              );

              return {
                ...product,
                variants: response.data.variants || [],
              };
            } catch (error) {
              console.log(
                `Error fetching variants for ${product.name}`,
                error
              );

              return {
                ...product,
                variants: [],
              };
            }
          })
        );

        setProducts(productsWithVariants);
      } catch (error) {
        console.log(
          "Error fetching product variants:",
          error
        );
      }
    };

    fetchVariants();
  }, [products.length]);

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-3 h-4 w-32 animate-pulse rounded bg-gray-200" />

          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mx-auto mt-3 h-5 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl bg-gray-50"
            >
              <div className="aspect-square animate-pulse bg-gray-200" />

              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
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

  // =====================================
  // MAIN UI
  // =====================================
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#00e603]">
            Fresh arrivals
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Products
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Discover the newest additions to the OSTIK collection.
          </p>
        </div>

        {/* Desktop */}
        <a
          href="/products"
          className="hidden items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#00e603] sm:flex"
        >
          View All Products
          <ArrowRight size={18} />
        </a>
      </div>

      {/* ============================= */}
      {/* PRODUCT GRID */}
      {/* ============================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const variant = getDisplayVariant(product);

          const finalPrice = variant
            ? variant.price -
              (variant.price * variant.discountPercent) / 100
            : null;

          const image =
            variant?.images?.[0] ||
            product.images?.[0] ||
            "";

          const productInWishlist = isInWishlist(product._id);

          const wishlistIsLoading =
            wishlistLoadingId === product._id;

          return (
            <div
              key={product._id}
              className="group overflow-hidden rounded-3xl bg-gray-50"
            >
              {/* ============================= */}
              {/* IMAGE */}
              {/* ============================= */}

              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {image && (
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* NEW BADGE */}

                <span className="absolute left-4 top-4 rounded-full bg-[#00e603] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  New
                </span>

                {/* WISHLIST */}

                <button
                  type="button"
                  onClick={() => handleWishlist(product)}
                  disabled={wishlistIsLoading}
                  className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all ${
                    productInWishlist
                      ? "bg-[#00ff03] text-white"
                      : "bg-white text-gray-700 hover:bg-[#00ff03] hover:text-white"
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
                    size={17}
                    fill={
                      productInWishlist
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              {/* ============================= */}
              {/* PRODUCT INFO */}
              {/* ============================= */}

              <div className="p-5">
                {/* Rating */}

                <div className="mb-2 flex items-center gap-1 text-xs">
                  <Star
                    size={14}
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

                <h3 className="min-h-[48px] font-semibold leading-6 text-gray-900">
                  {product.name}
                </h3>

                {/* PRICE */}

                {variant ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-gray-900">
                      From ₹
                      {finalPrice.toLocaleString("en-IN")}
                    </span>

                    {variant.discountPercent > 0 && (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{variant.price.toLocaleString("en-IN")}
                        </span>

                        <span className="text-xs font-semibold text-[#76B900]">
                          {variant.discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-400">
                    Price unavailable
                  </p>
                )}

                {/* VIEW PRODUCT */}

                <a
                  href={`/product/${product._id}`}
                  className="mt-5 flex w-fit items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#00ff03]"
                >
                  View Product
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================= */}
      {/* MOBILE VIEW ALL */}
      {/* ============================= */}

      <div className="mt-8 flex justify-center sm:hidden">
        <a
          href="/products"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#76B900]"
        >
          View All Products
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default LatestProducts;