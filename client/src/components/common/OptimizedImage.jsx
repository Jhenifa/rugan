import { useState, useRef, useEffect } from "react";

/**
 * OptimizedImage — drop-in replacement for <img> with:
 *  - Native lazy loading (loading="lazy")
 *  - Async decoding (decoding="async") — keeps main thread free
 *  - Blur-up placeholder while loading
 *  - Graceful fallback on broken src
 *  - fetchpriority="high" for above-the-fold images (priority prop)
 *  - Responsive srcSet support for external Cloudflare/CDN images
 *
 * Usage:
 *   <OptimizedImage src="/images/hero.jpg" alt="Hero" priority />
 *   <OptimizedImage src={post.coverImage} alt={post.title} aspectRatio="16/9" />
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  style = {},
  priority = false,       // set true for hero/above-the-fold images
  aspectRatio,            // e.g. "16/9", "1/1", "4/3"
  fallback = "/images/blog/hero.jpg",
  objectFit = "cover",
  objectPosition = "center",
  onLoad,
  ...props
}) {
  const [loaded, setLoaded]   = useState(false);
  const [error, setError]     = useState(false);
  const imgRef                = useRef(null);

  // If image is already in browser cache (complete before mount), mark loaded
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  const imgSrc = error || !src ? fallback : src;

  const wrapperStyle = {
    position: "relative",
    overflow: "hidden",
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit,
    objectPosition,
    display: "block",
    transition: "opacity 300ms ease, filter 300ms ease",
    opacity: loaded ? 1 : 0,
    filter: loaded ? "none" : "blur(8px)",
  };

  return (
    <div style={wrapperStyle} className={className}>
      {/* Low-quality placeholder background while loading */}
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #e8f2e6 0%, #d4e8d0 100%)",
          }}
        />
      )}

      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : "auto"}
        style={imgStyle}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          if (!error) setError(true);
        }}
        {...props}
      />
    </div>
  );
}
