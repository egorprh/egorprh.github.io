// Загрузка попапа в дом, открытие попапа
document.addEventListener('DOMContentLoaded', () => setupPopupHandlers());

function setupPopupHandlers() {
    const openButtons = document.querySelectorAll('.open-modal');

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const formSource = button.getAttribute('data-form-source');

            fetch(window.location.origin + '/popup.html')
                .then(response => response.text())
                .then(html => {
                    const modalContainer = document.createElement('div');
                    modalContainer.innerHTML = html;
                    document.body.appendChild(modalContainer);

                    const popupForm = modalContainer.querySelector('.contact-form'); 
                    const hiddenInput = modalContainer.querySelector('.contact-form input[name="form_source"]');
                    if (hiddenInput) hiddenInput.value = formSource; 

                    initModal(modalContainer);
                })
                .catch(error => console.error('Ошибка загрузки попапа:', error));
        });
    });
}


function initModal(modalContainer) {
    const modal = modalContainer.querySelector('#modal');
    const closeButton = modalContainer.querySelector('.close-modal');

    modal.classList.add('show');

    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modalContainer.remove();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modalContainer.remove();
        }
    });
}

// Карусель, получаем карточки и рендерим их
async function fetchJsonFiles() {
    const files = {
        dataIndex: "index.json",
        dataSpace: "d-space.json",
        dataDept: "exchange.json",
        dataClosed: "d-closed.json"
    };

    const dataSets = {};

    for (const key in files) {
        try {
            const response = await fetch(window.location.origin + `/src/reviews/${files[key]}`);
            if (!response.ok) throw new Error(`Ошибка ${response.status}`);
            const data = await response.json();
            dataSets[key] = data; // Записываем данные
        } catch (error) {
            console.error(`Ошибка загрузки ${files[key]}:`, error);
        }
    }

    populateCarousels(dataSets);
    
    // Инициализируем все карусели на странице
    document.querySelectorAll('.carousel').forEach(carouselElement => {
        new bootstrap.Carousel(carouselElement);
    });
}

function populateCarousels(dataSets) {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const type = carousel.getAttribute('data-type');
        const data = dataSets[type];

        if (data) {
            const carouselInner = carousel.querySelector('.carousel-inner');
            carouselInner.innerHTML = '';
            let indicatorsHTML = '';
            data.sort((a, b) => a.id - b.id);
            data.forEach((item, index) => {
                const activeClass = index === 0 ? 'active' : '';

                carouselInner.innerHTML += `
                    <div class="carousel-item bg-light p-4 ${activeClass}">
                        <div>
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <img src="${item.img}" alt="Testimonial Avatar" class="rounded-circle avatar img-object-fit img-fluid">
                                <p class="avatar-name m-0">${item.name}</p>
                            </div>
                            <div class="text">
                                <p>${item.text}</p>
                            </div>
                        </div>
                    </div>
                `;

                indicatorsHTML += `
                    <button type="button" data-bs-target="#${carousel.id}" data-bs-slide-to="${index}" class="${activeClass}"></button>
                `;
            });

            carouselInner.innerHTML += `<div class="carousel-indicators">${indicatorsHTML}</div>`;
        } 
    });
}

fetchJsonFiles(); // Запускаем загрузку, и после неё вызываем populateCarousels()



function validateForm(button) {
    const form = button.closest("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let isValid = true;

        // Создаём `loader`
        const loader = document.createElement("div");
        loader.className = "loader";
        form.appendChild(loader); // Добавляем `loader` в конец формы

        // Блокируем кнопку
        button.disabled = true;

        // Валидация Ф.И.О
        const nameInput = form.querySelector('input[name="name"]');
        const words = nameInput.value.trim().split(/\s+/);

        if (words.length < 2 || words.some(word => word.length < 2)) {
            showError(nameInput, words.length < 2 
                ? "Поле должно содержать фамилию и имя" 
                : "Фамилия и имя должны содержать не менее 2-х букв");
            isValid = false;
        }

        // Валидация телефона
        const phoneInput = form.querySelector('input[name="phone"]');
        if (!/^\+\d{10,}$/.test(phoneInput.value)) {
            showError(phoneInput, "Телефон начинается с \"+\" и имеет не менее 10 цифр");
            isValid = false;
        }

        // Валидация Telegram
        const telegramInput = form.querySelector('input[name="telegram"]');
        if (/[А-Яа-яЁё]/.test(telegramInput.value)) {
            showError(telegramInput, "Поле не может содержать русские буквы");
            isValid = false;
        }

        // Валидация чекбокса
        const consentCheckbox = form.querySelector("input[type='checkbox']");
        if (!consentCheckbox.checked) {
            consentCheckbox.classList.add("error-border");
            isValid = false;
        } 

        consentCheckbox.addEventListener("change", function (event) {
            event.target.classList.remove("error-border");
        });

        // Если есть ошибки, отменяем отправку
        if (!isValid) {
            form.removeChild(loader);
            button.disabled = false;
            return;
        }

        // Собираем данные формы и превращаем в JSON
        const formData = new FormData(form);
        const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

        // Отправка данных
        fetch("URL_ОТ_ТИМЛИДА", { // TODO нужен правильный урл
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Ответ сервера:", data);

            showNotification("success", form);

            form.reset();
        })
        .catch(error => {
            console.error("Ошибка отправки:", error);

            showNotification("danger", form);
        })
        .finally(() => {
            form.removeChild(loader);
            button.disabled = false;
        });
    }, { once: true });
}

