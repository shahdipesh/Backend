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
    // Animals
    { word: 'Dog', hint: 'Loyalty wrapped in fur and curious eyes' },
    { word: 'Cat', hint: 'Independence balanced on velvet paws' },
    { word: 'Bird', hint: 'Freedom given feathers and a voice' },
    { word: 'Fish', hint: 'A world seen through liquid silence' },
    { word: 'Elephant', hint: 'Memory made heavier with each passing year' },
    { word: 'Lion', hint: 'Authority woven into golden mane' },
    { word: 'Tiger', hint: 'Power written in stripes across wilderness' },
    { word: 'Bear', hint: 'Strength that sleeps through winter\'s patience' },
    { word: 'Horse', hint: 'Grace harnessed beneath the rider' },
    { word: 'Cow', hint: 'Sustenance given in quiet, patient rhythm' },
    { word: 'Monkey', hint: 'Mischief swinging between branches and reason' },
    { word: 'Penguin', hint: 'A creature who chooses ice over open sky' },
    { word: 'Butterfly', hint: 'Transformation made visible and temporary' },
    { word: 'Snake', hint: 'Shedding what no longer fits' },
    { word: 'Rabbit', hint: 'Caution disguised in softness' },

    // Food & Drink
    { word: 'Apple', hint: 'The first temptation, offered whole' },
    { word: 'Banana', hint: 'A fruit that announces its own undressing' },
    { word: 'Bread', hint: 'The staff of life, risen and broken' },
    { word: 'Milk', hint: 'Nourishment before thought could form' },
    { word: 'Cheese', hint: 'Patience aged into complexity' },
    { word: 'Chicken', hint: 'A creature that came before the egg\'s question' },
    { word: 'Rice', hint: 'Grain multiplied, feeding billions in silence' },
    { word: 'Egg', hint: 'Potential contained in fragile walls' },
    { word: 'Tomato', hint: 'Acidity bottled in crimson skin' },
    { word: 'Carrot', hint: 'Sweetness hidden underground until discovered' },
    { word: 'Coffee', hint: 'Awakening captured in steam and ritual' },
    { word: 'Pizza', hint: 'Cultures meeting on a circular stage' },
    { word: 'Chocolate', hint: 'Bitter and sweet arguing on the tongue' },
    { word: 'Fish', hint: 'Protein that lived in another world' },
    { word: 'Potato', hint: 'Humble fullness buried beneath soil' },

    // Household items
    { word: 'Chair', hint: 'Rest offered in four-legged faith' },
    { word: 'Table', hint: 'A stage for gathering and solitude alike' },
    { word: 'Bed', hint: 'Where vulnerability meets daily escape' },
    { word: 'Lamp', hint: 'Light denied the sun\'s permission' },
    { word: 'Cup', hint: 'A vessel holding warmth and reason' },
    { word: 'Plate', hint: 'A canvas for sustenance and artistry' },
    { word: 'Fork', hint: 'Civilization\'s three-pronged rebellion' },
    { word: 'Spoon', hint: 'The curve that catches liquid need' },
    { word: 'Knife', hint: 'Precision where clumsiness meets resistance' },
    { word: 'Pillow', hint: 'Support for thoughts too heavy for waking' },
    { word: 'Blanket', hint: 'Protection woven from textile and pretense' },
    { word: 'Towel', hint: 'Absolution after exposure to water' },
    { word: 'Napkin', hint: 'A tiny flag of surrender to appetite' },
    { word: 'Soap', hint: 'Cleanliness as ritual and necessity' },
    { word: 'Key', hint: 'Permission shaped in metal and mystery' },

    // Sports & Games
    { word: 'Football', hint: 'Organized chaos chased across grass' },
    { word: 'Basketball', hint: 'Gravity defied, then remembered' },
    { word: 'Tennis', hint: 'Violence wrapped in white fabric and net' },
    { word: 'Swimmer', hint: 'A body learning another element\'s language' },
    { word: 'Hockey', hint: 'Friction sought on a slippery stage' },
    { word: 'Golf', hint: 'Patience measured in small, lonely distances' },
    { word: 'Chess', hint: 'War played without consequence or sound' },
    { word: 'Dice', hint: 'Fate offered in six small betrayals' },

    // Weather & Nature
    { word: 'Sun', hint: 'A star so close it burns itself into rhythm' },
    { word: 'Moon', hint: 'Gravity\'s silent art show' },
    { word: 'Star', hint: 'Fire that will never warm you directly' },
    { word: 'Snow', hint: 'Winter\'s attempt to erase footprints' },
    { word: 'Wind', hint: 'Air given urgency and invisible hands' },
    { word: 'Cloud', hint: 'Water pretending to be solid in the sky' },
    { word: 'Tree', hint: 'Growth reaching upward through patient rings' },
    { word: 'Flower', hint: 'Brief rebellion against mortality' },
    { word: 'Grass', hint: 'The earth\'s whisper spread across itself' },
    { word: 'Rock', hint: 'Stillness so profound it becomes ancient' },
    { word: 'Water', hint: 'The element that remembers all shapes' },
    { word: 'Ice', hint: 'Transformation through subtraction' },
    { word: 'Storm', hint: 'Chaos that announces itself before arrival' },

    // Body parts
    { word: 'Hand', hint: 'First tool, first weapon, first tenderness' },
    { word: 'Foot', hint: 'Distance measured in small, stubborn steps' },
    { word: 'Eye', hint: 'Window that never closes but often lies' },
    { word: 'Nose', hint: 'Memory in fragrance form' },
    { word: 'Mouth', hint: 'Gateway of hunger, truth, and music' },
    { word: 'Ear', hint: 'Witness to everything, understood by none' },
    { word: 'Heart', hint: 'Rhythm that ignores reason\'s arguments' },
    { word: 'Head', hint: 'The most visited prison of all' },
    { word: 'Arm', hint: 'Reach limited only by its own length' },
    { word: 'Leg', hint: 'The body\'s commitment to forward motion' },
    { word: 'Tooth', hint: 'Hardness guarding vulnerability' },
    { word: 'Hair', hint: 'Sensation at the edge of self' },
    { word: 'Skin', hint: 'A border between inside and betrayal' },

    // Clothing
    { word: 'Hat', hint: 'Authority balanced on fragile balance' },
    { word: 'Shirt', hint: 'First layer of curated identity' },
    { word: 'Pants', hint: 'Civilization\'s lower compromise' },
    { word: 'Shoes', hint: 'Armor against earth\'s indifference' },
    { word: 'Coat', hint: 'Surrender to seasons made portable' },
    { word: 'Socks', hint: 'Modesty hidden where only feet witness' },
    { word: 'Tie', hint: 'A rope worn by choice around the throat' },
    { word: 'Gloves', hint: 'Distance maintained between skin and world' },

    // Vehicles & Transport
    { word: 'Bus', hint: 'Solitude experienced in a crowd' },
    { word: 'Bike', hint: 'Movement tied to human effort alone' },
    { word: 'Truck', hint: 'Labor made mobile and muscular' },
    { word: 'Boat', hint: 'Defiance against water\'s natural division' },
    { word: 'Airplane', hint: 'The earth reduced to a map below' },
    { word: 'Bicycle', hint: 'Balance learned through perpetual motion' },
    { word: 'Taxi', hint: 'Strangers paid to witness your journey' },

    // Family
    { word: 'Mother', hint: 'The origin that never truly releases' },
    { word: 'Father', hint: 'Distance taught to measure itself as love' },
    { word: 'Brother', hint: 'A rival assigned by blood' },
    { word: 'Sister', hint: 'A mirror who speaks back' },
    { word: 'Grandmother', hint: 'History given a face and patience' },
    { word: 'Grandfather', hint: 'Silence learned as wisdom' },
    { word: 'Baby', hint: 'Potential before it learned disappointment' },

    // Colors
    { word: 'Red', hint: 'Passion, warning, and shame in one hue' },
    { word: 'Blue', hint: 'Depth that stretches without bottom' },
    { word: 'Green', hint: 'The color that refuses to stay still' },
    { word: 'Yellow', hint: 'Joy captured in wavelength and pigment' },
    { word: 'Black', hint: 'Absence made visible' },
    { word: 'White', hint: 'Purity until it touches reality' },
    { word: 'Pink', hint: 'Softness learned through dilution' },
    { word: 'Orange', hint: 'The compromise between fire and fruit' },

    // Time & Numbers
    { word: 'Day', hint: 'Light\'s brief authority over dark' },
    { word: 'Night', hint: 'The time when honesty visits' },
    { word: 'Morning', hint: 'A second chance offered daily' },
    { word: 'Evening', hint: 'The light\'s farewell performance' },
    { word: 'Month', hint: 'The moon\'s full revolution' },
    { word: 'Year', hint: 'The circle that keeps returning changed' },
    { word: 'Hour', hint: 'Sixty minutes of forgetting' },
    { word: 'Minute', hint: 'Time small enough to hold' },

    // Basic objects
    { word: 'Ball', hint: 'Perfection in motion and weight' },
    { word: 'Box', hint: 'Geometry holding what cannot escape' },
    { word: 'Rope', hint: 'Connection wrapped around itself' },
    { word: 'Pen', hint: 'Permanence given to fleeting thought' },
    { word: 'Paper', hint: 'Emptiness waiting to be filled' },
    { word: 'Bag', hint: 'Transformation through containment' },
    { word: 'String', hint: 'Distance made fragile and tied' },
    { word: 'Nail', hint: 'Simplicity driven home' },
    { word: 'Hammer', hint: 'Blunt force given handle and purpose' },
    { word: 'Pot', hint: 'Heat captured for transformation' },
    { word: 'Pan', hint: 'Where pressure meets sizzle' },
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