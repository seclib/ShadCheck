import json, time, os

CACHE_FILE = "data/cache.json"
CACHE_DURATION = 86400

def load_cache():
    if not os.path.exists(CACHE_FILE):
        return None

    data = json.load(open(CACHE_FILE))
    if time.time() - data["timestamp"] > CACHE_DURATION:
        return None

    return data["games"]

def save_cache(games):
    os.makedirs("data", exist_ok=True)
    json.dump({"timestamp": time.time(), "games": games}, open(CACHE_FILE, "w"))