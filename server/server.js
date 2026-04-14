const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
var cors = require('cors');
const { events } = require('./events');
const app = express();
const server = http.createServer(app);
app.use(cors())
app.use(express.json())
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let games = {};

app.post('/createRoom', (req, res) => {
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const numPlayers = req.body.numPlayers

  if (games[gameId]){
    res.json({msg:"Name already taken"});
  }
  games[gameId] = {
    gameId: gameId,
    hostId: userId,
    numPlayers: numPlayers,
    players: []
  };
  res.json({ status: 200, gameId: gameId });
});

app.post('/joinRoom', async (req, res) => {
  let gameId = req.body.gameId
  let userId = req.body.userId
  const game = games[gameId];

  if(game.players.length>game.numPlayers){
    res.json({
      msg:"Already full"
    })
  }

  await game.players.push({
    userId: userId,
    score: 0,
    socket: null,
    isImposter: false
  });

  console.log("AFTER join room", games)

  res.json({
    status: 200,
    gameId,
    userId
  });

})

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  // player joins game
  socket.on(events.JOIN_GAME, ({ gameId, userId }) => {
    const game = games[gameId];

    if (game == null) {
      return
    }

    const player = game['players'].find(p => p.userId === userId);

    player.socket = socket;

    socket.gameId = gameId;
    socket.userId = userId;

    game.players.forEach(player => {
      player.socket.emit(events.CURRENT_PLAYERS_COUNT, ({ count: game.players.length }))

      if (game.players.length == game.numPlayers) {
        const randomNumber = Math.floor(Math.random() * game.numPlayers);
        console.log("RANDOM NUMBER", randomNumber)
        game.players[randomNumber].isImposter = true;
        game.currentPlayerTurn = 0;
        game.players.forEach((player, index) => {
          if (index == randomNumber) {
            player.socket.emit(events.IMPOSTER)
          }
          player.socket.emit(events.START_GAME)
        })
      }
    });
  });

});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})