import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [cartLoading, setCartLoading] = useState(false);

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product/${id}`
        );

        const data = response.data;

        setProduct(data.product);
        setVariants(data.variants || []);

        // Select first active variant
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error("Product fetch error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/review/product/${id}`
        );

        const data = response.data;

        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Review fetch error:", err);
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // =========================================================
  // FETCH WISHLIST STATUS
  // =========================================================

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      const token = localStorage.getItem("token");

      // User is not logged in.
      // No wishlist request is needed.
      if (!token || !id) {
        setIsWishlisted(false);
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

        const wishlistProducts =
          response.data?.wishlist?.products || [];

        const exists = wishlistProducts.some((wishlistProduct) => {
          const wishlistProductId =
            wishlistProduct?._id || wishlistProduct;

          return wishlistProductId?.toString() === id.toString();
        });

        setIsWishlisted(exists);
      } catch (error) {
        console.error("Wishlist fetch error:", error);

        // If token has expired, clear it.
        // Do not redirect because simply opening
        // a product page should not force login.
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsWishlisted(false);
        }
      }
    };

    fetchWishlistStatus();
  }, [id]);

  // =========================================================
  // CURRENT IMAGES
  // =========================================================

  const currentImages = useMemo(() => {
    if (!product) return [];

    // If selected variant has images,
    // show variant images first.
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      return selectedVariant.images;
    }

    // Otherwise product images
    return product.images || [];
  }, [product, selectedVariant]);

  // =========================================================
  // RESET IMAGE WHEN VARIANT CHANGES
  // =========================================================

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant]);

  // =========================================================
  // PRICE CALCULATION
  // =========================================================

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : 0;

  const discountPercent = selectedVariant
    ? Number(selectedVariant.discountPercent || 0)
    : 0;

  const finalPrice =
    currentPrice -
    (currentPrice * discountPercent) / 100;

  const roundedFinalPrice = Math.round(finalPrice);

  // =========================================================
  // STOCK
  // =========================================================

  const currentStock = selectedVariant
    ? Number(selectedVariant.stock || 0)
    : 0;

  const isOutOfStock =
    selectedVariant && currentStock <= 0;

  // =========================================================
  // QUANTITY
  // =========================================================

  const increaseQuantity = () => {
    if (!selectedVariant) return;

    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  };

  // =========================================================
  // VARIANT CHANGE
  // =========================================================

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  // =========================================================
  // IMAGE NAVIGATION
  // =========================================================

  const nextImage = () => {
    if (!currentImages.length) return;

    setSelectedImage((prev) =>
      prev === currentImages.length - 1
        ? 0
        : prev + 1
    );
  };

  const previousImage = () => {
    if (!currentImages.length) return;

    setSelectedImage((prev) =>
      prev === 0
        ? currentImages.length - 1
        : prev - 1
    );
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add products to cart");
      navigate("/login");
      return;
    }

    // Check variant
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    // Check stock
    if (currentStock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    // Check quantity
    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    // Prevent quantity greater than stock
    if (quantity > currentStock) {
      toast.error(
        `Only ${currentStock} items are available in stock`
      );
      return;
    }

    try {
      setCartLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          productId: product._id,
          variantId: selectedVariant._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show backend success message
      toast.success(
        response.data.message || "Product added to cart"
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      // If token is invalid/expired
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error(
          error.response?.data?.message ||
            "Please login again"
        );

        navigate("/login");
        return;
      }

      // Show backend error message
      toast.error(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  // =========================================================
  // BUY NOW
  // =========================================================

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    /*
      Buy Now → Checkout integration will be connected
      after checking your existing checkout/cart flow.
    */

    toast.success("Buy Now flow will be connected next");
  };

  // =========================================================
  // ADD / REMOVE WISHLIST
  // =========================================================

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

    // Check login
    if (!token) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    if (!product?._id) {
      toast.error("Product information is not available");
      return;
    }

    try {
      setWishlistLoading(true);

      // =====================================================
      // REMOVE FROM WISHLIST
      // =====================================================

      if (isWishlisted) {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsWishlisted(false);

        toast.success(
          response.data.message ||
            "Product removed from wishlist"
        );

        return;
      }

      // =====================================================
      // ADD TO WISHLIST
      // =====================================================

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsWishlisted(true);

      toast.success(
        response.data.message ||
          "Product added to wishlist"
      );
    } catch (error) {
      console.error("Wishlist error:", error);

      // If token is invalid/expired
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsWishlisted(false);

        toast.error(
          error.response?.data?.message ||
            "Please login again"
        );

        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to update wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="mb-8 h-5 w-64 rounded bg-gray-200" />

          <div className="grid gap-12 lg:grid-cols-2">

            <div>
              <div className="h-[500px] rounded-2xl bg-gray-200" />

              <div className="mt-5 flex gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-20 w-20 rounded-xl bg-gray-200"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="mt-5 h-5 w-40 rounded bg-gray-200" />
              <div className="mt-8 h-10 w-48 rounded bg-gray-200" />
              <div className="mt-8 h-20 rounded bg-gray-200" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ImageIcon className="h-7 w-7 text-gray-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Product not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error ||
              "This product may no longer be available."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00ff03] hover:text-black"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white text-gray-900">

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <div className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6 lg:px-10">

          <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">

            <button
              onClick={() => navigate("/")}
              className="transition hover:text-[#00ff03]"
            >
              Home
            </button>

            <ChevronRight className="h-4 w-4" />

            {product.category && (
              <>
                <button
                  onClick={() =>
                    navigate(
                      `/products?category=${product.category.slug}`
                    )
                  }
                  className="transition hover:text-[#00ff03]"
                >
                  {product.category.name}
                </button>

                <ChevronRight className="h-4 w-4" />
              </>
            )}

            <span className="max-w-[250px] truncate text-gray-800">
              {product.name}
            </span>

          </div>
        </div>

        {/* =====================================================
            PRODUCT MAIN SECTION
        ====================================================== */}

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-10">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">

            {/* =================================================
                LEFT - IMAGE GALLERY
            ================================================== */}

            <div>

              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                {currentImages.length > 0 ? (
                  <>
                    <img
                      src={currentImages[selectedImage]}
                      alt={product.name}
                      className="h-[420px] w-full object-contain p-8 sm:h-[500px] sm:p-12"
                    />

                    {currentImages.length > 1 && (
                      <>
                        <button
                          onClick={previousImage}
                          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-[#00ff03]"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>

                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-[#00ff03]"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                      {selectedImage + 1} / {currentImages.length}
                    </div>
                  </>
                ) : (
                  <div className="flex h-[420px] items-center justify-center sm:h-[500px]">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}

              </div>

              {/* THUMBNAILS */}

              {currentImages.length > 1 && (
                <div className="mt-5 flex gap-3 overflow-x-auto pb-2">

                  {currentImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() =>
                        setSelectedImage(index)
                      }
                      className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-gray-50 transition ${
                        selectedImage === index
                          ? "border-[#00ff03]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-contain p-2"
                      />
                    </button>
                  ))}

                </div>
              )}

            </div>

            {/* =================================================
                RIGHT - PRODUCT INFORMATION
            ================================================== */}

            <div>

              {/* PRODUCT NAME */}

              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>

              {/* RATING */}

              <div className="mt-4 flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <=
                        Math.round(
                          product.ratingAverage || 0
                        )
                          ? "fill-[#00ff03] text-[#00ff03]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}

                </div>

                <span className="text-sm font-medium text-gray-700">
                  {Number(
                    product.ratingAverage || 0
                  ).toFixed(1)}
                </span>

                <button
                  onClick={() =>
                    document
                      .getElementById("reviews")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="text-sm text-gray-500 underline-offset-2 hover:underline"
                >
                  {product.ratingCount || 0} Reviews
                </button>

              </div>

              <div className="my-6 h-px bg-gray-200" />

              {/* PRICE */}

              {selectedVariant && (
                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="text-3xl font-bold text-gray-950">
                      ₹{roundedFinalPrice.toLocaleString("en-IN")}
                    </span>

                    {discountPercent > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ₹{currentPrice.toLocaleString("en-IN")}
                        </span>

                        <span className="rounded-md bg-[#00ff03] px-2.5 py-1 text-xs font-bold text-black">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}

                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Inclusive of all taxes
                  </p>

                </div>
              )}

              {/* =================================================
                  VARIANTS
              ================================================== */}

              {variants.length > 0 && (
                <div className="mt-8">

                  <div className="mb-3 flex items-center justify-between">

                    <h3 className="text-sm font-bold text-gray-900">
                      Variant
                    </h3>

                    {selectedVariant && (
                      <span className="text-sm text-gray-500">
                        {selectedVariant.name}
                      </span>
                    )}

                  </div>

                  <div className="flex flex-wrap gap-3">

                    {variants.map((variant) => {

                      const isSelected =
                        selectedVariant?._id ===
                        variant._id;

                      const variantOutOfStock =
                        Number(variant.stock) <= 0;

                      return (
                        <button
                          key={variant._id}
                          disabled={variantOutOfStock}
                          onClick={() =>
                            handleVariantChange(variant)
                          }
                          className={`relative rounded-lg border px-5 py-3 text-sm font-semibold transition ${
                            isSelected
                              ? "border-[#00ff03] bg-[#00ff03]/10 text-black"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                          } ${
                            variantOutOfStock
                              ? "cursor-not-allowed opacity-40"
                              : ""
                          }`}
                        >

                          {isSelected && (
                            <Check className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#00ff03] p-1 text-black" />
                          )}

                          {variant.name}

                        </button>
                      );
                    })}

                  </div>

                </div>
              )}

              {/* SKU */}

              {selectedVariant?.sku && (
                <div className="mt-5 text-sm text-gray-500">
                  SKU:
                  <span className="ml-2 font-medium text-gray-800">
                    {selectedVariant.sku}
                  </span>
                </div>
              )}

              {/* STOCK */}

              {selectedVariant && (
                <div className="mt-4">

                  {currentStock > 0 ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                      <Check className="h-4 w-4" />
                      {currentStock <= 5
                        ? `Only ${currentStock} left in stock`
                        : "In Stock"}
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-red-600">
                      Out of Stock
                    </div>
                  )}

                </div>
              )}

              {/* QUANTITY */}

              {selectedVariant && !isOutOfStock && (
                <div className="mt-7">

                  <p className="mb-3 text-sm font-bold">
                    Quantity
                  </p>

                  <div className="flex h-11 w-fit items-center overflow-hidden rounded-lg border border-gray-300">

                    <button
                      onClick={decreaseQuantity}
                      disabled={
                        quantity <= 1 ||
                        cartLoading
                      }
                      className="flex h-full w-11 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="flex w-12 justify-center text-sm font-semibold">
                      {quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      disabled={
                        quantity >= currentStock ||
                        cartLoading
                      }
                      className="flex h-full w-11 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              )}

              {/* ACTION BUTTONS */}

              <div className="mt-7 flex items-center gap-3">

                {/* ADD TO CART */}

                <button
                  disabled={
                    cartLoading ||
                    !selectedVariant ||
                    isOutOfStock
                  }
                  onClick={handleAddToCart}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-5 text-sm font-bold text-black transition hover:border-[#00ff03] hover:bg-[#00ff03] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingCart className="h-5 w-5" />

                  {cartLoading
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                {/* BUY NOW */}

                <button
                  disabled={
                    !selectedVariant ||
                    isOutOfStock
                  }
                  onClick={handleBuyNow}
                  className="flex h-12 flex-1 items-center justify-center rounded-xl bg-black px-5 text-sm font-bold text-white transition hover:bg-[#00ff03] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Buy Now
                </button>

                {/* WISHLIST ICON */}

                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  aria-label={
                    isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  title={
                    isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#00ff03] hover:bg-[#00ff03]/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Heart
                    className={`h-6 w-6 transition-all duration-200 ${
                      isWishlisted
                        ? "fill-[#00ff03] text-[#00ff03]"
                        : "text-gray-700"
                    }`}
                  />
                </button>

              </div>

              {/* SERVICE FEATURES */}

              <div className="mt-8 grid gap-4 border-t border-gray-200 pt-7 sm:grid-cols-3">

                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00ff03]" />
                  <div>
                    <p className="text-xs font-bold">
                      Fast Delivery
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Delivered safely
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00ff03]" />
                  <div>
                    <p className="text-xs font-bold">
                      Secure Payment
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Safe checkout
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RotateCcw className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00ff03]" />
                  <div>
                    <p className="text-xs font-bold">
                      Easy Returns
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Simple return process
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            DESCRIPTION + SPECIFICATIONS
        ====================================================== */}

        <section className="border-y border-gray-200 bg-gray-50">

          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">

            <div className="grid gap-12 lg:grid-cols-2">

              {/* DESCRIPTION */}

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Product Description
                </h2>

                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {product.description}
                </div>

              </div>

              {/* SPECIFICATIONS */}

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Specifications
                </h2>

                {product.specs &&
                Object.keys(product.specs).length > 0 ? (
                  <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">

                    {Object.entries(product.specs).map(
                      ([key, value], index) => (
                        <div
                          key={key}
                          className={`grid grid-cols-2 gap-4 px-5 py-4 text-sm ${
                            index !==
                            Object.keys(product.specs).length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >

                          <span className="font-semibold capitalize text-gray-700">
                            {key.replace(
                              /([A-Z])/g,
                              " $1"
                            )}
                          </span>

                          <span className="text-gray-600">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>

                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <p className="mt-5 text-sm text-gray-500">
                    Specifications are not available.
                  </p>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            REVIEWS
        ====================================================== */}

        <section
          id="reviews"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10"
        >

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                Customer Reviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                See what customers think about this product.
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2">

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <=
                        Math.round(
                          product.ratingAverage || 0
                        )
                          ? "fill-[#00ff03] text-[#00ff03]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <span className="text-sm font-semibold">
                  {Number(
                    product.ratingAverage || 0
                  ).toFixed(1)}
                </span>

              </div>
            )}

          </div>

          {reviewLoading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-gray-200 p-5"
                >
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="mt-4 h-4 w-24 rounded bg-gray-200" />
                  <div className="mt-4 h-16 rounded bg-gray-200" />
                </div>
              ))}

            </div>
          ) : reviews.length === 0 ? (

            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 py-12 text-center">

              <Star className="mx-auto h-10 w-10 text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-800">
                No reviews yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Be the first to review this product.
              </p>

            </div>

          ) : (

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              {reviews.map((review) => (

                <div
                  key={review._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >

                  {/* USER */}

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      {review.user?.profileImage ? (
                        <img
                          src={review.user.profileImage}
                          alt={
                            review.user.name || "User"
                          }
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold">
                          {review.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-bold">
                          {review.user?.name ||
                            "Customer"}
                        </p>

                        {review.isVerifiedPurchase && (
                          <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-green-600">
                            <Check className="h-3 w-3" />
                            Verified Purchase
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <=
                            Number(review.rating || 0)
                              ? "fill-[#00ff03] text-[#00ff03]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                  </div>

                  {/* COMMENT */}

                  {review.comment && (
                    <p className="mt-5 text-sm leading-6 text-gray-600">
                      {review.comment}
                    </p>
                  )}

                  {/* REVIEW IMAGES */}

                  {review.images &&
                    review.images.length > 0 && (
                      <div className="mt-5 flex gap-3 overflow-x-auto">

                        {review.images.map(
                          (image, index) => (
                            <img
                              key={`${image}-${index}`}
                              src={image}
                              alt="Customer review"
                              className="h-24 w-24 flex-shrink-0 rounded-lg border border-gray-200 object-cover"
                            />
                          )
                        )}

                      </div>
                    )}

                  {/* DATE */}

                  {review.createdAt && (
                    <p className="mt-5 text-xs text-gray-400">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;