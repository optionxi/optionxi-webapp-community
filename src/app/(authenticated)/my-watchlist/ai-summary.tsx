'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

type AISummaryProps = {
  symbol: string // ✅ required now
}

export default function AISummaryFloatingButton({ symbol }: AISummaryProps) {
  if (!symbol) return null // extra safety

  return (
    <Link
      href={`/ai-stocks?symbol=${symbol}`}
      className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-50 group"
    >
      <div
        className="flex items-center gap-2 px-4 h-12 rounded-full 
        bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
        shadow-lg hover:scale-105 transition-all duration-200"
      >
        <Sparkles className="w-5 h-5 text-white" />

        {/* Label */}
        <span className="text-white text-sm font-medium">
          <span className="">AI Summary</span>
        </span>
      </div>
    </Link>
  )
}