const services = [
  { icon: '🌐', name: 'Web3' },
  { icon: '🤖', name: 'Telegram Bots' },
  { icon: '📱', name: 'TG Apps' },
  { icon: '🗂️', name: 'Websites' },
  { icon: '📄', name: 'TK Docs' },
  { icon: '⚙️', name: 'Automation' },
  { icon: '📖', name: 'LMS' },
];

const emojis = ['🎉', '💥', '✨', '🔥', '⚡', '💎', '🌟', '🎊', '💫', '⭐'];

// Matrix characters for background animation
const matrixChars = '｢｣､ｦｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';

// Matrix animation setup
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');
let matrixW = window.innerWidth;
let matrixH = window.innerHeight;

// Adaptive column width based on screen size
function getColumnWidth() {
  const isMobile = window.innerWidth <= 768;
  return isMobile ? 56 : 64; // Ещё крупнее
}

// Matrix columns
const matrixColumns = [];
let columnWidth = getColumnWidth();
let numColumns = Math.ceil(matrixW / columnWidth);

// Initialize matrix columns
for (let i = 0; i < numColumns; i++) {
  matrixColumns.push({
    x: i * columnWidth,
    y: Math.random() * matrixH,
    speed: 0.5 + Math.random() * 1,
    chars: [],
    length: 3 + Math.floor(Math.random() * 4) // Ещё меньше символов в колонке
  });
}

// Matrix animation function
function animateMatrix() {
  // Полностью убираем затухание фона
  // matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.01)';
  // matrixCtx.fillRect(0, 0, matrixW, matrixH);
  matrixCtx.clearRect(0, 0, matrixW, matrixH);

  // Очень крупный шрифт
  const isMobile = window.innerWidth <= 768;
  const fontSize = isMobile ? 48 : 64;
  matrixCtx.font = `bold ${fontSize}px monospace`;
  matrixCtx.textBaseline = 'top';

  matrixColumns.forEach(column => {
    // Add new character at top
    if (column.chars.length < column.length) {
      column.chars.push({
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        y: column.y,
        opacity: 1
      });
    }

    // Update and draw characters
    column.chars.forEach((char, index) => {
      char.y += column.speed * 0.5;
      char.opacity = 1;

      if (char.y < matrixH) {
        // Первый (нижний) символ — бело-зеленая капля с неоновым свечением
        if (index === column.chars.length - 1) {
          matrixCtx.shadowColor = '#baffc9';
          matrixCtx.shadowBlur = 24;
          matrixCtx.fillStyle = '#baffc9';
        } else {
          matrixCtx.shadowColor = '#00ffae';
          matrixCtx.shadowBlur = 16;
          matrixCtx.fillStyle = '#00ffae';
        }
        matrixCtx.fillText(char.char, column.x, char.y);
        matrixCtx.shadowBlur = 0;
      }
    });

    // Remove characters that are off screen
    column.chars = column.chars.filter(char => char.y < matrixH);

    // Reset column if empty
    if (column.chars.length === 0) {
      column.y = -fontSize;
    }
  });

  requestAnimationFrame(animateMatrix);
}

// Matrix resize function
function resizeMatrix() {
  matrixW = window.innerWidth;
  matrixH = window.innerHeight;
  matrixCanvas.width = matrixW;
  matrixCanvas.height = matrixH;

  columnWidth = getColumnWidth();
  const newNumColumns = Math.ceil(matrixW / columnWidth);
  while (matrixColumns.length < newNumColumns) {
    matrixColumns.push({
      x: matrixColumns.length * columnWidth,
      y: Math.random() * matrixH,
      speed: 0.5 + Math.random() * 1,
      chars: [],
      length: 3 + Math.floor(Math.random() * 4)
    });
  }
  matrixColumns.splice(newNumColumns);
  matrixColumns.forEach((column, index) => {
    column.x = index * columnWidth;
  });
}

// Start matrix animation
resizeMatrix();
animateMatrix();
window.addEventListener('resize', resizeMatrix);

