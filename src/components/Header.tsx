import type { JSX } from "astro/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Clapperboard, Gamepad2, BookOpen } from "lucide-react";
import { domains } from "@/data/domains";
import { domainStyles } from "@/data/domainStyles";
import { setActiveDomain, useActiveDomain } from "@/stores/activeDomain";

const icons = {
  cinema: Clapperboard,
  games: Gamepad2,
  books: BookOpen,
} as const;

type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Header of the website.
 *
 * @return {JSX.Element}
 */
export default function Header(): JSX.Element {
  const activeDomain = useActiveDomain();

  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  useEffect(() => {
    const root = document.documentElement.style;

    root.setProperty("--color-accent", `var(--color-${activeDomain.id})`);
    root.setProperty(
      "--color-accent-soft",
      `var(--color-${activeDomain.id}-soft)`,
    );
    root.setProperty(
      "--color-accent-ink",
      `var(--color-${activeDomain.id}-ink)`,
    );
  }, [activeDomain]);

  const measure = () => {
    const el = tabsRef.current[activeDomain.id];
    if (!el) return;

    setIndicator({
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDomain]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDomain]);

  return (
    <header className="fixed inset-x-0 top-[1rem] z-50 px-5">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-1 rounded-full bg-[#1a1a17] px-2 py-2 text-paper">
        <a
          href="#top"
          className="rounded-full px-2 text-lg font-extrabold tracking-tight text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper md:mx-5"
        >
          Orion
        </a>
        {/* Domain switcher: recolors the whole site when changed. */}
        <div
          role="tablist"
          aria-label="Univers"
          className="relative flex flex-1 items-center justify-center gap-1 rounded-full bg-[#171815]"
        >
          {/* Sliding background indicator */}
          {indicator && (
            <div
              aria-hidden="true"
              className="absolute rounded-full transition-[left,top,width,height,background-color] duration-300 ease-out"
              style={{
                left: indicator.left,
                top: indicator.top,
                width: indicator.width,
                height: indicator.height,
                backgroundColor: `var(--color-${activeDomain.id})`,
              }}
            />
          )}

          {domains.map((domain) => {
            const Icon = icons[domain.id];
            const isActive = domain.id === activeDomain.id;
            const style = domainStyles[domain.id];

            return (
              <button
                key={domain.id}
                ref={(el) => {
                  tabsRef.current[domain.id] = el;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDomain(domain.id)}
                className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 py-3 text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:px-3 sm:text-sm ${
                  isActive ? style.tabActive : "text-[#bbbbbb] hover:text-paper"
                }`}
              >
                <Icon size={15} strokeWidth={2.25} className="shrink-0" />
                <span className="hidden sm:inline">{domain.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
