// Загрузка попапа в дом, открытие попапа
document.addEventListener('DOMContentLoaded', () => {
    const openButtons = document.querySelectorAll('.open-modal');

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const formSource = button.getAttribute('data-form-source'); // Берем значение data-атрибута

            fetch('../popup.html')
                .then(response => response.text())
                .then(html => {
                    const modalContainer = document.createElement('div');
                    modalContainer.innerHTML = html;
                    document.body.appendChild(modalContainer);

                    // Ищем форму в попапе и записываем значение в скрытый input
                    const popupForm = modalContainer.querySelector('.contact-form'); 
                    const hiddenInput = modalContainer.querySelector('.contact-form input[name="form_source"]');
                    hiddenInput.value = formSource; 

                    initModal(modalContainer);
                })
                .catch(error => console.error('Ошибка загрузки попапа:', error));
        });
    });
});


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

const dataSets = {
    dataIndex: [
        {
            id: 45,
            avatar: 'https://i.pinimg.com/originals/7f/5b/b6/7f5bb635d56379f8b5676918675c34fc.jpg',
            fio: 'Барсик Байт',
            text: 'Программирование — это как ловить мышей: надо уметь быстро реагировать, иначе баги разбегаются по всей системе...'
        },
        {
            id: 68,
            avatar: 'https://i.pinimg.com/736x/39/f5/f0/39f5f0447e6f14abbe3299af038e7220.jpg',
            fio: 'Борис Джаваскриптов',
            text: 'Идеальный код — миф, как диета без срывов. Всегда найдётся баг, который спрятался в самых неожиданных местах...'
        },
        {
            id: 23,
            avatar: 'https://i.ytimg.com/vi/ocuVRR22DSs/maxresdefault.jpg',
            fio: 'Серега Дебагович',
            text: 'Баги — это не ошибки, а пасхалки, которые разработчик оставляет будущему себе...'
        }
    ],
    dataSpace: [
        {
            id: 40,
            avatar: 'https://content.onliner.by/news/1100x5616/56adc64398381dccf63b4f4bf282d5cd.jpeg',
            fio: 'Макс Клавиатуркин',
            text: 'Каждый разработчик знает, что лучший способ починить баг — сделать вид, что его нет. Но если вдруг код реально работает идеально, то это повод для беспокойства...'
        },
        {
            id: 85,
            avatar: 'https://i.pinimg.com/originals/36/1a/82/361a82cd45c61f4bbbc4d46ec6b42359.jpg',
            fio: 'Лиза ГитПуш',
            text: 'Коммит перед пятничным вечером — самый рискованный поступок. Нужно быть готовым к тому, что в понедельник придётся объяснять коллегам, что случилось...'
        },
        {
            id: 53,
            avatar: 'https://i.pinimg.com/736x/b8/ec/e8/b8ece86fa2752d194833f2175cb417c1.jpg',
            fio: 'Паша Логфайл',
            text: 'Если код не работает, просто добавь больше логов. Если он всё ещё не работает — удали лишние логи...'
        }
    ],
    dataClosed: [
        {
            id: 12,
            avatar: 'https://i.pinimg.com/originals/7f/5b/b6/7f5bb635d56379f8b5676918675c34fc.jpg',
            fio: 'Кот Компиляторович',
            text: 'Компиляция — это искусство. Иногда кажется, что код идеально написан, но компилятор с тобой не согласен...'
        },
        {
            id: 56,
            avatar: 'https://i.pinimg.com/736x/39/f5/f0/39f5f0447e6f14abbe3299af038e7220.jpg',
            fio: 'Дэн Мержов',
            text: 'Слияние веток — это как семейный ужин: издалека кажется безобидным, но в процессе понимаешь, что лучше бы этого вообще не было...'
        },
        {
            id: 21,
            avatar: 'https://i.pinimg.com/originals/b1/4c/89/b14c8933d3da9e048bbdd1fdd934875a.jpg',
            fio: 'Олег Фиксатор',
            text: 'Если ты программист, то исправление багов — это твоя суперспособность. Но чем больше фиксов ты делаешь, тем больше новых багов появляется...'
        }
    ],
    dataDept: [
        {
            id: 45,
            avatar: 'https://i.pinimg.com/736x/69/03/f3/6903f3d9317a0cb430681609ad0a8061.jpg',
            fio: 'Том СтекТрейсер',
            text: 'Стек трейсы — это как карта сокровищ: они вроде бы показывают путь, но на деле ты просто ходишь кругами...'
        },
        {
            id: 98,
            avatar: 'https://i.pinimg.com/736x/28/8f/5d/288f5db1695f2047925f5d5b1f2224d6.jpg',
            fio: 'Виктор ГлобальнаяПеременная',
            text: 'Использование глобальных переменных — это как оставлять разбросанные вещи по комнате: сначала кажется удобным, но потом ты не можешь найти нужное...'
        },
        {
            id: 45,
            avatar: 'https://i.pinimg.com/originals/97/b0/81/97b081b87b4b06e0783419ad4ed42bc0.jpg',
            fio: 'Женя НулПоинт',
            text: 'NullPointerException — лучший друг программиста. Он приходит без предупреждения и рушит все планы. Если ты не знаешь, где ошибка, просто добавь `try/catch`...'
        }
    ]
};

function populateCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const type = carousel.getAttribute('data-type');
        const data = dataSets[type];

        if (data) {
            const carouselInner = carousel.querySelector('.carousel-inner');

            // Очищаем контейнер перед добавлением новых элементов
            carouselInner.innerHTML = '';

            let indicatorsHTML = '';

            data.sort((a, b) => a.id - b.id);

            data.forEach((item, index) => {
                const activeClass = index === 0 ? 'active' : '';

                // Добавляем слайды
                carouselInner.innerHTML += `
                    <div class="carousel-item bg-light p-4 ${activeClass}">
                        <div>
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <img src="${item.avatar}" alt="Testimonial Avatar" class="rounded-circle avatar img-object-fit img-fluid">
                                <p class="avatar-name m-0">${item.fio}</p>
                            </div>
                            <div class="text">
                                <p>${item.text}</p>
                            </div>
                        </div>
                    </div>
                `;

                // Создает кнопки индикаторы
                indicatorsHTML += `
                    <button type="button" data-bs-target="#${carousel.id}" data-bs-slide-to="${index}" class="${activeClass}"></button>
                `;
            });

            // Добавляем кнопки после очистки и наполнения контейнера
            carouselInner.innerHTML += `<div class="carousel-indicators">${indicatorsHTML}</div>`;
        } 
    });
}

populateCarousels();

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