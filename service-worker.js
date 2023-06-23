const CACHE_NAME = "V1";
const CACHED_URLS = [
    "index.html", "style.css", "script.js",
    "logo.png", "icons/manifest-icon-192.maskable.png", "icons/manifest-icon-512.maskable.png", "icons/apple-icon-180.png",
];

self.addEventListener('install', (event) => {
   console.log('Service worker installed.');

    const filesUpdate = cache => {
        const stack = [];
        CACHED_URLS.forEach(file => stack.push(
            cache.add(file).catch(_=>console.error(`can't load ${file} to cache`))
        ));
        return Promise.all(stack);
    };

    event.waitUntil(caches.open(CACHE_NAME).then(filesUpdate));
});