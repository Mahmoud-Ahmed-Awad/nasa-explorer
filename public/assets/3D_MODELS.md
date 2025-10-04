# 3D Models for NASA Frontend

## Optional 3D Assets

The app works perfectly fine **without** these files - it has fallback geometries built in. However, if you want higher quality 3D models, you can add them here.

## Required File (Optional)

```
public/assets/
└── rocket.glb
```

## Where to Get Free 3D Models

### 1. NASA 3D Resources (Official)

**Best for authentic NASA models**

- URL: https://nasa3d.arc.nasa.gov/models
- Download rockets, spacecraft, satellites in GLTF/GLB format
- **Public domain** - free to use!

**Recommended models:**

- Space Shuttle
- Saturn V Rocket
- Mars Rovers
- ISS modules

### 2. Sketchfab (Free Models)

- URL: https://sketchfab.com/
- Search: "rocket", "spacecraft", "satellite"
- Filter: **Downloadable**, **Free**
- Look for models with **CC0** or **CC-BY** license
- Download format: **GLTF (.glb)**

### 3. Free3D

- URL: https://free3d.com/
- Search: "rocket", "space shuttle"
- Download and convert to GLB if needed

### 4. Poly Pizza

- URL: https://poly.pizza/
- Free low-poly models
- Good for web performance

## How to Add a Model

### Option 1: Direct Download

1. Download a `.glb` or `.gltf` file from one of the sources above
2. Rename it to `rocket.glb`
3. Place it in `public/assets/`
4. Refresh your browser - model will load automatically!

### Option 2: Convert from Other Formats

If you have `.obj`, `.fbx`, or other 3D formats:

**Online Converters:**

- https://anyconv.com/obj-to-gltf-converter/
- https://products.aspose.app/3d/conversion/obj-to-gltf

**Desktop Tools:**

- Blender (free): Export as GLTF/GLB
- https://www.blender.org/

## File Requirements

- **Format**: `.glb` (preferred) or `.gltf`
- **Size**: < 5MB recommended for web performance
- **Optimization**: Use tools like gltf-pipeline to compress
- **Location**: Must be in `public/assets/rocket.glb`

## Model Specifications

The app expects:

- **Scale**: Any (will be auto-scaled to 0.5)
- **Position**: Centered at origin
- **Up axis**: Y-up (standard)
- **Materials**: Will be overridden with neon glow effect

## Example: Download from NASA 3D

1. Go to https://nasa3d.arc.nasa.gov/models
2. Search for "Space Shuttle" or "Rocket"
3. Download the **GLB** format
4. Rename to `rocket.glb`
5. Move to `public/assets/rocket.glb`
6. Done! Refresh browser

## Optimization Tips

To keep your app fast:

```bash
# Install gltf-pipeline (optional)
npm install -g gltf-pipeline

# Compress your GLB
gltf-pipeline -i rocket.glb -o rocket-compressed.glb -d
```

## Current Status

- ✅ **Fallback geometry** - Simple rocket shape (works now)
- ⚠️ **GLTF model** - Optional enhancement (404 warning is normal)

## Disable the Rocket Entirely

If you don't want the rocket at all, you can disable it in the component:

```jsx
<ThreeScene enableRocket={false} />
```

## Model License Notes

When using 3D models:

- ✅ NASA models: Public domain
- ✅ CC0 models: No attribution required
- ⚠️ CC-BY models: Provide attribution in your app
- ❌ Commercial models: Check license

---

_Last Updated: October 2, 2025_
