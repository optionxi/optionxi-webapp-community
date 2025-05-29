'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ReactNode } from 'react'

if (typeof window !== 'undefined') {
  posthog.init(
    process.env.NEXT_PUBLIC_POSTHOG_KEY as string, 
    {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
      person_profiles: 'identified_only' as const, // or 'always' to create profiles for anonymous users as well
      capture_pageview:false,
      capture_pageleave:true
    }
  )
}

interface CSPostHogProviderProps {
  children: ReactNode
}

export function CSPostHogProvider({ children }: CSPostHogProviderProps) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}