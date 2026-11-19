import useCachedGet from "../../utils/useCachedGet";
import { STATIC_TTL } from "../../utils/apiCache";

function PromoCarousel() {
  // Both settings rarely change: fetched in parallel, cached briefly and
  // shared across pages.
  const carouselRequest = useCachedGet("/api/settings/promo-carousel", {
    ttl: STATIC_TTL,
  });
  const shippingRequest = useCachedGet("/api/settings/shipping", {
    ttl: STATIC_TTL,
  });

  const loading = carouselRequest.loading || shippingRequest.loading;
  const carousel = carouselRequest.data?.success
    ? carouselRequest.data.carousel
    : null;
  const shippingSettings = shippingRequest.data?.success
    ? shippingRequest.data.settings
    : null;

  // Reserve the strip's height while settings load: it sits at the very
  // top of the page, so appearing late would push everything down.
  if (loading) {
    return <div className="h-[51px] w-full sm:h-[59px]" aria-hidden="true" />;
  }

  // Wait until both settings have loaded before displaying messages.
  if (
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
                    width={600}
                    height={424}
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