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
  
  // Обработка всех якорных ссылок (и #anchor и /page.html#anchor)
  if (href && (href.includes('#') || href.startsWith('#'))) {
    event.preventDefault();
    
    // Разделяем путь и якорь
    const [path, hash] = href.split('#');
    const targetId = hash || path; // если href был просто "#products", то path будет пустым
    
    if (path && path !== window.location.pathname) {
      // Если это переход на другую страницу с якорем
      router.navigate(path, () => {
        // После загрузки страницы прокручиваем к якорю
        if (targetId) {
          const target = document.getElementById(targetId);
          if (target) {
            setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
          }
        }
      });
    } else {
      // Если якорь на текущей странице
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    return;
  }
  
  // Обработка обычных внутренних ссылок
  if (href && !href.match(/^http/i) && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
    event.preventDefault();
    router.navigate(href);
  }
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

document.addEventListener('DOMContentLoaded', () => {
  // Обработка якоря при первоначальной загрузке страницы
  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.substring(1));
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }
});

// И добавьте хук в роутер для обработки якорей после навигации
router.hooks({
  after: () => {
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.substring(1));
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }
});