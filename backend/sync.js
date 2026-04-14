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

// 🔁 fetch simple + safe (sans crash silencieux)
async function fetchAll(label) {
  let page = 1;
  let all = [];

  console.log("Fetching:", label);

  while (true) {
    const url = `${BASE_URL}?labels=${label}&per_page=100&page=${page}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "ShadCheck"
      }
    });

    if (!res.ok) {
      console.log(`❌ GitHub error ${res.status} on ${label}`);
      break;
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) break;

    all.push(...data);
    page++;
  }

  console.log(`✅ ${label}: ${all.length}`);
  return all;
}

// 🧼 clean game object
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
    const issues = await fetchAll(status);
    const games = issues.map((g) => normalize(g, status));
    allGames.push(...games);
  }

  // 🧠 dedup propre
  const map = new Map();

  for (const g of allGames) {
    const key = `${g.cusa}-${g.title}-${g.os}`;
    map.set(key, g);
  }

  const clean = [...map.values()];

  const output = path.resolve(__dirname, "../data.json");

  fs.writeFileSync(output, JSON.stringify(clean, null, 2));

  console.log(`🔥 DONE → ${clean.length} jeux dans data.json`);
}

run();