// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';
import chalk from 'chalk';
import checkBoundaries from './boundaryChecker.js';
import checkSelfCollision from './selfCollisionChecker.js';
import checkOpponentCollisions from './opponentCollisionChecker.js';
import { findClosestFood, getMoveTowardsFood } from './foodSeeker.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "Ivo",       // TODO: Your Battlesnake Username
    color: "#888888", // TODO: Choose color
    head: "all-seeing",  // TODO: Choose head
    tail: "weight",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

function printBoard(board) {
  // uncomment if you like to observe debug data
  // console.log(board.food);
  // console.log(board.snakes[0].body);

  const boardState = new Map();
  board.snakes.forEach(snake => {
    snake.body.forEach(segment => boardState.set(segment.x + "," + segment.y, "S"))
  });
  board.food.forEach(food => boardState.set(food.x + "," + food.y, "F"));

  for (let y = board.height - 1; y >= 0; y--) {
    for (let x = 0; x < board.width; x++) {
      // clean code, but andreas us wants us to use CHALK :)
      // process.stdout.write(boardState.get(x + "," + y) || '.');
      const cell = boardState.get(x + "," + y);
      if (cell === 'F') {
        process.stdout.write(chalk.bold.red('F'));
      } else if (cell === 'S') {
        process.stdout.write(chalk.bold.blue('S'));
      } else {
        process.stdout.write(chalk.bgWhite('.'));
      }
    }
    process.stdout.write('\n');
  }
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  // printBoard(gameState.board);

  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // Step 1 - Prevent Battlesnake from moving out of bounds
  const boundaryMoves = checkBoundaries(myHead, gameState.board.width, gameState.board.height);

  // Combine boundary checks with existing safe moves
  Object.keys(boundaryMoves).forEach(move => {
    if (!boundaryMoves[move]) isMoveSafe[move] = false;
  });

  // Step 2 - Prevent your Battlesnake from colliding with itself
  const selfCollisionMoves = checkSelfCollision(myHead, gameState.you.body);

  // Combine self-collision checks with existing safe moves
  Object.keys(selfCollisionMoves).forEach(move => {
    if (!selfCollisionMoves[move]) isMoveSafe[move] = false;
  });

  // Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes.filter(snake => snake.id !== gameState.you.id);
  const opponentCollisionMoves = checkOpponentCollisions(myHead, opponents);

  // Combine opponent collision checks with existing safe moves
  Object.keys(opponentCollisionMoves).forEach(move => {
    if (!opponentCollisionMoves[move]) isMoveSafe[move] = false;
  });

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  // Step 4 - Move towards food instead of random 
  const closestFood = findClosestFood(myHead, gameState.board.food);
  const foodMove = getMoveTowardsFood(myHead, closestFood, safeMoves);

  // Use food-seeking move if available, otherwise choose random safe move
  const nextMove = foodMove || safeMoves[Math.floor(Math.random() * safeMoves.length)];

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
