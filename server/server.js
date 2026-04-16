const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
var cors = require('cors');
const { events } = require('./events');
const gameRouter = require('./game')
const app = express();
const server = http.createServer(app);
let games = require('./gameState')
const { setIO } = require('./socketManager');
app.use(cors())
app.use(express.json())
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setIO(io);

app.use('/game', gameRouter)

app.get('/isOwner',(req,res)=>{
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const game = games[gameId];

  if(game['hostId']==userId){
    res.send({isOwner:true})
  }else{
    res.send({isOwner:false})
  }
})
app.post('/createRoom', (req, res) => {
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const numPlayers = req.body.numPlayers

  if (games[gameId]) {
    res.json({ msg: "Name already taken" });
  }
  games[gameId] = {
    gameId: gameId,
    hostId: userId,
    numPlayers: numPlayers,
    numRound:0,
    players: []
  };
  res.json({ status: 200, gameId: gameId });
});

app.post('/joinRoom', async (req, res) => {
  let playerName = req.body.playerName
  let gameId = req.body.gameId
  let userId = req.body.userId
  const game = games[gameId];

  if (game.players.length >= game.numPlayers) {
    res.send({
      msg: "Already full"
    })
    return;
  }
  
  await game.players.push({
    userId: userId,
    playerName:playerName,
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

    player.socketId = socket.id;
    const randomNumber = Math.floor(Math.random() * game.numPlayers);
    let players = game['players']
    players.forEach((player) => {
      io.to(player.socketId).emit(events.CURRENT_PLAYERS_COUNT, ({ count: game.players.length }))
    });
    if (players.length == game.numPlayers) {
      players.forEach((player,index) => {
        io.to(player.socketId).emit(events.START_GAME)
        if(index!=randomNumber){
          io.to(player.socketId).emit(events.WORD,({wordToGuess:"CARROT"}))
        }
      });
      game['currentGuesser'] = 0;
      let indexOfGuesser = game['currentGuesser'];
      let playerToSend = players[indexOfGuesser]
      console.log("SENDING GUESS EVENT TO", indexOfGuesser)
      console.log("SENDING GUESS TO Socket ID:", playerToSend.socketId);
      io.to(players[indexOfGuesser].socketId).emit(events.YOUR_TURN)
      game.players[randomNumber].isImposter = true;
      let imposterPlayerSocketId = players[randomNumber].socketId;
      io.to(imposterPlayerSocketId).emit(events.IMPOSTER)
    }
  });


});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})