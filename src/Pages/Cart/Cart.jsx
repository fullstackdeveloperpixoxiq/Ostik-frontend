import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Heart,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingVariantId, setUpdatingVariantId] = useState(null);
  const [removingVariantId, setRemovingVariantId] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);

  const navigate= useNavigate()

  // FETCH CART
  const fetchCart = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your cart");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(response.data?.cart?.items || []);
    } catch (error) {
      console.log("Fetch cart error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // CALCULATE FINAL PRICE
  const getFinalPrice = (variant) => {
    if (!variant) return 0;

    const finalPrice=
      variant.price -
      (variant.price * variant.discountPercent) / 100;

      return Math.round(finalPrice)
  };

  // INCREASE / DECREASE QUANTITY
  const handleQuantityChange = async (variantId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) return;

    try {
      setUpdatingVariantId(variantId);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/${variantId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(response.data?.cart?.items || []);

    } catch (error) {
      console.log("Update cart error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setUpdatingVariantId(null);
    }
  };

  // REMOVE ITEM
  const handleRemove = async (variantId) => {
    try {
      setRemovingVariantId(variantId);

      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/${variantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((previousItems) =>
        previousItems.filter(
          (item) => item.variant?._id !== variantId
        )
      );

      toast.success("Product removed from cart");
    } catch (error) {
      console.log("Remove cart error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    } finally {
      setRemovingVariantId(null);
    }
  };

  // CLEAR CART
  const handleClearCart = async () => {
    try {
      setClearingCart(true);

      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems([]);

      toast.success("Cart cleared successfully");
    } catch (error) {
      console.log("Clear cart error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    } finally {
      setClearingCart(false);
    }
  };

  // TOTALS
  const subtotal = cartItems.reduce((total, item) => {
    const price = getFinalPrice(item.variant);

    return total + price * item.quantity;
  }, 0);

  const originalTotal = cartItems.reduce((total, item) => {
    return total + (item.variant?.price || 0) * item.quantity;
  }, 0);

  const totalSavings = originalTotal - subtotal;

  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 99;

  const grandTotal = subtotal + shipping;

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F6]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your cart...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9F6] text-gray-900">
        <main className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-6 py-16">
          <div className="flex max-w-md flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
              <ShoppingBag
                size={42}
                className="text-green-600"
              />
            </div>

            <h1 className="mt-7 text-3xl font-semibold tracking-tight">
              Your cart is empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Looks like you haven't added anything to your cart
              yet. Explore our products and find something you
              love.
            </p>

            <button
              type="button"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-lg"
            >
              Explore Products
              <ArrowRight size={17} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-gray-900">
      {/* HEADER */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                <ShoppingBag size={14} />
                Shopping Cart
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Review your selected products before checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={clearingCart}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <Trash2 size={16} />

              {clearingCart ? "Clearing..." : "Clear Cart"}
            </button>
          </div>
        </div>
      </section>

      {/* CART CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Cart Items
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                const variant = item.variant;

                const finalPrice = getFinalPrice(variant);

                const isUpdating =
                  updatingVariantId === variant?._id;

                const isRemoving =
                  removingVariantId === variant?._id;

                return (
                  <article
                    key={variant?._id}
                    className="group rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg sm:rounded-3xl sm:p-5"
                  >
                    <div className="flex gap-3 sm:gap-6">
                      {/* IMAGE */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-36 sm:w-36 sm:rounded-2xl">
                        <img
                          src={
                            variant?.images?.[0] ||
                            product?.images?.[0]
                          }
                          alt={product?.name || "Product"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {variant?.discountPercent > 0 && (
                          <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-bold text-white">
                            {variant.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 sm:text-lg sm:leading-6">
                              {product?.name}
                            </h3>

                            {variant?.name && (
                              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                Color:{" "}
                                <span className="font-medium text-gray-700">
                                  {variant.name}
                                </span>
                              </p>
                            )}

                            {variant?.sku && (
                              <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                                SKU: {variant.sku}
                              </p>
                            )}
                          </div>

                          {/* REMOVE */}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(variant?._id)
                            }
                            disabled={isRemoving}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-9"
                            aria-label="Remove product"
                          >
                            <Trash2 size={15} className="sm:h-[17px] sm:w-[17px]" />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 sm:text-xl">
                            ₹
                            {finalPrice.toLocaleString("en-IN")}
                          </span>

                          {variant?.discountPercent > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹
                              {variant.price.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>

                        {/* BOTTOM */}
                        <div className="mt-4 flex items-center">
                        

                          {/* QUANTITY */}
                          <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  variant?._id,
                                  item.quantity,
                                  -1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                isUpdating
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-all duration-200 hover:bg-white hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-9 text-center text-sm font-semibold">
                              {isUpdating ? "..." : item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  variant?._id,
                                  item.quantity,
                                  1
                                )
                              }
                              disabled={
                                isUpdating ||
                                item.quantity >=
                                  variant?.stock
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-all duration-200 hover:bg-white hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* RIGHT - SUMMARY */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm sm:rounded-3xl sm:p-7">
              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">
                      You save
                    </span>

                    <span className="font-semibold text-green-600">
                      -₹{totalSavings.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span
                    className={
                      shipping === 0
                        ? "font-medium text-green-600"
                        : "font-medium text-gray-900"
                    }
                  >
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-gray-200" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </p>
                </div>

                {shipping === 0 && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Free Delivery
                  </span>
                )}
              </div>

              <button
                type="button"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00ff03] hover:shadow-xl"
                onClick={()=>navigate("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={18}
                    className="text-green-600"
                  />

                  <span className="text-xs text-gray-500">
                    Secure checkout & protected payment
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Truck
                    size={18}
                    className="text-green-600"
                  />

                  <span className="text-xs text-gray-500">
                    Fast and reliable delivery
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Heart
                    size={18}
                    className="text-green-600"
                  />

                  <span className="text-xs text-gray-500">
                    Your wishlist items stay saved
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;