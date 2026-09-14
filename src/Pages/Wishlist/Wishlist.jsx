import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingProductId, setRemovingProductId] = useState(null);
  const [clearingWishlist, setClearingWishlist] = useState(false);

  // FETCH WISHLIST
  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your wishlist");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/wishlist",
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

  // REMOVE SINGLE PRODUCT
  const handleRemoveFromWishlist = async (productId) => {
    try {
      setRemovingProductId(productId);

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== productId
        )
      );

      toast.success("Product removed from wishlist");
    } catch (error) {
      console.log("Remove wishlist error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove product from wishlist"
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  // CLEAR ENTIRE WISHLIST
  const handleClearWishlist = async () => {
    try {
      setClearingWishlist(true);

      const token = localStorage.getItem("token");

      await axios.delete(
        "http://localhost:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistProducts([]);

      toast.success("Wishlist cleared successfully");
    } catch (error) {
      console.log("Clear wishlist error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to clear wishlist"
      );
    } finally {
      setClearingWishlist(false);
    }
  };

  // CALCULATE DISCOUNTED PRICE
  const calculatePrice = (basePrice, discountPercent) => {
    return basePrice - (basePrice * discountPercent) / 100;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Heart
                size={24}
                className="fill-[#00ff03] text-[#00e603]"
              />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                My Wishlist
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Save your favourite products and shop them
                anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WISHLIST CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Saved Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1
                ? "product"
                : "products"}{" "}
              in your wishlist
            </p>
          </div>

          {/* CLEAR WISHLIST */}
          {wishlistProducts.length > 0 && (
            <button
              type="button"
              onClick={handleClearWishlist}
              disabled={clearingWishlist}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <Trash2 size={16} />

              {clearingWishlist
                ? "Clearing..."
                : "Clear Wishlist"}
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
          </div>
        ) : wishlistProducts.length === 0 ? (
          /* EMPTY WISHLIST */
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
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
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Explore Products
              <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          /* PRODUCTS */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistProducts.map((product) => {
              const finalPrice = calculatePrice(
                product.variant.price,
                product.variant.discountPercent
              );

              return (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* DISCOUNT */}
                    {product.discountPercent > 0 && (
                      <span className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                        {product.discountPercent}% OFF
                      </span>
                    )}

                    {/* WISHLIST HEART */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFromWishlist(product._id)
                      }
                      disabled={
                        removingProductId === product._id
                      }
                      aria-label="Remove from wishlist"
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Heart
                        size={19}
                        className="fill-[#00ff03] text-[#00ff03]"
                      />
                    </button>
                  </div>

                  {/* DETAILS */}
                  <div className="p-5">
                    <h3 className="line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-gray-900">
                      {product.name}
                    </h3>

                    {/* PRICE */}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{finalPrice.toLocaleString("en-IN")}
                      </span>

                      {product.discountPercent > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹
                          {product.basePrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}
                    </div>

                    {/* STOCK */}
                    <div className="mt-3">
                      {product.variant.stock > 0 ? (
                        <span className="text-xs font-medium text-green-600">
                          In Stock · {product.variant.stock} left
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-500">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        disabled={product.variant.stock === 0}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00ff03] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                      >
                        <ShoppingBag size={17} />
                        Add to Cart
                      </button>

                      <button
                        type="button"
                        aria-label="View product"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-green-600 hover:text-green-600"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;