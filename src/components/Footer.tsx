import type { JSX } from "astro/jsx-runtime";
import { domains } from "@/data/domains";

/**
 * Footer of the website.
 *
 * @return {JSX.Element}
 */
export default function Footer(): JSX.Element {
  return (
    <footer className="relative px-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 border-t border-ink/10 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo.png"
            alt="Orion logo"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span className="text-sm font-bold text-ink/70">Orion</span>
        </div>
        <p className="text-xs text-ink/40">
          Orion is not affiliated with{" "}
          {domains.map((domain, i) => (
            <span key={domain.id}>
              <a
                href={domain.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-ink/55 underline decoration-ink/20 underline-offset-2 transition-colors duration-200 outline-none hover:text-accent-soft focus:text-accent-soft focus:ring-2 focus:ring-accent-soft"
              >
                {domain.source.name}
              </a>
              {i < domains.length - 2
                ? ", "
                : i === domains.length - 2
                  ? " or "
                  : ""}
            </span>
          ))}
          , which provide the data.
        </p>
        <p className="text-xs text-ink/40">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://alexis-gousseau.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-ink/55 underline decoration-ink/20 underline-offset-2 transition-colors duration-200 outline-none hover:text-accent-soft focus:text-accent-soft focus:ring-2 focus:ring-accent-soft"
          >
            Alexis Gousseau
          </a>
        </p>
      </div>
    </footer>
  );
}
