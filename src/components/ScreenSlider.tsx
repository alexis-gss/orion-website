import type { JSX } from "astro/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { PhoneMockup } from "@/components/PhoneMockup";
import type { Domain } from "@/data/domains";
import { useActiveDomain } from "@/stores/activeDomain";

const SLIDE_DURATION = 5000;

/**
 * Screenshot slider for the domain currently selected in the Header switcher.
 *
 * @return {JSX.Element}
 */
export default function ScreenSlider(): JSX.Element {
  const activeDomain = useActiveDomain();

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col">
      <DomainSlider key={activeDomain.id} domain={activeDomain} />
    </div>
  );
}

function DomainSlider({ domain }: { domain: Domain }): JSX.Element {
  const screens = domain.screens;

  const [active, setActive] = useState<number>(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const startX = useRef<number>(0);
  const currentTranslate = useRef<number>(0);
  const previousTranslate = useRef<number>(0);
  const animation = useRef<number>(0);

  const [translate, setTranslate] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);

  const progressStart = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const [playing, setPlaying] = useState<boolean>(true);
  const autoplay = useRef<number>(0);
  const paused = useRef<boolean>(false);
  const pausedAt = useRef<number>(0);

  const slideWidth = () => sliderRef.current?.clientWidth ?? 0;

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const goToRef = useRef<(index: number) => void>(() => {});

  const restartAutoplay = useCallback(() => {
    window.clearTimeout(autoplay.current);
    if (!playing || paused.current) return;

    const elapsed = Date.now() - progressStart.current;
    const remaining = Math.max(SLIDE_DURATION - elapsed, 0);

    autoplay.current = window.setTimeout(() => {
      if (paused.current) return;
      goToRef.current(activeRef.current + 1);
    }, remaining);
  }, [playing]);

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = (index + screens.length) % screens.length;

      setActive(nextIndex);

      const x = -(nextIndex * slideWidth());

      previousTranslate.current = x;
      currentTranslate.current = x;
      setTranslate(x);

      progressStart.current = Date.now();
      setProgress(0);

      restartAutoplay();
    },
    [restartAutoplay, screens.length],
  );

  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  const togglePlaying = () => {
    setPlaying((value) => {
      const next = !value;

      if (!next) {
        pausedAt.current = Date.now();
      } else {
        const pauseDuration = Date.now() - pausedAt.current;
        progressStart.current += pauseDuration;
        paused.current = false;
      }

      return next;
    });
  };

  useEffect(() => {
    progressStart.current = Date.now();
  }, []);

  useEffect(() => {
    restartAutoplay();

    return () => window.clearTimeout(autoplay.current);
  }, [active, playing, restartAutoplay]);

  useEffect(() => {
    const update = () => {
      if (playing && !paused.current) {
        const elapsed = Date.now() - progressStart.current;

        setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
      }

      animation.current = requestAnimationFrame(update);
    };

    animation.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animation.current!);
  }, [playing]);

  useEffect(() => {
    const resize = () => {
      const x = -(active * slideWidth());

      previousTranslate.current = x;
      currentTranslate.current = x;

      setTranslate(x);
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, [active]);

  const pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    window.clearTimeout(autoplay.current);

    paused.current = true;
    pausedAt.current = Date.now();

    setDragging(true);

    startX.current = e.clientX;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const pointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;

    const delta = e.clientX - startX.current;

    currentTranslate.current = previousTranslate.current + delta;

    setTranslate(currentTranslate.current);
  };

  const pointerUp = () => {
    if (!dragging) return;

    setDragging(false);

    const moved = currentTranslate.current - previousTranslate.current;

    if (moved < -80) {
      paused.current = false;
      goTo(active + 1);
      return;
    }

    if (moved > 80) {
      paused.current = false;
      goTo(active - 1);
      return;
    }

    previousTranslate.current = -(active * slideWidth());
    currentTranslate.current = previousTranslate.current;
    setTranslate(previousTranslate.current);

    const pauseDuration = Date.now() - pausedAt.current;
    progressStart.current += pauseDuration;

    paused.current = false;

    restartAutoplay();
  };

  return (
    <div
      className="relative flex flex-col"
      onMouseEnter={() => {
        window.clearTimeout(autoplay.current);
        paused.current = true;
        pausedAt.current = Date.now();
      }}
      onMouseLeave={() => {
        const pauseDuration = Date.now() - pausedAt.current;
        progressStart.current += pauseDuration;
        paused.current = false;
        restartAutoplay();
      }}
    >
      <div className="absolute top-0 left-0 z-1 h-full w-[1rem] bg-gradient-to-r from-paper to-transparent" />
      <div className="absolute top-0 right-0 z-1 h-full w-[1rem] bg-gradient-to-l from-paper to-transparent" />
      {/* Play/pause button */}
      <div className="absolute start-0 top-0 z-2 h-10 w-10 shrink-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
                var(--color-accent) ${progress * 360}deg,
                transparent ${progress * 360}deg
              )`,
          }}
        />
        <button
          type="button"
          onClick={togglePlaying}
          aria-label={playing ? "Pause" : "Play the slideshow"}
          className="absolute inset-[3px] grid cursor-pointer place-items-center rounded-full bg-white shadow-sm transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-95"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
      {/* Slider */}
      <div
        ref={sliderRef}
        className="touch-pan-y overflow-hidden select-none"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onPointerLeave={() => dragging && pointerUp()}
      >
        <div
          className={`flex ${
            dragging ? "" : "transition-transform duration-500 ease-out"
          }`}
          style={{
            transform: `translate3d(${translate}px,0,0)`,
          }}
        >
          {screens.map((screen, i) => (
            <div
              key={screen.key}
              className="flex w-full shrink-0 flex-col items-center px-2"
            >
              <PhoneMockup
                src={screen.src}
                alt={`Screenshot ${screen.label}`}
                eager={i === 0}
                className={`transition-all duration-500 ${
                  active === i
                    ? "scale-100 opacity-100"
                    : "scale-[.96] opacity-75"
                }`}
              />
              <div className="mt-6 text-center">
                <h3 className="text-lg font-bold text-ink">{screen.label}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/60">
                  {screen.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Navigation */}
      <div className="relative mt-6 flex items-center justify-between pb-1">
        {/* Prev button */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous screenshot"
          className="z-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-ink/10 bg-white shadow-sm transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-95"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {/* Dots pagination */}
        <div className="flex items-center gap-2">
          {screens.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to the screenshot n°${i + 1}`}
              onClick={() => goTo(i)}
              className={`z-2 h-2 cursor-pointer rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                active === i ? "w-7 bg-accent" : "w-2 bg-ink/20 hover:bg-ink/35"
              }`}
            />
          ))}
        </div>
        {/* Next button */}
        <button
          type="button"
          onClick={next}
          aria-label="Next screenshot"
          className="z-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-ink/10 bg-white shadow-sm transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-95"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
