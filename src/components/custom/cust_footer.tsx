import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-12 pb-24 md:pb-6 relative z-10">
      <div >
        {/* Main Footer Content */}
        {/* Logo and Download Section */}
        <div className="flex flex-col items-center lg:flex-row justify-between w-full px-6 lg:px-16 mb-10 gap-8 lg:gap-0">

          {/* Left Side: Logo and App Buttons */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center lg:items-start lg:grid lg:grid-cols-12 gap-4">
              {/* Logo */}
              {/* <div className="mb-2 mt-2 lg:col-span-4">
                <div className="flex items-center">
                  <img 
                    src="/assets/images/logo_xi.png" 
                    alt="OptionXi" 
                    className="h-10 w-10 rounded-lg mr-3"
                  />
                  <span className="text-gray-900 dark:text-white text-2xl font-bold">OptionXi</span>
                </div>
              </div> */}
              
              {/* Download Buttons (Updated with dark mode compatibility but kept commented) */}
              <div className="flex gap-4 lg:col-span-8">
                <a href="https://play.google.com/store/apps/details?id=com.optionxi.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 w-fit px-4 h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-sm transition-all"
                >
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                  <path d="M6.45 6.323C6.168 6.948 6 7.652 6 8.408v31.179c0 0.761 0.164 1.463 0.45 2.09l17.674-17.68L6.45 6.323z" fill="#00A3FF" />
                  <path d="M13.488 4.012C10.794 2.508 7.605 3.778 6.45 6.323L24.126 24l9.014-9.014L13.488 4.012z" fill="#00C97A" />
                  <path d="M33.14 33.014L24.126 24L6.45 41.677c1.156 2.546 4.345 3.815 7.038 2.312L33.14 33.014z" fill="#E23B5E" />
                  <path d="M41.419 28.393c1.72-0.96 2.58-2.676 2.581-4.393c-0.001-1.717-0.861-3.434-2.581-4.393l-8.279-4.621L24.126 24l9.014 9.014L41.419 28.393z" fill="#FFB800" />
                </svg>
                <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">Get it on Google Play</span>
              </a>
            </div>
            </div>
          </div>

          {/* Right Side: Social Media Section */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 items-center">
            {/* Text color updated for dark mode */}
            {/* <div className="text-gray-700 dark:text-gray-300 tracking-wide text-sm font-medium">Follow us on</div> */}
            <div className="flex gap-4">
              
              {/* Twitter (X) Link */}
              <a 
                className="h-10 w-10 p-2 flex items-center justify-center rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl" 
                href="https://x.com/OptionXi" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>

              {/* GitHub Link */}
              <a 
                className="h-10 w-10 p-2 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl" 
                href="https://github.com/optionxi" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Check our GitHub"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>

              {/* Instagram Link */}
              <a 
                className="h-10 w-10 p-2 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl" 
                href="https://www.instagram.com/optionxi/" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.25-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.441c-3.161 0-3.52.012-4.752.07-2.734.125-3.951 1.345-4.076 4.076-.058 1.232-.069 1.591-.069 4.752s.011 3.52.069 4.752c.125 2.733 1.342 3.951 4.076 4.076 1.232.058 1.591.069 4.752.069s3.52-.011 4.752-.069c2.734-.125 3.951-1.343 4.076-4.076.058-1.232.069-1.591.069-4.752s-.011-3.52-.069-4.752c-.125-2.732-1.342-3.951-4.076-4.076C15.52 3.614 15.161 3.604 12 3.604zm0 4.238c-2.404 0-4.352 1.948-4.352 4.352s1.948 4.352 4.352 4.352 4.352-1.948 4.352-4.352-1.948-4.352-4.352-4.352zm0 7.261c-1.601 0-2.909-1.308-2.909-2.909s1.308-2.909 2.909-2.909 2.909 1.308 2.909 2.909-1.308 2.909-2.909 2.909zm4.62-7.417c-.744 0-1.346-.602-1.346-1.346s.602-1.346 1.346-1.346 1.346.602 1.346 1.346-.602 1.346-1.346 1.346z"></path>
                </svg>
              </a>
              
              {/* YouTube Link */}
              <a 
                className="h-10 w-10 p-2 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl" 
                href="https://www.youtube.com/channel/UCpzBvlP9V0hWhqc1_-1Zonw" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to our YouTube channel"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.882.029 12s.459 8.55 4.356 8.816c3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.698 4.356-8.816s-.459-8.55-4.356-8.816zM9.75 15.562V8.438l6.04 3.562-6.04 3.562z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>


        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 lg:px-16 mb-8">
          
          {/* Tools */}
          <div>
            <div className="uppercase text-xs font-bold tracking-wider mb-3 text-gray-900 dark:text-white">Tools</div>
            <div className="text-xs space-y-2">
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/top-gainers">Top Gainers</a></div>
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/top-losers" >Top Losers</a></div>
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/top-volume" >Top Volume</a></div>
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/heatmap" >Heatmap</a></div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="uppercase text-xs font-bold tracking-wider mb-3 text-gray-900 dark:text-white">Resources</div>
            <div className="text-xs space-y-2">
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/scanners">Scanners</a></div>
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/screeners">Screeners</a></div>
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/bollinger-breakouts">Breakouts</a></div>
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/atlas">Atlas</a></div>
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/alerts">Alerts</a></div>
            </div>
          </div>

          {/* Trading */}
          <div>
            <div className="uppercase text-xs font-bold tracking-wider mb-3 text-gray-900 dark:text-white">Trading</div>
            <div className="text-xs space-y-2">
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/dashboard">Dashboard</a></div>
              {/* <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/portfolio" target="_blank">Portfolio</a></div> */}
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/watchlist">Watchlist</a></div>
              {/* <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/virtual-trading" target="_blank">Virtual Trading</a></div> */}
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="uppercase text-xs font-bold tracking-wider mb-3 text-gray-900 dark:text-white">Company</div>
            <div className="text-xs space-y-2">
              {/* <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://optionxi.com/features" target="_blank">Features</a></div> */}
              {/* <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://optionxi.com/pricing" target="_blank">Pricing</a></div> */}
              {/* <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://docs.optionxi.com" target="_blank">Documentation</a></div> */}
              <div><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" href="https://app.optionxi.com/feature-request" target="_blank">Feature Request</a></div>
            </div>
          </div>
        </div>

        {/* Financial Disclaimer */}
        <div className="px-6 lg:px-16 mb-6">
          <div className="bg-gray-100 dark:bg-[#1a1b2e] rounded-xl p-4 text-gray-700 dark:text-gray-300">
            <div className="font-bold uppercase text-xs mb-2 text-gray-900 dark:text-white">Financial Content Disclaimer</div>
            <div className="text-xs leading-relaxed">
              The content provided on OptionXi is for educational and informational purposes only and does not constitute financial advice, investment recommendations, or trading signals. OptionXi is a virtual trading platform designed for learning and simulation purposes. All trading activities on our platform are virtual and do not involve real money transactions. We strongly advise users to conduct their own research or consult with qualified financial advisors before making any actual financial decisions. OptionXi does not guarantee the accuracy of market data, trading results, or any information provided by our platform. Virtual trading results do not represent actual trading performance and may not reflect the impact of market liquidity, fees, or other real trading conditions. Users should be aware that past performance in virtual trading does not guarantee future results in real trading. Always ensure that any financial decision aligns with your personal financial situation, risk tolerance, and investment goals. Please read our 
              <a className="underline hover:text-black dark:hover:text-gray-100 ml-1 mr-1" href="https://optionxi.com/privacy-policy">Privacy Policy </a>
              and 
              <a className="underline hover:text-black dark:hover:text-gray-100 ml-1" href="https://optionxi.com/terms-of-use">Terms of use </a>
               to understand more.
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="px-6 lg:px-16 mb-6 text-gray-700 dark:text-gray-300">
          <div className="uppercase text-xs font-bold tracking-wider mb-2 text-gray-900 dark:text-white">About OptionXi</div>
          <div className="text-xs leading-relaxed">
            OptionXi is India&apos;s open source virtual trading platform designed for stock market education and simulation. Our platform provides comprehensive tools for learning NSE stock trading, Nifty 50 strategies, and options trading on Bank Nifty and Nifty indices. With features like advanced stock screeners, real-time alerts, interactive heatmaps, top gainers/losers tracking, and detailed stock analysis, OptionXi empowers traders and investors to develop their skills in a risk-free environment. Whether you&apos;re a beginner learning market basics or an experienced trader testing new strategies, OptionXi provides the tools and insights needed to enhance your trading education.
          </div>
        </div>

        {/* Popular Stocks Section */}
        <div className="px-6 lg:px-16 mb-6 text-gray-700 dark:text-gray-300">
          <div className="uppercase text-xs font-bold tracking-wider mb-2 text-gray-900 dark:text-white">Popular Stocks</div>
          <div className="text-xs leading-relaxed">
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/RELIANCE">RELIANCE</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/TCS">TCS</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HDFCBANK">HDFCBANK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/INFY">INFY</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ICICIBANK">ICICIBANK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/SBIN">SBIN</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ITC">ITC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BHARTIARTL">BHARTIARTL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/LT">LT</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BAJFINANCE">BAJFINANCE</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/MARUTI">MARUTI</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/TATAMOTORS">TATAMOTORS</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ASIANPAINT">ASIANPAINT</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/AXISBANK">AXISBANK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/KOTAKBANK">KOTAKBANK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/WIPRO">WIPRO</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HCLTECH">HCLTECH</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/TECHM">TECHM</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ULTRACEMCO">ULTRACEMCO</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/SUNPHARMA">SUNPHARMA</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/TITAN">TITAN</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/NESTLEIND">NESTLEIND</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HINDUNILVR">HINDUNILVR</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/POWERGRID">POWERGRID</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/NTPC">NTPC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/COALINDIA">COALINDIA</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ONGC">ONGC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BPCL">BPCL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/IOC">IOC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/GRASIM">GRASIM</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/JSWSTEEL">JSWSTEEL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/TATASTEEL">TATASTEEL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HINDALCO">HINDALCO</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/VEDL">VEDL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/CIPLA">CIPLA</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/DRREDDY">DRREDDY</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/DIVISLAB">DIVISLAB</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/APOLLOHOSP">APOLLOHOSP</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HEROMOTOCO">HEROMOTOCO</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BAJAJ-AUTO">BAJAJ-AUTO</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/M&M">M&M</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/EICHERMOT">EICHERMOT</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/TATACONSUM">TATACONSUM</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BRITANNIA">BRITANNIA</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/UPL">UPL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ADANIPORTS">ADANIPORTS</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ADANIENT">ADANIENT</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/INDUSINDBK">INDUSINDBK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BAJAJFINSV">BAJAJFINSV</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HDFCLIFE">HDFCLIFE</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/SBILIFE">SBILIFE</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/LTIM">LTIM</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/INDIGO">INDIGO</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ZOMATO">ZOMATO</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/PAYTM">PAYTM</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/NYKAA">NYKAA</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/DMART">DMART</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/TRENT">TRENT</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/IRCTC">IRCTC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HAL">HAL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BEL">BEL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ADANIGREEN">ADANIGREEN</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/SUZLON">SUZLON</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/RVNL">RVNL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/IRFC">IRFC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/PFC">PFC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/RECLTD">RECLTD</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BANKBARODA">BANKBARODA</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/PNB">PNB</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/CANBK">CANBK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/UNIONBANK">UNIONBANK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/FEDERALBNK">FEDERALBNK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/IDBI">IDBI</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/YESBANK">YESBANK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/BANDHANBNK">BANDHANBNK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/AUBANK">AUBANK</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/IDFCFIRSTB">IDFCFIRSTB</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/SHRIRAMFIN">SHRIRAMFIN</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/CHOLAFIN">CHOLAFIN</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/M&MFIN">M&MFIN</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/MFSL">MFSL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ABCAPITAL">ABCAPITAL</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/LICHSGFIN">LICHSGFIN</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/POONAWALLA">POONAWALLA</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/LICI">LICI</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ICICIGI">ICICIGI</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/ICICIPRULI">ICICIPRULI</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/SBICARD">SBICARD</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/HDFCAMC">HDFCAMC</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/POLICYBZR">POLICYBZR</a><span className="mx-1 text-gray-400 dark:text-white/60">|</span></span>
            <span className="inline-block"><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://app.optionxi.com/stocks/JIOFIN">JIOFIN</a></span>
            </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-6"></div>

        {/* Bottom Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm mb-4">
          {/* <a href="https://optionxi.com/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Help</a> */}
          {/* <a href="https://optionxi.com/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">About</a> */}
          <a href="https://optionxi.com/privacy-policy" target="_blank" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Privacy policy</a>
          <a href="https://optionxi.com/terms-of-use" target="_blank" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Terms of use</a>
          {/* <a href="https://optionxi.com/refunds" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Refunds</a> */}
        </div>

        {/* Copyright */}
       <div className="text-xs text-center text-gray-500 dark:text-gray-400 py-3 mx-4">
          © OptionXi. All rights reserved. Made with
          <Heart className="inline-block mx-1 h-3 w-3 text-red-500 fill-red-500" />
          for traders in India. For queries, feedback or suggestions please email us at 
          <a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ml-1" href="mailto:support@optionxi.com">
            support@optionxi.com
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;