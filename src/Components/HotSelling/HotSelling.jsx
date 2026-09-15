import { useEffect, useState } from "react";
import { Heart, ArrowRight, Star } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HotSelling = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // WISHLIST STATES
  // =========================================================

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  const navigate = useNavigate();

  // =========================================================
  // FETCH HOT SELLING PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchHotSelling = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product/hot-selling`
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.log(
          "Error fetching hot selling products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotSelling();
  }, []);

  // =========================================================
  // FETCH WISHLIST
  // =========================================================

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      // Login cheythittillenkil wishlist fetch venda
      if (!token) {
        setWishlistProducts([]);
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

        const products =
          response.data.wishlist?.products || [];

        /*
          Backend populated products aanenkil:
          { _id: "...", name: "...", ... }

          Populate cheyyathath aanenkil:
          "...productId..."

          Randum handle cheyyunnu.
        */

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
        console.error(
          "WISHLIST FETCH ERROR:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setWishlistProducts([]);
        }
      }
    };

    fetchWishlist();
  }, []);

  // =========================================================
  // WISHLIST HELPERS
  // =========================================================

  const isInWishlist = (productId) => {
    return wishlistProducts.includes(productId);
  };

  // =========================================================
  // WISHLIST ADD / REMOVE
  // =========================================================

  const handleWishlist = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please login to add products to wishlist"
      );

      navigate("/login");
      return;
    }

    const productId = product._id;

    const alreadyInWishlist =
      wishlistProducts.includes(productId);

    try {
      setWishlistLoadingId(productId);

      let response;

      // =====================================================
      // REMOVE
      // =====================================================

      if (alreadyInWishlist) {
        response = await axios.delete(
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
      }

      // =====================================================
      // ADD
      // =====================================================

      else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wishlist`,
          {
            productId: productId,
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
      }

      // =====================================================
      // SUCCESS MESSAGE
      // =====================================================

      toast.success(
        response.data.message ||
          (alreadyInWishlist
            ? "Removed from wishlist"
            : "Added to wishlist")
      );
    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setWishlistProducts([]);

        toast.error(
          error.response?.data?.message ||
            "Please login again"
        );

        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to update wishlist"
      );
    } finally {
      setWishlistLoadingId(null);
    }
  };

  // =========================================================
  // GET VARIANT TO DISPLAY
  // =========================================================

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

      return currentFinalPrice < lowestFinalPrice
        ? current
        : lowest;
    });
  };

  // =========================================================
  // GET HIGHEST DISCOUNT
  // =========================================================

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

  // =========================================================
  // CALCULATE FINAL PRICE
  // =========================================================

  const getFinalPrice = (variant) => {
    if (!variant) return 0;

    return (
      variant.price -
      (variant.price * variant.discountPercent) / 100
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

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

  // =========================================================
  // NO PRODUCTS
  // =========================================================

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
          onClick={(e) => {
            e.preventDefault();
            navigate("/products");
          }}
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

            const productInWishlist =
              isInWishlist(product._id);

            const wishlistIsLoading =
              wishlistLoadingId === product._id;

            return (
              <div className="group relative overflow-hidden rounded-3xl bg-gray-50">

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">

                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
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
                    onClick={() =>
                      handleWishlist(product)
                    }
                    disabled={wishlistIsLoading}
                    className={`
                      absolute
                      right-5
                      top-5
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      shadow-sm
                      transition-all
                      ${
                        productInWishlist
                          ? "bg-[#00e603] text-white"
                          : "bg-white text-gray-700 hover:bg-[#00e603] hover:text-white"
                      }
                      ${
                        wishlistIsLoading
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }
                    `}
                    aria-label={
                      productInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      size={19}
                      fill={
                        productInWishlist
                          ? "currentColor"
                          : "none"
                      }
                    />
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
                  <h3
                    className="cursor-pointer text-xl font-semibold text-gray-900 transition-colors hover:text-[#76B900]"
                    onClick={() =>
                      navigate(
                        `/product/${product._id}`
                      )
                    }
                  >
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
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/product/${product._id}`
                      )
                    }
                    className="mt-5 block w-full cursor-pointer rounded-full bg-gray-900 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#00ff03]"
                  >
                    View Product
                  </button>

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

            const productInWishlist =
              isInWishlist(product._id);

            const wishlistIsLoading =
              wishlistLoadingId === product._id;

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
                      className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
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
                  <h3
                    className="cursor-pointer font-semibold text-gray-900 transition-colors hover:text-[#76B900]"
                    onClick={() =>
                      navigate(
                        `/product/${product._id}`
                      )
                    }
                  >
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
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/product/${product._id}`
                      )
                    }
                    className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-[#76B900]"
                  >
                    View Product
                    <ArrowRight size={16} />
                  </button>

                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() =>
                    handleWishlist(product)
                  }
                  disabled={wishlistIsLoading}
                  className={`
                    absolute
                    right-4
                    top-4
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    shadow-sm
                    transition-all
                    ${
                      productInWishlist
                        ? "bg-[#00e603] text-white"
                        : "bg-white text-gray-700"
                    }
                    ${
                      wishlistIsLoading
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }
                  `}
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
            );
          })}

        </div>
      </div>

      {/* Mobile Explore Link */}
      <div className="mt-8 flex justify-center sm:hidden">

        <button
          type="button"
          onClick={() =>
            navigate("/products")
          }
          className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#76B900]"
        >
          Explore All Products
          <ArrowRight size={18} />
        </button>

      </div>

    </section>
  );
};

export default HotSelling;