import { games } from './gameState.js';

export const setNextGuesser = (gameId) => {
  const game = games[gameId];
  let players = game['players'];
  game.currentGuesser = (game.currentGuesser + 1) % game.players.length;
  if (game.currentGuesser == 0) {
    game.numRound += 1;
  }
  if (game.numRound == 1) {
    return true;
  }
};

export const isAllPlayerActive = (players) => {
  players.forEach((p) => {
    if (p.active == false) {
      return false;
    }
  });

  return true;
};

export const getGameWords = () =>{
    const words = [
      'Beach',
      'Airport',
      'School',
      'Hospital',
      'Restaurant',
      'Library',
      'Gym',
      'Supermarket',
      'Hotel',
      'Park',
      'Backpack',
      'Umbrella',
      'Toothbrush',
      'Camera',
      'Keyboard',
      'Headphones',
      'Microwave',
      'Wallet',
      'Watch',
      'Bottle',
    ];
  
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
  
    return words;
  };

export const generateRandomIndex = (numPlayers) =>{
  const randomNumber = Math.floor(Math.random() * numPlayers);
  return randomNumber
}