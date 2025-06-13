// Загрузка попапа в дом, открытие попапа
document.addEventListener('DOMContentLoaded', () => {
    const openButtons = document.querySelectorAll('.open-modal');

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            fetch('../popup.html')
                .then(response => response.text())
                .then(html => {
                    const modalContainer = document.createElement('div');
                    modalContainer.innerHTML = html;
                    document.body.appendChild(modalContainer);

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
            img: 'https://i.pinimg.com/originals/7f/5b/b6/7f5bb635d56379f8b5676918675c34fc.jpg',
            name: 'Барсик Байт',
            text: 'Программирование — это как ловить мышей: надо уметь быстро реагировать, иначе баги разбегаются по всей системе. Главное — не забывать делать резервные копии, ведь если что-то сломалось, откатить проще, чем объяснять начальству, почему прод упал.'
        },
        {
            id: 68,
            img: 'https://i.pinimg.com/736x/39/f5/f0/39f5f0447e6f14abbe3299af038e7220.jpg',
            name: 'Борис Джаваскриптов',
            text: 'Идеальный код — миф, как диета без срывов. Всегда найдётся баг, который спрятался в самых неожиданных местах, и всегда в пятницу вечером перед релизом. Главное правило разработчика: если всё работает, не трогай. Если не работает — кофе, нервы, и Ctrl+Z.'
        },
        {
            id: 23,
            img: 'https://i.ytimg.com/vi/ocuVRR22DSs/maxresdefault.jpg',
            name: 'Серега Дебагович',
            text: 'Баги — это не ошибки, а пасхалки, которые разработчик оставляет будущему себе. Если ты не понимаешь, почему код сломался, просто скажи "ну так задумано" и добавь логгирование. А потом молись, чтобы никто не нашёл костыль в проде.'
        }
    ],
    dataSpace: [
        {
            id: 40,
            img: 'https://content.onliner.by/news/1100x5616/56adc64398381dccf63b4f4bf282d5cd.jpeg',
            name: 'Макс Клавиатуркин',
            text: 'Каждый разработчик знает, что лучший способ починить баг — сделать вид, что его нет. Но если вдруг код реально работает идеально, то это повод для беспокойства. Значит, либо ты гений, либо баги пока просто притворяются мёртвыми.'
        },
        {
            id: 85,
            img: 'https://i.pinimg.com/originals/36/1a/82/361a82cd45c61f4bbbc4d46ec6b42359.jpg',
            name: 'Лиза ГитПуш',
            text: 'Коммит перед пятничным вечером — самый рискованный поступок. Нужно быть готовым к тому, что в понедельник придётся не только объяснять коллегам, что случилось, но ещё и вспоминать, что ты вообще пытался исправить.'
        },
        {
            id: 53,
            img: 'https://i.pinimg.com/736x/b8/ec/e8/b8ece86fa2752d194833f2175cb417c1.jpg',
            name: 'Паша Логфайл',
            text: 'Если код не работает, просто добавь больше логов. Если он всё ещё не работает — удали лишние логи. А если он вдруг заработал после простого перезапуска, молчи и делай вид, что так и должно было быть.'
        }
    ],
    dataClosed: [
        {
            id: 12,
            img: 'https://i.pinimg.com/originals/7f/5b/b6/7f5bb635d56379f8b5676918675c34fc.jpg',
            name: 'Кот Компиляторович',
            text: 'Компиляция — это искусство. Иногда кажется, что код идеально написан, но компилятор с тобой не согласен. Он выдаст ошибку, которая ничего не объясняет, и оставит тебя размышлять, почему вообще ты выбрал эту профессию.'
        },
        {
            id: 56,
            img: 'https://i.pinimg.com/736x/39/f5/f0/39f5f0447e6f14abbe3299af038e7220.jpg',
            name: 'Дэн Мержов',
            text: 'Слияние веток — это как семейный ужин: издалека кажется безобидным, но в процессе понимаешь, что лучше бы этого вообще не было. Главное правило: если ты видишь слово "conflict" в терминале, то пора сделать вид, что ты в отпуске.'
        },
        {
            id: 21,
            img: 'https://i.pinimg.com/originals/b1/4c/89/b14c8933d3da9e048bbdd1fdd934875a.jpg',
            name: 'Олег Фиксатор',
            text: 'Если ты программист, то исправление багов — это твоя основная суперспособность. Но есть нюанс: чем больше фиксов ты делаешь, тем больше новых багов появляется. Это как гидра, только вместо голов у неё неожиданное поведение продакшн-системы.'
        }
    ],
    dataDept: [
        {
            id: 45,
            img: 'https://i.pinimg.com/736x/69/03/f3/6903f3d9317a0cb430681609ad0a8061.jpg',
            name: 'Том СтекТрейсер',
            text: 'Стек трейсы — это как карта сокровищ: они вроде бы показывают путь, но на деле ты просто ходишь кругами, а в конце находишь лишь головную боль. Запомни: если баг не повторяется, значит, он просто ждёт подходящего момента.'
        },
        {
            id: 98,
            img: 'https://i.pinimg.com/736x/28/8f/5d/288f5db1695f2047925f5d5b1f2224d6.jpg',
            name: 'Виктор ГлобальнаяПеременная',
            text: 'Использование глобальных переменных — это как оставлять разбросанные вещи по комнате: сначала кажется удобным, но потом ты не можешь найти нужное. А если всё работает, то просто не двигай ничего, пока Вселенная не решит снова потроллить тебя.'
        },
        {
            id: 45,
            img: 'https://i.pinimg.com/originals/97/b0/81/97b081b87b4b06e0783419ad4ed42bc0.jpg',
            name: 'Женя НулПоинт',
            text: 'NullPointerException — лучший друг программиста. Он приходит без предупреждения и рушит все планы. Если ты не знаешь, где ошибка, просто добавь `try/catch` и сделай вид, что проблема решена. Это называется "инженерный подход".'
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
                                <img src="${item.img}" alt="Testimonial Avatar" class="rounded-circle avatar img-object-fit img-fluid">
                                <p class="avatar-name m-0">${item.name}</p>
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