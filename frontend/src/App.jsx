import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:3001/games")
      .then(res => setGames(res.data));
  }, []);

  const getVerdict = (status) => {
    switch (status) {
      case "playable":
        return { text: "JOUABLE", color: "#00ff9d" };
      case "ingame":
        return { text: "INGAME", color: "#ffaa00" };
      case "bootable":
        return { text: "BOOT", color: "#ffcc00" };
      case "menus":
        return { text: "MENUS ONLY", color: "#4da3ff" };
      default:
        return { text: "NON JOUABLE", color: "#ff4d4d" };
    }
  };

  const filtered = games
    .filter(g =>
      g.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(g =>
      statusFilter === "all" ? true : g.status === statusFilter
    );

  return (
    <div style={styles.bg}>

      {/* CENTER CARD */}
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>shadPS4</h2>
          <p style={styles.subtitle}>Compatibility Scanner</p>
        </div>

        {/* SEARCH */}
        <input
          style={styles.input}
          placeholder="Search game..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* BUTTON */}
        <button
          style={styles.button}
          onClick={() => setActive(!active)}
        >
          {active ? "Stop scan" : "Entrée (Start scan)"}
        </button>

        {/* FILTERS */}
        <div style={styles.filters}>
          {["all", "playable", "ingame", "bootable", "menus", "nothing"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                ...styles.filterBtn,
                borderBottom: statusFilter === s ? "2px solid #4da3ff" : "2px solid transparent"
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div style={styles.list}>
          {active ? (
            filtered.map((g, i) => {
              const v = getVerdict(g.status);

              return (
                <div key={i} style={styles.item}>
                  <div style={styles.name}>{g.title}</div>

                  <div style={styles.meta}>
                    {g.cusa}
                  </div>

                  <div style={{ ...styles.verdict, color: v.color }}>
                    {v.text}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.empty}>
              Click “Entrée” to start detection
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {

  // 🌌 FULL BLACK (NO WHITE SIDES)
  bg: {
    height: "100vh",
    width: "100vw",
    background: "#000000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,
    color: "#fff",
    fontFamily: "sans-serif"
  },

  // 🪟 CENTER UI (GDM3 STYLE)
  card: {
    width: "420px",
    height: "600px",
    background: "#121212",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 20,
    display: "flex",
    flexDirection: "column"
  },

  header: {
    textAlign: "center",
    marginBottom: 10
  },

  title: {
    margin: 0,
    fontSize: 22
  },

  subtitle: {
    margin: 0,
    fontSize: 12,
    opacity: 0.6
  },

  input: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #333",
    background: "#0f0f0f",
    color: "#fff",
    outline: "none"
  },

  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #4da3ff",
    background: "transparent",
    color: "#4da3ff",
    cursor: "pointer"
  },

  filters: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 12,
    flexWrap: "wrap"
  },

  filterBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 11,
    cursor: "pointer",
    opacity: 0.7,
    paddingBottom: 4
  },

  list: {
    marginTop: 15,
    flex: 1,
    overflowY: "auto"
  },

  item: {
    padding: 10,
    borderBottom: "1px solid rgba(255,255,255,0.06)"
  },

  name: {
    fontWeight: "bold"
  },

  meta: {
    fontSize: 11,
    opacity: 0.6
  },

  verdict: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    opacity: 0.5
  }
};