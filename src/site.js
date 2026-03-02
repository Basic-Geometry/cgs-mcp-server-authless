// Cache important resources during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll([
        '/index.html',
        'geometry.jpeg',
        'square.png',
        'cubeMarkup.jpeg',
        'trigonometry.png',
        'pentagon.png',
        'areaOfACircle.jpg',
        'circleSegment.jpg',
        'circumference.jpg',
        'sphereAndCubeMarkup.jpeg',
        'sphericalCap.jpg',
        'coneAndSphereMarkup.jpeg',
        'sphereAndConeMarkup.jpeg',
        'octantSphereQuarterCone.jpeg',
        'coneAndSphereComparison.png',
        'coneMarkup.jpeg',
        'frustumOfConeMarkup.png',
        'conePyramidVolumeMarkup.jpeg',
        'tetraFrame.jpeg',
        'frustumOfPyramidMarkup.png',
        'tetrahedronMarkup.jpeg'
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
