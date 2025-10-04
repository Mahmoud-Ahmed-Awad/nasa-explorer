# NASA Frontend Assets

This directory contains all image assets used in the NASA Frontend application.

## 📁 Directory Structure

```
assets/
├── exoplanets/      - Exoplanet images (17 files needed)
├── missions/        - Mission spacecraft images (16 files needed)
├── satellites/      - Satellite images (26 files needed)
├── team/            - Team member photos (8 files needed)
└── lensflare/       - Lens flare textures (2 files needed)
```

## 🚀 Quick Start

### Option 1: Run the Image Downloader (Recommended)

```bash
# Download images from NASA APIs automatically
node scripts/download-nasa-images.js
```

This will download default images from NASA's public APIs.

### Option 2: Manual Download from NASA

**Free NASA Image Sources:**

1. [NASA Image Gallery](https://images.nasa.gov/)
2. [ESA/Hubble Gallery](https://esahubble.org/images/)
3. [JPL Photojournal](https://photojournal.jpl.nasa.gov/)
4. [SpaceX Flickr](https://www.flickr.com/photos/spacex/)

**Steps:**

1. Search for relevant images (e.g., "Kepler 442b", "JWST", etc.)
2. Download high-resolution images
3. Rename to match required filenames (see REQUIRED_IMAGES.md)
4. Place in appropriate folders

### Option 3: Use Placeholders

For testing, you can use simple colored placeholder images:

**Online Placeholder Generators:**

- https://placeholder.com/
- https://via.placeholder.com/

Example URLs:

```
https://via.placeholder.com/800x600/1a1a2e/16213e?text=Exoplanet
https://via.placeholder.com/1200x800/0f3460/16213e?text=Mission
https://via.placeholder.com/800x600/533483/16213e?text=Satellite
```

## 📋 Required Files by Priority

### High Priority (App won't load 3D scene without these)

```
lensflare/
  - lensflare0.png  ⚠️ CRITICAL
  - lensflare3.png  ⚠️ CRITICAL
```

**Download lens flare textures from:**

```bash
# Option 1: From Three.js GitHub
https://github.com/mrdoob/three.js/tree/dev/examples/textures/lensflare

# Option 2: Create simple circular gradient PNGs
# (Use Photoshop, GIMP, or online tools)
```

### Medium Priority (Fallback defaults)

```
exoplanets/default.jpg
missions/default.jpg
satellites/default.jpg
```

### Low Priority (Specific images, can use defaults)

All other specific planet, mission, and satellite images.

## 🎨 Image Specifications

| Category   | Size       | Format | Notes                                   |
| ---------- | ---------- | ------ | --------------------------------------- |
| Exoplanets | 800x600px  | JPG    | Artist concepts, NASA-approved imagery  |
| Missions   | 1200x800px | JPG    | Spacecraft, facilities, mission patches |
| Satellites | 800x600px  | JPG    | Satellite photos, diagrams              |
| Team       | 400x400px  | JPG    | Square, professional headshots          |
| Lens Flare | 512x512px+ | PNG    | Transparent background required         |

## 📝 Complete File List

See `REQUIRED_IMAGES.md` for the complete list of all 69 required image files.

## ⚖️ License & Attribution

**NASA Images:**

- Most NASA images are **public domain**
- No attribution required for NASA images
- Always verify specific image licenses

**Third-Party Images:**

- Check individual licenses
- Provide attribution as required
- ESA/Hubble may require credit line

**Recommended Attribution Format:**

```
Image Credit: NASA/JPL-Caltech
Image Credit: ESA/Hubble & NASA
```

## 🛠️ Troubleshooting

### Images not showing?

1. Check file names match exactly (case-sensitive on some systems)
2. Verify file extensions (.jpg not .jpeg)
3. Check browser console for 404 errors
4. Clear browser cache

### Lens flare not working?

1. Ensure PNG files have transparent backgrounds
2. Check file names: `lensflare0.png` and `lensflare3.png`
3. Verify files are in `public/assets/lensflare/`

### Performance issues?

1. Compress images (use tinypng.com or similar)
2. Convert to WebP format for better compression
3. Ensure images aren't larger than specified dimensions

## 📦 Size Estimates

- Exoplanets: ~10-15 MB
- Missions: ~15-20 MB
- Satellites: ~15-20 MB
- Team: ~2-3 MB
- Lens Flare: ~1 MB
- **Total: 45-60 MB**

## 🔄 Updating Images

To replace an image:

1. Keep the same filename
2. Match the recommended dimensions
3. Use the same format (JPG/PNG)
4. Optimize before uploading

## 📞 Support

For issues with images:

1. Check REQUIRED_IMAGES.md for complete list
2. Run the download script
3. Verify file paths and names
4. Check browser developer tools for errors

---

_Last Updated: October 2, 2025_
