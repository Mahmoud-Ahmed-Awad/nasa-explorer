# Required Asset Images

This file lists all images required by the NASA Frontend application.

## Directory Structure

```
public/assets/
├── exoplanets/
│   ├── default.jpg
│   ├── kepler-442b.jpg
│   ├── proxima-b.jpg
│   ├── trappist-1e.jpg
│   ├── kepler-452b.jpg
│   ├── k2-18b.jpg
│   ├── kepler-186f.jpg
│   ├── kepler-62f.jpg
│   ├── hd-40307g.jpg
│   ├── 51-pegasi-b.jpg
│   ├── hd-189733b.jpg
│   ├── wasp-121b.jpg
│   ├── kepler-16b.jpg
│   ├── gj-1214b.jpg
│   ├── kepler-22b.jpg
│   ├── 55-cancri-e.jpg
│   └── kepler-10b.jpg
│
├── missions/
│   ├── default.jpg
│   ├── kepler.jpg
│   ├── tess.jpg
│   ├── jwst.jpg
│   ├── hubble.jpg
│   ├── gaia.jpg
│   ├── cheops.jpg
│   ├── spitzer.jpg
│   ├── plato.jpg
│   ├── ariel.jpg
│   ├── iss.jpg
│   ├── artemis.jpg
│   ├── mars-curiosity.jpg
│   ├── mars-perseverance.jpg
│   ├── mars-spirit.jpg
│   └── mars-opportunity.jpg
│
├── satellites/
│   ├── default.jpg
│   ├── landsat-9.jpg
│   ├── sentinel-2a.jpg
│   ├── aqua.jpg
│   ├── terra.jpg
│   ├── goes-18.jpg
│   ├── suomi-npp.jpg
│   ├── gps.jpg
│   ├── worldview-4.jpg
│   ├── icesat-2.jpg
│   ├── grace-fo.jpg
│   ├── sentinel-6.jpg
│   ├── swot.jpg
│   ├── starlink.jpg
│   ├── metop-c.jpg
│   ├── oco-3.jpg
│   ├── asteroid.jpg
│   ├── soho.jpg
│   ├── sdo.jpg
│   ├── parker.jpg
│   ├── iss.jpg
│   ├── tiangong.jpg
│   └── landsat.jpg
│
├── team/
│   ├── sarah-chen.jpg
│   ├── michael-rodriguez.jpg
│   ├── emily-watanabe.jpg
│   ├── james-obrien.jpg
│   ├── priya-patel.jpg
│   ├── alexander-novak.jpg
│   ├── lisa-thompson.jpg
│   └── david-kim.jpg
│
└── lensflare/
    ├── lensflare0.png
    └── lensflare3.png
```

## Image Specifications

### Exoplanets (16 images + 1 default)

- **Resolution**: 800x600px recommended
- **Format**: JPG
- **Content**: Space/planet imagery
- **Default**: Generic exoplanet image

### Missions (15 images + 1 default)

- **Resolution**: 1200x800px recommended
- **Format**: JPG
- **Content**: Mission spacecraft/facility images
- **Default**: Generic mission/spacecraft image

### Satellites (25 images + 1 default)

- **Resolution**: 800x600px recommended
- **Format**: JPG
- **Content**: Satellite/spacecraft images
- **Default**: Generic satellite image

### Team (8 images)

- **Resolution**: 400x400px (square)
- **Format**: JPG
- **Content**: Professional headshots/avatars
- **Style**: Consistent professional look

### Lens Flare (2 images)

- **Resolution**: 512x512px or higher
- **Format**: PNG with transparency
- **Content**: Lens flare optical effects
- **Source**: Can use Three.js examples or create custom

## Quick Setup

### Option 1: Use Placeholder Images

1. Download free space images from:

   - NASA Image Gallery: https://images.nasa.gov/
   - Unsplash Space: https://unsplash.com/s/photos/space
   - ESA/Hubble: https://esahubble.org/images/

2. Rename and place in appropriate folders

### Option 2: Create Placeholder Script

Run this script to create colored placeholder images:

```javascript
// Create a simple placeholder generator
// (Requires canvas/sharp library or use online tools)
```

### Option 3: Use Default Fallback

The app will attempt to load these images but won't crash if they're missing.
You can start with just the `default.jpg` files in each category.

## NASA Image Sources

**Recommended Free Sources:**

1. **NASA Image and Video Library**: https://images.nasa.gov/
2. **ESA Gallery**: https://www.esa.int/ESA_Multimedia/Images
3. **JPL Photojournal**: https://photojournal.jpl.nasa.gov/
4. **Hubble Site**: https://hubblesite.org/images/gallery
5. **SpaceX Flickr**: https://www.flickr.com/photos/spacex/

## License Compliance

Most NASA images are **public domain** and free to use, but always:

- Check individual image licenses
- Provide attribution where required
- Review usage rights for non-NASA images

## Notes

- All paths are relative to `public/` directory
- Images are loaded asynchronously
- Missing images will show broken image icon or fallback
- Consider image optimization for production (use WebP, compress JPG)
- Total storage needed: ~50-100MB for all images

## Priority Images

**Start with these essential images:**

1. `assets/exoplanets/default.jpg`
2. `assets/missions/default.jpg`
3. `assets/satellites/default.jpg`
4. `assets/lensflare/lensflare0.png`
5. `assets/lensflare/lensflare3.png`

These will serve as fallbacks until you add specific images.
