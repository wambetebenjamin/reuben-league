'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[reuben-league] global error', error)
  }, [error])

  return (
    <html lang="en-KE">
      <body style={{ fontFamily: 'Muli, Arial, sans-serif', margin: 0, background: '#ffffff', color: '#25262a' }}>
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f23a2e', fontWeight: 900 }}>
            Error 500
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '12px 0' }}>The scoreboard hit a snag</h1>
          <p style={{ color: '#989898', lineHeight: 1.7 }}>
            Something broke while loading Reuben League. Your league data is safe. Try again, or message us on WhatsApp
            at +254 112 272 061.
          </p>
          <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#f23a2e',
                color: '#ffffff',
                border: '2px solid #f23a2e',
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: '2px solid #000000',
                color: '#000000',
                padding: '12px 24px',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Homepage
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
