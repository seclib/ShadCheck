import os, re

def scan_games(path):
    found = []
    for folder in os.listdir(path):
        match = re.search(r'CUSA\d+', folder)
        if match:
            found.append(match.group())
    return found