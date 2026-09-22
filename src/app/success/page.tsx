"use client";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Smartphone } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Define allowed brokers to prevent path traversal
const ALLOWED_BROKERS = ['zerodha', 'upstox', 'angelone', 'icicidirect', 'kotak', 'fyers', 'aliceblue'] as const;
type AllowedBroker = typeof ALLOWED_BROKERS[number];

// Validate and sanitize broker name
function getSafeBrokerName(broker: string | null): AllowedBroker | null {
  if (!broker) return null;
  
  const normalizedBroker = broker.toLowerCase().trim();
  return ALLOWED_BROKERS.includes(normalizedBroker as AllowedBroker) 
    ? normalizedBroker as AllowedBroker 
    : null;
}

// Basic sanitization for display strings
function sanitizeDisplayString(input: string | null): string {
  if (!input) return 'N/A';
  
  return input
    .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
    .slice(0, 100) // Limit length
    .trim();
}

function SuccessContent() {
  const searchParams = useSearchParams();

  const brokerParam = searchParams?.get("broker") ?? "";
  const userId = searchParams?.get("user_id") ?? "";
  const userName = searchParams?.get("user_name") ?? "";


  // Validate broker name to prevent path traversal
  const safeBroker = getSafeBrokerName(brokerParam);
  
  // Show error if broker is invalid
  if (!safeBroker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border border-red-100/50 dark:border-red-800/30">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Invalid Broker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The specified broker &ldquo;{brokerParam}&ldquo; is not supported or invalid.
          </p>
          <button 
            onClick={() => window.close()} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border border-green-100/50 dark:border-green-800/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center border-2 border-green-100">
              {/* SECURE: Only use validated broker names */}
              <Image 
                src={`/assets/brokers/${safeBroker}.png`}
                alt={`${safeBroker} logo`}
                width={60}
                height={60}
                className="object-contain"
                onError={(e) => {
                  // Fallback to a default image if broker image fails
                  const img = e.target as HTMLImageElement;
                  img.src = '/assets/brokers/default.png';
                }}
              />
            </div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Successfully Connected!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Your trading account is now linked with{" "}
            <span className="font-semibold text-green-600 dark:text-green-400 capitalize">
              {safeBroker}
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 text-left mb-8 border border-green-100/50 dark:border-green-800/30"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">User ID:</span>
              <span className="font-mono font-semibold text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-lg">
                {sanitizeDisplayString(userId)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">User Name:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-lg">
                {sanitizeDisplayString(userName)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-3 text-green-600 dark:text-green-400 mb-4">
            <Smartphone className="w-6 h-6" />
            <span className="font-medium text-lg">Ready to Trade!</span>
            <ArrowRight className="w-5 h-5" />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-blue-800 dark:text-blue-300 font-medium text-sm leading-relaxed">
              🎉 You&apos;re all set! You can now close this window and return to the app to start placing orders.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Connection established • Access token secured • Ready for trading
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// 🔹 Skeleton Fallback
function SuccessSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4 mx-auto mb-3" />
        <Skeleton className="h-6 w-5/6 mx-auto mb-8" />
        <div className="space-y-4 mb-8">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}