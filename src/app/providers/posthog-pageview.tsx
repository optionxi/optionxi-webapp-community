'use client'

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from 'posthog-js/react';

export default function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    // Track pageviews
    if (pathname && posthog) {
      let url = window.origin + pathname;
      const searchParamsString = searchParams?.toString() || ''; // Handle potential null

      if (searchParamsString) {
        url += `?${searchParamsString}`;
      }

      posthog.capture('$pageview', {
        '$current_url': url,
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
