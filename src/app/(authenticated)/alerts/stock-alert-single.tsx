import React from "react";
import { FallbackImage } from "@/components/custom/cust_fallback_image";
import { Alert } from "@/components/ui/alert";
import { format, formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { AlertModel } from "@/datamodels/alerts_model";

type Props = {
  alert: AlertModel;
  styles: { border: string; bg: string; tag: string };
  index: number;
  alertDatetime: Date;
};

export default function StockAlertSingleItem({ alert, styles, index, alertDatetime }: Props) {
  const ltp = alert.close;
  const pct = alert.pcnt;
  const pctText = pct !== null && pct !== undefined ? `${pct.toFixed(2)}%` : "--";

  // small helper to choose color for pct
  const pctClass = pct !== null && pct !== undefined
    ? pct > 0
      ? "text-emerald-600"
      : pct < 0
      ? "text-rose-600"
      : "text-gray-500"
    : "text-gray-400";

  return (
    <Alert
      key={alert.id}
      className={`${styles.border} ${styles.bg} shadow-sm rounded-lg transition-all duration-300 animate-in slide-in-from-right`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <FallbackImage
            src={`/assets/stockimages/${alert.symbol??"default"}.png`}
            alt={`${alert.symbol ?? "Market"} logo`}
            width={56}
            height={56}
            className="rounded-xl border border-gray-100 dark:border-white/10 shadow-sm"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold truncate">{alert.symbol || "Market Alert"}</span>
                {alert.sentiment && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles.tag}`}>{alert.sentiment.toUpperCase()}</span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate">{alert.description}</p>
            </div>

            {/* LTP block - minimal and on the right */}
            <div className="flex flex-col items-end ml-3">
              <span className="text-sm text-gray-500">LTP</span>
              <div className="mt-1 text-right">
                <div className="text-base font-semibold">{ltp !== null && ltp !== undefined ? ltp.toFixed(2) : "--"}</div>
                <div className={`text-xs ${pctClass}`}>{pctText}</div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(alertDatetime, { addSuffix: true })}</span>
            </div>
            <span>{format(alertDatetime, "h:mm a")}</span>
          </div>
        </div>
      </div>
    </Alert>
  );
}
