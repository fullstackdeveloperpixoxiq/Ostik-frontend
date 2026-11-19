import { useState } from "react";
import { responsiveImage } from "../../utils/image";

// Drop-in replacement for <img> for remote (Cloudinary) images.
//
// - Requests a correctly sized, modern-format variant instead of the
//   multi-megabyte original.
// - Lazy-loads by default; pass `priority` for above-the-fold images (LCP).
// - If the optimised variant ever fails (e.g. transformation quota), it falls
//   back to the original stored URL so no image is lost.
//
// `maxWidth`: largest CSS width the image renders at.
// `sizes`:    standard <img sizes> hint so the browser picks the right file.
const SmartImage = ({
  src,
  maxWidth = 640,
  sizes,
  priority = false,
  onError,
  ...rest
}) => {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src) return null;

  const useOriginal = failedSrc === src;
  const optimised = useOriginal
    ? { src, srcSet: undefined }
    : responsiveImage(src, maxWidth);

  return (
    <img
      {...rest}
      src={optimised.src}
      srcSet={optimised.srcSet}
      sizes={optimised.srcSet ? sizes || `${maxWidth}px` : undefined}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onError={(event) => {
        if (!useOriginal && optimised.src !== src) {
          setFailedSrc(src);
          return;
        }
        onError?.(event);
      }}
    />
  );
};

export default SmartImage;
