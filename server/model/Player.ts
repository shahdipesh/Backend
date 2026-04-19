export type Player = {
  userId: string;
  playerName: string;
  score: number;
  socketId?: string;
  isImposter?: boolean;
  active?: boolean;
};
