const screens = {
  start: document.getElementById("startScreen"),
  game: document.getElementById("gameScreen"),
  letter: document.getElementById("letterScreen")
};

const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replayButton");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tulipCounter = document.getElementById("tulipCounter");
const gameToast = document.getElementById("gameToast");
const heartLives = document.getElementById("heartLives");
const letterText = document.getElementById("letterText");
const bearSpeechBubble = document.getElementById("bearSpeechBubble");

const tile = 45;
const map = [
  "####################",
  "#S....#......#.....#",
  "#.###.#.####.#.###.#",
  "#...#...#..#...#...#",
  "###.#####..#####.#.#",
  "#...#....T.....#.#.#",
  "#.###.######.#.#.#.#",
  "#.....#..T...#...#.#",
  "#.#####.#######.####",
  "#...T...#.....#...TG",
  "####################",
  "####################"
];

const totalTulips = 7;
let player;
let tulips;
let won = false;
let moves = 0;
let speechBubbleTimer;

const letterParagraphs = [
  "Mi amor, feliz Día de la Novia. Hice este pequeño detalle pensando en ti, en tus colores lila y en esos tulipanes que hacen que todo se vea más bonito, como si el mundo supiera ponerse tierno para ti.",
  "Gracias por ser esa persona que me alegra los días, que me inspira a cuidar los detalles y que vuelve especial hasta lo más sencillo. Me encanta tu forma de existir, tu risa, tu ternura y todo lo que eres.",
  "Quiero que esta carta te recuerde que eres muy amada. Ojalá cada flor de este juego llegue como un abrazo, y cada corazoncito como una forma pequeña de decirte: me haces muy feliz.",
  "Te quiero muchísimo, mi amor."
];

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function resetGame() {
  clearTimeout(speechBubbleTimer);
  bearSpeechBubble.className = "bear-speech-bubble";
  bearSpeechBubble.textContent = "";
  player = { x: 1, y: 1, blink: 0 };
  tulips = [
    { x: 12, y: 1, found: false },
    { x: 5, y: 3, found: false },
    { x: 10, y: 5, found: false },
    { x: 16, y: 5, found: false },
    { x: 9, y: 7, found: false },
    { x: 4, y: 9, found: false },
    { x: 18, y: 9, found: false }
  ];
  won = false;
  moves = 0;
  tulipCounter.textContent = `Tulipanes 0/${totalTulips}`;
  heartLives.textContent = "♥ ♥ ♥";
  gameToast.textContent = "Usa las flechas o los botones para moverte";
  gameToast.classList.remove("is-hidden");
  drawGame();
}

function drawBrickPattern(x, y, width, height) {
  ctx.fillStyle = "#f57aaa";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "rgba(255, 174, 197, 0.55)";
  for (let row = 6; row < height; row += 16) {
    const offset = row % 32 === 6 ? 6 : 24;
    for (let col = offset; col < width; col += 42) {
      ctx.fillRect(x + col, y + row, 24, 7);
    }
  }
}

