// offline support: page = network first (so updates arrive), image bundles = cache first,
// book pages = cache first in their own cache, kept across updates (each page is downloaded once, when first opened)
const V="als-1792004302";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(["./","manifest.webmanifest","icon-192.png"])));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="als-pages").map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url); if(e.request.method!=="GET"||u.origin!==location.origin) return;
  if(u.pathname.includes("/pages/")){ e.respondWith(caches.open("als-pages").then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok)c.put(e.request,n.clone());return n;})))); return; }
  if(u.pathname.includes("/img/")){ e.respondWith(caches.open(V).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n;})))); return; }
  e.respondWith(fetch(e.request).then(n=>{const cp=n.clone();caches.open(V).then(c=>c.put(e.request,cp));return n;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./"))));
});
