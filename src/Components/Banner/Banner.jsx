import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCachedGet from "../../utils/useCachedGet";
import { STATIC_TTL } from "../../utils/apiCache";
import { preloadImage } from "../../utils/image";
import SmartImage from "../Common/SmartImage";

const BANNER_MAX_WIDTH = 1920;
const BANNER_RATIO_WIDTH = 1920;
const BANNER_RATIO_HEIGHT = 640;

const SuperBanner = () => {
  // Banners rarely change: cached for a few minutes and shared, so going
  // back to the homepage shows them instantly.
  const { data, loading } = useCachedGet("/api/banner", { ttl: STATIC_TTL });
  const banners = useMemo(() => data?.banners || [], [data]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  // Warm the next slide so the switch doesn't show a blank frame.
  useEffect(() => {
    if (banners.length <= 1) return;
    const next = banners[(currentIndex + 1) % banners.length];
    preloadImage(next?.image, BANNER_MAX_WIDTH, "100vw");
  }, [banners, currentIndex]);

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
      // Same footprint as the loaded banner (280px on mobile, 3:1 on larger
      // screens, plus the slide indicators) so nothing jumps when it arrives.
      <div aria-hidden="true">
        <div className="h-[280px] w-full animate-pulse bg-gray-100 sm:aspect-[3/1] sm:h-auto" />
        <div className="h-[30px] sm:h-[38px]" />
      </div>
    );
  }

  if (!banners.length) {
    return null;
  }

  const banner = banners[currentIndex] || banners[0];

  return (
    <section className="relative w-full overflow-hidden">

      {/* Banner */}
      <div className="relative h-[280px] w-full bg-black sm:h-auto">

        {/* Image */}
        {/* Above the fold (LCP): loaded eagerly with high priority,
            in a size and format suited to the screen. */}
        <SmartImage
          src={banner.image}
          maxWidth={BANNER_MAX_WIDTH}
          sizes="100vw"
          priority
          // Space-reservation hint only (banners are 3:1). Once the image
          // loads its real proportions are used, so other shapes still
          // display exactly as uploaded.
          width={BANNER_RATIO_WIDTH}
          height={BANNER_RATIO_HEIGHT}
          alt={banner.title}
          className="absolute inset-0 h-full w-full sm:static sm:h-auto sm:w-full"
        />

        {/* Dark shade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-10 lg:px-16">

            <div className="max-w-xl text-white">

              {banner.subtitle && (
                <p className="mb-2 text-[7px] font-medium uppercase tracking-widest sm:mb-3 sm:text-sm">
                  {banner.subtitle}
                </p>
              )}

              <h1 className="text-xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {banner.title}
              </h1>

              <button
                onClick={() =>
                  navigate(banner.buttonLink || "/products")
                }
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#00ff03] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#00e603] sm:mt-7 sm:px-6 sm:py-3 sm:text-sm"
              >
                {banner.buttonText || "Shop Now"}

                <ArrowRight
                  size={18}
                  className="sm:h-[18px] sm:w-[18px]"
                />
              </button>

            </div>
          </div>
        </div>

        {/* Previous */}
        {banners.length > 1 && (
          <button
            onClick={previousBanner}
            className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:left-4 sm:h-10 sm:w-10"
          >
            <ChevronLeft
              size={18}
              className="sm:h-[22px] sm:w-[22px]"
            />
          </button>
        )}

        {/* Next */}
        {banners.length > 1 && (
          <button
            onClick={nextBanner}
            className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:right-4 sm:h-10 sm:w-10"
          >
            <ChevronRight
              size={18}
              className="sm:h-[22px] sm:w-[22px]"
            />
          </button>
        )}
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="flex w-full items-center justify-center gap-2 py-3 sm:py-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === index
                  ? "w-8 bg-[#00ff03]"
                  : "w-5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default SuperBanner;