function drawTulip(cx, cy, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#49b57d";
  ctx.fillRect(-3, 2, 6, 24);
  ctx.beginPath();
  ctx.ellipse(-8, 16, 10, 4, -0.55, 0, Math.PI * 2);
  ctx.ellipse(8, 16, 10, 4, 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#bd77e6";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(9, -8);
  ctx.lineTo(18, -14);
  ctx.lineTo(15, 4);
  ctx.quadraticCurveTo(0, 17, -15, 4);
  ctx.lineTo(-18, -14);
  ctx.lineTo(-9, -8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ff86b3";
  ctx.beginPath();
  ctx.ellipse(0, -3, 9, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayer() {
  const px = player.x * tile + tile / 2;
  const py = player.y * tile + tile / 2;
  ctx.save();
  ctx.translate(px, py);

  ctx.fillStyle = "#704126";
  ctx.fillRect(-14, -20, 9, 9);
  ctx.fillRect(5, -20, 9, 9);
  ctx.fillStyle = "#e8a977";
  ctx.fillRect(-11, -17, 4, 4);
  ctx.fillRect(7, -17, 4, 4);

  ctx.fillStyle = "#9b5f39";
  ctx.fillRect(-14, -15, 28, 22);
  ctx.fillRect(-11, 6, 22, 15);
  ctx.fillRect(-16, 8, 5, 10);
  ctx.fillRect(11, 8, 5, 10);
  ctx.fillRect(-9, 19, 7, 6);
  ctx.fillRect(2, 19, 7, 6);

  ctx.fillStyle = "#efbd8d";
  ctx.fillRect(-8, -5, 16, 9);
  ctx.fillRect(-6, 9, 12, 9);
  ctx.fillStyle = "#3b2450";
  ctx.fillRect(-8, -10, 4, 5);
  ctx.fillRect(4, -10, 4, 5);
  ctx.fillRect(-2, -4, 5, 4);
  ctx.fillRect(0, 0, 2, 3);
  ctx.fillStyle = "#d9a8f5";
  ctx.fillRect(-11, 6, 22, 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-7, -9, 1, 1);
  ctx.fillRect(5, -9, 1, 1);
  ctx.restore();
}

function drawGoal() {
  const gx = 19 * tile + tile / 2;
  const gy = 9 * tile + tile / 2;
  ctx.save();
  ctx.translate(gx, gy);
  ctx.fillStyle = "#ff4f88";
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.bezierCurveTo(-31, -3, -20, -28, 0, -14);
  ctx.bezierCurveTo(20, -28, 31, -3, 0, 18);
  ctx.fill();
  ctx.restore();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffd3e7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      const cell = map[y][x];
      if (cell === "#") {
        drawBrickPattern(x * tile, y * tile, tile, tile);
      } else {
        ctx.fillStyle = "#fffafd";
        ctx.fillRect(x * tile, y * tile, tile, tile);
        ctx.fillStyle = "rgba(217, 168, 245, 0.12)";
        ctx.fillRect(x * tile + 8, y * tile + 8, tile - 16, tile - 16);
      }
    }
  }

  tulips.forEach((tulip) => {
    if (!tulip.found) {
      drawTulip(tulip.x * tile + tile / 2, tulip.y * tile + tile / 2, 0.72);
    }
  });

  drawGoal();
  drawPlayer();
}

function canMove(x, y) {
  return map[y] && map[y][x] && map[y][x] !== "#";
}

function updateStats() {
  const found = tulips.filter((tulip) => tulip.found).length;
  tulipCounter.textContent = `Tulipanes ${found}/${totalTulips}`;
  heartLives.textContent = found >= totalTulips ? "♥ ♥ ♥ ♥ ♥" : "♥ ♥ ♥";
  return found;
}

function showBearSpeechBubble() {
  clearTimeout(speechBubbleTimer);
  const columns = canvas.width / tile;
  const rows = canvas.height / tile;

  bearSpeechBubble.className = "bear-speech-bubble";
  bearSpeechBubble.style.left = `${((player.x + 0.5) / columns) * 100}%`;
  bearSpeechBubble.style.top = `${((player.y + 0.5) / rows) * 100}%`;
  bearSpeechBubble.classList.toggle("is-below", player.y <= 1);
  bearSpeechBubble.classList.toggle("is-right", player.x >= columns - 2);
  bearSpeechBubble.textContent = "Mua ❤️";

  void bearSpeechBubble.offsetWidth;
  bearSpeechBubble.classList.add("is-visible");
  speechBubbleTimer = setTimeout(() => {
    bearSpeechBubble.classList.remove("is-visible");
  }, 1100);
}

function movePlayer(dx, dy) {
  if (won) return;
  const nextX = player.x + dx;
  const nextY = player.y + dy;
  if (!canMove(nextX, nextY)) {
    gameToast.textContent = "Por aquí no, mi amor merece un camino bonito";
    gameToast.classList.remove("is-hidden");
    return;
  }

  player.x = nextX;
  player.y = nextY;
  moves += 1;
  gameToast.classList.add("is-hidden");

  tulips.forEach((tulip) => {
    if (!tulip.found && tulip.x === player.x && tulip.y === player.y) {
      tulip.found = true;
      gameToast.textContent = "Tulipán guardado para mi amor";
      gameToast.classList.remove("is-hidden");
      showBearSpeechBubble();
    }
  });

  const found = updateStats();
  drawGame();

  if (player.x === 19 && player.y === 9) {
    if (found === totalTulips) {
      won = true;
      gameToast.textContent = "Lo lograste. Abriendo la carta...";
      gameToast.classList.remove("is-hidden");
      setTimeout(openLetter, 900);
    } else {
      gameToast.textContent = "Faltan tulipanes antes de abrir el corazón";
      gameToast.classList.remove("is-hidden");
    }
  }
}

function openLetter() {
  showScreen("letter");
  launchConfetti();
  typeLetter();
}

function typeLetter() {
  letterText.innerHTML = "";
  let paragraphIndex = 0;
  let charIndex = 0;
  let currentParagraph = document.createElement("p");
  letterText.appendChild(currentParagraph);

  function tick() {
    const text = letterParagraphs[paragraphIndex];
    currentParagraph.textContent = text.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex < text.length) {
      setTimeout(tick, 18);
      return;
    }

    paragraphIndex += 1;
    charIndex = 0;
    if (paragraphIndex < letterParagraphs.length) {
      currentParagraph = document.createElement("p");
      letterText.appendChild(currentParagraph);
      setTimeout(tick, 180);
    }
  }

  tick();
}

function launchConfetti() {
  const colors = ["#ff76aa", "#d9a8f5", "#a66bd6", "#ffc7df", "#49b57d"];
  for (let i = 0; i < 44; i += 1) {
    const piece = document.createElement("span");
    const isTulip = i % 3 === 0;
    piece.className = isTulip ? "confetti is-tulip" : "confetti";
    if (isTulip) piece.textContent = "🌷";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3400);
  }
}

startButton.addEventListener("click", () => {
  resetGame();
  showScreen("game");
  canvas.focus();
});

replayButton.addEventListener("click", () => {
  resetGame();
  showScreen("game");
});

document.addEventListener("keydown", (event) => {
  const keys = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1],
    s: [0, 1],
    a: [-1, 0],
    d: [1, 0]
  };
  const move = keys[event.key];
  if (!move || !screens.game.classList.contains("is-active")) return;
  event.preventDefault();
  movePlayer(move[0], move[1]);
});

document.querySelectorAll("[data-move]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.move;
    const movesByDirection = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0]
    };
    const move = movesByDirection[direction];
    movePlayer(move[0], move[1]);
  });
});

resetGame();
