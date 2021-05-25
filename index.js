const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const itemSize = 25;
class Item {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.itemSize = itemSize;
    this.color = color;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.itemSize, this.itemSize);
  }

  update() {
    this.draw();
  }
}
const item = new Item();

const appleSpawnZones = [];
for (
  let cooridnates = itemSize;
  cooridnates <= canvas.width - itemSize * 2;
  cooridnates += itemSize
) {
  appleSpawnZones.push(cooridnates);
}

const snakeBody = [];
const snakeColor = "#5975FB";
for (let babySnake = 0; babySnake < 5; babySnake++) {
  snakeBody.push(new Item(300 - babySnake * itemSize, 300, snakeColor));
}

const fruit = [];
const appleColor = "#F00E33";
for (let firstApple = 0; firstApple < 1; firstApple++) {
  fruit.push(new Item(400, 300, appleColor));
}

let snakeMove = setInterval(snakeMovement, 100);
let snakeSpawnX, snakeSpawnY;
let direction = "right";
function snakeMovement() {
  switch (direction) {
    case "left":
      snakeBody.unshift(
        new Item(snakeBody[0].x - itemSize, snakeBody[0].y, snakeColor)
      );
      break;
    case "right":
      snakeBody.unshift(
        new Item(snakeBody[0].x + itemSize, snakeBody[0].y, snakeColor)
      );
      break;
    case "up":
      snakeBody.unshift(
        new Item(snakeBody[0].x, snakeBody[0].y - itemSize, snakeColor)
      );
      break;
    case "down":
      snakeBody.unshift(
        new Item(snakeBody[0].x, snakeBody[0].y + itemSize, snakeColor)
      );

      break;
  }
  snakeSpawnX = snakeBody[snakeBody.length - 1].x;
  snakeSpawnY = snakeBody[snakeBody.length - 1].y;
  snakeBody.pop();
}

document.onkeydown = changeDirection;
function changeDirection(e) {
  switch (e.keyCode) {
    case 37:
      if (direction !== "right") direction = "left";
      break;
    case 39:
      if (direction !== "left") direction = "right";
      break;
    case 38:
      if (direction !== "down") direction = "up";
      break;
    case 40:
      if (direction !== "up") direction = "down";
      break;
    case 32:
      gameState === "playing"
        ? (gameState = "paused")
        : (gameState = "playing");
      break;
  }
}

let appleSpawnX, appleSpawnY;
function appleRandomize() {
  appleSpawnX =
    appleSpawnZones[Math.floor(Math.random() * appleSpawnZones.length)];
  appleSpawnY =
    appleSpawnZones[Math.floor(Math.random() * appleSpawnZones.length)];

  for (let i = 0; i < snakeBody.length; i++) {
    if (appleSpawnY === snakeBody[i].y && appleSpawnX === snakeBody[i].x) {
      appleRandomize();
    }
  }
}

let gameState = "playing";
let resumeGame = true;
document
  .querySelector("button")
  .addEventListener("click", () => (document.location.href = ""));
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
      c.fillStyle = "rgba(0,0,0, 0.5)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.font = "50px Ariel";
      c.fillStyle = "white";
      c.textAlign = "center";
      c.fillText("Paused", canvas.width / 2, canvas.height / 2);
      break;

    case "gameover":
      clearInterval(snakeMove);
      clearInterval(timeTic);
      document.querySelector("#modal").style.display = "block";
      document.querySelector("#death").innerText = causeOfDeath;
      let snakeSize = snakeBody.length * itemSize;
      document.querySelector("#stats").innerText = `Apples Eaten: ${score} 
            Snake Size: ${snakeSize}m `;
      break;
  }
}

let score = 0;
let causeOfDeath;
function collisionTest(snakeHeadX, snakeHeadY) {
  if (
    snakeHeadX + itemSize > canvas.width ||
    snakeHeadX < 0 ||
    snakeHeadY + itemSize > canvas.height ||
    snakeHeadY < 0
  ) {
    gameState = "gameover";
    causeOfDeath = "Ouchh.... Ittsss NOT an Apple Tree!?";
  }

  if (
    snakeHeadX + itemSize > fruit[0].x &&
    snakeHeadX < fruit[0].x + itemSize &&
    snakeHeadY < fruit[0].y + itemSize &&
    snakeHeadY + itemSize > fruit[0].y
  ) {
    score++;
    score > 20 ? (seconds += 2) : score > 10 ? (seconds += 3) : (seconds += 4);
    if (seconds >= 20) seconds = 20;

    snakeBody.push(new Item(snakeSpawnX, snakeSpawnY, snakeColor));
    fruit.shift();
    appleRandomize();
    fruit.push(new Item(appleSpawnX, appleSpawnY, appleColor));
  }

  for (let hit = 1; hit < snakeBody.length; hit++) {
    if (snakeHeadX === snakeBody[hit].x && snakeHeadY === snakeBody[hit].y) {
      gameState = "gameover";
      causeOfDeath = "Feeling dissszzy iss..that mE...";
    }
  }
}

let timeTic = setInterval(countDown, 1000);
const appendTimeValue = (seconds) => (seconds < 10 ? `0${seconds}` : seconds);
let seconds = 15;
function countDown() {
  seconds--;
  if (seconds === 0) {
    gameState = "gameover";
    causeOfDeath = "sSSsoooo tired...floating apples..?";
  }
}

function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "#1EF060";
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snakeBody.length; i++) snakeBody[i].update();

  for (let j = 0; j < fruit.length; j++) fruit[j].update();

  collisionTest(snakeBody[0].x, snakeBody[0].y);

  (c.font = "30px Ariel"), (c.fillStyle = "black"), (c.textAlign = "left");
  c.fillText(
    `Apples: ${score} Time: 0:${appendTimeValue(seconds)}s`,
    itemSize,
    canvas.height - itemSize
  );

  gameStateMaster();
}

animate();
