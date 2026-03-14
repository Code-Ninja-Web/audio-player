/* eslint-disable no-restricted-globals */

if ('undefined' === typeof window) {
    // eslint-disable-next-line no-undef
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js'
    )

    const workbox = this['workbox']

    const IMAGE_CACHE = 'images'
    const FONT_CACHE = 'fonts'

    // Note: Ignore the error that Glitch raises about workbox being undefined.
    workbox.setConfig({
        debug: false,
    })

    self.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
            self.skipWaiting()
        }
    })

    // Demonstrates a custom cache name for a route.
    workbox.routing.registerRoute(
        ({ event }) => event.request.destination === 'image',
        new workbox.strategies.CacheFirst({
            cacheName: IMAGE_CACHE,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 30,
                }),
            ],
        })
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
        })
    )
}
