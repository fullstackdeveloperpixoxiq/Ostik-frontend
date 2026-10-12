
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function PromoCarousel() {
  const [carousel, setCarousel] = useState(null);
  const [shippingSettings, setShippingSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const [carouselResult, shippingResult] =
          await Promise.allSettled([
            fetch(`${API_URL}/api/settings/promo-carousel`),
            fetch(`${API_URL}/api/settings/shipping`),
          ]);

        // Fetch promo carousel messages
        if (
          carouselResult.status === "fulfilled" &&
          carouselResult.value.ok
        ) {
          const data = await carouselResult.value.json();

          if (isMounted && data.success && data.carousel) {
            setCarousel(data.carousel);
          }
        } else {
          console.error("Failed to fetch promo carousel settings.");
        }

        // Fetch shipping settings
        if (
          shippingResult.status === "fulfilled" &&
          shippingResult.value.ok
        ) {
          const data = await shippingResult.value.json();

          if (isMounted && data.success && data.settings) {
            setShippingSettings(data.settings);
          }
        } else {
          console.error("Failed to fetch shipping settings.");
        }
      } catch (error) {
        console.error("Promo carousel error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Wait until both settings have loaded before displaying messages.
  if (
    loading ||
    !carousel ||
    !carousel.isVisible ||
    !shippingSettings
  ) {
    return null;
  }

  // Filter active messages and hide free-shipping messages
  // when Free Delivery is disabled.
  const activeMessages = (carousel.messages || []).filter(
    (message) => {
      if (
        !message.isActive ||
        typeof message.text !== "string" ||
        !message.text.trim()
      ) {
        return false;
      }

      const isShippingMessage =
        /free[\s-]*(shipping|delivery)/i.test(message.text);

      if (
        isShippingMessage &&
        shippingSettings.freeDeliveryEnabled === false
      ) {
        return false;
      }

      return true;
    }
  );

  if (activeMessages.length === 0) {
    return null;
  }

  // Update the shipping message with the latest threshold.
  const getDisplayText = (message) => {
    const text = message.text;

    const isShippingMessage =
      /free[\s-]*(shipping|delivery)/i.test(text);

    const threshold = Number(
      shippingSettings.freeDeliveryThreshold
    );

    if (
      isShippingMessage &&
      shippingSettings.freeDeliveryEnabled === true &&
      Number.isFinite(threshold) &&
      threshold >= 0
    ) {
      const formattedAmount = `₹${threshold.toLocaleString("en-IN")}`;

      // Replace the old amount saved in the carousel message.
      if (/₹?\s*[\d,]+/.test(text)) {
        return text.replace(
          /₹?\s*[\d,]+/,
          formattedAmount
        );
      }

      return `${text} ${formattedAmount}`;
    }

    return text;
  };

  // Repeat the message group for continuous scrolling.
  const copies = [0, 1, 2, 3];

  return (
    <section className="promo-carousel w-full overflow-hidden">
      <style>{`
        @keyframes ostik-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-25%);
          }
        }

        .promo-carousel__track {
          display: flex;
          width: max-content;
          animation: ostik-marquee 25s linear infinite;
          will-change: transform;
        }

        .promo-carousel__group {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          width: max-content;
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .promo-carousel__track {
            animation-duration: 60s;
          }
        }
      `}</style>

      <div className="overflow-hidden py-3 text-black">
        <div className="promo-carousel__track items-center">
          {copies.map((copy) => (
            <div
              key={`carousel-copy-${copy}`}
              className="promo-carousel__group gap-8 pr-8 text-sm font-bold tracking-wide sm:gap-14 sm:pr-14 sm:text-lg"
              aria-hidden={copy !== 0}
            >
              {activeMessages.map((message, index) => (
                <div
                  key={`${copy}-${message._id || index}`}
                  className="flex shrink-0 items-center gap-8 sm:gap-14"
                >
                  <span>{getDisplayText(message)}</span>

                  <img
                    src="/OstikLogo/OSTIK_PNG.png"
                    alt=""
                    className="h-auto w-[38px] shrink-0 object-contain sm:w-[50px]"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromoCarousel;