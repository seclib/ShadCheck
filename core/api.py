import requests, re

API_URL = "https://api.github.com/repos/shadps4-compatibility/shadps4-game-compatibility/issues"

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
                "url": issue["html_url"],
                "image": None  # placeholder pour V future API covers
            })

        page += 1

    return games