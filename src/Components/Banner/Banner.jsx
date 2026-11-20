import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCachedGet from "../../utils/useCachedGet";
import { STATIC_TTL } from "../../utils/apiCache";
import { preloadImage, responsiveImage } from "../../utils/image";
import SmartImage from "../Common/SmartImage";

const BANNER_MAX_WIDTH = 1920;
const MOBILE_MAX_WIDTH = 1080;
const MOBILE_QUERY = "(max-width: 480px)";
const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

// Banner frame per breakpoint.
//   Desktop >=1200px  16:5   (image cropped to fill, focus = imagePosition)
//   Laptop  769–1199  16:6
//   Tablet  481–768   4:3
//   Mobile  <=480     no fixed frame: the whole image is shown at full width
//                     with its natural aspect ratio, so the banner height
//                     follows the image (no cropping, zooming or stretching).
const FRAME_ABOVE_MOBILE =
  "min-[481px]:aspect-[4/3] min-[769px]:aspect-[16/6] min-[1200px]:aspect-[16/5]";

const getMobileImage = (banner) => banner?.mobileImage || "";

const isMobileScreen = () =>
  typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;

const BannerSlide = ({ banner, active, priority, onNavigate }) => {
  const mobileImage = getMobileImage(banner);
  const mobileSource = mobileImage
    ? responsiveImage(mobileImage, MOBILE_MAX_WIDTH)
    : null;
  const Heading = priority ? "h1" : "h2";
  const desktopPosition = banner.imagePosition || "center";

  // Dedicated mobile artwork is tall enough to carry the text on top of it.
  // A wide desktop image shown in full on a phone is only ~110px tall, so the
  // text goes below it instead of being squeezed over it.
  const overlayOnMobile = Boolean(mobileImage);

  return (
    <div
      className={`transition-opacity duration-700 ease-in-out min-[481px]:absolute min-[481px]:inset-0 ${
        active
          ? "relative z-[1] opacity-100"
          : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
      }`}
      aria-hidden={!active}
    >
      {/* Phones get the dedicated mobile artwork when one exists, so they
          never download the large desktop file. */}
      <picture>
        {mobileSource && (
          <source
            media={MOBILE_QUERY}
            srcSet={mobileSource.srcSet || mobileSource.src}
            sizes="100vw"
          />
        )}
        <SmartImage
          src={banner.image}
          maxWidth={BANNER_MAX_WIDTH}
          sizes="100vw"
          priority={priority}
          alt={banner.title}
          style={{ "--pos-d": desktopPosition }}
          className="block h-auto w-full min-[481px]:absolute min-[481px]:inset-0 min-[481px]:h-full min-[481px]:object-cover min-[481px]:[object-position:var(--pos-d)]"
        />
      </picture>

      {/* Shade: from the bottom on phones (text sits low), from the left on
          larger screens. */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent min-[481px]:block min-[481px]:bg-gradient-to-r min-[481px]:from-black/60 min-[481px]:via-black/25 ${
          overlayOnMobile ? "" : "hidden"
        }`}
      />

      {/* Content */}
      <div
        className={`flex min-[481px]:absolute min-[481px]:inset-0 min-[481px]:items-center min-[481px]:bg-transparent min-[481px]:py-0 ${
          overlayOnMobile
            ? "absolute inset-0 items-end pb-8"
            : "relative bg-black py-5"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 min-[481px]:px-14 lg:px-16">
          <div className="max-w-xl text-white">
            {banner.subtitle && (
              <p className="mb-2 line-clamp-2 text-[10px] font-medium uppercase tracking-widest sm:mb-3 sm:text-sm">
                {banner.subtitle}
              </p>
            )}

            {/* One h1 per page: the first banner keeps it, like before. */}
            <Heading className="line-clamp-3 text-2xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {banner.title}
            </Heading>

            <button
              onClick={() => onNavigate(banner.buttonLink || "/products")}
              tabIndex={active ? 0 : -1}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#00ff03] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#00e603] sm:mt-7 sm:px-6 sm:py-3 sm:text-sm"
            >
              {banner.buttonText || "Shop Now"}
              <ArrowRight size={16} className="sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuperBanner = () => {
  // Banners rarely change: cached for a few minutes and shared, so going
  // back to the homepage shows them instantly.
  const { data, loading } = useCachedGet("/api/banner", { ttl: STATIC_TTL });
  const banners = useMemo(() => data?.banners || [], [data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Slides are mounted the first time they're needed (current or next), so
  // banners further along aren't downloaded up front.
  const [mounted, setMounted] = useState(() => new Set([0, 1]));
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const navigate = useNavigate();
  const count = banners.length;

  const goTo = useCallback(
    (index) => {
      if (!count) return;
      const target = ((index % count) + count) % count;
      const after = (target + 1) % count;
      setCurrentIndex(target);
      setMounted((prev) => {
        if (prev.has(target) && prev.has(after)) return prev;
        return new Set([...prev, target, after]);
      });
    },
    [count]
  );

  // Warm the next slide's image so the switch doesn't show a blank frame.
  useEffect(() => {
    if (!count) return;
    const nextIndex = (currentIndex + 1) % count;
    if (count > 1) {
      const next = banners[nextIndex];
      const mobile = getMobileImage(next);
      if (isMobileScreen() && mobile) {
        preloadImage(mobile, MOBILE_MAX_WIDTH, "100vw");
      } else {
        preloadImage(next?.image, BANNER_MAX_WIDTH, "100vw");
      }
    }
  }, [banners, count, currentIndex]);

  // Auto slide. Restarts after manual navigation; pauses on hover/touch.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setTimeout(() => goTo(currentIndex + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [count, currentIndex, paused, goTo]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (event) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    setPaused(false);
    if (start === null || count <= 1) return;
    const delta = event.changedTouches[0].clientX - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    goTo(delta < 0 ? currentIndex + 1 : currentIndex - 1);
  };

  if (loading) {
    return (
      // Same footprint as the loaded banner (plus the slide indicators) so
      // nothing jumps when it arrives.
      <div aria-hidden="true">
        <div className={`aspect-[4/3] w-full animate-pulse bg-gray-100 ${FRAME_ABOVE_MOBILE}`} />
        <div className="h-[30px] sm:h-[38px]" />
      </div>
    );
  }

  if (!count) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured offers"
    >
      {/* Banner */}
      <div
        className={`relative w-full overflow-hidden bg-black ${FRAME_ABOVE_MOBILE}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => setPaused(false)}
      >
        {banners.map((banner, index) =>
          mounted.has(index) ? (
            <BannerSlide
              key={banner._id || index}
              banner={banner}
              active={index === currentIndex}
              // Only the first banner is above-the-fold LCP content.
              priority={index === 0}
              onNavigate={navigate}
            />
          ) : null
        )}

        {count > 1 && (
          <>
            <button
              onClick={() => goTo(currentIndex - 1)}
              aria-label="Previous banner"
              className="absolute left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black min-[481px]:flex sm:left-4 sm:h-10 sm:w-10"
            >
              <ChevronLeft size={18} className="sm:h-[22px] sm:w-[22px]" />
            </button>

            <button
              onClick={() => goTo(currentIndex + 1)}
              aria-label="Next banner"
              className="absolute right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black min-[481px]:flex sm:right-4 sm:h-10 sm:w-10"
            >
              <ChevronRight size={18} className="sm:h-[22px] sm:w-[22px]" />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
      {count > 1 && (
        <div className="flex w-full items-center justify-center gap-2 py-3 sm:py-4">
          {banners.map((banner, index) => (
            <button
              key={banner._id || index}
              onClick={() => goTo(index)}
              aria-label={`Go to banner ${index + 1}`}
              aria-current={currentIndex === index}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === index ? "w-8 bg-[#00ff03]" : "w-5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SuperBanner;
