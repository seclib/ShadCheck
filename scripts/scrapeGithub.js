import axios from "axios";
import fs from "fs";

const BASE =
  "https://api.github.com/repos/shadps4-compatibility/shadps4-game-compatibility/issues";

const labels = [
  { name: "status-playable", value: "playable" },
  { name: "status-ingame", value: "ingame" },
  { name: "status-bootable", value: "booting" },
];

function extractCUSA(text) {
  const match = text.match(/CUSA\d+/i);
  return match ? match[0].toUpperCase() : null;
}

async function fetchLabel(label, status) {
  const res = await axios.get(
    `${BASE}?labels=${label}&per_page=100`
  );

  return res.data
    .map((issue) => {
      const text = issue.title + " " + issue.body;

      const cusa = extractCUSA(text);
      if (!cusa) return null;

      return {
        title: issue.title,
        cusa,
        status,
        os: "linux",
      };
    })
    .filter(Boolean);
}

async function run() {
  let allGames = [];

  for (const l of labels) {
    const games = await fetchLabel(l.name, l.value);
    allGames = allGames.concat(games);
  }

  // 🔥 remove duplicates
  const map = new Map();
  allGames.forEach((g) => map.set(g.cusa, g));

  const clean = Array.from(map.values());

  fs.writeFileSync(
    "../data.json",
    JSON.stringify(clean, null, 2)
  );

  console.log(`🔥 ${clean.length} games synced from GitHub`);
}

run();