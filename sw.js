importScripts('js/sw-utils.js')

const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v1'
const INMUTABLE_CACHE = 'inmutable-v1'

const APP_SHELL = [
  '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
]

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
]

self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
  const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE))

  const cachePromise = Promise.all([ cacheStatic, cacheInmutable ])

  e.waitUntil(cachePromise)
})

self.addEventListener('activate', e => {
  const cleanPromises = Promise.all([ cleanStaticCache(), cleanInmutableCache(), cleanDynamicCache() ])

  e.waitUntil(cleanPromises)
})

self.addEventListener('fetch', e => {
  const res = caches.match(e.request).then(res => {
    if(res) return res

    return fetch(e.request).then(newRes => {
      return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes)
    })
  })

  return e.respondWith(res)
})