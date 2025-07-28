'use client'

import { PostHogProvider } from '../components/PostHogProvider'

export function PHProvider({ children }) {
  return <PostHogProvider>{children}</PostHogProvider>
}