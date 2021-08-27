const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const itemSize = 25;

let snakeSpawnX, snakeSpawnY;
let gameState = "playing";
let resumeGame = true;
let score = 0;
let causeOfDeath;
let seconds = 15;

let apple = {
  x: 0,
  y: 0,
  color: "#F00E33",
};

let snake = {
  body: [],
  color: "#5975FB",
  direction: "right",
};

window.onload = () => {
  appleRandomize();
};

let timeTic = setInterval(countDown, 1000);
let snakeMove = setInterval(snakeMovement, 100);
document.onkeydown = changeDirection;

function drawApple() {
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, itemSize, itemSize);
}

function drawSnake() {
  ctx.fillStyle = snake.color;
  for (let snakeBody of snake.body) {
    ctx.fillRect(snakeBody.x, snakeBody.y, itemSize, itemSize);
  }
}

for (let babySnake = 0; babySnake < 5; babySnake++) {
  snake.body.push({
    x: 300 - babySnake * itemSize,
    y: 300,
  });
}

function snakeMovement() {
  switch (snake.direction) {
    case "left":
      snake.body.unshift({ x: snake.body[0].x - itemSize, y: snake.body[0].y });
      break;
    case "right":
      snake.body.unshift({ x: snake.body[0].x + itemSize, y: snake.body[0].y });
      break;
    case "up":
      snake.body.unshift({ x: snake.body[0].x, y: snake.body[0].y - itemSize });
      break;
    case "down":
      snake.body.unshift({ x: snake.body[0].x, y: snake.body[0].y + itemSize });

      break;
  }
  snakeSpawnX = snake.body[snake.body.length - 1].x;
  snakeSpawnY = snake.body[snake.body.length - 1].y;
  snake.body.pop();
}

function changeDirection(e) {
  switch (e.keyCode) {
    case 37:
      if (snake.direction !== "right") snake.direction = "left";
      break;
    case 39:
      if (snake.direction !== "left") snake.direction = "right";
      break;
    case 38:
      if (snake.direction !== "down") snake.direction = "up";
      break;
    case 40:
      if (snake.direction !== "up") snake.direction = "down";
      break;
    case 32:
      gameState === "playing"
        ? (gameState = "paused")
        : (gameState = "playing");
      break;
  }
}

function appleRandomize() {
  apple.x = Math.floor((Math.random() * canvas.width) % itemSize) * itemSize;
  apple.y = Math.floor((Math.random() * canvas.height) % itemSize) * itemSize;

  for (let i = 0; i < snake.body.length; i++) {
    if (apple.y === snake.body[i].y && apple.x === snake.body[i].x) {
      appleRandomize();
    }
  }
}

const slitherAgain = document.querySelector("button");
slitherAgain.addEventListener("click", () => (document.location.href = ""));

function gameStateMaster() {
  switch (gameState) {
    case "playing":
      if (resumeGame === false) {
        snakeMove = setInterval(snakeMovement, 100);
        timeTic = setInterval(countDown, 1000);
        resumeGame = true;
      }
      break;

    case "paused":
      clearInterval(snakeMove);
      clearInterval(timeTic);
      resumeGame = false;
      ctx.fillStyle = "rgba(0,0,0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "50px Ariel";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Paused", canvas.width / 2, canvas.height / 2);
      break;

    case "gameover":
      clearInterval(snakeMove);
      clearInterval(timeTic);
      document.querySelector("#modal").style.display = "block";
      document.querySelector("#death").innerText = causeOfDeath;
      let snakeSize = snake.body.length * itemSize;
      document.querySelector("#stats").innerText = `Apples Eaten: ${score} 
            Snake Size: ${snakeSize}m `;
      break;
  }
}

function collisionTest(snakeHeadX, snakeHeadY) {
  checkIfSnakeHitsWall(snakeHeadX, snakeHeadY);
  checkIfShankeEatsApple(snakeHeadX, snakeHeadY);
  checkIfSnakeEatsItself(snakeHeadX, snakeHeadY);
}

function checkIfSnakeEatsItself(snakeHeadX, snakeHeadY) {
  for (let hit = 1; hit < snake.body.length; hit++) {
    if (snakeHeadX === snake.body[hit].x && snakeHeadY === snake.body[hit].y) {
      gameState = "gameover";
      causeOfDeath = "Ouch! I bit myself";
    }
  }
}

function checkIfShankeEatsApple(snakeHeadX, snakeHeadY) {
  if (
    snakeHeadX + itemSize > apple.x &&
    snakeHeadX < apple.x + itemSize &&
    snakeHeadY < apple.y + itemSize &&
    snakeHeadY + itemSize > apple.y
  ) {
    score++;
    score > 20 ? (seconds += 2) : score > 10 ? (seconds += 3) : (seconds += 4);
    if (seconds >= 20) seconds = 20;

    snake.body.push({ x: snakeSpawnX, y: snakeSpawnY });

    appleRandomize();
  }
}

function checkIfSnakeHitsWall(snakeHeadX, snakeHeadY) {
  if (
    snakeHeadX + itemSize > canvas.width ||
    snakeHeadX < 0 ||
    snakeHeadY + itemSize > canvas.height ||
    snakeHeadY < 0
  ) {
    gameState = "gameover";
    causeOfDeath = "Hey! That's not an Apple Tree";
  }
}

const appendTimeValue = (seconds) => (seconds < 10 ? `0${seconds}` : seconds);

function countDown() {
  seconds--;
  if (seconds === 0) {
    gameState = "gameover";
    causeOfDeath = "Need food... So hungry...";
  }
}

function animate() {
  requestAnimationFrame(animate);

  clearCanvas();

  drawSnake();

  drawApple();

  collisionTest(snake.body[0].x, snake.body[0].y);

  displayScoreAndTime();

  gameStateMaster();
}

function displayScoreAndTime() {
  ctx.font = "30px Ariel";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.fillText(
    `Apples: ${score} Time: 0:${appendTimeValue(seconds)}s`,
    itemSize,
    canvas.height - itemSize
  );
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1EF060";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

animate();
