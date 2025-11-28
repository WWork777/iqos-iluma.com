'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function YandexAd({
  blockId,
  renderTo,
  className = '',
  onError,
  onLoad,
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      const adContainer = document.getElementById(renderTo)
      if (adContainer) adContainer.innerHTML = ''
    }
  }, [renderTo])

  useEffect(() => {
    if (!isMounted) return

    const initAd = () => {
      try {
        window.yaContextCb.push(() => {
          if (window.Ya?.Context?.AdvManager) {
            window.Ya.Context.AdvManager.render({
              blockId,
              renderTo,
            })
            onLoad?.()
          } else {
            throw new Error('Yandex Context API not available')
          }
        })
      } catch (error) {
        onError?.(error)
        console.error('YandexAd error:', error)
      }
    }

    if (window.Ya?.Context?.AdvManager) {
      initAd()
    } 
    else if (window.yaContextCb) {
      window.yaContextCb.push(initAd)
    }
  }, [blockId, renderTo, isMounted, onLoad, onError])

  return (
    <>
      <div
        id={renderTo}
        className={`yandex-ad-container ${className}`}
        style={{ display: 'inline-block' }}
      />

      {isMounted && !window.Ya?.Context?.AdvManager && (
        <Script
          id="yandex-context-js"
          src="https://yandex.ru/ads/system/context.js"
          strategy="afterInteractive"
          async
          onError={e => {
            onError?.(new Error(`Failed to load Yandex Context: ${e.message}`))
          }}
          onLoad={() => {
          }}
        />
      )}
    </>
  )
}