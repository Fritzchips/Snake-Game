const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

const dimension = 20;
class Item {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.dimension = dimension;
    this.color = color;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.dimension, this.dimension);
  }

  update() {
    this.draw();
  }
}
const item = new Item();

let timeTic = setInterval(countDown, 1000);
const appendTimeValue = (seconds) => (seconds < 10 ? `0${seconds}` : seconds);
let seconds = 15;
function countDown() {
  seconds--;
  if (seconds === 0)
    (gameState = "gameover"),
      (causeOfDeath = "sSSsoooo tired...floating apples..?");
}

let snakeMove = setInterval(snakeMovement, 100);
let snakeSpawnX, snakeSpawnY;
let direction = "right";
function snakeMovement() {
  switch (direction) {
    case "left":
      snakeBody.unshift(
        new Item(snakeBody[0].x - dimension, snakeBody[0].y, snakeColor)
      );
      snakeSpawnX = snakeBody[0].x - dimension;
      snakeSpawnY = snakeBody[0].y;
      break;
    case "right":
      snakeBody.unshift(
        new Item(snakeBody[0].x + dimension, snakeBody[0].y, snakeColor)
      );
      snakeSpawnX = snakeBody[0].x + dimension;
      snakeSpawnY = snakeBody[0].y;
      break;
    case "up":
      snakeBody.unshift(
        new Item(snakeBody[0].x, snakeBody[0].y - dimension, snakeColor)
      );
      snakeSpawnX = snakeBody[0].x;
      snakeSpawnY = snakeBody[0].y - dimension;
      break;
    case "down":
      snakeBody.unshift(
        new Item(snakeBody[0].x, snakeBody[0].y + dimension, snakeColor)
      );
      snakeSpawnX = snakeBody[0].x;
      snakeSpawnY = snakeBody[0].y + dimension;
      break;
  }
  snakeBody.pop();
}

const snakeBody = [];
const snakeColor = "#9466FA";
for (let babySnake = 0; babySnake < 5; babySnake++) {
  snakeBody.push(new Item(300 - babySnake * dimension, 300, snakeColor));
}

const fruit = [];
const appleColor = "#F00E33";
for (let firstApple = 0; firstApple < 1; firstApple++) {
  fruit.push(new Item(400, 300, appleColor));
}

const appleSpawnZones = [];
for (
  let cooridnates = 20;
  cooridnates <= canvas.width - dimension * 2;
  cooridnates += 20
) {
  appleSpawnZones.push(cooridnates);
}

onkeydown = changeDirection;
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
      let snakeSize = snakeBody.length * dimension;
      document.querySelector("#stats").innerText = `Apples Eaten: ${score} 
            Snake Size: ${snakeSize}m `;
      break;
  }
}

let score = 0;
let causeOfDeath;
function collisionTest() {
  if (
    snakeBody[0].x + dimension > canvas.width ||
    snakeBody[0].x < 0 ||
    snakeBody[0].y + dimension > canvas.height ||
    snakeBody[0].y < 0
  ) {
    gameState = "gameover";
    causeOfDeath = "Ouchh.... Ittsss NOT an Apple Tree!?";
  }

  if (
    snakeBody[0].x + dimension > fruit[0].x &&
    snakeBody[0].x < fruit[0].x + dimension &&
    snakeBody[0].y < fruit[0].y + dimension &&
    snakeBody[0].y + dimension > fruit[0].y
  ) {
    score++;
    seconds += 3;
    if (seconds >= 20) seconds = 20;

    snakeBody.push(new Item(snakeSpawnX, snakeSpawnY, snakeColor));
    fruit.shift();
    appleRandomize();
    fruit.push(new Item(appleSpawnX, appleSpawnY, appleColor));
  }

  for (let hit = 1; hit < snakeBody.length; hit++) {
    if (
      snakeBody[0].x === snakeBody[hit].x &&
      snakeBody[0].y === snakeBody[hit].y
    ) {
      gameState = "gameover";
      causeOfDeath = "Feeling dissszzy iss..that mE...";
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "#66FAE2";
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snakeBody.length; i++) {
    snakeBody[i].update();
  }
  for (let j = 0; j < fruit.length; j++) {
    fruit[j].update();
  }

  collisionTest();

  c.font = "30px Ariel";
  c.fillStyle = "black";
  c.textAlign = "left";
  c.fillText(
    `Apples: ${score} Time: 0:${appendTimeValue(seconds)}s`,
    dimension,
    canvas.height - dimension
  );

  gameStateMaster();
}

animate();
