# 🎮 ShadCheck

> SteamDB-style compatibility tracker for the shadPS4 emulator

---

## 🚀 Overview

ShadCheck is a lightweight web dashboard that tracks and displays PlayStation 4 game compatibility for the shadPS4 emulator.

It provides a clean Steam-like interface to browse games and their emulation status.

---

## ✨ Features

- 🎮 Game compatibility database (PS4 / shadPS4)
- 🟢 Status tracking:
  - Playable
  - In-game
  - Menus
  - Boots
  - Nothing
- 🔎 Instant search (CUSA / game title)
- ⚡ Fast Node.js backend API
- 🎨 Steam-like React UI

---

## 🧱 Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Data: JSON compatibility dataset

---

## 📁 Project Structure

ShadCheck/
│
├── backend/ # API server
├── frontend/ # React UI
└── README.md

## ⚙️ Installation

### 1. Backend

```bash
cd backend
npm install
node index.js

Backend runs on:

http://localhost:3000

🔌 API Endpoints
GET /games

Returns all games

GET /search?q=xxx

Search games by title or CUSA

📊 Example Data
{
  "title": "Bloodborne",
  "cusa": "CUSA00900",
  "status": "ingame",
  "os": "linux"
}
🎯 Roadmap
SteamDB-style UI upgrade
Filters (status / OS)
Game detail page
Auto sync from shadPS4 compatibility GitHub
Emulator log analyzer
Electron desktop version