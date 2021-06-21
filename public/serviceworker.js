const cache_name = "version-1";
const urlsToCache = ["index.html","offline.html"];
const self = this;

// install sw
self.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(cache_name)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    )
})
// listen
self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request)
            .then(()=>{
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
})
// activate sw
self.addEventListener('activate',(event)=>{
    const cacheWhiteList = [];
    cacheWhiteList.push(cache_name);
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName =>{
                if (!cacheWhiteList.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    )
})