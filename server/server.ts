import { games } from './gameState.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { events } from './events.js';
import gameRouter from './game.js';
import { setIO } from './socketManager.js';
import { generateRandomIndex, getGameWords } from './gameService.ts'

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setIO(io);

app.use('/game', gameRouter);

app.get('/isOwner', (req, res) => {
  const { userId, gameId } = req.query;
  const game = games[gameId];

  if (game['hostId'] == userId) {
    res.json({ isOwner: true });
  } else {
    res.json({ isOwner: false });
  }
});

app.post('/createRoom', (req, res) => {
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const numPlayers = req.body.numPlayers;
  const gameWords = getGameWords();
  if (games[gameId]) {
    res.json({ msg: 'Name already taken' });
  } else {
    games[gameId] = {
      gameId: gameId,
      hostId: userId,
      numPlayers: numPlayers,
      numRound: 0,
      players: [],
      socketIds: [],
      words: gameWords,
      currentWordIndex: 0,
      gameStarted: false,
      currentGuesser: generateRandomIndex(numPlayers),
      imposterIndex: generateRandomIndex(numPlayers)
    };
    res.json({ gameId: gameId });
  }
});

app.post('/joinRoom', async (req, res) => {
  let playerName = req.body.playerName;
  let gameId = req.body.gameId;
  let userId = req.body.userId;
  const game = games[gameId];

  if (game.players.length >= game.numPlayers) {
    const existing = game.players.find((p) => p.userId === userId);
    if (!existing) {
      res.status(403).json({ msg: 'Already full' });
      return;
    }
  }

  const player = game['players'].find((p) => p.userId === userId);
  if (!player) {
      game.players.push({
      userId: userId,
      playerName: playerName,
      score: 0,
      isImposter: false,
    })
  }
  res.json({gameId,userId});
});

io.on('connection', async(socket) => {
  socket.on(events.JOIN_GAME, ({ gameId, userId }) => {
    console.log('JOIN EVENT');
    const game = games[gameId];
    if (game == null) {
      return;
    }

    const player = game['players'].find((p) => p.userId === userId);
    if (player) {
      console.log("Player exist, updating socket id")
      player.socketId = socket.id;
      if(game.gameStarted){
        io.to(player.socketId).emit(events.START_GAME);
        if(game.players[game.imposterIndex].userId===player.userId){
          io.to(player.socketId).emit(events.IMPOSTER);
        }else{
          io.to(player.socketId).emit(events.WORD, {
            wordToGuess: game['words'][game.currentWordIndex],
          });
        }
        if(game.players[game.currentGuesser].userId===player.userId){
          io.to(player.socketId).emit(events.YOUR_TURN);
        }
      }

    }

    let players = game['players'];
    players.forEach((p) => {
      if (p.socketId) {
        io.to(p.socketId).emit(events.CURRENT_PLAYERS_COUNT, {
          count: game.players.length,
        });
      }
    });
    if (players.length == game.numPlayers && !game['gameStarted']) {
      players.forEach((player, index) => {
        if (player.socketId) {
          io.to(player.socketId).emit(events.START_GAME);
          if (index != game.imposterIndex) {
            io.to(player.socketId).emit(events.WORD, {
              wordToGuess: game['words'][game.currentWordIndex],
            });
          }
        }
        else {
          console.error("Socket Id doesnot exist")
        }
      });
      let indexOfGuesser = game.currentGuesser;
      if (players[indexOfGuesser]?.socketId) {
        io.to(players[indexOfGuesser].socketId).emit(events.YOUR_TURN);
        game.players[game.imposterIndex].isImposter = true;
        let imposterPlayerSocketId = players[game.imposterIndex].socketId;
        if (imposterPlayerSocketId) {
          io.to(imposterPlayerSocketId).emit(events.IMPOSTER);
          console.log(game.imposterIndex + ' is the new imposter');
        } else {
          console.error("Imposter Player id not found")
        }
        game['gameStarted'] = true;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