function showError(input, message) {
    const errorElement = input.parentElement.querySelector(".error-message");
    errorElement.textContent = message;
    errorElement.classList.remove("d-none");
    input.classList.add("error-border");

    setTimeout(() => {
        hideError(input);
    }, 3000);
}

function hideError(input) {
    const errorElement = input.parentElement.querySelector(".error-message");
    errorElement.classList.add("d-none");
    input.classList.remove("error-border");
}

function showNotification(type, form) {
    // Создаём `div.notification`
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = type === "success" 
        ? "Заявка успешно отправлена" 
        : "Произошла ошибка, попробуйте еще раз";

    form.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}


// Торговые журналы
async function fetchMonthButtons() {
    try {
        const response = await fetch("src/reviews/trade-magazines.json");
        if (!response.ok) throw new Error(`Ошибка ${response.status}`);
        const data = await response.json();
        renderButtons(data);
    } catch (error) {
        console.error("Ошибка загрузки monthButtons.json:", error);
    }
}

function renderButtons(data) {
    const buttonContainer = document.getElementById("month-buttons");
    
    if (!buttonContainer) {
        // console.error('Элемент с id "month-buttons" не найден в DOM');
        return;
    }

    // Сортируем по id и берем последние 4 элемента
    const sortedData = [...data].sort((a, b) => a.id - b.id).slice(-4);
    
    // Собираем все кнопки в одну строку
    const buttonsHTML = sortedData.map(item => 
        `<a href="${item.url}" target="_blank" class="btn text-white">${item.name}</a>`
    ).join('');

    buttonContainer.innerHTML = buttonsHTML;
}

// Загружаем JSON **только если есть блок `#month-buttons`**
if (document.getElementById("month-buttons")) {
    fetchMonthButtons();
}







// // ====== 2. Обработка форм ======

// /**
//  * Функция универсальной обработки формы
//  * @param {HTMLFormElement} form - форма, с которой работаем
//  * @param {string} endpoint - URL, куда отправляем данные
//  */
// function handleFormSubmit(form, endpoint) {
//     form.addEventListener('submit', function (e) {
//         e.preventDefault();

//         const formData = new FormData(form);
//         const data = Object.fromEntries(formData);

//         // Можно заменить на fetch, если нужно POST-запросом
//         sendFormData(data, endpoint);
//     });
// }

// /**
//  * Отправка данных в указанный сервис
//  * @param {Object} data - объект с данными формы
//  * @param {string} endpoint - URL API или Formspree
//  */
// function sendFormData(data, endpoint) {
//     // Пример с fetch и POST-запросом:
//     fetch(endpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => {
//         if (response.ok) {
//             alert('Спасибо! Мы получили вашу заявку.');
//             form.reset(); // Очистить форму
//             closeModal(); // Закрыть попап (если это форма из модального окна)
//         } else {
//             alert('Ошибка отправки. Попробуйте позже.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
//     });
// }

// // ====== 3. Подключение форм ======
// // Форма в попапе
// const modalForm = document.querySelector('#modal form');
// if (modalForm) {
//     handleFormSubmit(modalForm, 'https://formspree.io/f/your-form-id '); // <-- замени на свой ID
// }

// // Формы на странице (например, контактная форма)
// document.querySelectorAll('form.contact-form').forEach(form => {
//     handleFormSubmit(form, 'https://formspree.io/f/your-form-id '); // <-- замени на свой ID
// });