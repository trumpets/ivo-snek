
function checkBoundaries(head, boardWidth, boardHeight) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // Check left boundary
  if (head.x === 0) {
    isMoveSafe.left = false;
  }

  // Check right boundary
  if (head.x === boardWidth - 1) {
    isMoveSafe.right = false;
  }

  // Check bottom boundary
  if (head.y === 0) {
    isMoveSafe.down = false;
  }

  // Check top boundary
  if (head.y === boardHeight - 1) {
    isMoveSafe.up = false;
  }

  return isMoveSafe;
}

export default checkBoundaries;
