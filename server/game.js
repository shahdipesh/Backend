const express = require('express');
const router = express.Router();
let games = require('./gameState')
const {setNextGuesser} = require('./gameService')
const { getIO } = require('./socketManager');
const { events } = require('./events')


router.post('/guess',async(req,res)=>{
    try{
        const io = getIO();
        const userId = req.body.userId;
        const gameId = req.body.gameId; 
        const game = games[gameId];
        let players = game['players']
        let isGameOver = setNextGuesser(gameId)
        if(isGameOver){
            players.forEach(p => {
                io.to(p.socketId).emit(events.ROUND_OVER)
                console.log("ROUND OVER")
            });
            res.send({msg:"Round Over"})
        } else{
            let indexOfGuesser = game['currentGuesser'];
            let playerToSend = players[indexOfGuesser]
            console.log("SENDING GUESS EVENT TO", indexOfGuesser)
            console.log("SENDING GUESS TO Socket ID:", playerToSend.socketId);
            io.to(playerToSend.socketId).emit(events.YOUR_TURN)
            res.send({msg:`${playerToSend} turn to guess`})
        }
        
    }
    catch{
        res.send(500)
    }
})

module.exports = router; 