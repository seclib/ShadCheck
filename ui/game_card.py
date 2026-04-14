from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel
from PyQt6.QtGui import QPixmap

STATUS_COLOR = {
    "playable": "#00ff88",
    "ingame": "#ffaa00",
    "menus": "#ffff00",
    "boots": "#00aaff",
    "nothing": "#ff4444"
}

class GameCard(QWidget):
    def __init__(self, game, owned):
        super().__init__()

        layout = QVBoxLayout()

        img = QLabel()
        pixmap = QPixmap("assets/placeholder.png")
        img.setPixmap(pixmap.scaledToWidth(150))
        
        title = QLabel(game["title"])
        title.setWordWrap(True)

        color = STATUS_COLOR.get(game["status"], "#aaa")
        badge = QLabel(game["status"].upper())
        badge.setStyleSheet(f"background:{color}; padding:4px; border-radius:6px;")

        owned_label = QLabel("✔ Owned" if game["cusa"] in owned else "")

        layout.addWidget(img)
        layout.addWidget(title)
        layout.addWidget(badge)
        layout.addWidget(owned_label)

        self.setLayout(layout)
        self.setStyleSheet("""
            background:#1e1e1e;
            border-radius:10px;
            padding:10px;
        """)