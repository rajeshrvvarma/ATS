// Inline Manifest Generator for PWA fallback
// Creates manifest dynamically when external manifest.json fails to load

export const createInlineManifest = () => {
  const manifestData = {
    "name": "Agnidhra Technologies - Cybersecurity Training",
    "short_name": "AT-CS Training", 
    "description": "Professional cybersecurity training platform with hands-on bootcamps and advanced courses",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0f172a",
    "theme_color": "#0ea5e9",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "en",
    "categories": ["education", "business", "productivity"],
    "icons": [
      {
        "src": "/logo.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/logo.png", 
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "shortcuts": [
      {
        "name": "Course Dashboard",
        "short_name": "Dashboard",
        "description": "Access your learning dashboard",
        "url": "/dashboard",
        "icons": [
          {
            "src": "/logo.png",
            "sizes": "96x96",
            "type": "image/png"
          }
        ]
      }
    ]
  };

  return manifestData;
};

export const injectInlineManifest = () => {
  // Check if manifest link already exists
  const existingManifest = document.querySelector('link[rel="manifest"]');
  
  if (existingManifest) {
    // Try to fetch the existing manifest first
    fetch(existingManifest.href)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Manifest fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then(manifest => {
        console.log('✅ External manifest loaded successfully');
      })
      .catch(error => {
        console.warn('❌ External manifest failed, using inline fallback:', error.message);
        
        // Remove failed manifest link
        existingManifest.remove();
        
        // Create inline manifest
        const manifestData = createInlineManifest();
        const manifestBlob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' });
        const manifestUrl = URL.createObjectURL(manifestBlob);
        
        // Create new manifest link
        const newManifestLink = document.createElement('link');
        newManifestLink.rel = 'manifest';
        newManifestLink.href = manifestUrl;
        
        // Add to document head
        document.head.appendChild(newManifestLink);
        
        console.log('✅ Inline manifest injected successfully');
      });
  } else {
    // No manifest link exists, create one
    console.log('📱 Creating inline manifest...');
    
    const manifestData = createInlineManifest();
    const manifestBlob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = manifestUrl;
    
    document.head.appendChild(manifestLink);
    console.log('✅ Inline manifest created and injected');
  }
};

export default { createInlineManifest, injectInlineManifest };