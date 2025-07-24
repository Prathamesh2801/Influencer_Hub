importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

// Precache + routing
const { precaching, routing, strategies, core } = workbox;
core.skipWaiting();
core.clientsClaim();

// Precaching manifest (injected by your build tool)
precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Example runtime caching:
routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new strategies.CacheFirst()
);

// 3. Load Firebase compat scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC9AopJqvy6xh8tTzjprSHldUKZkpKwXvw",
  authDomain: "influencerhub-24ac7.firebaseapp.com",
  projectId: "influencerhub-24ac7",
  storageBucket: "influencerhub-24ac7.firebasestorage.app",
  messagingSenderId: "1074407246164",
  appId: "1:1074407246164:web:f1df82a0abb681a5caa0c1",
});

const messaging = firebase.messaging();

// Cache configuration
const CACHE_NAME = "influencer-hub-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// Install event handler
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event handler
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push notification event handler
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
  };

  event.waitUntil(
    self.registration.showNotification("Influencer Hub", options)
  );
});

// Background message handler for Firebase
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