function getCardSize() {
  // Минимум 120x60, максимум 200x100, адаптивно
  const w = Math.max(120, Math.min(200, window.innerWidth * 0.6));
  const h = Math.max(60, Math.min(100, window.innerHeight * 0.12));
  return { width: w, height: h };
}

// Размеры карточек
let CARD_WIDTH = 120;
let CARD_HEIGHT = 80;

// Адаптивные размеры для мобильных устройств
function updateCardSizes() {
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  if (isMobile) {
    CARD_WIDTH = 160;
    CARD_HEIGHT = 120;
  } else {
    CARD_WIDTH = 140;
    CARD_HEIGHT = 100;
  }
}

// Обновляем размеры при загрузке и изменении размера окна
updateCardSizes();
window.addEventListener('resize', updateCardSizes);

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth;
let H = window.innerHeight;

let score = 0;
let lives = 3;
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const typewriterElement = document.getElementById('typewriter');

// Проверяем, что все элементы существуют
if (!scoreElement) console.error('Score element not found');
if (!livesElement) console.error('Lives element not found');
if (!typewriterElement) console.error('Typewriter element not found');

let currentServiceIndex = 0;
let gameStarted = false;

function updateLives() {
  const hearts = '❤️'.repeat(lives);
  livesElement.textContent = hearts;
}

function gameOver() {
  // Лопаем все карточки на экране
  cards.forEach(card => {
    if (!card.sliced) {
      card.sliced = true;
      card.sliceAnim = 1.0;
      card.sliceX = card.x;
      card.sliceY = card.y;
      // Больше частиц для эффектного взрыва
      for (let i = 0; i < 15; i++) {
        createSliceParticles(card.x, card.y);
      }
    }
  });

  // Обнуляем очки
  score = 0;
  scoreElement.textContent = score;

  // Восстанавливаем жизни
  lives = 3;
  updateLives();

  // Сбрасываем индекс для последовательного появления
  currentServiceIndex = 0;
}

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  updateCardSizes();
}
window.addEventListener('resize', resize);
resize();

// --- Typewriter animation ---
function typeWriter(text, element, speed = 100) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    element.classList.add('active');

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          element.classList.remove('active');
          setTimeout(resolve, 500);
        }, 2000);
      }
    }
    type();
  });
}

// --- Start game sequence ---
async function startGame() {
  await typeWriter("We are a development team and we can do anything!", typewriterElement, 80);
  gameStarted = true;
}

// --- Card physics ---
function getNextService() {
  const service = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;
  return service;
}

function randomX() {
  return Math.random() * (W - CARD_WIDTH) + CARD_WIDTH/2;
}

let cards = [];
let particles = [];

function spawnCard() {
  if (!gameStarted) {
    console.log('Game not started yet, skipping card spawn');
    return;
  }

  const s = getNextService();
  const card = {
    x: randomX(),
    y: -CARD_HEIGHT,
    vx: (Math.random()-0.5)*2,
    vy: 2 + Math.random()*2,
    angle: 0,
    vangle: (Math.random()-0.5)*0.04,
    icon: s.icon,
    name: s.name,
    sliced: false,
    sliceAnim: 0,
    sliceX: 0,
    sliceY: 0,
    reachedBottom: false
  };
  cards.push(card);
  console.log('Spawned card:', card.name, 'Total cards:', cards.length);
}
setInterval(spawnCard, 1200);

// --- Particle system ---
function createSliceParticles(x, y) {
  for (let i = 0; i < 8; i++) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      emoji: emoji,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.02
    });
  }
}

// --- Mouse slicing ---
let mouse = {x:0, y:0, px:0, py:0, down:false};
canvas.addEventListener('mousedown', e => { mouse.down = true; });
canvas.addEventListener('mouseup', e => { mouse.down = false; });
canvas.addEventListener('mouseleave', e => { mouse.down = false; });
canvas.addEventListener('mousemove', e => {
  mouse.px = mouse.x;
  mouse.py = mouse.y;
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
  if (mouse.down) {
    // Проверяем все карточки в радиусе курсора
    cards.forEach(card => {
      if (!card.sliced && isNearMouse(card, mouse.x, mouse.y)) {
        sliceCard(card, mouse.x, mouse.y);
      }
    });
  }
});

// --- Touch slicing for mobile devices ---
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  mouse.down = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  mouse.x = touch.clientX - rect.left;
  mouse.y = touch.clientY - rect.top;
  mouse.px = mouse.x;
  mouse.py = mouse.y;
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  mouse.px = mouse.x;
  mouse.py = mouse.y;
  mouse.x = touch.clientX - rect.left;
  mouse.y = touch.clientY - rect.top;

  if (mouse.down) {
    // Проверяем все карточки в радиусе касания
    cards.forEach(card => {
      if (!card.sliced && isNearMouse(card, mouse.x, mouse.y)) {
        sliceCard(card, mouse.x, mouse.y);
      }
    });
  }
});

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  mouse.down = false;

  // Touch tap slicing
  const touch = e.changedTouches[0];
  const rect = canvas.getBoundingClientRect();
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;

  // Если это был короткий тап (не drag)
  const touchDuration = touch.timeStamp - (touch.startTime || touch.timeStamp);
  if (touchDuration < 200) { // менее 200мс = тап
    cards.forEach(card => {
      if (!card.sliced && isNearMouse(card, touchX, touchY)) {
        sliceCard(card, touchX, touchY);
      }
    });
  }
});

canvas.addEventListener('touchcancel', e => {
  e.preventDefault();
  mouse.down = false;
});

// --- Click slicing ---
canvas.addEventListener('click', e => {
  cards.forEach(card => {
    if (!card.sliced && isNearMouse(card, e.offsetX, e.offsetY)) {
      sliceCard(card, e.offsetX, e.offsetY);
    }
  });
});

function isNearMouse(card, mouseX, mouseY) {
  const cx = card.x, cy = card.y;
  const hw = CARD_WIDTH/2, hh = CARD_HEIGHT/2;

  // Больший радиус для touch-устройств
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  const radius = isMobile ? Math.max(hw, hh) + 25 : Math.max(hw, hh) + 10;

  // Проверяем, находится ли курсор рядом с карточкой
  const distance = Math.sqrt((mouseX - cx) * (mouseX - cx) + (mouseY - cy) * (mouseY - cy));
  return distance <= radius;
}

function sliceCard(card, sliceX, sliceY) {
  card.sliced = true;
  card.sliceAnim = 1.0;
  card.sliceX = sliceX;
  card.sliceY = sliceY;
  createSliceParticles(card.x, card.y);
  score += 10;
  scoreElement.textContent = score;
}

function intersectsCard(card, x1, y1, x2, y2) {
  // Прямоугольник карточки
  const cx = card.x, cy = card.y;
  const hw = CARD_WIDTH/2, hh = CARD_HEIGHT/2;
  // Проверка: линия мыши пересекает прямоугольник
  // (грубая аппроксимация)
  return (
    Math.max(x1, x2) > cx - hw && Math.min(x1, x2) < cx + hw &&
    Math.max(y1, y2) > cy - hh && Math.min(y1, y2) < cy + hh
  );
}

// --- Main loop ---
function drawCard(card) {
  ctx.save();
  ctx.translate(card.x, card.y);
  ctx.rotate(card.angle);

  if (card.sliced && card.sliceAnim > 0) {
    // Анимация разрезания - карточка разделяется на две части
    const sliceProgress = 1 - card.sliceAnim;
    const offset = sliceProgress * 20;

    // Левая часть
    ctx.save();
    ctx.translate(-offset, 0);
    ctx.globalAlpha = card.sliceAnim;
    drawCardHalf(-CARD_WIDTH/2, -CARD_HEIGHT/2, CARD_WIDTH/2, CARD_HEIGHT, card);
    ctx.restore();

    // Правая часть
    ctx.save();
    ctx.translate(offset, 0);
    ctx.globalAlpha = card.sliceAnim;
    drawCardHalf(0, -CARD_HEIGHT/2, CARD_WIDTH/2, CARD_HEIGHT, card);
    ctx.restore();
  } else {
    // Обычная карточка
    drawCardHalf(-CARD_WIDTH/2, -CARD_HEIGHT/2, CARD_WIDTH, CARD_HEIGHT, card);
  }

  ctx.restore();
}

