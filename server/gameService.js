let games = require('./gameState')
const { setIO, getIO } = require('./socketManager')

const setNextGuesser = (gameId) => {
    const io =getIO()
    const game = games[gameId];
    let players = game['players']
    game.currentGuesser = (game.currentGuesser + 1) % (game.players.length);
    if(game.currentGuesser==0){
        game.numRound+=1
    }
    if(game.numRound==1){
        return true;
    }
}

module.exports = { setNextGuesser }