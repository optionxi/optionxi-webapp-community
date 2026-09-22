"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";

// NOTE: tailwind.config.{js,ts} must have `darkMode: "media"` (the default)
// so this follows the system light/dark setting with no toggle needed.

const display = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const BACKEND_URL = process.env.NEXT_PUBLIC_PAYMENT_BACKEND_URL;
const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 25; // ~15s of polling before we stop and say "still confirming"

type Status = "checking" | "paid" | "pending" | "failed" | "not_found";

interface StatusData {
  status: string;
  plan_key: string | null;
  expires_at: string | null;
}

function formatExpiry(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function planLabel(key: string | null | undefined) {
  if (!key) return "—";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function truncateRef(id: string | null) {
  if (!id) return "—";
  if (id.length <= 16) return id;
  return `${id.slice(0, 9)}···${id.slice(-4)}`;
}

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const paymentLinkId = searchParams
    ? searchParams.get("razorpay_payment_link_id")
    : null;
  const [status, setStatus] = useState<Status>("checking");
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    if (!paymentLinkId) {
      setStatus("not_found");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `${BACKEND_URL}/payments/status/${paymentLinkId}`
        );

        if (res.status === 404) {
          if (!cancelled) setStatus("not_found");
          return;
        }

        const json: StatusData = await res.json();
        if (cancelled) return;

        setData(json);

        if (json.status === "paid") {
          setStatus("paid");
          return;
        }
        if (json.status === "paid_unverified_phone" || json.status === "failed") {
          setStatus("failed");
          return;
        }

        // still "created" — webhook hasn't landed yet
        if (attempts < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setStatus("pending");
        }
      } catch {
       if (attempts < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        } else if (attempts < MAX_POLLS + 15) {
          // slow down instead of stopping — check every 5s for another ~75s
          setTimeout(poll, 5000);
        } else {
          setStatus("pending");
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [paymentLinkId]);

  const copy = getCopy(status, data);

  return (
    <main
      className={`${body.className} lg:min-h-screen flex items-center justify-center px-5 py-8
      bg-[#f5f6f8] text-[#10131a] dark:bg-[#0a0c10] dark:text-[#e7e9ee]`}
    >
      <div
        className="w-full max-w-[380px] rounded-[20px] border px-7 pt-8 pb-6
        bg-white border-[#e3e6eb] shadow-[0_1px_2px_rgba(16,19,26,0.04),0_12px_32px_-16px_rgba(16,19,26,0.18)]
        dark:bg-[#13161c] dark:border-[#22262f] dark:shadow-none"
      >
        {/* Brand row */}
        <div className="flex items-baseline justify-between mb-8">
          <span className={`${display.className} text-sm font-bold tracking-[0.14em]`}>
            OptionXI
          </span>
          <span
            className={`${mono.className} text-[0.65rem] tracking-[0.16em] text-[#5b6472] dark:text-[#8a93a3]`}
          >
            PAYMENT
          </span>
        </div>

        {/* Status */}
        <div className="flex flex-col items-center text-center gap-3.5 pb-7">
          <StatusGlyph status={status} />
          <h1 className={`${display.className} text-[1.35rem] leading-tight font-bold`}>
            {copy.heading}
          </h1>
          <p className="text-sm leading-relaxed max-w-[28ch] text-[#5b6472] dark:text-[#8a93a3]">
            {copy.sub}
          </p>
        </div>

        {/* Ticket perforation */}
        <div
          aria-hidden="true"
          className="h-px -mx-7 bg-[length:12px_1px] bg-repeat-x
          bg-[linear-gradient(to_right,#e3e6eb_0,#e3e6eb_6px,transparent_6px,transparent_12px)]
          dark:bg-[linear-gradient(to_right,#22262f_0,#22262f_6px,transparent_6px,transparent_12px)]"
        />

        {/* Details */}
        <dl className="mt-6 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[0.72rem] tracking-wider uppercase text-[#5b6472] dark:text-[#8a93a3]">
              Plan
            </dt>
            <dd className="text-sm font-medium">{planLabel(data?.plan_key)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[0.72rem] tracking-wider uppercase text-[#5b6472] dark:text-[#8a93a3]">
              Reference
            </dt>
            <dd className={`${mono.className} text-sm font-medium tracking-[0.01em]`}>
              {truncateRef(paymentLinkId)}
            </dd>
          </div>
          {status === "paid" && data?.expires_at && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.72rem] tracking-wider uppercase text-[#5b6472] dark:text-[#8a93a3]">
                Valid through
              </dt>
              <dd className="text-sm font-medium">{formatExpiry(data.expires_at)}</dd>
            </div>
          )}
        </dl>

        <p className="mt-7 text-center text-[0.78rem] leading-relaxed text-[#5b6472] dark:text-[#8a93a3]">
          {copy.footnote}
        </p>
      </div>
    </main>
  );
}

function getCopy(status: Status, data: StatusData | null) {
  switch (status) {
    case "checking":
      return {
        heading: "Confirming your payment",
        sub: "Verifying the transaction with your bank. This usually takes a few seconds.",
        footnote: "Keep this tab open — it'll update automatically.",
      };
    case "paid":
      return {
        heading: "Payment confirmed",
        sub: `Your ${planLabel(data?.plan_key)} plan is now active.`,
        footnote: "You can return to the OptionXi app now. If you don't see your plan active, refresh the app or contact support (support@optionxi.com).",
      };
    case "pending":
      return {
        heading: "Still confirming",
        sub: "This is taking longer than usual. No need to retry — we'll keep watching for confirmation.",
        footnote: "If this doesn't resolve in a few minutes, check the app or contact support (support@optionxi.com).",
      };
    case "failed":
      if (data?.status === "paid_unverified_phone") {
        return {
          heading: "Payment received, verification pending",
          sub: "We got your payment, but couldn't verify your phone number.",
          footnote: "Contact support (support@optionxi.com) with your reference below to activate your plan.",
        };
      }
      return {
        heading: "Payment not completed",
        sub: "The transaction didn't go through.",
        footnote:
          "If you were charged, the amount will be reversed automatically. Contact support (support@optionxi.com) if it isn't, within a few days.",
      };
    case "not_found":
    default:
      return {
        heading: "We couldn't find this payment",
        sub: "This link may have expired or the reference is invalid.",
        footnote: "Return to the OptionXi app and start the payment again or contact support (support@optionxi.com) if you think this is an error.",
      };
  }
}

function StatusGlyph({ status }: { status: Status }) {
  if (status === "checking") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="26" className="stroke-[#e3e6eb] dark:stroke-[#22262f]" strokeWidth="2" />
        <polyline
          points="12,30 20,30 24,20 30,36 34,26 38,30 44,30"
          fill="none"
          className="stroke-[#0e8f5f] dark:stroke-[#34d399] animate-[ticker_1.4s_ease-in-out_infinite]"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 60, strokeDashoffset: 60 }}
        />
      </svg>
    );
  }

  if (status === "paid") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle
          cx="28"
          cy="28"
          r="26"
          className="fill-[#0e8f5f1a] stroke-[#0e8f5f] dark:fill-[#34d3991f] dark:stroke-[#34d399]"
          strokeWidth="2"
        />
        <path
          d="M18 29 L25 36 L39 21"
          fill="none"
          className="stroke-[#0e8f5f] dark:stroke-[#34d399] animate-[reveal_0.5s_ease-out_forwards]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 32, strokeDashoffset: 32 }}
        />
      </svg>
    );
  }

  if (status === "pending") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle
          cx="28"
          cy="28"
          r="26"
          className="fill-[#b1791f1a] stroke-[#b1791f] dark:fill-[#e0a84e1f] dark:stroke-[#e0a84e]"
          strokeWidth="2"
        />
        <path
          d="M28 17 V28 L35 33"
          fill="none"
          className="stroke-[#b1791f] dark:stroke-[#e0a84e]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // failed / not_found
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle
        cx="28"
        cy="28"
        r="26"
        className="fill-[#c53c3c1a] stroke-[#c53c3c] dark:fill-[#f0716f1f] dark:stroke-[#f0716f]"
        strokeWidth="2"
      />
      <path
        d="M21 21 L35 35 M35 21 L21 35"
        className="stroke-[#c53c3c] dark:stroke-[#f0716f]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}