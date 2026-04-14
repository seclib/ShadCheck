import sys, os, json, time, re, requests
from rapidfuzz import fuzz

from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout,
    QLineEdit, QPushButton, QLabel, QScrollArea, QFileDialog
)
from PyQt6.QtCore import Qt

CACHE_FILE = "cache.json"
CACHE_DURATION = 86400

API_URL = "https://api.github.com/repos/shadps4-compatibility/shadps4-game-compatibility/issues"

STATUS_COLOR = {
    "playable": "#00ff88",
    "ingame": "#ffaa00",
    "menus": "#ffff00",
    "boots": "#00aaff",
    "nothing": "#ff4444"
}

# ---------------- CACHE ----------------
def load_cache():
    if not os.path.exists(CACHE_FILE):
        return None
    data = json.load(open(CACHE_FILE))
    if time.time() - data["timestamp"] > CACHE_DURATION:
        return None
    return data["games"]

def save_cache(games):
    json.dump({"timestamp": time.time(), "games": games}, open(CACHE_FILE, "w"))

def fetch_games():
    games = []
    page = 1

    while True:
        r = requests.get(API_URL, params={"per_page": 100, "page": page})
        data = r.json()
        if not data:
            break

        for issue in data:
            title = issue["title"]
            labels = [l["name"] for l in issue["labels"]]
            status = next((l for l in labels if "status-" in l), "unknown")

            cusa = re.search(r'CUSA\d+', title)
            games.append({
                "title": title,
                "status": status.replace("status-", ""),
                "cusa": cusa.group() if cusa else "",
                "url": issue["html_url"]
            })

        page += 1

    save_cache(games)
    return games

def get_games(force=False):
    if not force:
        cache = load_cache()
        if cache:
            return cache
    return fetch_games()

# ---------------- SCAN LOCAL ----------------
def scan_games(path):
    found = []
    for folder in os.listdir(path):
        match = re.search(r'CUSA\d+', folder)
        if match:
            found.append(match.group())
    return found

# ---------------- UI CARD ----------------
class GameCard(QWidget):
    def __init__(self, game, owned):
        super().__init__()

        layout = QVBoxLayout()

        status = game["status"]
        color = STATUS_COLOR.get(status, "#aaa")

        title = QLabel(f"🎮 {game['title']}")
        title.setStyleSheet("font-size:14px; font-weight:bold;")

        badge = QLabel(f"{status.upper()}")
        badge.setStyleSheet(f"""
            background:{color};
            padding:4px;
            border-radius:6px;
            color:black;
        """)

        owned_label = QLabel("✔ Dans ta bibliothèque" if game["cusa"] in owned else "")
        owned_label.setStyleSheet("color:#00ff88;")

        layout.addWidget(title)
        layout.addWidget(badge)
        layout.addWidget(owned_label)

        self.setLayout(layout)
        self.setStyleSheet("""
            background:#1e1e1e;
            border-radius:10px;
            padding:10px;
        """)

# ---------------- APP ----------------
class App(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("🎮 ShadCheck V3")
        self.setGeometry(200, 100, 900, 700)

        self.games = get_games()
        self.owned = []

        main = QVBoxLayout()

        # TOP BAR
        top = QHBoxLayout()

        self.search = QLineEdit()
        self.search.setPlaceholderText("Recherche (nom ou CUSA)...")

        btn_search = QPushButton("🔍")
        btn_search.clicked.connect(self.update_view)

        btn_refresh = QPushButton("🔄")
        btn_refresh.clicked.connect(self.refresh)

        btn_scan = QPushButton("📂 Scan jeux")
        btn_scan.clicked.connect(self.scan_folder)

        btn_playable = QPushButton("🎮 Playable Only")
        btn_playable.clicked.connect(self.filter_playable)

        top.addWidget(self.search)
        top.addWidget(btn_search)
        top.addWidget(btn_refresh)
        top.addWidget(btn_scan)
        top.addWidget(btn_playable)

        main.addLayout(top)

        # COUNT
        self.count_label = QLabel("")
        main.addWidget(self.count_label)

        # SCROLL
        self.scroll = QScrollArea()
        self.container = QWidget()
        self.layout = QVBoxLayout()

        self.container.setLayout(self.layout)
        self.scroll.setWidget(self.container)
        self.scroll.setWidgetResizable(True)

        main.addWidget(self.scroll)

        self.setLayout(main)

        self.setStyleSheet("""
            QWidget { background:#121212; color:white; }
            QLineEdit { background:#1e1e1e; padding:6px; }
            QPushButton { background:#333; padding:6px; }
        """)

        self.update_view()

    def fuzzy_match(self, query, text):
        return fuzz.partial_ratio(query, text) > 70

    def update_view(self):
        query = self.search.text().lower()

        # clear
        for i in reversed(range(self.layout.count())):
            self.layout.itemAt(i).widget().deleteLater()

        count = 0

        for game in self.games:
            if query:
                if not (
                    self.fuzzy_match(query, game["title"].lower()) or
                    query in game["cusa"].lower()
                ):
                    continue

            card = GameCard(game, self.owned)
            self.layout.addWidget(card)
            count += 1

        self.count_label.setText(f"🎮 {count} résultats")

    def filter_playable(self):
        self.search.setText("")
        self.games = [g for g in self.games if g["status"] == "playable"]
        self.update_view()

    def refresh(self):
        self.games = get_games(force=True)
        self.update_view()

    def scan_folder(self):
        path = QFileDialog.getExistingDirectory(self, "Choisir dossier PS4")
        if path:
            self.owned = scan_games(path)
            self.update_view()


# ---------------- RUN ----------------
if __name__ == "__main__":
    app = QApplication(sys.argv)
    win = App()
    win.show()
    sys.exit(app.exec())
