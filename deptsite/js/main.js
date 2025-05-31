// ====== 1. Открытие/закрытие модального окна ======

const openButtons = document.querySelectorAll('.open-modal');
const modal = document.getElementById('modal');
const modalContent = document.querySelector('.modal-content');

// Функция для открытия попапа
function openModal() {
    modal.classList.add('show');
}

// Функция для закрытия попапа
function closeModal() {
    modal.classList.remove('show');
}

// Обработчик кликов на кнопки открытия
openButtons.forEach(button => {
    button.addEventListener('click', openModal);
});

// Закрытие при клике вне контента
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Закрытие при нажатии Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});


// ====== 2. Обработка форм ======

/**
 * Функция универсальной обработки формы
 * @param {HTMLFormElement} form - форма, с которой работаем
 * @param {string} endpoint - URL, куда отправляем данные
 */
function handleFormSubmit(form, endpoint) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Можно заменить на fetch, если нужно POST-запросом
        sendFormData(data, endpoint);
    });
}

/**
 * Отправка данных в указанный сервис
 * @param {Object} data - объект с данными формы
 * @param {string} endpoint - URL API или Formspree
 */
function sendFormData(data, endpoint) {
    // Пример с fetch и POST-запросом:
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Спасибо! Мы получили вашу заявку.');
            form.reset(); // Очистить форму
            closeModal(); // Закрыть попап (если это форма из модального окна)
        } else {
            alert('Ошибка отправки. Попробуйте позже.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
    });
}

// ====== 3. Подключение форм ======
// Форма в попапе
const modalForm = document.querySelector('#modal form');
if (modalForm) {
    handleFormSubmit(modalForm, 'https://formspree.io/f/your-form-id '); // <-- замени на свой ID
}

// Формы на странице (например, контактная форма)
document.querySelectorAll('form.contact-form').forEach(form => {
    handleFormSubmit(form, 'https://formspree.io/f/your-form-id '); // <-- замени на свой ID
});