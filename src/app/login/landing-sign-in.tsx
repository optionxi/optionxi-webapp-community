"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart2, PieChart, Activity, Bell } from "lucide-react"
import SignInCard from "./components/sign-in-section"
import { AnalyticCard } from "./components/analytics-card"

export default function SignInLandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center p-2 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex md:flex-col md:justify-center md:space-y-4"
          >
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                OptionXi
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience the future of trading with our cutting-edge platform.
            </p>
            <div className="grid grid-cols-2 gap-4">
              
            {/* <AnalyticCard
              title="Heatmap"
              value="Market Heatmap"
              icon={<BarChart2 className="h-4 w-4 text-blue-500" />}
              change="Visual stock analysis"
              changeDirection="neutral"
              link="/heatmap"
            />
            <AnalyticCard
              title="Screeners"
              value="Custom Filters"
              icon={<PieChart className="h-4 w-4 text-purple-500" />}
              change="Find stocks by criteria"
              changeDirection="neutral"
              link="/screeners"
            /> */}

            <AnalyticCard
              title="Market Sentiments"
              value="Market Sentiments"
              icon={<BarChart2 className="h-4 w-4 text-blue-500" />}
              change="Visual market sentiments"
              changeDirection="neutral"
              link="/atlas"
            />
            <AnalyticCard
              title="Screeners"
              value="Custom Filters"
              icon={<PieChart className="h-4 w-4 text-purple-500" />}
              change="Find stocks by criteria"
              changeDirection="neutral"
              link="/screeners"
            />
            <AnalyticCard
              title="Scanners"
              value="Live Scans"
              icon={<Activity className="h-4 w-4 text-yellow-500" />}
              change="Real-time stock scanners"
              changeDirection="neutral"
              link="/scanners"
            />
            <AnalyticCard
              title="Stock Alerts"
              value="Stock Alerts"
              icon={<Bell className="h-4 w-4 text-orange-500" />}
              change="Never miss a move"
              changeDirection="neutral"
              link="/alerts"
            />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <SignInCard />
          </motion.div>
        </div>
      </main>

      <footer className="mt-auto p-4 text-center text-sm text-muted-foreground">
        © 2025 OptionXi. All rights reserved.
      </footer>
    </div>
  )
}