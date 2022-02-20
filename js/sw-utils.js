const cleanVersionsCache = (currentCache, cacheName) => {
  caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== currentCache && key.includes(cacheName))
        caches.delete(key)
    })
  })
}

const cleanStaticCache = () => cleanVersionsCache(STATIC_CACHE, 'static')
const cleanInmutableCache = () => cleanVersionsCache(INMUTABLE_CACHE, 'inmutable')
const cleanDynamicCache = () => cleanVersionsCache(DYNAMIC_CACHE, 'dynamic')

const updateDynamicCache = (dynamicCache, req, res) => {
  if(res.ok)
    return caches.open(dynamicCache).then(cache => {
      cache.put(req, res.clone())
      return res.clone()
    })

  return res
}