import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fixing "__dirname is not defined in ES module scope" because we made it as a module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration from the json file
const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Function to count words in file, skipping words that contain number of syombol
function countWords(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          // Error no Entry/Entity
          reject(`File not found: ${filePath}`);
        } else {
          reject(`Error reading file: ${filePath}`);
        }
        return;
      }
      // Splitting the text into words
      const words = data.split(/\s+/).filter(Boolean);

      // Filtering out words that contain numbers or symbols
      const validWords = words.filter((word) => /^[a-zA-Z]+$/.test(word)); // filtering

      resolve(validWords.length);
    });
  });
}

// This function to process each file asynchronously.
async function processFiles() {
  try {
    for (const file of config.files) {
      const filePath = path.join(__dirname, file);
      const wordCount = await countWords(filePath);
      console.log(`${filePath}: ${wordCount} valid words`);
    }
  } catch (error) {
    console.error(error);
  }
}

processFiles();
