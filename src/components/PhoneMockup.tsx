import type { JSX } from "astro/jsx-runtime";
import { useEffect, useRef, useState } from "react";

type PhoneMockupProps = {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
};

/**
 * Phone mockup.
 *
 * @return {JSX.Element}
 */
export function PhoneMockup({
  src,
  alt,
  eager = false,
  className = "",
}: PhoneMockupProps): JSX.Element {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setStatus("loading");

    const img = imgRef.current;

    if (img?.complete && img.naturalWidth > 0) {
      setStatus("loaded");
    } else if (img?.complete) {
      setStatus("error");
    }
  }, [src]);

  return (
    <div
      className={`relative mx-auto aspect-[9/19.5] w-full max-w-[200px] rounded-[2.6rem] border-[6px] border-ink bg-ink shadow-[0_10px_10px_0_rgba(26,26,23,0.35)] sm:max-w-[240px] lg:max-w-[280px] ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2.15rem] bg-paper">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 grid place-items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 z-10 grid place-items-center px-4">
            <p className="text-center text-xs text-ink/60">{alt}</p>
          </div>
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`pointer-events-none h-full w-full object-cover object-top transition-opacity duration-300 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
