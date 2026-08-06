import type { JSX } from "astro/jsx-runtime";
import { useEffect, useState } from "react";
import { formatSize, formatDate } from "@/utils/global.tsx";
import ScreenSlider from "@/components/ScreenSlider";
import { useActiveDomain } from "@/stores/activeDomain";

const GITHUB_URL = `https://api.github.com/repos/alexis-gss/orion-application/releases/latest`;

/**
 * Section hero.
 *
 * @return {JSX.Element}
 */
export default function Hero(): JSX.Element {
  const activeDomain = useActiveDomain();

  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(GITHUB_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Release not found");
        return res.json();
      })
      .then((data: ReleaseData) => {
        if (cancelled) return;
        const apkAsset = data.assets.find((a) => a.name.endsWith(".apk"));
        if (!apkAsset) throw new Error("No APK in this release");
        setState({ status: "success", release: data, apkAsset });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-[6rem] pb-[3rem] sm:px-8"
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Background gradient, tinted with the active domain's accent. */}
        <div
          className="pointer-events-none absolute top-0 left-0 h-[560px] w-[560px] -translate-1/2 rounded-full opacity-30 blur-[110px] transition-[background] duration-500 lg:top-1/2"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent) 0%, var(--color-accent-soft) 45%, transparent 72%)",
          }}
        />
        {/* Left column: description + download button. */}
        <div className="z-1 flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="max-w-xl text-4xl leading-[1.05] font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            <span className="bg-[linear-gradient(transparent_65%,var(--color-accent)_65%,var(--color-accent-soft)_100%)] transition-[background] duration-500">
              {activeDomain.heroHighlight}
            </span>{" "}
            {activeDomain.heroTitleEnd}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/60 sm:text-lg">
            {activeDomain.heroDescription}
          </p>
          <div className="mt-8 flex w-full max-w-sm flex-col items-center gap-3 lg:items-start">
            {state.status === "loading" && (
              <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-ink/10 bg-white px-6 py-4 text-sm font-semibold text-ink/50 shadow-sm">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/15 border-t-accent" />
                Searching for the latest version…
              </div>
            )}
            {state.status === "error" && (
              <div className="w-full rounded-2xl border border-[#ff6b5e]/25 bg-[#ff6b5e]/10 px-6 py-4 text-center text-sm font-medium text-[#c23f34] lg:text-left">
                We're unable to retrieve the latest version at this time. Please
                try again later, or go directly to{" "}
                <a
                  href="https://github.com/alexis-gss/orion-application/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[#c23f34]/50 underline-offset-2 hover:text-ink"
                >
                  the releases page
                </a>
                .
              </div>
            )}
            {state.status === "success" && (
              <>
                <a
                  href={state.apkAsset.browser_download_url}
                  download
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-accent-soft to-accent px-8 py-4 text-base font-extrabold text-accent-ink transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" />
                  </svg>
                  Download the APK
                </a>
                <p className="w-full text-center text-xs font-medium text-ink/45">
                  Version {state.release.tag_name} ·{" "}
                  {formatSize(state.apkAsset.size)} · published at{" "}
                  {formatDate(state.release.published_at)}
                </p>
              </>
            )}
          </div>
        </div>
        {/* Right column: screenshots slider, following the same active domain. */}
        <div className="flex min-w-0 justify-center lg:justify-end">
          <ScreenSlider />
        </div>
      </div>
    </section>
  );
}
