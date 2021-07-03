'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "825b9f30aa83b271c61867f29ebf67a1",
"index.html": "c6ad2df03badf9b7223f83d9e3f23344",
"/": "c6ad2df03badf9b7223f83d9e3f23344",
"main.dart.js": "4541eeb945adad277ac5cc1f5f4fe4f2",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "95d90b3ce2e111e0faf4d8fea3bb114e",
"assets/images/amplop.svg": "8ccf9de200874ffa9348738440ed6ff5",
"assets/images/kiri_atas.svg": "360fe1326e64143b53d32ff9fc1da21a",
"assets/images/lonceng.svg": "bc5204552a381f61739fb9a46caf0390",
"assets/images/home.svg": "e46839403b098b8d8c6374a336d02dc8",
"assets/images/layanan.svg": "d264c54e1a2ae67fb498976f63bfadd0",
"assets/images/profil.svg": "7ae698768ee9f7abd00e8e255a3d046d",
"assets/images/lain_lain.svg": "1890e902fa75a9f700ff55af592e253e",
"assets/images/ms_smartphones.jpeg": "208598516256b329c1a632421bd4caa3",
"assets/images/jualanku.svg": "84eef4bce541e9b705ccf49425908be9",
"assets/images/pembiayaan_lainnya.svg": "15a19cddabba83dba101543b25cef61c",
"assets/images/lupa_password.svg": "5efe3482b226988b83d225886111c516",
"assets/images/ms_sepeda.jpg": "f6fdb8fd73320d9f4ea93f374cea7944",
"assets/images/logo_simpel.svg": "34b7cffd2e277f2b503d6f33ff9f71c6",
"assets/images/ms_air_water_purifier.jpeg": "baa5cea1387fd4aa8c424090eb57631a",
"assets/images/pmak2.svg": "759acea2facd9d236d4096e20ffc1de2",
"assets/images/simpanan.svg": "9bf8c96e4288693e63f0ac5d647570b8",
"assets/images/pembiayaan.svg": "c0372886896191b0d26c829fa13c4899",
"assets/images/gembok.svg": "254aaea64540b45764da9f49863da0f6",
"assets/images/logo_kiselgroup.svg": "21b3ec5a840dd95601951f5310a4be96",
"assets/images/coway_slider.png": "c474777165e43ba8b6b03f9affb6e811",
"assets/images/kembali.svg": "b527ffaa12e0ae6c1887575d1743b02b",
"assets/images/pdsak.svg": "2469fae1616fec559409a5d2c94549cc",
"assets/images/bukti_potong.svg": "7563da24160f81724434ddf21b60d6a2",
"assets/images/pinjaman.svg": "0ed37b5a95a20a13ec450a5ef58b53ff",
"assets/images/shu.svg": "41b583d8b4cf85f4b66845594dd0ec76",
"assets/images/foto.svg": "8aeb558ff487899953876b2fbf108fcb",
"assets/images/tambah.svg": "4a21c2b7474281d62702de2a71055f8e",
"assets/images/pmak.svg": "759acea2facd9d236d4096e20ffc1de2",
"assets/images/kanan_bawah.svg": "c2cb153bc6e7d8d5648d61ef2c51fd42",
"assets/images/kartuanggota.png": "30f9a554bd88c8ae4b6e4693e9beda08",
"assets/AssetManifest.json": "742dd081c6dabd3d81bd9d02b4dcb28b",
"assets/NOTICES": "df6d6b0423e098703ec4e5eb32417d3d",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
