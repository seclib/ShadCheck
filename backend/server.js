import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadData() {
  const filePath = path.resolve(process.cwd(), "data.json");

  if (!fs.existsSync(filePath)) return [];

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

app.get("/", (req, res) => {
  res.json({
    status: "shadPS4 API OK",
    endpoints: ["/games", "/games/search", "/games/status/:status"]
  });
});

app.get("/games", (req, res) => {
  res.json(loadData());
});

app.get("/games/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const data = loadData();

  res.json(
    data.filter(
      g =>
        g.title.toLowerCase().includes(q) ||
        g.cusa.toLowerCase().includes(q)
    )
  );
});

app.get("/games/status/:status", (req, res) => {
  const data = loadData();
  res.json(data.filter(g => g.status === req.params.status));
});

app.listen(PORT, () => {
  console.log(`🚀 shadPS4 API running http://localhost:${PORT}`);
});
app.get("/games", (req, res) => {
  const data = loadData();

  console.log("DATA SENT:", data.length);

  res.json(data);
});