const CACHE_NAME = 'weather-app-cache-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/current-weather.png',
    '/icons/forecast.png',
    OFFLINE_URL
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL);
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        );
    }
});

self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-weather') {
        event.waitUntil(updateWeather());
    }
});

async function updateWeather() {
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => {
        client.postMessage({ type: 'WEATHER_UPDATE' });
    });
}

