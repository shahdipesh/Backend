import { games } from './gameState.js';

export const setNextGuesser = (gameId) => {
  const game = games[gameId];
  let players = game['players'];
  game.currentGuesser = (game.currentGuesser + 1) % game.players.length;
  if (game.currentGuesser === game.startingPlayerIndex) {
    game.numRound += 1;
  }
  if (game.numRound == 2) {
    game.isVotingStarted = true
    game.isVotingEnded = false
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

export const getGameWords = () => {
  const words = [
    { word: 'Beach', hint: 'Where endings dissolve into endless motion' },
    { word: 'Airport', hint: 'Where departures and returns briefly overlap' },
    { word: 'School', hint: 'Where repetition slowly becomes understanding' },
    { word: 'Hospital', hint: 'Where fragility is met with careful hands' },
    { word: 'Restaurant', hint: 'Where hunger becomes a shared ritual' },
    { word: 'Library', hint: 'Where silence holds countless borrowed minds' },
    { word: 'Gym', hint: 'Where resistance is invited, not avoided' },
    { word: 'Supermarket', hint: 'Where abundance is arranged in silent rows' },
    { word: 'Hotel', hint: 'Where no one truly stays, only passes through' },
    { word: 'Park', hint: 'Where nature pauses for human wandering' },

    { word: 'Backpack', hint: 'A burden chosen rather than imposed' },
    { word: 'Umbrella', hint: 'A refusal to accept what falls from above' },
    { word: 'Toothbrush', hint: 'A ritual of renewal hidden in routine' },
    { word: 'Camera', hint: 'A pause extracted from the flow of time' },
    { word: 'Keyboard', hint: 'Where thought becomes traceable form' },
    { word: 'Headphones', hint: 'A private world drawn from invisible threads' },
    { word: 'Microwave', hint: 'Where distance collapses into heat' },
    { word: 'Wallet', hint: 'A small keeper of permission and exchange' },
    { word: 'Watch', hint: 'A quiet reminder of irreversible movement' },
    { word: 'Bottle', hint: 'A boundary between containment and release' },

    // new ones
    { word: 'Train', hint: 'A rhythm that follows fixed paths through distance' },
    { word: 'Bridge', hint: 'A decision suspended over emptiness' },
    { word: 'Ocean', hint: 'A presence too large to be held in sight' },
    { word: 'Mountain', hint: 'A stillness that resists approach' },
    { word: 'Fire', hint: 'A form that exists only while it changes everything' },
    { word: 'Rain', hint: 'A soft insistence from the sky' },
    { word: 'Phone', hint: 'A distant voice made immediate' },
    { word: 'Car', hint: 'A private movement through shared space' },
    { word: 'Book', hint: 'A world folded into still pages' },
    { word: 'Clock', hint: 'A circle pretending to measure the infinite' },
    { word: 'Door', hint: 'A choice disguised as an object' },
    { word: 'Window', hint: 'A boundary that allows borrowed views' },
    { word: 'Mirror', hint: 'A surface that answers without speaking' },
    { word: 'Road', hint: 'A line that only exists while being followed' },
    { word: 'Light', hint: 'A presence that reveals without touching' },
    { word: 'Shadow', hint: 'What remains when presence turns away' },
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