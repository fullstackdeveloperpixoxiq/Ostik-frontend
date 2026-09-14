import axios from "axios";
import { useEffect, useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/category"
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

  // Loading
  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mb-10 h-9 w-40 animate-pulse rounded " />

        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="min-w-[180px] flex-shrink-0 sm:min-w-[210px]"
            >
              <div className="aspect-square animate-pulse rounded-2xl" />
              <div className="mx-auto mt-4 h-5 w-24 animate-pulse rounded " />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // No categories
  if (!categories.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10">

      {/* Heading */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Categories
        </h2>
      </div>

      {/* Horizontal Scroll */}
      <div
        className="flex gap-5 overflow-x-auto pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((category) => (
          <a
            key={category._id}
            href={`/products?category=${category.slug}`}
            className="group w-[180px] flex-shrink-0 sm:w-[210px] lg:w-[230px]"
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden rounded-2xl ">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              />
            </div>

            {/* Category Name */}
            <h3 className="mt-4 text-center text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#00e603] sm:text-lg">
              {category.name}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Category;