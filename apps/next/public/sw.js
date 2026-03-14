/* eslint-disable no-restricted-globals */

if ('undefined' === typeof window) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js')

  const workbox = this['workbox']
  const IMAGE_CACHE = 'images'
  const FONT_CACHE = 'fonts'

  workbox.setConfig({
    debug: false,
  })

  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting()
    }
  })

  workbox.routing.registerRoute(
    ({ event }) => event.request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: IMAGE_CACHE,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
        }),
      ],
    }),
  )

  workbox.routing.registerRoute(
    ({ event }) => event.request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: FONT_CACHE,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 15,
        }),
      ],
    }),
  )

  // Keep metadata endpoints network-first so channel updates don't get stale.
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.includes('/rest/') || url.pathname.includes('/air-channels'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'channel-metadata',
      networkTimeoutSeconds: 3,
    }),
  )
}
