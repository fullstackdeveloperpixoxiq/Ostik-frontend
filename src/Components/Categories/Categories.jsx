import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/category`
        );

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================================================
  // ONLY MAIN CATEGORIES
  // parentCategory === null
  // =========================================================
  const mainCategories = categories.filter(
    (category) => !category.parentCategory
  );

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-10 h-9 w-40 animate-pulse rounded" />

        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="min-w-[180px] flex-shrink-0 sm:min-w-[210px]"
            >
              <div className="aspect-square animate-pulse rounded-2xl" />

              <div className="mx-auto mt-4 h-5 w-24 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // =========================================================
  // NO MAIN CATEGORIES
  // =========================================================
  if (!mainCategories.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10">
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Categories
        </h2>
      </div>

      {/* CATEGORY LIST */}
      <div
        className="flex gap-3 sm:gap-5 overflow-x-auto pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {mainCategories.map((category) => (
          <Link
            key={category._id}
            to={`/products?category=${encodeURIComponent(
              category.slug
            )}`}
            className="group w-[145px] flex-shrink-0 sm:w-[210px] lg:w-[230px]"
          >
            {/* IMAGE */}
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              />
            </div>

            {/* NAME */}
            <h3 className="mt-3 text-center text-sm font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#00e603] sm:mt-4 sm:text-lg">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Category;