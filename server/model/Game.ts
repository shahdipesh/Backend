import type { Player } from './Player.js';

export type Game = {
  gameId: string;
  hostId: string;
  numPlayers: number;
  numRound: number;
  players: Player[];
  socketIds: string[];
  words: string[];
  currentWordIndex: number;
  gameStarted: boolean;
  currentGuesser: number;
  imposterIndex: number,
  startingPlayerIndex: number
};
