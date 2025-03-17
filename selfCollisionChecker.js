
function checkSelfCollision(head, body) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true
  };

  // Check potential next positions against all body parts except the tail
  // (since the tail will move out of the way)
  const bodyToCheck = body.slice(0, -1);

  bodyToCheck.forEach(segment => {
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

  return isMoveSafe;
}

export default checkSelfCollision;
