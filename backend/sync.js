const fs = require("fs");

async function sync() {
  const url =
    "https://raw.githubusercontent.com/shadps4-compatibility/shadps4-game-compatibility/main/data.json";

  const res = await fetch(url);
  const data = await res.json();

  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));

  console.log("🔥 Synced:", data.length);
}

module.exports = sync;