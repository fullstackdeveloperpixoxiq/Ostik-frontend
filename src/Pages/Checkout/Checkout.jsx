import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [updatingVariantId, setUpdatingVariantId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // -----------------------------------------
  // FETCH CART
  // -----------------------------------------

  const fetchCart = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const items = response.data?.cart?.items || [];

      if (items.length === 0) {
        toast.error("Your cart is empty");
        navigate("/cart");
        return;
      }

      setCartItems(items);

    } catch (error) {
      console.log("Fetch checkout cart error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


  // -----------------------------------------
  // HANDLE ADDRESS CHANGE
  // -----------------------------------------

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // -----------------------------------------
  // PRICE CALCULATION
  // -----------------------------------------

  const getFinalPrice = (variant) => {
    if (!variant) {
      return 0;
    }

    const price = Number(variant.price) || 0;
    const discountPercent =
      Number(variant.discountPercent) || 0;

    const discountedPrice =
      price -
      (price * discountPercent) / 100;

    return Math.round(discountedPrice);
  };


  const getOriginalPrice = (variant) => {
    if (!variant) {
      return 0;
    }

    return Math.round(Number(variant.price) || 0);
  };


  const subtotal = cartItems.reduce((total, item) => {
    const price = getFinalPrice(item.variant);

    return total + price * item.quantity;
  }, 0);


  const originalTotal = cartItems.reduce((total, item) => {
    const price = getOriginalPrice(item.variant);

    return total + price * item.quantity;
  }, 0);


  const totalDiscount =
    originalTotal - subtotal;


  const shippingFee =
    subtotal >= 2000 ? 0 : 99;


  const grandTotal =
    subtotal + shippingFee;


  // -----------------------------------------
  // UPDATE CART QUANTITY
  // -----------------------------------------

  const handleQuantityChange = async (
    variantId,
    currentQuantity,
    change
  ) => {

    const newQuantity =
      currentQuantity + change;

    if (newQuantity < 1) {
      return;
    }

    try {

      setUpdatingVariantId(variantId);

      const token =
        localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/cart/${variantId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedItems =
        response.data?.cart?.items || [];

      setCartItems(updatedItems);

    } catch (error) {

      console.log(
        "Update checkout cart error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to update quantity"
      );

    } finally {

      setUpdatingVariantId(null);
    }
  };


  // -----------------------------------------
  // VALIDATE ADDRESS
  // -----------------------------------------

  const validateAddress = () => {

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
    } = shippingAddress;


    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }


    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }


    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }


    if (!address.trim()) {
      toast.error("Please enter your address");
      return false;
    }


    if (!city.trim()) {
      toast.error("Please enter your city");
      return false;
    }


    if (!state.trim()) {
      toast.error("Please enter your state");
      return false;
    }


    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }


    return true;
  };


  // -----------------------------------------
  // LOAD RAZORPAY SCRIPT
  // -----------------------------------------

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {

      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

      if (existingScript) {
        resolve(true);
        return;
      }


      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };


  // -----------------------------------------
  // HANDLE RAZORPAY PAYMENT
  // -----------------------------------------

  const openRazorpayCheckout = async (order) => {

    try {

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error(
          "Razorpay failed to load. Please try again."
        );

        setPlacingOrder(false);
        return;
      }


      const token =
        localStorage.getItem("token");


      // Create Razorpay order
      const paymentResponse =
        await axios.post(
          "http://localhost:5000/api/payment/create",
          {
            orderId: order._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


      const payment =
        paymentResponse.data?.payment;


      if (!payment) {
        throw new Error(
          "Payment details not received"
        );
      }


      const options = {

        key:
          import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount:
          payment.amount,

        currency:
          payment.currency,

        name: "OSTIK",

        description:
          "OSTIK Electronics Order",

        order_id:
          payment.razorpayOrderId,


        handler: async function (response) {

          try {

            const verifyResponse =
              await axios.post(
                "http://localhost:5000/api/payment/verify",
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );


            if (
              verifyResponse.status === 200
            ) {

              toast.success(
                "Payment successful! Your order has been placed."
              );


              navigate(
                `/order-success/${order._id}`
              );
            }

          } catch (error) {

            console.log(
              "Payment verification error:",
              error
            );

            toast.error(
              error.response?.data?.message ||
              "Payment verification failed"
            );

            setPlacingOrder(false);
          }
        },


        prefill: {

          name:
            shippingAddress.fullName,

          contact:
            shippingAddress.phone,
        },


        notes: {
          orderId:
            order._id,
        },


        theme: {
          color: "#111827",
        },


        modal: {
          ondismiss: function () {

            setPlacingOrder(false);

            toast.info(
              "Payment cancelled"
            );
          },
        },
      };


      const razorpay =
        new window.Razorpay(options);


      razorpay.open();


    } catch (error) {

      console.log(
        "Razorpay error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to start payment"
      );

      setPlacingOrder(false);
    }
  };


  // -----------------------------------------
  // PLACE ORDER
  // -----------------------------------------

  const handlePlaceOrder = async () => {

    if (!validateAddress()) {
      return;
    }


    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }


    try {

      setPlacingOrder(true);

      const token =
        localStorage.getItem("token");


      // Create order
      const response =
        await axios.post(
          "http://localhost:5000/api/order",
          {
            shippingAddress,
            paymentMethod,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const order =
        response.data?.order;


      if (!order) {
        throw new Error(
          "Order was not created"
        );
      }


      // -------------------------------------
      // COD
      // -------------------------------------

      if (paymentMethod === "cod") {

        toast.success(
          "Order placed successfully!"
        );


        navigate(
          `/order-success/${order._id}`
        );

        return;
      }


      // -------------------------------------
      // RAZORPAY
      // -------------------------------------

      await openRazorpayCheckout(order);

    } catch (error) {

      console.log(
        "Place order error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to place order"
      );

      setPlacingOrder(false);
    }
  };


  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {

    return (
      <div className="min-h-screen bg-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-500 text-sm">
            Loading checkout...
          </p>

        </div>

      </div>
    );
  }


  return (

    <div className="min-h-screen bg-gray-50">

      {/* ---------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------- */}

      <header className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
            >

              <ArrowLeft size={18} />

              <span>
                Back to Cart
              </span>

            </button>


            <div className="shrink-0 px-10 flex items-center justify-center">

              <img src="\OstikLogo\OSTIK_PNG.png" alt="LOGO" 
              className="w-[150px] h-auto object-contain"/>

            </div>


            <div className="hidden sm:flex items-center gap-2 text-gray-500">

              <LockKeyhole size={16} />

              <span className="text-xs">
                Secure Checkout
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* ---------------------------------- */}
      {/* CHECKOUT CONTENT */}
      {/* ---------------------------------- */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* TITLE */}

        <div className="mb-8">

          <p className="text-sm font-medium text-[#00ff03] mb-2">
            OSTIK CHECKOUT
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Complete your order
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your delivery details and choose your payment method.
          </p>

        </div>


        {/* -------------------------------- */}
        {/* MAIN GRID */}
        {/* -------------------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">


          {/* ================================ */}
          {/* LEFT SIDE */}
          {/* ================================ */}

          <div className="lg:col-span-7 space-y-6">


            {/* ------------------------------ */}
            {/* SHIPPING ADDRESS */}
            {/* ------------------------------ */}

            <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">

              <div className="flex items-start gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">

                  <MapPin
                    size={20}
                    className="text-[#00ff03]"
                  />

                </div>


                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Delivery address
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Where should we deliver your order?
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                {/* FULL NAME */}

                <div className="sm:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    placeholder="Enter your full name"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-green focus:ring-1 focus:ring-black transition"
                  />

                </div>


                {/* PHONE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                  />

                </div>


                {/* PINCODE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleAddressChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                  />

                </div>


                {/* ADDRESS */}

                <div className="sm:col-span-2">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    placeholder="House / Flat / Street / Area"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none resize-none focus:border-black focus:ring-1 focus:ring-black transition"
                  />

                </div>


                {/* CITY */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                  />

                </div>


                {/* STATE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                  />

                </div>

              </div>

            </section>


            {/* ------------------------------ */}
            {/* PAYMENT METHOD */}
            {/* ------------------------------ */}

            <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">

              <div className="flex items-start gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">

                  <CreditCard
                    size={20}
                    className="text-gray-700"
                  />

                </div>


                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment method
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Choose how you'd like to pay.
                  </p>

                </div>

              </div>


              <div className="space-y-3">


                {/* RAZORPAY */}

                <label
                  className={`block border rounded-2xl p-4 cursor-pointer transition ${
                    paymentMethod === "razorpay"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={
                        paymentMethod === "razorpay"
                      }
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                      className="w-4 h-4 accent-black"
                    />


                    <div className="flex-1">

                      <div className="flex items-center justify-between gap-3">

                        <div>

                          <p className="font-semibold text-gray-900">
                            Online Payment
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            UPI, Cards, Net Banking & Wallets
                          </p>

                        </div>


                        <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          Recommended
                        </span>

                      </div>

                    </div>

                  </div>

                </label>


                {/* COD */}

                <label
                  className={`block border rounded-2xl p-4 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={
                        paymentMethod === "cod"
                      }
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value
                        )
                      }
                      className="w-4 h-4 accent-black"
                    />


                    <div>

                      <p className="font-semibold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Pay when your order arrives.
                      </p>

                    </div>

                  </div>

                </label>

              </div>

            </section>


            {/* ------------------------------ */}
            {/* SECURITY FEATURES */}
            {/* ------------------------------ */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">

                <ShieldCheck
                  size={20}
                  className="text-[#00ff03] shrink-0"
                />

                <div>

                  <p className="text-sm font-medium text-gray-900">
                    Secure payment
                  </p>

                  <p className="text-xs text-gray-500">
                    Protected checkout
                  </p>

                </div>

              </div>


              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">

                <Truck
                  size={20}
                  className="text-[#00ff03] shrink-0"
                />

                <div>

                  <p className="text-sm font-medium text-gray-900">
                    Fast delivery
                  </p>

                  <p className="text-xs text-gray-500">
                    Reliable shipping
                  </p>

                </div>

              </div>


              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">

                <LockKeyhole
                  size={20}
                  className="text-[#00ff03] shrink-0"
                />

                <div>

                  <p className="text-sm font-medium text-gray-900">
                    Your privacy
                  </p>

                  <p className="text-xs text-gray-500">
                    Data is protected
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================================ */}
          {/* RIGHT SIDE */}
          {/* ================================ */}

          <div className="lg:col-span-5">


            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden lg:sticky lg:top-6">


              {/* ORDER SUMMARY HEADER */}

              <div className="p-5 sm:p-6 border-b border-gray-200">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-semibold text-gray-900">
                      Order summary
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {cartItems.length}{" "}
                      {cartItems.length === 1
                        ? "item"
                        : "items"}
                    </p>

                  </div>


                  <ShoppingBag
                    size={20}
                    className="text-gray-400"
                  />

                </div>

              </div>


              {/* CART ITEMS */}

              <div className="p-5 sm:p-6 max-h-[420px] overflow-y-auto">

                <div className="space-y-5">

                  {cartItems.map((item) => {

                    const variant =
                      item.variant;

                    const product =
                      item.product;

                    const finalPrice =
                      getFinalPrice(
                        variant
                      );

                    const originalPrice =
                      getOriginalPrice(
                        variant
                      );


                    return (

                      <div
                        key={variant?._id}
                        className="flex gap-4"
                      >

                        {/* IMAGE */}

                        <div className="relative w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">

                          <img
                            src={
                              variant?.images?.[0] ||
                              product?.images?.[0] ||
                              ""
                            }
                            alt={
                              product?.name ||
                              "Product"
                            }
                            className="w-full h-full object-contain"
                          />

                          <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-black text-white text-xs flex items-center justify-center">
                            {item.quantity}
                          </span>

                        </div>


                        {/* DETAILS */}

                        <div className="flex-1 min-w-0">

                          <div className="flex justify-between gap-3">

                            <div className="min-w-0">

                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {product?.name}
                              </h3>

                              {variant?.name && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {variant.name}
                                </p>
                              )}

                            </div>


                            <div className="text-right shrink-0">

                              <p className="text-sm font-semibold text-gray-900">
                                ₹
                                {(
                                  finalPrice *
                                  item.quantity
                                ).toLocaleString("en-IN")}
                              </p>

                              {originalPrice >
                                finalPrice && (
                                <p className="text-xs text-gray-400 line-through">
                                  ₹
                                  {(
                                    originalPrice *
                                    item.quantity
                                  ).toLocaleString("en-IN")}
                                </p>
                              )}

                            </div>

                          </div>


                          {/* QUANTITY */}

                          <div className="flex items-center gap-2 mt-3">

                            <button
                              type="button"
                              disabled={
                                updatingVariantId ===
                                variant?._id
                              }
                              onClick={() =>
                                handleQuantityChange(
                                  variant?._id,
                                  item.quantity,
                                  -1
                                )
                              }
                              className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                            >

                              <Minus size={13} />

                            </button>


                            <span className="text-sm font-medium w-5 text-center">
                              {item.quantity}
                            </span>


                            <button
                              type="button"
                              disabled={
                                updatingVariantId ===
                                variant?._id
                              }
                              onClick={() =>
                                handleQuantityChange(
                                  variant?._id,
                                  item.quantity,
                                  1
                                )
                              }
                              className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                            >

                              <Plus size={13} />

                            </button>

                          </div>

                        </div>

                      </div>

                    );
                  })}

                </div>

              </div>


              {/* PRICE BREAKDOWN */}

              <div className="border-t border-gray-200 p-5 sm:p-6">

                <div className="space-y-3 text-sm">


                  {/* ORIGINAL */}

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="text-gray-900">
                      ₹
                      {originalTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>


                  {/* DISCOUNT */}

                  {totalDiscount > 0 && (

                    <div className="flex items-center justify-between">

                      <span className="text-gray-500">
                        Discount
                      </span>

                      <span className="text-green-600">
                        -₹
                        {totalDiscount.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  )}


                  {/* SHIPPING */}

                  <div className="flex items-center justify-between">

                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span
                      className={
                        shippingFee === 0
                          ? "text-green-600"
                          : "text-gray-900"
                      }
                    >

                      {shippingFee === 0
                        ? "FREE"
                        : `₹${shippingFee.toLocaleString(
                            "en-IN"
                          )}`}

                    </span>

                  </div>

                </div>


                {/* TOTAL */}

                <div className="border-t border-gray-200 mt-5 pt-5">

                  <div className="flex items-end justify-between">

                    <div>

                      <p className="font-semibold text-gray-900">
                        Total
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Inclusive of applicable taxes
                      </p>

                    </div>


                    <p className="text-2xl font-bold text-gray-900">

                      ₹
                      {grandTotal.toLocaleString(
                        "en-IN"
                      )}

                    </p>

                  </div>

                </div>


                {/* PLACE ORDER */}

                <button
                  type="button"
                  disabled={placingOrder}
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 h-14 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#00ff03] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {placingOrder ? (

                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>

                      <span>
                        Processing...
                      </span>
                    </>

                  ) : (

                    <>
                      <CheckCircle2 size={19} />

                      <span>
                        {paymentMethod === "razorpay"
                          ? "Pay & Place Order"
                          : "Place Order"}
                      </span>
                    </>

                  )}

                </button>


                {/* SECURE NOTE */}

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">

                  <LockKeyhole size={13} />

                  <span>
                    Secure and encrypted checkout
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Checkout;