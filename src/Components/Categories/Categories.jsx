import useCachedGet from "../../utils/useCachedGet";
import { STATIC_TTL } from "../../utils/apiCache";
import SmartImage from "../Common/SmartImage";
import { Link } from "react-router-dom";

const Category = () => {
  // Shared with the navbar and product listing (one request per visit).
  const { data, loading } = useCachedGet("/api/category", { ttl: STATIC_TTL });
  const categories = data?.categories || [];

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
      // Mirrors the loaded layout (padding, tile widths, title size) so the
      // page below doesn't shift when categories arrive.
      <section
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10"
        aria-busy="true"
      >
        <div className="mb-10 h-8 w-40 animate-pulse rounded bg-gray-100 sm:h-10" />

        <div className="flex gap-3 overflow-hidden pb-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="w-[145px] flex-shrink-0 sm:w-[210px] lg:w-[230px]"
            >
              <div className="aspect-square animate-pulse rounded-2xl bg-gray-100" />

              <div className="mx-auto mt-3 h-5 w-24 animate-pulse rounded bg-gray-100 sm:mt-4 sm:h-7" />
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
              <SmartImage
                src={category.image}
                maxWidth={230}
                sizes="(min-width: 1024px) 230px, (min-width: 640px) 210px, 145px"
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