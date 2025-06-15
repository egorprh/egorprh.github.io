const router = new Navigo("/");

const routes = {
  "/": "index.html",
  "/index.html": "index.html",
  "/d-closed.html": "d-closed.html",
  "/d-space.html": "d-space.html",
  "/start.html": "start.html",
  "/dept-exchange.html": "dept-exchange.html",
};

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
}

// Обновленная функция loadPage
function loadPage(page) {
  showLoader();
  fetch(page)
    .then(res => res.text())
    .then(html => {
      document.getElementById("app").innerHTML = extractBody(html);
      window.scrollTo(0, 0); // Прокручиваем вверх после загрузки
      attachLinkHandlers(); // Вешаем обработчики ссылок
      setupPopupHandlers(); // Для работы попапов
      fetchJsonFiles();
      fetchMonthButtons();
      
      // Обработка якоря после загрузки
      if (window.location.hash) {
        scrollToAnchor(window.location.hash.substring(1));
      }
    })
    .catch(err => {
      document.getElementById("app").innerHTML = "<p>Ошибка загрузки страницы.</p>";
      console.error(err);
    })
    .finally(hideLoader);
}

// Функция для обработки кликов по ссылкам
function handleLinkClick(event) {
  const link = event.target.closest('a');
  if (!link) return;
  
  const href = link.getAttribute('href');
  
  // Обработка якорных ссылок
  if (href && href.includes('#')) {
    event.preventDefault();
    const [path, hash] = href.split('#');
    
    if (path && path !== window.location.pathname) {
      // Для переходов между страницами
      const fullPath = hash ? `${path}#${hash}` : path;
      router.navigate(fullPath);
    } else {
      // Для якорей на текущей странице
      scrollToAnchor(hash);
    }
    return;
  }
  
  // Обработка обычных внутренних ссылок
  if (href && !href.match(/^http/i) && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
    event.preventDefault();
    router.navigate(href);
  }
}

// Функция для прокрутки к якорю
function scrollToAnchor(anchorId) {
  if (!anchorId) return;
  
  setTimeout(() => {
    const target = document.getElementById(anchorId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, 300);
}

// Функция для добавления обработчиков на все ссылки
function attachLinkHandlers() {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', handleLinkClick);
  });
}

router.on(
  Object.fromEntries(
    Object.entries(routes).map(([path, file]) => [path, () => loadPage(file)])
  )
).resolve();

// Инициализация обработчиков ссылок при первой загрузке
attachLinkHandlers();

// Модифицируем инициализацию роутера
router.on({
  '/': () => loadPage('index.html'),
  '/index.html': () => {
    const [path, hash] = window.location.href.split('#');
    loadPage('index.html');
    if (hash) setTimeout(() => scrollToAnchor(hash), 500);
  },
  '/d-closed.html': () => loadPage('d-closed.html'),
  '/d-space.html': () => loadPage('d-space.html'),
  '/start.html': () => loadPage('start.html'),
  '/dept-exchange.html': () => loadPage('dept-exchange.html')
}).resolve();

// Обработка при загрузке страницы
if (window.location.hash) {
  setTimeout(() => {
    scrollToAnchor(window.location.hash.substring(1));
  }, 800);
}