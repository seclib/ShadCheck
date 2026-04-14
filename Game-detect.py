import sys
import requests
import json
import os
import time
import re

from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QLineEdit,
    QPushButton, QTextEdit, QLabel
)
from PyQt6.QtGui import QColor
from PyQt6.QtCore import Qt

CACHE_FILE = "cache.json"
CACHE_DURATION = 60 * 60 * 24  # 24h

API_URL = "https://api.github.com/repos/shadps4-compatibility/shadps4-game-compatibility/issues"


# -----------------------
# 📦 CACHE SYSTEM
# -----------------------
def load_cache():
    if not os.path.exists(CACHE_FILE):
        return None

    with open(CACHE_FILE, "r") as f:
        data = json.load(f)

    if time.time() - data["timestamp"] > CACHE_DURATION:
        return None

    return data["games"]


def save_cache(games):
    with open(CACHE_FILE, "w") as f:
        json.dump({
            "timestamp": time.time(),
            "games": games
        }, f)


def fetch_games():
    print("🔄 Fetch GitHub...")
    games = []
    page = 1

    while True:
        res = requests.get(API_URL, params={"per_page": 100, "page": page})
        data = res.json()

        if not data:
            break

        for issue in data:
            title = issue["title"]
            labels = [l["name"] for l in issue["labels"]]

            status = next((l for l in labels if l.startswith("status-")), "unknown")

            cusa_match = re.search(r'CUSA\d+', title)

            games.append({
                "title": title,
                "status": status.replace("status-", ""),
                "cusa": cusa_match.group() if cusa_match else "",
                "url": issue["html_url"]
            })

        page += 1

    save_cache(games)
    return games


def get_games():
    cache = load_cache()
    if cache:
        return cache
    return fetch_games()


# -----------------------
# 🎨 UI
# -----------------------
class App(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("🎮 shadPS4 Checker V2")
        self.setGeometry(300, 200, 700, 500)

        layout = QVBoxLayout()

        self.label = QLabel("🔍 Recherche (Nom ou CUSA)")
        layout.addWidget(self.label)

        self.search = QLineEdit()
        layout.addWidget(self.search)

        self.btn = QPushButton("Rechercher")
        self.btn.clicked.connect(self.search_game)
        layout.addWidget(self.btn)

        self.output = QTextEdit()
        layout.addWidget(self.output)

        self.setLayout(layout)

        self.games = get_games()

    def format_result(self, game):
        color = {
            "playable": "green",
            "ingame": "orange",
            "menus": "yellow",
            "boots": "blue",
            "nothing": "red"
        }.get(game["status"], "white")

        return f"""
<span style="color:{color}">
🎮 {game['title']}<br>
➡ {game['status']}<br>
🔑 {game['cusa']}<br>
🔗 <a href="{game['url']}">{game['url']}</a>
</span><br><br>
"""

    def search_game(self):
        query = self.search.text().lower()
        self.output.clear()

        results = []

        for game in self.games:
            if query in game["title"].lower() or query in game["cusa"].lower():
                results.append(game)

        if not results:
            self.output.setText("❌ Aucun résultat")
            return

        for game in results:
            self.output.insertHtml(self.format_result(game))


# -----------------------
# 🚀 RUN
# -----------------------
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = App()
    window.show()
    sys.exit(app.exec())
