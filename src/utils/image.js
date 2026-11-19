// =========================================================
// Cloudinary delivery optimisation
// ---------------------------------------------------------
// Product / category / banner images are uploaded to Cloudinary at their
// original size (often 2–10 MB PNG/JPEG) and were rendered as-is, even in
// small thumbnails. Cloudinary can resize and re-encode on the fly when a
// transformation segment is inserted after `/upload/`, so we do that at
// render time only. Stored URLs in the database are never modified.
//
//   f_auto  -> AVIF / WebP when the browser supports it
//   q_auto  -> perceptual quality compression
//   c_limit -> shrink to fit, never upscale
//   w_N     -> target width in pixels
// =========================================================

// A fixed ladder keeps the number of derived assets (and Cloudinary
// transformation quota) small and maximises CDN cache hits.
const WIDTH_LADDER = [160, 320, 480, 640, 960, 1280, 1600, 1920];

const CLOUDINARY_UPLOAD_RE =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

// A transformation segment looks like "w_400,c_fill" etc. If the URL already
// carries one we leave it untouched.
const TRANSFORM_SEGMENT_RE = /^[a-z]{1,3}_[^/]*$/;

export const isCloudinaryUrl = (url) =>
  typeof url === "string" && CLOUDINARY_UPLOAD_RE.test(url);

export const cloudinaryUrl = (url, width) => {
  if (!isCloudinaryUrl(url)) return url;

  const [, prefix, rest] = url.match(CLOUDINARY_UPLOAD_RE);
  const firstSegment = rest.split("/")[0];

  if (TRANSFORM_SEGMENT_RE.test(firstSegment)) return url;

  const parts = ["f_auto", "q_auto", "c_limit"];
  if (width) parts.push(`w_${Math.round(width)}`);

  return `${prefix}${parts.join(",")}/${rest}`;
};

// Returns { src, srcSet } for an <img>. `maxWidth` is the largest rendered
// width (in CSS px) the image will ever need at 1x; 2x density is covered
// automatically by including the next ladder steps.
export const responsiveImage = (url, maxWidth = 640) => {
  if (!isCloudinaryUrl(url)) return { src: url, srcSet: undefined };

  const limit = maxWidth * 2;
  const widths = WIDTH_LADDER.filter((w) => w <= limit);
  const larger = WIDTH_LADDER.find((w) => w > limit);
  if (larger) widths.push(larger);

  const fallbackWidth =
    WIDTH_LADDER.find((w) => w >= maxWidth) ||
    WIDTH_LADDER[WIDTH_LADDER.length - 1];

  return {
    src: cloudinaryUrl(url, fallbackWidth),
    srcSet: widths.map((w) => `${cloudinaryUrl(url, w)} ${w}w`).join(", "),
  };
};

// Warm the browser cache for an image that is about to be shown
// (e.g. the next banner slide).
export const preloadImage = (url, maxWidth, sizes) => {
  if (!url || typeof window === "undefined") return;
  const { src, srcSet } = responsiveImage(url, maxWidth);
  const img = new Image();
  if (sizes) img.sizes = sizes;
  if (srcSet) img.srcset = srcSet;
  img.src = src;
};
