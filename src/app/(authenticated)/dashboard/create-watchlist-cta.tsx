import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle,} from "lucide-react";
import Link from 'next/link';

const WatchListCTA = () => {
  return (
    <section className="relative w-full pt-3 pb-16 overflow-hidden">
      {/* Background gradient and blur effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20" /> */}
      
      {/* Decorative elements */}
      {/* <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl opacity-30" /> */}
      {/* <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl opacity-30" /> */}

      {/* Content container with glassmorphism */}
      <div className="container relative mx-auto px-4">
        {/* <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-2xl p-8 border border-gray-200/20 dark:border-gray-700/20 shadow-xl"> */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Floating icons */}
            {/* <div className="relative w-full h-12 mb-4">
              <PlayCircle className="absolute left-1/4 top-0 text-blue-500 animate-bounce" size={28} />
              <Star className="absolute right-1/4 top-4 text-yellow-500 animate-pulse" size={28} />
            </div> */}

            {/* Main content */}
            {/* <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Create Your Watchlist
            </h2>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
              Track your favorite shows and movies all in one place. Never miss an update about what you love to watch.
            </p> */}

            {/* Modern CTA button with hover effects */}
            <Link href="/my-watchlist">
                <Button 
                size="lg"
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                            dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600
                            text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                            rounded-xl px-8 py-6 h-auto text-lg font-medium"
                >
                <PlusCircle className="mr-2 h-5 w-5 animate-pulse" />
                Add Your Stocks to watchlist
                </Button>
            </Link>
            

            {/* Stats section */}
            <div className="flex flex-wrap justify-center gap-8 mt-8 pt-8 border-t border-gray-200/20 dark:border-gray-700/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">10K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">50K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Watchlists Created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">100K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Movies Tracked</p>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </section>
  );
};

export default WatchListCTA;