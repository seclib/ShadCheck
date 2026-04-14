from PyQt6.QtWidgets import *
from rapidfuzz import fuzz
from core.api import fetch_games
from core.cache import load_cache, save_cache
from core.scanner import scan_games
from ui.game_card import GameCard

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("ShadCheck")
        self.resize(1000, 700)

        self.games = load_cache() or fetch_games()
        save_cache(self.games)

        self.owned = []

        layout = QVBoxLayout()

        # TOP BAR
        top = QHBoxLayout()
        self.search = QLineEdit()
        btn = QPushButton("Search")
        btn.clicked.connect(self.update_view)

        btn_refresh = QPushButton("Refresh")
        btn_refresh.clicked.connect(self.refresh)

        btn_scan = QPushButton("Scan")
        btn_scan.clicked.connect(self.scan)

        btn_playable = QPushButton("Playable")
        btn_playable.clicked.connect(self.filter_playable)

        top.addWidget(self.search)
        top.addWidget(btn)
        top.addWidget(btn_refresh)
        top.addWidget(btn_scan)
        top.addWidget(btn_playable)

        layout.addLayout(top)

        self.grid = QGridLayout()
        container = QWidget()
        container.setLayout(self.grid)

        scroll = QScrollArea()
        scroll.setWidget(container)
        scroll.setWidgetResizable(True)

        layout.addWidget(scroll)

        self.setLayout(layout)

        self.update_view()

    def fuzzy(self, q, text):
        return fuzz.partial_ratio(q, text) > 70

    def update_view(self):
        for i in reversed(range(self.grid.count())):
            self.grid.itemAt(i).widget().deleteLater()

        query = self.search.text().lower()

        row, col = 0, 0

        for game in self.games:
            if query:
                if not (self.fuzzy(query, game["title"].lower()) or query in game["cusa"].lower()):
                    continue

            card = GameCard(game, self.owned)
            self.grid.addWidget(card, row, col)

            col += 1
            if col >= 4:
                col = 0
                row += 1

    def refresh(self):
        self.games = fetch_games()
        save_cache(self.games)
        self.update_view()

    def scan(self):
        path = QFileDialog.getExistingDirectory(self)
        if path:
            self.owned = scan_games(path)
            self.update_view()

    def filter_playable(self):
        self.games = [g for g in self.games if g["status"] == "playable"]
        self.update_view()