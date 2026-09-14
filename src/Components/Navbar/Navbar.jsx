import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Globe,
  Heart,
  UserRound,
  ShoppingCart,
  Mic,
  Search,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  // =========================================================
  // BASIC STATES
  // =========================================================

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLinks, setShowLinks] = useState(true);

  // Desktop Products dropdown
  const [productsOpen, setProductsOpen] = useState(false);

  // Mobile Products dropdown
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  // Currently expanded category
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Categories from backend
  const [categories, setCategories] = useState([]);

  // =========================================================
  // SEARCH STATES
  // =========================================================

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Reference for desktop Products menu
  const productsMenuRef = useRef(null);

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/category`
        );

        setCategories(response.data.categories || []);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // =========================================================
  // MAIN CATEGORIES
  // parentCategory === null
  // =========================================================

  const mainCategories = categories.filter(
    (category) => !category.parentCategory
  );

  // =========================================================
  // GET SUBCATEGORIES
  // =========================================================

  const getSubCategories = (parentId) => {
    return categories.filter((category) => {
      if (!category.parentCategory) {
        return false;
      }

      const parentIdValue =
        typeof category.parentCategory === "object"
          ? category.parentCategory._id
          : category.parentCategory;

      return parentIdValue === parentId;
    });
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearchChange = async (value) => {
    setSearchQuery(value);

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchOpen(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product`,
        {
          params: {
            search: trimmedValue,
          },
        }
      );

      setSearchResults(response.data.products || []);
    } catch (error) {
      console.log("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================================================
  // SEARCH SUBMIT
  // =========================================================

  const handleSearchSubmit = () => {
    const trimmedValue = searchQuery.trim();

    if (!trimmedValue) {
      return;
    }

    setSearchOpen(false);

    navigate(
      `/products?search=${encodeURIComponent(trimmedValue)}`
    );
  };

  // =========================================================
  // SEARCH RESULT CLICK
  // =========================================================

  const handleSearchResultClick = (product) => {
    setSearchOpen(false);

    setSearchQuery(product.name);

    navigate(
      `/products?search=${encodeURIComponent(product.name)}`
    );
  };

  // =========================================================
  // CATEGORY CLICK
  // =========================================================

  const handleCategoryClick = (category) => {
    setProductsOpen(false);
    setMobileProductsOpen(false);
    setMenuOpen(false);
    setExpandedCategory(null);

    navigate(`/products?category=${category.slug}`);
  };

  // =========================================================
  // MAIN CATEGORY EXPAND / COLLAPSE
  // =========================================================

  const handleMainCategoryClick = (categoryId) => {
    setExpandedCategory((previous) =>
      previous === categoryId ? null : categoryId
    );
  };

  // =========================================================
  // OPEN PRODUCTS MENU
  // =========================================================

  const handleProductsToggle = () => {
    setProductsOpen((previous) => {
      const nextState = !previous;

      if (!nextState) {
        setExpandedCategory(null);
      }

      return nextState;
    });
  };

  // =========================================================
  // MOBILE PRODUCTS TOGGLE
  // =========================================================

  const handleMobileProductsToggle = () => {
    setMobileProductsOpen((previous) => {
      const nextState = !previous;

      if (!nextState) {
        setExpandedCategory(null);
      }

      return nextState;
    });
  };

  // =========================================================
  // CLICK OUTSIDE DESKTOP PRODUCTS MENU
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productsMenuRef.current &&
        !productsMenuRef.current.contains(event.target)
      ) {
        setProductsOpen(false);
        setExpandedCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // CLICK OUTSIDE SEARCH
  // =========================================================

  useEffect(() => {
    const handleSearchOutside = (event) => {
      const searchContainers =
        document.querySelectorAll("[data-search-container]");

      let clickedInside = false;

      searchContainers.forEach((container) => {
        if (container.contains(event.target)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleSearchOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleSearchOutside
      );
    };
  }, []);

  // =========================================================
  // DESKTOP NAVBAR SCROLL BEHAVIOR
  // =========================================================

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navigation at top
      if (currentScrollY <= 20) {
        setShowLinks(true);
        lastScrollY = currentScrollY;
        return;
      }

      const difference = currentScrollY - lastScrollY;

      // Ignore small movements
      if (Math.abs(difference) < 6) {
        return;
      }

      // Scrolling down
      if (difference > 0) {
        setShowLinks(false);
        setProductsOpen(false);
        setExpandedCategory(null);
        setSearchOpen(false);
      }

      // Scrolling up
      else {
        setShowLinks(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // CLOSE MOBILE MENU WHEN DESKTOP PRODUCTS OPENS
  // =========================================================

  useEffect(() => {
    if (productsOpen) {
      setMobileProductsOpen(false);
    }
  }, [productsOpen]);

  // =========================================================
  // CLOSE PRODUCTS WHEN MOBILE MENU CLOSES
  // =========================================================

  useEffect(() => {
    if (!menuOpen) {
      setMobileProductsOpen(false);
      setExpandedCategory(null);
    }
  }, [menuOpen]);

  return (
    <header
      className="
        sticky
        top-0
        z-[100]
        w-full
        bg-[#2b2b2b]
        border-b
        border-gray-200
        font-['Helvetica',_Arial,_sans-serif]
      "
    >

      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <div className="hidden xl:block">

        {/* =====================================================
            TOP SECTION
        ====================================================== */}

        <div className="h-[120px] px-8 flex items-center">

          {/* SEARCH */}

          <div className="flex-1 min-w-0">

            <div
              data-search-container
              className="
                relative
                w-full
                max-w-[675px]
              "
            >

              {/* SEARCH BOX */}

              <div
                className="
                  h-[54px]
                  w-full
                  flex
                  items-center
                  border
                  border-gray-200
                  rounded-full
                  overflow-hidden
                  bg-white
                "
              >

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    handleSearchChange(event.target.value)
                  }
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setSearchOpen(true);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="Search products..."
                  className="
                    flex-1
                    min-w-0
                    h-full
                    px-6
                    outline-none
                    text-[17px]
                    text-gray-700
                    placeholder:text-gray-400
                  "
                />

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="
                    w-[58px]
                    h-full
                    shrink-0
                    flex
                    items-center
                    justify-center
                    bg-[#00ff03]
                    text-gray-500
                  "
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

              </div>

              {/* SEARCH RESULTS */}

              {searchOpen && searchQuery.trim() && (
                <div
                  className="
                    absolute
                    top-[62px]
                    left-0
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-2xl
                    z-[300]
                    overflow-hidden
                  "
                >

                  {searchLoading ? (

                    <div className="px-5 py-5 text-sm text-gray-500">
                      Searching...
                    </div>

                  ) : searchResults.length > 0 ? (

                    <div className="max-h-[380px] overflow-y-auto">

                      {searchResults.slice(0, 6).map((product) => (

                        <button
                          key={product._id}
                          type="button"
                          onClick={() =>
                            handleSearchResultClick(product)
                          }
                          className="
                            w-full
                            flex
                            items-center
                            gap-4
                            px-5
                            py-3
                            text-left
                            hover:bg-gray-50
                            transition-colors
                          "
                        >

                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="
                              w-[52px]
                              h-[52px]
                              rounded-xl
                              object-cover
                              border
                              border-gray-100
                              shrink-0
                            "
                          />

                          <div className="min-w-0 flex-1">

                            <p
                              className="
                                text-sm
                                font-semibold
                                text-gray-900
                                truncate
                              "
                            >
                              {product.name}
                            </p>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                              "
                            >
                              {product.category?.name || "Product"}
                            </p>

                          </div>

                          <ChevronRight
                            size={18}
                            className="shrink-0 text-gray-400"
                          />

                        </button>

                      ))}

                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="
                          w-full
                          border-t
                          border-gray-100
                          px-5
                          py-4
                          text-sm
                          font-semibold
                          text-gray-700
                          hover:bg-gray-50
                          hover:text-black
                          text-left
                        "
                      >
                        View all results for "{searchQuery}"
                      </button>

                    </div>

                  ) : (

                    <div className="px-5 py-5 text-sm text-gray-500">
                      No products found for "{searchQuery}"
                    </div>

                  )}

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="
              shrink-0
              px-10
              flex
              items-center
              justify-center
            "
          >

            <img
              src="/OstikLogo/OSTIK_PNG.png"
              alt="OSTIK"
              className="
                w-[150px]
                h-auto
                object-contain
                drop-shadow-[0_8px_8px_rgba(0,0,0,0.18)]
              "
            />

          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="flex-1 min-w-0 flex justify-end">

            <div className="flex items-center gap-6">

              {/* COUNTRY */}

              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-2
                  text-[16px]
                  font-semibold
                  text-white
                "
              >

                <Globe
                  size={20}
                  className="text-white"
                />

                <span className="text-white">
                  India · ₹INR
                </span>

                <ChevronDown
                  size={16}
                  className="text-white"
                />

              </button>

              {/* WISHLIST */}

              <button
                type="button"
                onClick={() => navigate("/wishlist")}
                className="
                  text-white
                  hover:text-[#00ff03]
                  transition
                  duration-300
                "
                aria-label="Wishlist"
              >

                <Heart
                  size={25}
                  strokeWidth={1.8}
                  className="text-white"
                />

              </button>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  text-white
                  hover:text-[#00ff03]
                  transition
                  duration-300
                "
                aria-label="Profile"
              >

                <UserRound
                  size={24}
                  strokeWidth={1.8}
                  className="text-white"
                />

              </button>

              {/* CART */}

              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="
                  relative
                  text-white
                  hover:text-[#00ff03]
                  transition
                  duration-300
                "
                aria-label="Cart"
              >

                <ShoppingCart
                  size={25}
                  strokeWidth={1.8}
                  className="text-white"
                />

                <span
                  className="
                    absolute
                    -top-3
                    -right-3
                    w-[21px]
                    h-[21px]
                    rounded-full
                    bg-[#00ff03]
                    text-black
                    text-[11px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  2
                </span>

              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            BOTTOM NAVIGATION
        ====================================================== */}

        <div
          className={`
            relative
            border-t
            border-gray-200
            bg-white
            transition-all
            duration-500
            ease-[cubic-bezier(0.4,0,0.2,1)]
            ${
              showLinks
                ? "h-[86px] opacity-100"
                : "h-0 opacity-0 pointer-events-none"
            }
          `}
        >

          <div
            className={`
              h-[86px]
              px-8
              flex
              items-center
              justify-between
              transition-transform
              duration-500
              ease-[cubic-bezier(0.4,0,0.2,1)]
              ${
                showLinks
                  ? "translate-y-0"
                  : "-translate-y-4"
              }
            `}
          >

            {/* =================================================
                LEFT LINKS
            ================================================= */}

            <nav className="flex items-center gap-14">

              {/* HOME */}

              <a
                href="/"
                className="
                  text-[17px]
                  font-bold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
              >
                Home
              </a>

              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div
                ref={productsMenuRef}
                className="
                  relative
                  h-full
                  flex
                  items-center
                "
              >

                {/* PRODUCTS BUTTON */}

                <button
                  type="button"
                  onClick={handleProductsToggle}
                  className="
                    flex
                    items-center
                    gap-2
                    text-[18px]
                    font-bold
                    text-gray-600
                    hover:text-[#00e603]
                    transition-colors
                    duration-300
                  "
                >

                  <span>Products</span>

                  <ChevronDown
                    size={17}
                    className={`
                      transition-transform
                      duration-300
                      ${
                        productsOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />

                </button>

                {/* =================================================
                    DESKTOP MEGA MENU
                ================================================= */}

                {productsOpen && (

                  <div
                    className="
                      absolute
                      top-[86px]
                      left-0
                      w-[550px]
                      max-h-[520px]
                      overflow-y-auto
                      rounded-b-2xl
                      border
                      border-gray-200
                      bg-white
                      shadow-2xl
                      z-[200]
                      p-8
                    "
                  >

                    {/* MENU HEADER */}

                    <div className="mb-6">

                      <button
                        type="button"
                        onClick={() => {
                          setProductsOpen(false);
                          setExpandedCategory(null);
                          navigate("/products");
                        }}
                        className="
                          text-[20px]
                          font-bold
                          text-gray-900
                          hover:text-[#00e603]
                          transition-colors
                        "
                      >
                        All Products
                      </button>

                    </div>

                    {/* =================================================
                        CATEGORY LIST
                    ================================================= */}

                    {mainCategories.length > 0 ? (

                      <div className="grid grid-cols-2 gap-x-10">

                        {mainCategories.map((category) => {

                          const subCategories =
                            getSubCategories(
                              category._id
                            );

                          const isExpanded =
                            expandedCategory ===
                            category._id;

                          return (

                            <div
                              key={category._id}
                              className="
                                border-b
                                border-gray-100
                              "
                            >

                              {/* MAIN CATEGORY BUTTON */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleMainCategoryClick(
                                    category._id
                                  )
                                }
                                className="
                                  w-full
                                  flex
                                  items-center
                                  justify-between
                                  py-4
                                  text-left
                                  text-[16px]
                                  font-bold
                                  text-gray-800
                                  hover:text-[#00e603]
                                  transition-colors
                                "
                              >

                                <span>
                                  {category.name}
                                </span>

                                {subCategories.length >
                                  0 && (

                                  <ChevronRight
                                    size={18}
                                    className={`
                                      transition-transform
                                      duration-300
                                      ${
                                        isExpanded
                                          ? "rotate-90"
                                          : ""
                                      }
                                    `}
                                  />

                                )}

                              </button>

                              {/* SUBCATEGORY LIST */}

                              {isExpanded &&
                                subCategories.length >
                                  0 && (

                                  <div
                                    className="
                                      pb-4
                                      pl-4
                                      flex
                                      flex-col
                                      gap-3
                                      border-l-2
                                      border-gray-100
                                    "
                                  >

                                    {subCategories.map(
                                      (subCategory) => (

                                        <button
                                          key={
                                            subCategory._id
                                          }
                                          type="button"
                                          onClick={() =>
                                            handleCategoryClick(
                                              subCategory
                                            )
                                          }
                                          className="
                                            text-left
                                            text-[14px]
                                            text-gray-500
                                            hover:text-[#00e603]
                                            transition-colors
                                            duration-200
                                          "
                                        >
                                          {
                                            subCategory.name
                                          }
                                        </button>

                                      )
                                    )}

                                  </div>

                                )}

                            </div>

                          );
                        })}

                      </div>

                    ) : (

                      <p
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        No categories available
                      </p>

                    )}

                  </div>

                )}

              </div>

              {/* IN CAR */}

              <a
                href="/in-car"
                className="
                  text-[18px]
                  font-bold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
              >
                In Car
              </a>

              {/* POWER BANKS */}

              <a
                href="/power-banks"
                className="
                  text-[18px]
                  font-bold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
              >
                Power Banks
              </a>

              {/* BUNDLES */}

              <a
                href="/bundles"
                className="
                  text-[18px]
                  font-bold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
              >
                Bundles
              </a>

              {/* CONTACT */}

              <a
                href="/contact"
                className="
                  text-[18px]
                  font-bold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
                onClick={()=>navigate("/contact")}
              >
                Contact
              </a>

              {/* OFFERS */}

              <a
                href="/offers"
                className="
                  text-[18px]
                  font-bold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
              >
                Offers
              </a>

            </nav>

            {/* =================================================
                RIGHT LINKS
            ================================================= */}

            <div
              className="
                flex
                items-center
                gap-8
                pl-8
                border-l
                border-gray-300
              "
            >

              {/* ORDERS */}

              <a
                href="/orders"
                className="
                  text-[15px]
                  text-gray-500
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
              >
                Orders
              </a>

              {/* PROFILE */}

              <a
                href="/profile"
                className="
                  text-[15px]
                  text-gray-500
                  hover:text-[#00e603]
                  transition-colors
                  duration-300
                "
              >
                Profile
              </a>

              {/* WHATSAPP */}

              <a
                href="/whatsapp"
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-full
                  bg-[#22c96b]
                  text-white
                  text-[16px]
                  font-semibold
                  hover:opacity-90
                  transition-opacity
                  duration-300
                "
              >

                <MessageCircle
                  size={18}
                  fill="white"
                />

                <span>WhatsApp</span>

              </a>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          TABLET + MOBILE
      ====================================================== */}

      <div className="xl:hidden">

        {/* =====================================================
            MOBILE TOP
        ====================================================== */}

        <div
          className="
            h-[78px]
            px-5
            flex
            items-center
            justify-between
          "
        >

          {/* MENU BUTTON */}

          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="p-2 text-white"
            aria-label="Menu"
          >

            {menuOpen ? (
              <X
                size={27}
                className="text-white"
              />
            ) : (
              <Menu
                size={27}
                className="text-white"
              />
            )}

          </button>

          {/* LOGO */}

          <a
            href="/"
            className="flex items-center"
          >

            <img
              src="/OstikLogo/OSTIK_PNG.png"
              alt="OSTIK"
              className="
                w-[150px]
                h-auto
                object-contain
                drop-shadow-[0_8px_8px_rgba(0,0,0,0.18)]
              "
            />

          </a>

          {/* MOBILE ACTIONS */}

          <div className="flex items-center gap-4">

            {/* COUNTRY */}

            <button
              type="button"
              className="
                hidden
                sm:flex
                items-center
                gap-1
                text-sm
                font-semibold
                text-white
              "
            >

              <Globe
                size={18}
                className="text-white"
              />

              <span className="text-white">
                India · ₹INR
              </span>

              <ChevronDown
                size={14}
                className="text-white"
              />

            </button>

            {/* WISHLIST */}

            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="text-white"
              aria-label="Wishlist"
            >

              <Heart
                size={24}
                strokeWidth={1.8}
                className="text-white"
              />

            </button>

            {/* PROFILE */}

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-white"
              aria-label="Profile"
            >

              <UserRound
                size={23}
                strokeWidth={1.8}
                className="text-white"
              />

            </button>

            {/* CART */}

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="
                relative
                text-white
              "
              aria-label="Cart"
            >

              <ShoppingCart
                size={24}
                strokeWidth={1.8}
                className="text-white"
              />

              <span
                className="
                  absolute
                  -top-3
                  -right-3
                  w-[20px]
                  h-[20px]
                  rounded-full
                  bg-[#00ff03]
                  text-white
                  text-[10px]
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                2
              </span>

            </button>

          </div>

        </div>

        {/* =====================================================
            MOBILE SEARCH
        ====================================================== */}

        <div className="px-5 pb-4">

          <div
            data-search-container
            className="
              relative
              w-full
            "
          >

            {/* SEARCH BOX */}

            <div
              className="
                h-[58px]
                w-full
                flex
                items-center
                border
                border-gray-200
                rounded-full
                overflow-hidden
                bg-white
              "
            >

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  handleSearchChange(event.target.value)
                }
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setSearchOpen(true);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Search products..."
                className="
                  flex-1
                  min-w-0
                  h-full
                  px-5
                  outline-none
                  text-[16px]
                  placeholder:text-gray-400
                "
              />

              <button
                type="button"
                onClick={handleSearchSubmit}
                className="
                  h-full
                  w-[68px]
                  shrink-0
                  flex
                  items-center
                  justify-center
                  bg-[#00ff03]
                  text-gray-500
                "
                aria-label="Search"
              >

                <Search size={21} />

              </button>

            </div>

            {/* MOBILE SEARCH RESULTS */}

            {searchOpen && searchQuery.trim() && (
              <div
                className="
                  absolute
                  top-[66px]
                  left-0
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  shadow-2xl
                  z-[300]
                  overflow-hidden
                "
              >

                {searchLoading ? (

                  <div className="px-5 py-5 text-sm text-gray-500">
                    Searching...
                  </div>

                ) : searchResults.length > 0 ? (

                  <div className="max-h-[380px] overflow-y-auto">

                    {searchResults.slice(0, 6).map((product) => (

                      <button
                        key={product._id}
                        type="button"
                        onClick={() =>
                          handleSearchResultClick(product)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          gap-4
                          px-5
                          py-3
                          text-left
                          hover:bg-gray-50
                          transition-colors
                        "
                      >

                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="
                            w-[52px]
                            h-[52px]
                            rounded-xl
                            object-cover
                            border
                            border-gray-100
                            shrink-0
                          "
                        />

                        <div className="min-w-0 flex-1">

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-gray-900
                              truncate
                            "
                          >
                            {product.name}
                          </p>

                          <p
                            className="
                              text-xs
                              text-gray-500
                              mt-1
                            "
                          >
                            {product.category?.name || "Product"}
                          </p>

                        </div>

                        <ChevronRight
                          size={18}
                          className="shrink-0 text-gray-400"
                        />

                      </button>

                    ))}

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="
                        w-full
                        border-t
                        border-gray-100
                        px-5
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                        hover:bg-gray-50
                        hover:text-black
                        text-left
                      "
                    >
                      View all results for "{searchQuery}"
                    </button>

                  </div>

                ) : (

                  <div className="px-5 py-5 text-sm text-gray-500">
                    No products found for "{searchQuery}"
                  </div>

                )}

              </div>
            )}

          </div>

        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        {menuOpen && (

          <div
            className="
              border-t
              border-gray-200
              px-5
              py-5
              bg-white
            "
          >

            <nav className="flex flex-col gap-5">

              {/* HOME */}

              <a
                href="/"
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                Home
              </a>

              {/* =================================================
                  MOBILE PRODUCTS
              ================================================= */}

              <div>

                <button
                  type="button"
                  onClick={handleMobileProductsToggle}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    text-left
                    text-lg
                    font-semibold
                    text-gray-600
                    hover:text-[#00e603]
                    transition-colors
                  "
                >

                  <span>Products</span>

                  <ChevronDown
                    size={20}
                    className={`
                      transition-transform
                      duration-300
                      ${
                        mobileProductsOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />

                </button>

                {/* MOBILE CATEGORY LIST */}

                {mobileProductsOpen && (

                  <div
                    className="
                      mt-4
                      rounded-xl
                      bg-gray-50
                      p-4
                    "
                  >

                    {mainCategories.length > 0 ? (

                      <div className="flex flex-col">

                        {mainCategories.map(
                          (category) => {

                            const subCategories =
                              getSubCategories(
                                category._id
                              );

                            const isExpanded =
                              expandedCategory ===
                              category._id;

                            return (

                              <div
                                key={category._id}
                                className="
                                  border-b
                                  border-gray-200
                                  last:border-b-0
                                "
                              >

                                {/* MAIN CATEGORY */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMainCategoryClick(
                                      category._id
                                    )
                                  }
                                  className="
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    py-4
                                    text-left
                                    text-base
                                    font-bold
                                    text-gray-700
                                    hover:text-[#00e603]
                                    transition-colors
                                  "
                                >

                                  <span>
                                    {category.name}
                                  </span>

                                  {subCategories.length >
                                    0 && (

                                    <ChevronRight
                                      size={18}
                                      className={`
                                        transition-transform
                                        duration-300
                                        ${
                                          isExpanded
                                            ? "rotate-90"
                                            : ""
                                        }
                                      `}
                                    />

                                  )}

                                </button>

                                {/* SUBCATEGORIES */}

                                {isExpanded &&
                                  subCategories.length >
                                    0 && (

                                    <div
                                      className="
                                        pb-4
                                        pl-4
                                        flex
                                        flex-col
                                        gap-3
                                        border-l-2
                                        border-gray-200
                                      "
                                    >

                                      {subCategories.map(
                                        (subCategory) => (

                                          <button
                                            key={
                                              subCategory._id
                                            }
                                            type="button"
                                            onClick={() =>
                                              handleCategoryClick(
                                                subCategory
                                              )
                                            }
                                            className="
                                              text-left
                                              text-sm
                                              text-gray-500
                                              hover:text-[#00e603]
                                              transition-colors
                                            "
                                          >
                                            {
                                              subCategory.name
                                            }
                                          </button>

                                        )
                                      )}

                                    </div>

                                  )}

                              </div>

                            );
                          }
                        )}

                      </div>

                    ) : (

                      <p
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        No categories available
                      </p>

                    )}

                  </div>

                )}

              </div>

              {/* IN CAR */}

              <a
                href="/in-car"
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                In Car
              </a>

              {/* POWER BANKS */}

              <a
                href="/power-banks"
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                Power Banks
              </a>

              {/* BUNDLES */}

              <a
                href="/bundles"
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                Bundles
              </a>

              {/* CONTACT */}

              <a
                href="/contact"
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                Contact
              </a>

              {/* OFFERS */}

              <a
                href="/offers"
                className="
                  text-lg
                  font-semibold
                  text-gray-600
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                Offers
              </a>

              <hr />

              {/* ORDERS */}

              <a
                href="/orders"
                className="
                  text-lg
                  text-gray-500
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                Orders
              </a>

              {/* PROFILE */}

              <a
                href="/profile"
                className="
                  text-lg
                  text-gray-500
                  hover:text-[#00e603]
                  transition-colors
                "
              >
                Profile
              </a>

              {/* WHATSAPP */}

              <a
                href="/whatsapp"
                className="
                  w-fit
                  flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-full
                  bg-[#22c96b]
                  text-white
                  font-semibold
                "
              >

                <MessageCircle
                  size={18}
                  fill="white"
                />

                <span>WhatsApp</span>

              </a>

            </nav>

          </div>

        )}

      </div>

    </header>
  );
};

export default Navbar;