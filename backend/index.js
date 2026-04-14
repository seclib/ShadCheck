const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const DATA = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

// 📊 all games
app.get("/games", (req, res) => {
  res.json(DATA);
});

// 🔎 search
app.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  const result = DATA.filter((g) => {
    return (
      g.title.toLowerCase().includes(q) ||
      g.cusa.toLowerCase().includes(q)
    );
  });

  res.json(result);
});

app.listen(3000, () => {
  console.log("🔥 Backend OK http://localhost:3000");
});