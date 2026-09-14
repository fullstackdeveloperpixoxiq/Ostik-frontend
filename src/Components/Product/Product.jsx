import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  ChevronRight,
  Star,
} from "lucide-react";
import axios from "axios";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Products = () => {
  const [searchParams] = useSearchParams();

  const categorySlug = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FILTER STATES
  // ==============================

  const [showFilter, setShowFilter] = useState(false);

  const [availability, setAvailability] = useState("all");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);

  const navigate= useNavigate();
  // ==============================
  // SORT
  // ==============================

  const [sortBy, setSortBy] = useState("relevant");

  // ==============================
  // FETCH PRODUCTS
  // ==============================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        let url = "http://localhost:5000/api/product";

        if (categorySlug) {
          url += `?category=${categorySlug}`;
        }

        const response = await axios.get(url);

        const fetchedProducts = response.data.products || [];

        setProducts(fetchedProducts);

        if (fetchedProducts.length > 0) {
          setCategoryName(
            fetchedProducts[0]?.category?.name || ""
          );
        } else {
          setCategoryName("");
        }
      } catch (err) {
        console.log("PRODUCT FETCH ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  // ==============================
  // HELPER FUNCTIONS
  // ==============================

  const getActiveVariants = (product) => {
    if (!Array.isArray(product?.variants)) {
      return [];
    }

    return product.variants.filter(
      (variant) => variant?.isActive === true
    );
  };

  const getFinalPrice = (variant) => {
    if (!variant) {
      return 0;
    }

    const price = Number(variant.price) || 0;
    const discount = Number(variant.discountPercent) || 0;

    if (discount <= 0) {
      return price;
    }

    return price - (price * discount) / 100;
  };

  const getDisplayVariant = (product) => {
    const variants = getActiveVariants(product);

    if (variants.length === 0) {
      return null;
    }

    // First prefer variants which are in stock
    const inStockVariants = variants.filter(
      (variant) => Number(variant.stock) > 0
    );

    const variantsToUse =
      inStockVariants.length > 0
        ? inStockVariants
        : variants;

    // Show the cheapest variant
    return [...variantsToUse].sort(
      (a, b) =>
        getFinalPrice(a) - getFinalPrice(b)
    )[0];
  };

  const isProductInStock = (product) => {
    const variants = getActiveVariants(product);

    return variants.some(
      (variant) => Number(variant.stock) > 0
    );
  };

  const getTotalAvailableStock = (product) => {
    const variants = getActiveVariants(product);

    return variants.reduce(
      (total, variant) =>
        total + (Number(variant.stock) || 0),
      0
    );
  };

  // ==============================
  // AVAILABILITY COUNTS
  // ==============================

  const availableCount = products.filter(
    (product) => isProductInStock(product)
  ).length;

  const unavailableCount = products.filter(
    (product) => !isProductInStock(product)
  ).length;

  // ==============================
  // PRICE RANGE
  // ==============================

  const priceRange = useMemo(() => {
    const prices = products
      .map((product) => {
        const variant = getDisplayVariant(product);

        return variant
          ? getFinalPrice(variant)
          : null;
      })
      .filter(
        (price) =>
          price !== null &&
          Number.isFinite(price)
      );

    if (prices.length === 0) {
      return {
        min: 0,
        max: 0,
      };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // ==============================
  // FILTER PRODUCTS
  // ==============================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Availability
    if (availability === "active") {
      result = result.filter((product) =>
        isProductInStock(product)
      );
    }

    if (availability === "inactive") {
      result = result.filter(
        (product) =>
          !isProductInStock(product)
      );
    }

    // Minimum price
    if (minPrice !== "") {
      result = result.filter((product) => {
        const variant = getDisplayVariant(product);

        if (!variant) {
          return false;
        }

        return (
          getFinalPrice(variant) >=
          Number(minPrice)
        );
      });
    }

    // Maximum price
    if (maxPrice !== "") {
      result = result.filter((product) => {
        const variant = getDisplayVariant(product);

        if (!variant) {
          return false;
        }

        return (
          getFinalPrice(variant) <=
          Number(maxPrice)
        );
      });
    }

    return result;
  }, [
    products,
    availability,
    minPrice,
    maxPrice,
  ]);

  // ==============================
  // SORT PRODUCTS
  // ==============================

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    if (sortBy === "name-asc") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(
          b.name || ""
        )
      );
    }

    if (sortBy === "name-desc") {
      result.sort((a, b) =>
        (b.name || "").localeCompare(
          a.name || ""
        )
      );
    }

    if (sortBy === "rating") {
      result.sort(
        (a, b) =>
          (Number(b.ratingAverage) || 0) -
          (Number(a.ratingAverage) || 0)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const variantA = getDisplayVariant(a);
        const variantB = getDisplayVariant(b);

        return (
          getFinalPrice(variantA) -
          getFinalPrice(variantB)
        );
      });
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => {
        const variantA = getDisplayVariant(a);
        const variantB = getDisplayVariant(b);

        return (
          getFinalPrice(variantB) -
          getFinalPrice(variantA)
        );
      });
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
    }

    return result;
  }, [filteredProducts, sortBy]);

  // ==============================
  // CLEAR FILTERS
  // ==============================

  const clearFilters = () => {
    setAvailability("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("relevant");
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="min-h-[70vh] bg-white">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div
                className="
                  mx-auto
                  h-9
                  w-9
                  animate-spin
                  rounded-full
                  border-2
                  border-gray-200
                  border-t-[#72c500]
                "
              />

              <p className="mt-4 text-sm text-gray-500">
                Loading products...
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <>
        <Navbar />

        <section className="min-h-[70vh] bg-white">
          <div className="flex min-h-[500px] items-center justify-center px-5">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Something went wrong
              </h2>

              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-white">

        {/* =====================================================
            COLLECTION HEADER
        ====================================================== */}

        <div className="border-b border-gray-100">
          <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">

            {/* BREADCRUMB */}

            <div className="mb-7 flex items-center justify-center gap-2 text-xs text-gray-400">

              <span>Home</span>

              <ChevronRight size={13} />

              <span>Products</span>

              {categoryName && (
                <>
                  <ChevronRight size={13} />

                  <span className="text-gray-700">
                    {categoryName}
                  </span>
                </>
              )}

            </div>

            {/* TITLE */}

            <div className="text-center">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-[#72c500]">
                OSTIK COLLECTION
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-[42px]">
                {categoryName || "All Products"}
              </h1>

              <p className="mx-auto mt-4 max-w-[600px] text-sm leading-6 text-gray-500">
                Explore our collection of reliable and modern
                technology accessories designed for everyday use.
              </p>

            </div>

          </div>
        </div>

        {/* =====================================================
            FILTER & SORT BAR
        ====================================================== */}

        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">

          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">

            {/* LEFT */}

            <div className="flex items-center gap-4">

              {/* MOBILE FILTER */}

              <button
                type="button"
                onClick={() => setShowFilter(true)}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-gray-200
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-900
                  transition
                  hover:border-gray-400
                  lg:hidden
                "
              >
                <SlidersHorizontal size={17} />

                Filter & Sort
              </button>

              {/* DESKTOP FILTER */}

              <div className="hidden items-center gap-2 lg:flex">

                <SlidersHorizontal
                  size={17}
                  strokeWidth={1.8}
                />

                <span className="text-sm font-medium text-gray-900">
                  Filters
                </span>

              </div>

              <span className="text-sm text-gray-400">
                {sortedProducts.length} products
              </span>

            </div>

            {/* SORT */}

            <div className="flex items-center gap-2">

              <span className="hidden text-sm text-gray-500 sm:block">
                Sort by:
              </span>

              <div className="relative">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="
                    cursor-pointer
                    appearance-none
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    py-2.5
                    pl-4
                    pr-10
                    text-sm
                    font-medium
                    text-gray-900
                    outline-none
                    transition
                    hover:border-gray-400
                    focus:border-[#72c500]
                  "
                >

                  <option value="relevant">
                    Most relevant
                  </option>

                  <option value="rating">
                    Best rated
                  </option>

                  <option value="price-low">
                    Price, low to high
                  </option>

                  <option value="price-high">
                    Price, high to low
                  </option>

                  <option value="name-asc">
                    Alphabetically, A-Z
                  </option>

                  <option value="name-desc">
                    Alphabetically, Z-A
                  </option>

                  <option value="newest">
                    Date, new to old
                  </option>

                  <option value="oldest">
                    Date, old to new
                  </option>

                </select>

                <ChevronDown
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                />

              </div>

            </div>

          </div>
        </div>

        {/* =====================================================
            MAIN PRODUCT SECTION
        ====================================================== */}

        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">

          <div className="flex items-start gap-8">

            {/* =================================================
                DESKTOP FILTER SIDEBAR
            ================================================== */}

            <aside className="hidden w-[250px] shrink-0 lg:block">

              <div className="sticky top-24">

                {/* FILTER HEADER */}

                <div className="flex items-center justify-between border-b border-gray-200 pb-5">

                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Filter
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Refine your results
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      text-xs
                      font-medium
                      text-gray-500
                      underline
                      underline-offset-4
                      transition
                      hover:text-[#72c500]
                    "
                  >
                    Clear all
                  </button>

                </div>

                {/* ===============================
                    AVAILABILITY
                ================================= */}

                <div className="border-b border-gray-200 py-6">

                  <button
                    type="button"
                    onClick={() =>
                      setAvailabilityOpen(
                        !availabilityOpen
                      )
                    }
                    className="flex w-full items-center justify-between"
                  >

                    <span className="text-sm font-semibold text-gray-900">
                      Availability
                    </span>

                    {availabilityOpen ? (
                      <ChevronUp
                        size={17}
                        className="text-gray-500"
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                        className="text-gray-500"
                      />
                    )}

                  </button>

                  {availabilityOpen && (
                    <div className="mt-5 space-y-4">

                      {/* ALL */}

                      <label className="flex cursor-pointer items-center justify-between">

                        <div className="flex items-center gap-3">

                          <input
                            type="radio"
                            name="availability"
                            value="all"
                            checked={
                              availability === "all"
                            }
                            onChange={(e) =>
                              setAvailability(
                                e.target.value
                              )
                            }
                            className="h-4 w-4 accent-[#72c500]"
                          />

                          <span className="text-sm text-gray-600">
                            All products
                          </span>

                        </div>

                        <span className="text-xs text-gray-400">
                          {products.length}
                        </span>

                      </label>

                      {/* IN STOCK */}

                      <label className="flex cursor-pointer items-center justify-between">

                        <div className="flex items-center gap-3">

                          <input
                            type="radio"
                            name="availability"
                            value="active"
                            checked={
                              availability === "active"
                            }
                            onChange={(e) =>
                              setAvailability(
                                e.target.value
                              )
                            }
                            className="h-4 w-4 accent-[#72c500]"
                          />

                          <span className="text-sm text-gray-600">
                            In stock
                          </span>

                        </div>

                        <span className="text-xs text-gray-400">
                          {availableCount}
                        </span>

                      </label>

                      {/* OUT OF STOCK */}

                      <label className="flex cursor-pointer items-center justify-between">

                        <div className="flex items-center gap-3">

                          <input
                            type="radio"
                            name="availability"
                            value="inactive"
                            checked={
                              availability === "inactive"
                            }
                            onChange={(e) =>
                              setAvailability(
                                e.target.value
                              )
                            }
                            className="h-4 w-4 accent-[#72c500]"
                          />

                          <span className="text-sm text-gray-600">
                            Out of stock
                          </span>

                        </div>

                        <span className="text-xs text-gray-400">
                          {unavailableCount}
                        </span>

                      </label>

                    </div>
                  )}

                </div>

                {/* ===============================
                    PRICE
                ================================= */}

                <div className="border-b border-gray-200 py-6">

                  <button
                    type="button"
                    onClick={() =>
                      setPriceOpen(!priceOpen)
                    }
                    className="flex w-full items-center justify-between"
                  >

                    <span className="text-sm font-semibold text-gray-900">
                      Price
                    </span>

                    {priceOpen ? (
                      <ChevronUp
                        size={17}
                        className="text-gray-500"
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                        className="text-gray-500"
                      />
                    )}

                  </button>

                  {priceOpen && (
                    <div className="mt-5">

                      <div className="flex items-center gap-2">

                        {/* MIN */}

                        <div className="flex flex-1 items-center rounded-md border border-gray-200 px-3">

                          <span className="text-xs text-gray-400">
                            ₹
                          </span>

                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) =>
                              setMinPrice(
                                e.target.value
                              )
                            }
                            placeholder="Min"
                            className="
                              w-full
                              bg-transparent
                              px-2
                              py-2.5
                              text-sm
                              outline-none
                              placeholder:text-gray-400
                            "
                          />

                        </div>

                        <span className="text-gray-300">
                          —
                        </span>

                        {/* MAX */}

                        <div className="flex flex-1 items-center rounded-md border border-gray-200 px-3">

                          <span className="text-xs text-gray-400">
                            ₹
                          </span>

                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) =>
                              setMaxPrice(
                                e.target.value
                              )
                            }
                            placeholder="Max"
                            className="
                              w-full
                              bg-transparent
                              px-2
                              py-2.5
                              text-sm
                              outline-none
                              placeholder:text-gray-400
                            "
                          />

                        </div>

                      </div>

                      <p className="mt-3 text-xs leading-5 text-gray-400">
                        Available price range: ₹
                        {priceRange.min.toLocaleString(
                          "en-IN"
                        )}
                        {" - "}
                        ₹
                        {priceRange.max.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  )}

                </div>

                {/* ===============================
                    CATEGORY
                ================================= */}

                <div className="border-b border-gray-200 py-6">

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryOpen(
                        !categoryOpen
                      )
                    }
                    className="flex w-full items-center justify-between"
                  >

                    <span className="text-sm font-semibold text-gray-900">
                      Category
                    </span>

                    {categoryOpen ? (
                      <ChevronUp
                        size={17}
                        className="text-gray-500"
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                        className="text-gray-500"
                      />
                    )}

                  </button>

                  {categoryOpen && (
                    <div className="mt-5">

                      <div className="flex items-center gap-3">

                        <span className="h-2 w-2 rounded-full bg-[#72c500]" />

                        <span className="text-sm text-gray-600">
                          {categoryName ||
                            "All categories"}
                        </span>

                      </div>

                    </div>
                  )}

                </div>

              </div>
            </aside>

            {/* =================================================
                PRODUCT AREA
            ================================================== */}

            <div className="min-w-0 flex-1">

              {/* NO PRODUCTS */}

              {sortedProducts.length === 0 && (
                <div className="flex min-h-[450px] items-center justify-center">

                  <div className="text-center">

                    <h2 className="text-xl font-semibold text-gray-900">
                      No products found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Try changing your filters.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="
                        mt-5
                        text-sm
                        font-medium
                        text-[#72c500]
                        underline
                        underline-offset-4
                      "
                    >
                      Clear filters
                    </button>

                  </div>

                </div>
              )}

              {/* PRODUCT GRID */}

              {sortedProducts.length > 0 && (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-x-5
                    gap-y-12
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >

                  {sortedProducts.map(
                    (product) => {

                      const variant =
                        getDisplayVariant(
                          product
                        );

                      const inStock =
                        isProductInStock(
                          product
                        );

                      const finalPrice =
                        getFinalPrice(
                          variant
                        );

                      const originalPrice =
                        Number(
                          variant?.price
                        ) || 0;

                      const discount =
                        Number(
                          variant?.discountPercent
                        ) || 0;

                      const totalStock =
                        getTotalAvailableStock(
                          product
                        );

                      return (
                        <div
                          key={product._id}
                          className="group"
                        >

                          {/* ===============================
                              IMAGE
                          ================================= */}

                          <div
                            className="
                              relative
                              aspect-square
                              overflow-hidden
                              rounded-xl
                              bg-[#f7f7f7]
                            "
                          >

                            {product.images?.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                  transition
                                  duration-500
                                  ease-out
                                  group-hover:scale-[1.04]
                                  cursor-pointer
                                "
                                onClick={()=>navigate(`/product/${product._id}`)}
                              />
                            ) : (
                              <div
                                className="
                                  flex
                                  h-full
                                  items-center
                                  justify-center
                                  text-sm
                                  text-gray-400
                                "
                              >
                                No Image
                              </div>
                            )}

                            {/* NEW */}

                            {product.isNewArrival && (
                              <span
                                className="
                                  absolute
                                  left-4
                                  top-4
                                  rounded-full
                                  bg-white
                                  px-3
                                  py-1.5
                                  text-[10px]
                                  font-semibold
                                  uppercase
                                  tracking-wider
                                  text-gray-800
                                  shadow-sm
                                "
                              >
                                New arrival
                              </span>
                            )}

                            {/* DISCOUNT */}

                            {discount > 0 && (
                              <span
                                className="
                                  absolute
                                  left-4
                                  bottom-4
                                  rounded-full
                                  bg-red-500
                                  px-3
                                  py-1.5
                                  text-[10px]
                                  font-semibold
                                  text-white
                                "
                              >
                                -{discount}%
                              </span>
                            )}

                            {/* WISHLIST */}

                            <button
                              type="button"
                              className="
                                absolute
                                right-4
                                top-4
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-gray-800
                                shadow-sm
                                transition
                                duration-200
                                hover:bg-[#72c500]
                                hover:text-white
                              "
                              aria-label="Add to wishlist"
                            >
                              <Heart
                                size={18}
                                strokeWidth={1.8}
                              />
                            </button>

                          </div>

                          {/* ===============================
                              DETAILS
                          ================================= */}

                          <div className="pt-4">

                            {/* CATEGORY */}

                            {product.category?.name && (
                              <p
                                className="
                                  mb-1
                                  text-[10px]
                                  font-semibold
                                  uppercase
                                  tracking-[1.5px]
                                  text-gray-400
                                "
                              >
                                {product.category.name}
                              </p>
                            )}

                            {/* NAME */}

                            <h2
                              className="
                                line-clamp-2
                                min-h-[48px]
                                text-[16px]
                                font-semibold
                                leading-6
                                text-gray-900
                                transition
                                group-hover:text-[#72c500]
                                cursor-pointer
                              "
                              onClick={()=>navigate(`/product/${product._id}`)}
                            >
                              {product.name}
                            </h2>

                            {/* RATING */}

                            <div className="mt-2 flex items-center gap-2">

                              <div className="flex items-center gap-0.5">

                                {[1, 2, 3, 4, 5].map(
                                  (star) => {

                                    const rating =
                                      Math.round(
                                        Number(
                                          product.ratingAverage
                                        ) || 0
                                      );

                                    return (
                                      <Star
                                        key={star}
                                        size={13}
                                        fill={
                                          star <=
                                          rating
                                            ? "#f5b301"
                                            : "none"
                                        }
                                        className={
                                          star <=
                                          rating
                                            ? "text-[#f5b301]"
                                            : "text-gray-300"
                                        }
                                      />
                                    );
                                  }
                                )}

                              </div>

                              <span className="text-xs text-gray-400">
                                (
                                {product.ratingCount ||
                                  0}
                                )
                              </span>

                            </div>

                            {/* PRICE */}

                            <div className="mt-3 flex items-center gap-2">

                              {variant ? (
                                <>
                                  <span className="text-lg font-bold text-gray-900">
                                    ₹
                                    {Math.round(
                                      finalPrice
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>

                                  {discount > 0 && (
                                    <span
                                      className="
                                        text-sm
                                        text-gray-400
                                        line-through
                                      "
                                    >
                                      ₹
                                      {Math.round(
                                        originalPrice
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">
                                  Price unavailable
                                </span>
                              )}

                            </div>

                            {/* VARIANT */}

                            {variant?.name && (
                              <p className="mt-2 text-xs text-gray-500">
                                Variant:{" "}
                                <span className="font-medium text-gray-700">
                                  {variant.name}
                                </span>
                              </p>
                            )}

                            {/* SKU */}

                            {variant?.sku && (
                              <p className="mt-1 text-xs text-gray-400">
                                SKU: {variant.sku}
                              </p>
                            )}

                            {/* STOCK */}

                            <div className="mt-2">

                              {inStock ? (
                                <p className="text-xs font-medium text-green-600">
                                  In stock ·{" "}
                                  {totalStock} available
                                </p>
                              ) : (
                                <p className="text-xs font-medium text-red-500">
                                  Out of stock
                                </p>
                              )}

                            </div>

                            {/* ADD TO CART */}

                            <button
                              type="button"
                              disabled={
                                !inStock ||
                                !variant
                              }
                              className={`
                                mt-4
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                transition
                                cursor-pointer
                                duration-300
                                ${
                                  inStock &&
                                  variant
                                    ? "bg-[#00ff03] text-black hover:bg-[#00c800] hover:text-white"
                                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                                }
                              `}
                            >
                              <ShoppingCart size={16} />

                              {inStock &&
                              variant
                                ? "Add to cart"
                                : "Out of stock"}
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </div>
        </div>

        {/* =====================================================
            MOBILE FILTER DRAWER
        ====================================================== */}

        {showFilter && (
          <div className="fixed inset-0 z-[300] lg:hidden">

            {/* BACKDROP */}

            <div
              className="
                absolute
                inset-0
                bg-black/40
              "
              onClick={() =>
                setShowFilter(false)
              }
            />

            {/* DRAWER */}

            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-[88%]
                max-w-[380px]
                overflow-y-auto
                bg-white
                shadow-2xl
              "
            >

              {/* HEADER */}

              <div
                className="
                  sticky
                  top-0
                  z-10
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-200
                  bg-white
                  px-5
                  py-5
                "
              >

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Filter & Sort
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {sortedProducts.length} products
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowFilter(false)
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                    text-gray-700
                  "
                >
                  <X size={19} />
                </button>

              </div>

              {/* SORT */}

              <div
                className="
                  border-b
                  border-gray-200
                  px-5
                  py-6
                "
              >

                <p className="mb-5 text-sm font-semibold text-gray-900">
                  Sort by
                </p>

                <div className="space-y-4">

                  {[
                    ["relevant", "Most relevant"],
                    ["rating", "Best rated"],
                    ["price-low", "Price, low to high"],
                    ["price-high", "Price, high to low"],
                    ["name-asc", "Alphabetically, A-Z"],
                    ["name-desc", "Alphabetically, Z-A"],
                    ["newest", "Date, new to old"],
                    ["oldest", "Date, old to new"],
                  ].map(
                    ([value, label]) => (
                      <label
                        key={value}
                        className="
                          flex
                          cursor-pointer
                          items-center
                          gap-3
                        "
                      >

                        <input
                          type="radio"
                          name="mobile-sort"
                          value={value}
                          checked={
                            sortBy === value
                          }
                          onChange={(e) =>
                            setSortBy(
                              e.target.value
                            )
                          }
                          className="
                            h-4
                            w-4
                            accent-[#72c500]
                          "
                        />

                        <span className="text-sm text-gray-600">
                          {label}
                        </span>

                      </label>
                    )
                  )}

                </div>

              </div>

              {/* AVAILABILITY */}

              <div
                className="
                  border-b
                  border-gray-200
                  px-5
                  py-6
                "
              >

                <p className="mb-5 text-sm font-semibold text-gray-900">
                  Availability
                </p>

                <div className="space-y-4">

                  {[
                    [
                      "all",
                      "All products",
                      products.length,
                    ],
                    [
                      "active",
                      "In stock",
                      availableCount,
                    ],
                    [
                      "inactive",
                      "Out of stock",
                      unavailableCount,
                    ],
                  ].map(
                    ([value, label, count]) => (
                      <label
                        key={value}
                        className="
                          flex
                          cursor-pointer
                          items-center
                          justify-between
                        "
                      >

                        <div className="flex items-center gap-3">

                          <input
                            type="radio"
                            name="mobile-availability"
                            value={value}
                            checked={
                              availability ===
                              value
                            }
                            onChange={(e) =>
                              setAvailability(
                                e.target.value
                              )
                            }
                            className="
                              h-4
                              w-4
                              accent-[#72c500]
                            "
                          />

                          <span className="text-sm text-gray-600">
                            {label}
                          </span>

                        </div>

                        <span className="text-xs text-gray-400">
                          {count}
                        </span>

                      </label>
                    )
                  )}

                </div>

              </div>

              {/* PRICE */}

              <div className="px-5 py-6">

                <p className="mb-5 text-sm font-semibold text-gray-900">
                  Price
                </p>

                <div className="flex items-center gap-2">

                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value
                      )
                    }
                    placeholder="Min"
                    className="
                      w-full
                      rounded-md
                      border
                      border-gray-200
                      px-3
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#72c500]
                    "
                  />

                  <span className="text-gray-300">
                    —
                  </span>

                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value
                      )
                    }
                    placeholder="Max"
                    className="
                      w-full
                      rounded-md
                      border
                      border-gray-200
                      px-3
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#72c500]
                    "
                  />

                </div>

                <p className="mt-3 text-xs leading-5 text-gray-400">
                  Available price range: ₹
                  {priceRange.min.toLocaleString(
                    "en-IN"
                  )}
                  {" - "}
                  ₹
                  {priceRange.max.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

              {/* MOBILE ACTIONS */}

              <div
                className="
                  sticky
                  bottom-0
                  border-t
                  border-gray-200
                  bg-white
                  p-5
                "
              >

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      flex-1
                      rounded-full
                      border
                      border-gray-300
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowFilter(false)
                    }
                    className="
                      flex-1
                      rounded-full
                      bg-[#00ff03]
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-black
                      transition
                      hover:bg-[#00c800]
                      hover:text-white
                    "
                  >
                    Show{" "}
                    {sortedProducts.length} results
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </section>

      <Footer />
    </>
  );
};

export default Products;