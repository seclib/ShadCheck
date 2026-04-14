import axios from "axios";
import type { Game } from "../types/game";

const API = "http://localhost:3000";

export const getGames = async (): Promise<Game[]> => {
  const res = await axios.get(`${API}/games`);
  return res.data;
};

export const searchGames = async (q: string): Promise<Game[]> => {
  const res = await axios.get(`${API}/search?q=${q}`);
  return res.data;
};