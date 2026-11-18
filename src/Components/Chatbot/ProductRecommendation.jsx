import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const formatINR = (value) =>
  typeof value === "number" && Number.isFinite(value) ? `₹${value.toLocaleString("en-IN")}` : null;

// Product cards built only from backend data (never from AI text).
const ProductRecommendation = ({ products, onNavigate }) => {
  const navigate = useNavigate();

  if (!products?.length) return null;

  const open = (product) => {
    // Only the existing product details route, with an ID returned by the backend.
    if (!/^[a-f0-9]{24}$/i.test(product._id)) return;
    navigate(`/product/${product._id}`);
    onNavigate?.();
  };

  return (
    <div className="ostik-chat-cards mt-2 -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2">
      {products.map((product) => {
        const hasDiscount = product.discountPercent > 0 && product.price > product.finalPrice;

        return (
          <div
            key={product._id}
            className="flex w-[168px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e8ede3] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <button
              type="button"
              onClick={() => open(product)}
              className="relative block h-[140px] w-full shrink-0 bg-[#F8F9F6]"
              aria-label={`View ${product.name}`}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[#999999]">
                  <ShoppingBag size={28} />
                </span>
              )}

              {hasDiscount && (
                <span className="absolute left-2 top-2 rounded-full bg-[#00ff03] px-2 py-0.5 text-[10px] font-bold text-black">
                  {product.discountPercent}% OFF
                </span>
              )}
            </button>

            <div className="flex flex-1 flex-col gap-1 p-2.5">
              <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#171717]">
                {product.name}
              </p>

              {product.variantName && (
                <p className="truncate text-[11px] text-[#777777]">
                  {product.variantName}
                  {product.variantCount > 1 ? ` · ${product.variantCount} options` : ""}
                </p>
              )}

              {(product.sku || product.modelNumber) && (
                <p className="truncate text-[10.5px] text-[#999999]" title={[product.sku && `SKU ${product.sku}`, product.modelNumber && `Model ${product.modelNumber}`].filter(Boolean).join(" · ")}>
                  {product.sku && <span>SKU {product.sku}</span>}
                  {product.sku && product.modelNumber && product.modelNumber.toUpperCase() !== product.sku.toUpperCase() && " · "}
                  {product.modelNumber && (!product.sku || product.modelNumber.toUpperCase() !== product.sku.toUpperCase()) && (
                    <span>Model {product.modelNumber}</span>
                  )}
                </p>
              )}

              <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5">
                {formatINR(product.finalPrice) && (
                  <span className="text-[14px] font-bold text-[#171717]">{formatINR(product.finalPrice)}</span>
                )}
                {hasDiscount && (
                  <span className="text-[11px] text-[#999999] line-through">{formatINR(product.price)}</span>
                )}
              </div>

              <p className={`text-[11px] font-medium ${product.inStock ? "text-[#2f9e00]" : "text-[#d93025]"}`}>
                {product.inStock ? "In stock" : "Out of stock"}
              </p>

              <button
                type="button"
                onClick={() => open(product)}
                className="mt-1 flex items-center justify-center gap-1 rounded-full bg-black py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#00ff03] hover:text-black"
              >
                View Product <ArrowRight size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductRecommendation;
