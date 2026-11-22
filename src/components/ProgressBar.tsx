"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function ProgressBarChild() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (anchor.getAttribute("download")) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      const targetHref = anchor.getAttribute("href");
      if (!targetHref || targetHref.startsWith("#")) return;

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(anchor.href, window.location.origin);

      if (targetUrl.origin !== window.location.origin) return;

      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search
      ) {
        return;
      }

      NProgress.start();
    };

    const handlePopState = () => {
      NProgress.start();
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      const targetUrl = args[2] ? new URL(args[2].toString(), window.location.origin) : null;
      if (
        targetUrl &&
        (targetUrl.pathname !== window.location.pathname ||
          targetUrl.search !== window.location.search)
      ) {
        NProgress.start();
      }
      return originalPushState.apply(this, args);
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function (...args) {
      const targetUrl = args[2] ? new URL(args[2].toString(), window.location.origin) : null;
      if (
        targetUrl &&
        (targetUrl.pathname !== window.location.pathname ||
          targetUrl.search !== window.location.search)
      ) {
        NProgress.start();
      }
      return originalReplaceState.apply(this, args);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      NProgress.done();
    };
  }, []);

  return null;
}

export default function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarChild />
    </Suspense>
  );
}
