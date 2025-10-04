/**
 * NASA Image Downloader Script
 * Downloads images from NASA APIs and saves them to the assets folder
 *
 * Usage: node scripts/download-nasa-images.js
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NASA_API_KEY = process.env.VITE_NASA_API_KEY || "DEMO_KEY";
const APOD_URL = "https://api.nasa.gov/planetary/apod";
const NASA_IMAGE_LIBRARY = "https://images-api.nasa.gov/search";

// Ensure directories exist
const ASSETS_DIR = path.join(__dirname, "../public/assets");
const dirs = ["exoplanets", "missions", "satellites", "team", "lensflare"];

dirs.forEach((dir) => {
  const dirPath = path.join(ASSETS_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Download an image
async function downloadImage(url, filepath) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    fs.writeFileSync(filepath, response.data);
    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to download ${path.basename(filepath)}:`,
      error.message
    );
    return false;
  }
}

// Search NASA Image Library
async function searchNASAImages(query, count = 1) {
  try {
    const response = await axios.get(NASA_IMAGE_LIBRARY, {
      params: {
        q: query,
        media_type: "image",
        page_size: count,
      },
      timeout: 15000,
    });

    const items = response.data.collection.items || [];
    const imageUrls = items
      .filter((item) => item.links && item.links[0])
      .map((item) => item.links[0].href);

    return imageUrls;
  } catch (error) {
    console.error(`Failed to search for "${query}":`, error.message);
    return [];
  }
}

// Download images for a category
async function downloadCategoryImages(category, keywords) {
  console.log(`\n📥 Downloading ${category} images...`);

  for (const [filename, searchQuery] of Object.entries(keywords)) {
    const filepath = path.join(ASSETS_DIR, category, filename);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipping ${filename} (already exists)`);
      continue;
    }

    // Search and download
    const imageUrls = await searchNASAImages(searchQuery, 1);
    if (imageUrls.length > 0) {
      await downloadImage(imageUrls[0], filepath);
      // Rate limiting - wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      console.log(`⚠️  No images found for ${filename}`);
    }
  }
}

// Main function
async function main() {
  console.log("🚀 NASA Image Downloader Starting...\n");
  console.log(
    `API Key: ${
      NASA_API_KEY === "DEMO_KEY"
        ? "Using DEMO_KEY (limited)"
        : "Using custom API key"
    }\n`
  );

  // Define image categories and search keywords
  const imageCategories = {
    exoplanets: {
      "default.jpg": "exoplanet artist concept",
      "kepler-442b.jpg": "kepler 442 exoplanet",
      "proxima-b.jpg": "proxima centauri planet",
      "trappist-1e.jpg": "trappist-1 planet",
      "kepler-452b.jpg": "kepler 452b earth cousin",
    },
    missions: {
      "default.jpg": "nasa mission spacecraft",
      "jwst.jpg": "james webb space telescope",
      "hubble.jpg": "hubble space telescope",
      "iss.jpg": "international space station",
      "artemis.jpg": "artemis mission moon",
    },
    satellites: {
      "default.jpg": "earth observation satellite",
      "iss.jpg": "international space station earth",
      "landsat-9.jpg": "landsat satellite",
      "terra.jpg": "terra satellite",
      "aqua.jpg": "aqua satellite",
    },
  };

  // Download images for each category
  for (const [category, keywords] of Object.entries(imageCategories)) {
    await downloadCategoryImages(category, keywords);
  }

  // Download APOD images for missions
  console.log("\n📥 Downloading Astronomy Pictures of the Day...");
  try {
    const response = await axios.get(APOD_URL, {
      params: {
        api_key: NASA_API_KEY,
        count: 5,
      },
      timeout: 15000,
    });

    for (let i = 0; i < response.data.length; i++) {
      const apod = response.data[i];
      if (apod.url && apod.media_type === "image") {
        const filename = `apod-${i + 1}.jpg`;
        const filepath = path.join(ASSETS_DIR, "missions", filename);

        if (!fs.existsSync(filepath)) {
          await downloadImage(apod.url, filepath);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  } catch (error) {
    console.error("Failed to download APOD images:", error.message);
  }

  // Create placeholder lens flare images (these need to be sourced separately)
  console.log("\n⚠️  Lens flare images need to be added manually from:");
  console.log(
    "   https://github.com/mrdoob/three.js/tree/dev/examples/textures/lensflare"
  );
  console.log("   - lensflare0.png");
  console.log("   - lensflare3.png");

  // Create placeholder team images note
  console.log("\n👥 Team images should be added manually to:");
  console.log("   public/assets/team/");

  console.log("\n✅ Image download complete!");
  console.log(`\n📊 Summary:`);
  console.log(`   - Check public/assets/ for downloaded images`);
  console.log(`   - Some images may need manual download from NASA sources`);
  console.log(
    `   - Lens flare textures: Use Three.js examples or create custom`
  );
  console.log(`   - Team photos: Add your own team member photos`);
}

// Run the script
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
