import { useEffect, useState } from "react";
import {
  Heart,
  ArrowRight,
  Star,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [wishlistLoadingId, setWishlistLoadingId] =
    useState(null);

  const [clearingWishlist, setClearingWishlist] =
    useState(false);

  // =========================================
  // FETCH WISHLIST
  // =========================================

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistProducts(
        response.data?.wishlist?.products || []
      );
    } catch (error) {
      console.log("Fetch wishlist error:", error);

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

      toast.error(
        error.response?.data?.message ||
          "Failed to load wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // =========================================
  // REMOVE FROM WISHLIST
  // =========================================

  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    setWishlistLoadingId(productId);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistProducts((prev) =>
        prev.filter(
          (product) => product._id !== productId
        )
      );

      toast.success(
        response.data?.message ||
          "Removed from wishlist"
      );
    } catch (error) {
      console.log(
        "Remove wishlist error:",
        error
      );

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

      toast.error(
        error.response?.data?.message ||
          "Failed to remove product from wishlist"
      );
    } finally {
      setWishlistLoadingId(null);
    }
  };

  // =========================================
  // CLEAR WISHLIST
  // =========================================

  const handleClearWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    setClearingWishlist(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistProducts([]);

      toast.success(
        "Wishlist cleared successfully"
      );
    } catch (error) {
      console.log(
        "Clear wishlist error:",
        error
      );

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

      toast.error(
        error.response?.data?.message ||
          "Failed to clear wishlist"
      );
    } finally {
      setClearingWishlist(false);
    }
  };

  // =========================================
  // PRODUCT CLICK
  // =========================================

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F6]">
        <Navbar />

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10">

          <div className="mb-10">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200" />

            <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl bg-gray-50"
              >
                <div className="aspect-square animate-pulse bg-gray-200" />

                <div className="space-y-3 p-3 sm:p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-gray-900">

      <Navbar />

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 sm:h-12 sm:w-12">
              <Heart
                size={20}
                className="fill-[#00ff03] text-[#00e603] sm:h-6 sm:w-6"
              />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                My Wishlist
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Save your favourite products and shop them anytime.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10">

        {/* ===================================
            HEADER
        =================================== */}

        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">

          <div>

            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#00e603]">
              Your favourites
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Saved Products
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1
                ? "product"
                : "products"}{" "}
              in your wishlist
            </p>

          </div>

          {/* CLEAR */}

          {wishlistProducts.length > 0 && (
            <button
              type="button"
              onClick={handleClearWishlist}
              disabled={clearingWishlist}
              className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
            >
              <Trash2 size={15} />

              {clearingWishlist
                ? "Clearing..."
                : "Clear Wishlist"}
            </button>
          )}

        </div>

        {/* ===================================
            EMPTY
        =================================== */}

        {wishlistProducts.length === 0 ? (

          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <Heart
                size={36}
                className="text-green-600"
              />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't added anything to your wishlist yet.
              Explore our products and save the ones you love.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="mt-7 flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Explore Products
              <ArrowRight size={17} />
            </button>

          </div>

        ) : (

          <>
            {/* =================================
                PRODUCT GRID
            ================================= */}

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

              {wishlistProducts.map((product) => {

                const variant = product?.variant;

                const price = Number(
                  variant?.price ?? 0
                );

                const discountPercent = Number(
                  variant?.discountPercent ?? 0
                );

                const finalPrice =
                  price -
                  (price * discountPercent) / 100;

                /*
                  Same image logic as LatestProducts.
                  Variant image first, product image second.
                */

                const image =
                  variant?.images?.[0] ||
                  product.images?.[0] ||
                  "";

                const isRemoving =
                  wishlistLoadingId === product._id;

                return (
                  <div
                    key={product._id}
                    className="group overflow-hidden rounded-2xl bg-gray-50 sm:rounded-3xl"
                  >

                    {/* =================================
                        IMAGE
                    ================================= */}

                    <div className="relative aspect-square overflow-hidden bg-gray-100">

                      {image && (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full cursor-pointer object-contain transition-transform duration-500 group-hover:scale-105"
                          onClick={() =>
                            handleProductClick(
                              product._id
                            )
                          }
                        />
                      )}

                      {/* DISCOUNT */}

                      {discountPercent > 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#00e603] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[10px]">
                          {discountPercent}% OFF
                        </span>
                      )}

                      {/* WISHLIST */}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          handleRemoveFromWishlist(
                            product._id
                          );
                        }}
                        disabled={isRemoving}
                        className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all sm:right-4 sm:top-4 sm:h-9 sm:w-9 ${
                          isRemoving
                            ? "cursor-not-allowed opacity-60"
                            : "bg-[#00ff03] text-white hover:bg-white hover:text-[#00e603]"
                        }`}
                        aria-label="Remove from wishlist"
                      >
                        <Heart
                          size={15}
                          fill="currentColor"
                        />
                      </button>

                    </div>

                    {/* =================================
                        PRODUCT INFO
                    ================================= */}

                    <div className="p-3 sm:p-5">

                      {/* RATING */}

                      <div className="mb-2 flex items-center gap-1 text-xs">

                        <Star
                          size={14}
                          fill="currentColor"
                          className="text-yellow-400"
                        />

                        <span className="font-medium text-gray-700">
                          {Number(
                            product.ratingAverage || 0
                          ).toFixed(1)}
                        </span>

                        <span className="text-gray-400">
                          (
                          {product.ratingCount || 0}
                          )
                        </span>

                      </div>

                      {/* PRODUCT NAME */}

                      <h3
                        onClick={() =>
                          handleProductClick(
                            product._id
                          )
                        }
                        className="min-h-[42px] cursor-pointer text-sm font-semibold leading-5 text-gray-900 transition-colors hover:text-[#00e603] sm:min-h-[48px] sm:text-base sm:leading-6"
                      >
                        {product.name}
                      </h3>

                      {/* PRICE */}

                      {variant ? (

                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          <span className="text-sm font-bold text-gray-900 sm:text-base">
                            From ₹
                            {Math.round(
                              finalPrice
                            ).toLocaleString("en-IN")}
                          </span>

                          {discountPercent > 0 && (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                ₹
                                {Math.round(
                                  price
                                ).toLocaleString("en-IN")}
                              </span>

                              <span className="text-xs font-semibold text-[#76B900]">
                                {discountPercent}%
                                {" "}
                                OFF
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

                      <button
                        type="button"
                        onClick={() =>
                          handleProductClick(
                            product._id
                          )
                        }
                        className="mt-4 flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-gray-900 transition-colors hover:text-[#00ff03] sm:mt-5 sm:gap-2 sm:text-sm"
                      >
                        View Product
                        <ArrowRight size={16} />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* =================================
                MOBILE / BOTTOM
            ================================= */}

            <div className="mt-8 flex justify-center">

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#76B900]"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </button>

            </div>

          </>
        )}

      </main>

      <Footer />

    </div>
  );
};

export default Wishlist;