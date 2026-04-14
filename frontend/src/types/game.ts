export type GameStatus =
  | "playable"
  | "ingame"
  | "menus"
  | "boots"
  | "nothing";

export interface Game {
  title: string;
  cusa: string;
  status: GameStatus;
  os?: string;
}