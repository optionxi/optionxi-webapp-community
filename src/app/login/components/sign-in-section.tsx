"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signIn } from "next-auth/react"

const catchyPhrases = [
  "Trade Smarter, Not Harder",
  "Your Gateway to Financial Success",
  "Unlock the Power of Intelligent Trading",
  "Where Traders Become Champions",
]

export default function SignInCard() {
  const [isHovered, setIsHovered] = useState(false)

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="overflow-hidden relative border-border backdrop-blur-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <CardContent className="p-8 relative z-10">
          <motion.div
            className="mb-8 text-center"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/assets/images/logo_xi.png"
              alt="TradePro Logo"
              width={100}
              height={100}
              className="mx-auto mb-6 drop-shadow-lg"
            />
            <h2 className="mb-2 text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Sign In to OptionXi
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">Your journey to smarter trading starts here</p>
          </motion.div>
          <div className="space-y-6">
            <Button
              variant="outline"
              className="w-full backdrop-blur-sm transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="/assets/svgs/google.svg"
                alt="Google icon"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 py-1 text-muted-foreground rounded-full backdrop-blur-sm">
                  Discover the OptionXi Advantage
                </span>
              </div>
            </div>
            <ul className="space-y-3">
              {catchyPhrases.map((phrase, index) => (
                <motion.li
                  key={index}
                  className="flex items-center text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="mr-2 text-blue-500 text-lg">✓</span>
                  {phrase}
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Card>
    </motion.div>
  )
}