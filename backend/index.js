const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const DATA = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

app.get("/games", (req, res) => {
  res.json(DATA);
});

app.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  const result = DATA.filter(
    g =>
      g.title.toLowerCase().includes(q) ||
      g.cusa.toLowerCase().includes(q)
  );

  res.json(result);
});

app.listen(3000, () => {
  console.log("🔥 Backend running on http://localhost:3000");
});
const sync = require("./sync");

setInterval(sync, 1000 * 60 * 60); // every hour
sync();