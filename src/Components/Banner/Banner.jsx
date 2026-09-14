import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SuperBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/api/banner`
        );

        setBanners(response.data.banners || []);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const previousBanner = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const nextBanner = () => {
    setCurrentIndex((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="h-[450px] w-full animate-pulse bg-gray-100" />
    );
  }

  if (!banners.length) {
    return null;
  }

  const banner = banners[currentIndex];

  return (
    <section className="relative w-full overflow-hidden">

      {/* Banner */}
      <div className="relative h-[420px] w-full sm:h-[480px] lg:h-[560px]">

        {/* Image */}
        <img
          src={banner.image}
          alt={banner.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark shade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">

            <div className="max-w-xl text-white">

              {banner.subtitle && (
                <p className="mb-3 text-sm font-medium uppercase tracking-widest">
                  {banner.subtitle}
                </p>
              )}

              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {banner.title}
              </h1>

              <a
                href={banner.buttonLink || "/products"}
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#00ff03] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00e603]"
              >
                {banner.buttonText || "Shop Now"}

                <ArrowRight size={18} />
              </a>

            </div>
          </div>
        </div>

        {/* Previous */}
        {banners.length > 1 && (
          <button
            onClick={previousBanner}
            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Next */}
        {banners.length > 1 && (
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
          >
            <ChevronRight size={22} />
          </button>
        )}

      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === index
                  ? "w-8 bg-[#00ff03]"
                  : "w-5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default SuperBanner;