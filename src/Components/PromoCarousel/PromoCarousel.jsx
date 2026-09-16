function PromoCarousel() {
  return (
    <section className="promo-carousel">
      <style>{`
        @keyframes ostik-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .promo-carousel:hover .promo-carousel__track {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="overflow-hidden py-3 text-black">
        <div
          className="promo-carousel__track flex w-max items-center whitespace-nowrap"
          style={{ animation: "ostik-marquee 25s linear infinite" }}
        >
          <div className="flex items-center gap-8 sm:gap-14 pr-8 sm:pr-14 text-sm sm:text-lg font-bold tracking-wide">
            <span>Free shipping on orders above ₹999</span>
            <img src="\OstikLogo\OSTIK_PNG.png" alt="LOGO" 
            className="w-[38px] sm:w-[50px] h-auto object-contain"/>
            <span>Secure Payments</span>
            <img src="\OstikLogo\OSTIK_PNG.png" alt="LOGO" 
            className="w-[38px] sm:w-[50px] h-auto object-contain"/>
            <span>Fast Delivery Across India</span>
            <img src="\OstikLogo\OSTIK_PNG.png" alt="LOGO" 
            className="w-[38px] sm:w-[50px] h-auto object-contain"/>
          </div>

          <div
            className="flex items-center gap-14 pr-14 text-lg font-bold tracking-wide"
            aria-hidden="true"
          >
            <span>Free shipping on orders above ₹999</span>
            <img src="\OstikLogo\OSTIK_PNG.png" alt="LOGO" 
            className="w-[38px] sm:w-[50px] h-auto object-contain"/>
            <span>Secure Payments</span>
            <img src="\OstikLogo\OSTIK_PNG.png" alt="LOGO" 
            className="w-[38px] sm:w-[50px] h-auto object-contain"/>
            <span>Fast Delivery Across India</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoCarousel;