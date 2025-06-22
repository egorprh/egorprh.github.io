// Модалка
const modal = document.querySelector('#modal');
const hiddenInput = modal.querySelector('.contact-form input[name="form_source"]');
const closeButton = modal.querySelector('.close-modal');
const openButtons = document.querySelectorAll('.open-modal');

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        hiddenInput.value = button.getAttribute('data-form-source');
        modal.classList.add('show');
    });
});

closeButton.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
    }
});

// Карусель, получаем карточки и рендерим их
async function fetchJsonFiles() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const type = carousel.getAttribute('data-type');

    try {
        const response = await fetch(`${window.location.origin}/src/reviews/${type}.json`);
        const data = await response.json();
        populateCarousels({ [type]: data });
        new bootstrap.Carousel(carousel);
    } catch (error) {
        console.error(`Ошибка загрузки ${type}.json:`, error);
    }
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

// Валидация формы, отправка данных
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
        if (nameInput.value.trim().length < 2) {
            markInvalidInput(nameInput, 'Имя должно содержать не менее 2-х букв');
            isValid = false;
        }
        

        // Валидация телефона
        const phoneInput = form.querySelector('input[name="phone"]');

        let rawValue = phoneInput.value.replace(/\D/g, '');

        if (!rawValue.startsWith('+' )) {
            rawValue = '+' + rawValue;
        }

        phoneInput.value = rawValue;

        if (!/^\+\d{10,15}$/.test(rawValue)) {
            markInvalidInput(phoneInput, 'Введите корректный номер телефона');
            isValid = false;
        }        

        // Валидация Telegram
        const telegramInput = form.querySelector('input[name="telegram"]');
        if (/[^\x00-\x7F]/.test(telegramInput.value)) {
            markInvalidInput(telegramInput, 'Введите корректный никнейм');
            isValid = false;
        }
        

        // Валидация чекбокса
        const consentCheckbox = form.querySelector("input[type='checkbox']");
        if (!consentCheckbox.checked) {
            consentCheckbox.classList.add("input-error-bg");
            isValid = false;
        } 

        consentCheckbox.addEventListener("change", function (event) {
            event.target.classList.remove("input-error-bg");
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
        fetch("https://79.137.192.124:9348/send-application/", { // TODO нужен правильный урл
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => {
            showMessage(form, "success");
            form.reset();
        })
        .catch(error => {
            showMessage(form, "error");
        })
        .finally(() => {
            form.removeChild(loader);
            button.disabled = false;
        });
    }, { once: true });
}

function markInvalidInput(input, message) {
    input.classList.add('input-error-bg');
    input.setAttribute('title', message);
    input.setAttribute('data-bs-toggle', 'tooltip');
    input.setAttribute('data-bs-placement', 'top');

    bootstrap.Tooltip.getInstance(input)?.dispose();

    const tooltip = new bootstrap.Tooltip(input);
    tooltip.show();

    const autoDispose = setTimeout(() => {
        bootstrap.Tooltip.getInstance(input)?.dispose();
    }, 2000);

    const clear = () => {
        clearTimeout(autoDispose);
        input.classList.remove('input-error-bg');
        input.removeAttribute('title');
        input.removeAttribute('data-bs-toggle');
        input.removeAttribute('data-bs-placement');
        bootstrap.Tooltip.getInstance(input)?.dispose();
        input.removeEventListener('input', clear);
    };

    input.addEventListener('input', clear, { once: true });
}

function showMessage(form, type) {
    const message = form.querySelector(`.message-${type}`);
  
    message.classList.add('show');
  
    setTimeout(() => {
      message.classList.remove('show');
    }, 2500);
}


// Торговые журналы
async function fetchMonthButtons() {
    const buttonContainer = document.getElementById("month-buttons");
    if (!buttonContainer) return;

    try {
        const response = await fetch("src/reviews/trade-magazines.json");
        const data = await response.json();
        renderButtons(data, buttonContainer);
    } catch (error) {
        console.error("Ошибка загрузки trade-magazines.json:", error);
    }
}

function renderButtons(data, buttonContainer) {
    const sortedData = [...data].sort((a, b) => a.id - b.id).slice(-4);

    const buttonsHTML = sortedData.map(item => 
        `<a href="${item.url}" target="_blank" class="btn text-white">${item.name}</a>`
    ).join('');

    buttonContainer.innerHTML = buttonsHTML;
}

fetchMonthButtons();