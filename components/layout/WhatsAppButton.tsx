'use client'

import { useEffect, useState } from 'react'
import { WHATSAPP_REGISTER_LINK } from '@/lib/site'

export function WhatsAppButton() {
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setPulse(false), 6000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="fixed right-6 bottom-6 bottom-safe z-[9998] flex flex-col items-end gap-2">
      <span
        id="whatsapp-tooltip"
        className="pointer-events-none hidden sm:block bg-ink text-white text-xs font-bold px-3 py-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Chat with us on WhatsApp
      </span>
      <div className="relative group">
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full bg-brand-green/40 ${pulse ? 'animate-pulse-ring' : ''}`}
        />
        <a
          href={WHATSAPP_REGISTER_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          aria-describedby="whatsapp-tooltip"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-brand-green text-white shadow-lg hover:bg-[#79b13c] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" fill="currentColor">
            <path d="M16.04 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.25.6 4.45 1.72 6.39L3.2 28.8l6.6-1.73a12.77 12.77 0 0 0 6.24 1.6h.01c7.05 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.04a12.7 12.7 0 0 0-9.05-3.63Zm0 23.4h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.02 1.05 1.08-3.92-.25-.4a10.57 10.57 0 0 1-1.62-5.63c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.5 1.11 7.5 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.6-10.64 10.6Zm5.83-7.94c-.32-.16-1.9-.94-2.19-1.05-.29-.1-.5-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
