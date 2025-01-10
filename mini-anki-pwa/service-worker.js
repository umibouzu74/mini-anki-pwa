// キャッシュ名とキャッシュするファイルの指定
const CACHE_NAME = 'mini-anki-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './style.css',         // CSSを別ファイルで読み込む場合
  './service-worker.js',
  './icon-192.png',
  './icon-512.png'
  // 必要に応じてJSや画像ファイルを足していく
];

// インストール時にキャッシュにファイルを追加
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエストがあったときにキャッシュを返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返し、なければネットワークからフェッチ
        return response || fetch(event.request);
      })
  );
});

// 新しいバージョンのキャッシュが有効になったときに古いキャッシュを削除
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
