function checkOpponentCollisions(head, opponents) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  opponents.forEach(snake => {
    // Check all body segments of each opponent snake
    snake.body.forEach(segment => {
      // Check left move
      if (head.x - 1 === segment.x && head.y === segment.y) {
        isMoveSafe.left = false;
      }
      // Check right move
      if (head.x + 1 === segment.x && head.y === segment.y) {
        isMoveSafe.right = false;
      }
      // Check down move
      if (head.x === segment.x && head.y - 1 === segment.y) {
        isMoveSafe.down = false;
      }
      // Check up move
      if (head.x === segment.x && head.y + 1 === segment.y) {
        isMoveSafe.up = false;
      }
    });
  });

  return isMoveSafe;
}

export default checkOpponentCollisions;