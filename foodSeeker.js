function findClosestFood(head, food) {
  if (!food.length) return null;

  return food.reduce((closest, current) => {
    const distanceToCurrent = Math.abs(current.x - head.x) + Math.abs(current.y - head.y);
    const distanceToClosest = Math.abs(closest.x - head.x) + Math.abs(closest.y - head.y);
    return distanceToCurrent < distanceToClosest ? current : closest;
  });
}

function getMoveTowardsFood(head, food, safeMoves) {
  if (!food || !safeMoves.length) return null;

  const preferredMoves = [];

  // Horizontal movement
  if (head.x < food.x && safeMoves.includes('right')) {
    preferredMoves.push('right');
  } else if (head.x > food.x && safeMoves.includes('left')) {
    preferredMoves.push('left');
  }

  // Vertical movement
  if (head.y < food.y && safeMoves.includes('up')) {
    preferredMoves.push('up');
  } else if (head.y > food.y && safeMoves.includes('down')) {
    preferredMoves.push('down');
  }

  return preferredMoves.length ? preferredMoves[Math.floor(Math.random() * preferredMoves.length)] : null;
}

export { findClosestFood, getMoveTowardsFood };