import type { Player } from './Player.js';
import { Word } from './Word.js';

export type Game = {
  gameId: string;
  hostId: string;
  numPlayers: number;
  numRound: number;
  players: Player[];
  socketIds: string[];
  words: Array<Word>;
  currentWordIndex: number;
  gameStarted: boolean;
  currentGuesser: number;
  imposterIndex: number,
  startingPlayerIndex: number
};
