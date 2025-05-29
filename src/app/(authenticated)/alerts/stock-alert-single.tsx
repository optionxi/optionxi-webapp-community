import { FallbackImage } from "@/components/custom/cust_fallback_image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertModel } from "@/datamodels/alerts_model";
import { format, formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";

export function StockAlertSingleItem(alert: AlertModel, styles: { border: string; bg: string; tag: string }, index: number, alertDatetime: Date) {
    return <Alert
      key={alert.id}
      className={`${styles.border} ${styles.bg} shadow-sm rounded-lg transition-all duration-300 animate-in slide-in-from-right`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-shrink-0">
          <FallbackImage
            src={`/assets/stockimages/${alert.symbol}.png`} // Assuming alert.symbol is the stock name
            alt={`${alert.symbol} logo`}
            width={60}
            height={60}
            // className={cn(
            //   "rounded-xl",
            //   "border border-gray-200 dark:border-white/20",
            //   "transition-transform duration-300",
            //   "group-hover:scale-110",
            //   "shadow-lg"
            // )} 
            />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-lg font-semibold flex items-center gap-2">
            {alert.symbol || 'Market Alert'}
            {alert.sentiment && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${styles.tag}`}>
                {alert.sentiment.toUpperCase()}
              </span>
            )}
          </AlertTitle>
          <AlertDescription>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {alert.description}
            </p>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(alertDatetime, { addSuffix: true })}</span>
              </div>
              <span className="text-gray-400">
                {format(alertDatetime, 'h:mm a')}
              </span>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  }