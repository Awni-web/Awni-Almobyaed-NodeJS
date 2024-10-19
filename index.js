import fs from "fs";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

function countWords(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          reject(`File not found: ${filePath}`);
        } else {
          reject(`Error reading file: ${filePath}`);
        }
        return;
      }
      const words = data.split(/\s+/).filter(Boolean);

      const validWords = words.filter((word) => /^[a-zA-Z]+$/.test(word));

      resolve(validWords.length);
    });
  });
}

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
