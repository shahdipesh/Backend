import { games } from './gameState.js';
import express from 'express';
import { setNextGuesser } from './gameService.js';
import { getIO } from './socketManager.js';
import { events } from './events.js';
import { generateRandomIndex } from './gameService.ts'
import { Score } from './model/Score.ts';

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
      players.forEach((p, i) => {
        if (i != indexOfGuesser) {
          if (players[i] && players[i].socketId) {
            console.log("knjfkjfrn")
            let playerTurnName = players[indexOfGuesser]['playerName'];
            io.to(players[i].socketId).emit(events.PLAYER_TURN, ({ playerTurnName: playerTurnName}));
          }
        }
      })
      const playerToSend = players[indexOfGuesser];
      io.to(playerToSend.socketId).emit(events.YOUR_TURN);
      
      res.send({ msg: `${playerToSend} turn to guess` });
    }
  } catch {
    res.send(500);
  }
});

router.get('/getPlayers',(req,res)=>{
  const {gameId} = req.query
  const game = games[gameId];
  res.json({players: game.players})
})

router.post('/whoseTurn', (req,res)=>{
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const game = games[gameId];
  let players = game['players'];
  let currentGuesser = game.currentGuesser
  res.json({userId: players[currentGuesser].userId,name:players[currentGuesser].playerName})
})

router.post('/restart', async (req, res) => {
  const io = getIO();
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const game = games[gameId];
  let players = game['players'];

  let currentGuesserIndex = generateRandomIndex(game.numPlayers)

  game.numRound = 0;
  game.currentWordIndex = game.currentWordIndex + 1;
  game.gameStarted = false;
  game.imposterIndex = generateRandomIndex(game.numPlayers)
  game.currentGuesser = currentGuesserIndex
  game.startingPlayerIndex = currentGuesserIndex
  game.numberOfGuesses=0
  game.isVotingStarted = false
  game.isVotingEnded = true
  game.currentVoterIds=[]

  players.forEach((player) => {
    io.to(player.socketId).emit('PLAY_AGAIN');
  });

  res.send(200);
});

router.post('/guessImposter',(req, res)=>{
  const io = getIO();
  const userId = req.body.userId;
  const gameId = req.body.gameId;
  const guessedImposterId = req.body.guessedImposterId;
  const guessedWord = req.body.guessedWord;
  let isImposter = false
  if(guessedImposterId===games[gameId].players[games[gameId].imposterIndex].userId){
    isImposter = true
  }

  const game = games[gameId];
  game.numVotes+=1;

  let players = game['players'];
  let guessedPlayer = players[game.imposterIndex]

  if(game.currentVoterIds && game.currentVoterIds.includes(userId)){
    if(game.numberOfGuesses==game.numPlayers){
      game.isVotingStarted = false
      game.isVotingEnded = true
      players.forEach(p=>{
        io.to(p.socketId).emit('ALL_VOTED');
      })
      return;
    }
  }

  game.numberOfGuesses += 1
  game.currentVoterIds.push(userId)

  if(game.numberOfGuesses==game.numPlayers){
    game.isVotingStarted = false
    game.isVotingEnded = true
    players.forEach(p=>{
      io.to(p.socketId).emit('ALL_VOTED');
    })
  }

  console.log("guessedWord", guessedWord)
  console.log("asdad",game.words[game.currentWordIndex].word)
  if(guessedImposterId===guessedPlayer.userId || guessedWord?.trim().toLowerCase()===game.words[game.currentWordIndex].word.trim().toLowerCase()){
    let isWordGuessed = false
    if(guessedWord?.trim().toLowerCase()===game.words[game.currentWordIndex].word.trim().toLowerCase()){
      isWordGuessed = true
    }
    players.forEach(p=>{
      if(p.userId===userId){
        if(isWordGuessed){
          p.score+=2
        } else{
          p.score+=1
        }
      }
    })
    game.leaderBoard.forEach(s=>{
      if(s.playerId===userId){
        if(isWordGuessed){
          s.score+=2
        } else{
        s.score+=1
        }
      }
    })
    res.json({msg:userId})
    return
  } else {
    players.forEach(p=>{
      if(p.userId===userId){
        (p.score>0 && !isImposter)?p.score-=1:p.score=0
      }
    })
    game.leaderBoard.forEach(s=>{
      if(s.playerId===userId){
        (s.score>0 && !isImposter)?s.score-=1:s.score=0
      }
    })
  }
  game.isVotingStarted = true
  game.isVotingEnded = false
 res.json({msg:null})
})


router.get('/getScore',(req,res)=>{
  const { gameId } = req.query;
  const game = games[gameId];
  const leaderBoard = game.players.map((p) => ({
    playerName: p.playerName,
    playerId: p.userId,
    score: p.score,
    gameId,
  }));
  res.json(leaderBoard)
})

router.get(`/hasAlreadyVoted`,(req,res)=>{
  const { gameId, userId } = req.query;
  const game = games[gameId];
  let voted = game.currentVoterIds.includes(userId)
  res.send({msg:voted, isVotingStarted: game.isVotingStarted, isVotingEnded: game.isVotingEnded})
})

router.get('/isVotingStarted',(req,res)=>{
  const { gameId } = req.query;
  const game = games[gameId];
  if(game.isVotingStarted){
    res.json({msg:"YES"})
  }
  else {
    res.json({msg:"NO"})
  }
})

export default router;
