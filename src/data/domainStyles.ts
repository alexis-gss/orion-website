import type { DomainId } from "@/data/domains";

/**
 * Literal Tailwind class strings per domain.
 *
 * Tailwind's build-time scanner only picks up complete, literal class names
 * found in the source — a string built at runtime like `from-${id}-soft`
 * is invisible to it and silently produces no CSS. Every class used anywhere
 * in the app must therefore be spelled out in full somewhere, hence this map
 * instead of interpolating `domain.colors.*` directly into className props.
 */
export const domainStyles: Record<
  DomainId,
  {
    /** Gradient background, dark-on-light or white-on-dark text as appropriate. */
    badge: string;
    /** Gradient underline/divider bar. */
    bar: string;
    /** Active tab pill (solid background + contrasting text). */
    tabActive: string;
    /** Focus/hover ring color matching the domain accent. */
    ring: string;
    /** Text color matching the domain accent (on the paper/white background). */
    text: string;
    /** Progress indicator (autoplay ring / dots) background color. */
    dot: string;
    /** Border used to highlight this domain's card/pill when it is the active one. */
    activeBorder: string;
  }
> = {
  cinema: {
    badge: "bg-gradient-to-br from-cinema-soft to-cinema text-cinema-ink",
    bar: "bg-gradient-to-r from-cinema-soft to-cinema",
    tabActive: "text-cinema-ink",
    ring: "focus-visible:ring-cinema",
    text: "text-cinema",
    dot: "bg-cinema",
    activeBorder: "border-cinema",
  },
  games: {
    badge: "bg-gradient-to-br from-games-soft to-games text-games-ink",
    bar: "bg-gradient-to-r from-games-soft to-games",
    tabActive: "text-games-ink",
    ring: "focus-visible:ring-games",
    text: "text-games",
    dot: "bg-games",
    activeBorder: "border-games",
  },
  books: {
    badge: "bg-gradient-to-br from-books-soft to-books text-books-ink",
    bar: "bg-gradient-to-r from-books-soft to-books",
    tabActive: "text-books-ink",
    ring: "focus-visible:ring-books",
    text: "text-books",
    dot: "bg-books",
    activeBorder: "border-books",
  },
};
