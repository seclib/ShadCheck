import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL =
  "https://api.github.com/repos/shadps4-compatibility/shadps4-game-compatibility/issues";

const statuses = [
  "status-playable",
  "status-ingame",
  "status-bootable",
  "status-menus",
  "status-nothing",
];

// 🔁 fetch toutes les pages d’un label
async function fetchAllPages(label) {
  let page = 1;
  let results = [];

  console.log("Fetching:", label);

  while (true) {
    const url = `${BASE_URL}?labels=${label}&per_page=100&page=${page}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "ShadCheck"
      }
    });

    if (!res.ok) {
      console.error(`❌ Error fetching ${label} page ${page}`);
      break;
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      break;
    }

    results.push(...data);
    page++;
  }

  return results;
}

// 🧼 transform GitHub issue → game object
function normalize(issue, label) {
  const title = issue.title || "Unknown";

  const match = title.match(/CUSA\d+/i);

  return {
    title: title.replace(/CUSA\d+/i, "").trim(),
    cusa: match ? match[0].toUpperCase() : "UNKNOWN",
    status: label.replace("status-", ""),
    os: "linux",
    url: issue.html_url
  };
}

async function run() {
  let allGames = [];

  for (const status of statuses) {
    const issues = await fetchAllPages(status);
    const games = issues.map((issue) => normalize(issue, status));
    allGames.push(...games);
  }

  // 🧠 dedup propre (CUSA + title + OS)
  const map = new Map();

  for (const game of allGames) {
    const key = `${game.cusa}-${game.title}-${game.os}`;
    map.set(key, game);
  }

  const clean = Array.from(map.values());

  // 📁 output file (root project)
  const outputPath = path.resolve(__dirname, "../data.json");

  fs.writeFileSync(outputPath, JSON.stringify(clean, null, 2));

  console.log(`🔥 ${clean.length} jeux sauvegardés dans data.json`);
}

run();