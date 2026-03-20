// Cache important resources during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/index.html',
        'circle.png',
        'circumference.png',
        'sphere.jpeg',
        'sphereAndCone.jpeg',
        'trigonometry.png',
        'sphereSurface.jpeg',
        'polygon.png',
        'circleSegment.png',
        'cone.jpeg',
        'conePyramidVolume.jpeg',
        'tetraFrame.jpeg',
        'frustumPyramid.jpeg',
        'frustumCone.jpeg',
        'tetrahedron.jpeg',
        'isoperimetry.png',
        'polygonApproximation.png',
        'equityFigure.png',
        'circleArea.png',
        'cubeDissection.jpeg',
        'square.png',
        'cube.jpeg'
      ]);
    })
  );
});

// Serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Check if the request is for an image
      if (event.request.destination === 'image') {
        return response || fetch(event.request).then((networkResponse) => {
          // Cache the new image and return the network response
          return caches.open('my-cache').then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }
      // For other requests, return the cached response or fetch from network
      return response || fetch(event.request).catch(() => {
        // Return the cached page if fetch fails
        return caches.match('/index.html');
      });
    })
  );
});
