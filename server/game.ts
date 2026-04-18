import { games } from './gameState.js';
import express from 'express';
import { setNextGuesser } from './gameService.js';
import { getIO } from './socketManager.js';
import { events } from './events.js';
import { generateRandomIndex } from './gameService.ts'

const router = express.Router();

router.post('/guess', async (req, res) => {
  try {
    const io = getIO();
    const userId = req.body.userId;
    const gameId = req.body.gameId;
    const game = games[gameId];
    let players = game['players'];
    let isGameOver = setNextGuesser(gameId);
    if (isGameOver) {
      players.forEach((p) => {
        io.to(p.socketId).emit(events.ROUND_OVER);
        console.log('ROUND OVER');
      });
      res.send({ msg: 'Round Over' });
    } else {
      const indexOfGuesser = game.currentGuesser ?? 0;
      const playerToSend = players[indexOfGuesser];
      io.to(playerToSend.socketId).emit(events.YOUR_TURN);
      res.send({ msg: `${playerToSend} turn to guess` });
    }
  } catch {
    res.send(500);
  }
});

router.post('/restart', async (req, res) => {
  const io = getIO();
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const game = games[gameId];
  let players = game['players'];

  game.numRound = 0;
  game.currentWordIndex = game.currentWordIndex + 1;
  game.gameStarted = false;
  game.imposterIndex = generateRandomIndex(game.numPlayers)

  players.forEach((player) => {
    io.to(player.socketId).emit('PLAY_AGAIN');
  });

  res.send(200);
});

export default router;
