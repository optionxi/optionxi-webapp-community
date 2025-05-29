'use client'

import { Sparkles } from 'lucide-react'

export default function AISummary() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-50 blur-xl"></div>
        <div className="relative rounded-lg p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Summary</h2>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Intelligent insights at your fingertips.
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-green-400 font-medium">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}