function drawCardHalf(x, y, width, height, card) {
  // Glow
  ctx.shadowColor = '#00ffe7';
  ctx.shadowBlur = 24;
  // Card
  ctx.fillStyle = 'rgba(10,20,40,0.95)';
  ctx.strokeStyle = '#00ffe7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 18);
  ctx.fill();
  ctx.stroke();

  // Icon & text
  ctx.shadowBlur = 0;

  // Иконка
  const iconSize = Math.round(height * 0.25);
  ctx.font = `${iconSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(card.icon, x + width/2, y + height/2 - height*0.15);

  // Текст с автоматическим масштабированием
  const maxTextWidth = width * 0.85; // 85% от ширины карточки
  const maxTextHeight = height * 0.25; // 25% от высоты карточки

  // Начинаем с большого размера и уменьшаем, пока текст не поместится
  let fontSize = Math.round(height * 0.18);
  ctx.font = `bold ${fontSize}px monospace`;

  // Проверяем ширину текста
  let textMetrics = ctx.measureText(card.name);
  while (textMetrics.width > maxTextWidth && fontSize > 8) {
    fontSize--;
    ctx.font = `bold ${fontSize}px monospace`;
    textMetrics = ctx.measureText(card.name);
  }

  // Если текст все еще не помещается, разбиваем на несколько строк
  if (textMetrics.width > maxTextWidth) {
    const words = card.name.split(' ');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testMetrics = ctx.measureText(testLine);

      if (testMetrics.width <= maxTextWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Отрисовываем каждую строку
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = y + height/2 + height*0.15 - totalHeight/2;

    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ffb300';
    ctx.shadowBlur = 8;

    lines.forEach((line, index) => {
      ctx.fillText(line, x + width/2, startY + index * lineHeight);
    });
  } else {
    // Текст помещается в одну строку
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ffb300';
    ctx.shadowBlur = 8;
    ctx.fillText(card.name, x + width/2, y + height/2 + height*0.15);
  }
}

function drawParticles() {
  particles.forEach(particle => {
    ctx.save();
    ctx.globalAlpha = particle.life;
    ctx.font = '2rem serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00ffe7';
    ctx.shadowBlur = 16;
    ctx.fillText(particle.emoji, particle.x, particle.y);
    ctx.restore();
  });
}

function loop() {
  ctx.clearRect(0,0,W,H);

  // Draw cards
  for (let card of cards) {
    if (!card.sliced || card.sliceAnim > 0) drawCard(card);
  }

  // Draw particles
  drawParticles();

  // Update cards
  for (let card of cards) {
    card.x += card.vx;
    card.y += card.vy;
    card.angle += card.vangle;

    // Проверяем, достигла ли карточка дна
    if (!card.sliced && card.y > H + CARD_HEIGHT/2 && !card.reachedBottom) {
      card.reachedBottom = true;
      lives--;
      updateLives();

      // Если жизни закончились
      if (lives <= 0) {
        gameOver();
      }
    }

    if (card.sliced && card.sliceAnim > 0) {
      card.sliceAnim -= 0.03;
    }
  }

  // Update particles
  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.1; // gravity
    particle.life -= particle.decay;
  });

  // Remove offscreen or finished
  cards = cards.filter(card => card.y < H + CARD_HEIGHT && (!card.sliced || card.sliceAnim > 0));
  particles = particles.filter(particle => particle.life > 0);

  requestAnimationFrame(loop);
}
loop();

// --- Start the game ---
console.log('Starting game...');
startGame().then(() => {
  console.log('Game started successfully!');
}).catch(error => {
  console.error('Error starting game:', error);
});

// --- Telegram button ---
const tgBtn = document.getElementById('tg-btn');
const likeEmoji = document.getElementById('like-emoji');
tgBtn.addEventListener('click', () => {
  likeEmoji.classList.add('active');
  setTimeout(() => {
    likeEmoji.classList.remove('active');
    window.open('https://t.me/egorprh', '_blank');
  }, 700);
}); 