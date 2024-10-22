// Функция для генерации списка дней для заданного количества месяцев
function getDaysListExact(startDateStr, numMonths) {
    let startDateParts = startDateStr.split(".");
    let startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]); // Парсинг стартовой даты
    let daysList = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < numMonths; i++) {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();

        let startDay = currentDate.getDate(); // Начало не с 1-го числа, а с выбранного дня
        let daysInMonth = new Date(year, month + 1, 0).getDate(); // Количество дней в месяце

        // Цикл по каждому дню месяца, начиная с выбранного дня
        for (let day = startDay; day <= daysInMonth; day++) {
            daysList.push({
                day: ("0" + day).slice(-2),
                month: ("0" + (month + 1)).slice(-2),
                year: year,
                dateStr: ("0" + day).slice(-2) + "." + ("0" + (month + 1)).slice(-2) + "." + year
            });
        }

        // Переход к следующему месяцу, начиная с 1-го числа
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return daysList;
}

// Функция для создания словаря расписания с шаблоном рабочих/домашних дней
function getScheduleDictionary(daysToCalculate) {
    let distributionPattern = [
        ["home_work", 1],
        ["work", 3],
        ["work_home", 1],
        ["home", 3]
    ];

    let index = 0;
    let sf = {
        "home_work": [],
        "work": [],
        "work_home": [],
        "home": []
    };

    while (index < daysToCalculate.length) {
        for (let [key, numDays] of distributionPattern) {
            sf[key] = sf[key].concat(daysToCalculate.slice(index, index + numDays).map(d => d.dateStr));
            index += numDays;

            if (index >= daysToCalculate.length) {
                break;
            }
        }
    }

    return sf;
}

// Главная функция для расчета расписания
function calculateSchedule(startWorkingDay, numMonths) {
    let daysToCalculate = getDaysListExact(startWorkingDay, numMonths);
    return getScheduleDictionary(daysToCalculate);
}

// Функция для создания календаря
function createCalendar(schedule, numMonths, startDate) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Очистка предыдущего календаря

    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const daysOfWeek = ['Пон', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вскр'];

    let currentDate = new Date(startDate);

    for (let i = 0; i < numMonths; i++) {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();

        // Создаем секцию месяца
        const monthContainer = document.createElement('div');
        monthContainer.classList.add('month-section');

        const monthHeader = document.createElement('h3');
        monthHeader.textContent = monthNames[month] + " " + year;
        monthContainer.appendChild(monthHeader);

        // Создаем сетку для дней недели
        const daysGrid = document.createElement('div');
        daysGrid.classList.add('days-grid');

        // Добавляем заголовки дней недели
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-day-header');
            dayHeader.textContent = day;
            daysGrid.appendChild(dayHeader);
        });

        // Получаем первый день месяца и количество дней в месяце
        let firstDayOfMonth = new Date(year, month, currentDate.getDate()).getDay();
        firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Сдвиг на понедельник
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Заполняем пустые дни перед первым днем месяца
        for (let j = 0; j < firstDayOfMonth; j++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            daysGrid.appendChild(emptyDay);
        }

        // Заполняем дни месяца
        for (let day = currentDate.getDate(); day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');

            const dayStr = ("0" + day).slice(-2) + "." + ("0" + (month + 1)).slice(-2) + "." + year;

            // Добавляем иконки и классы для каждого дня
            if (schedule.work.includes(dayStr)) {
                dayElement.classList.add('work');
            } else if (schedule.home.includes(dayStr)) {
                dayElement.classList.add('home');
            } else if (schedule.home_work.includes(dayStr)) {
                dayElement.classList.add('home_work');
                const trainIcon = document.createElement('i');
                trainIcon.classList.add('fas', 'fa-train', 'calendar-icon'); // Добавляем иконку поезда
                dayElement.appendChild(trainIcon);
            } else if (schedule.work_home.includes(dayStr)) {
                dayElement.classList.add('work_home');
                const homeIcon = document.createElement('i');
                homeIcon.classList.add('fas', 'fa-home', 'calendar-icon'); // Добавляем иконку дома
                dayElement.appendChild(homeIcon);
            }

            dayElement.textContent = day;
            daysGrid.appendChild(dayElement);
        }

        monthContainer.appendChild(daysGrid);
        calendar.appendChild(monthContainer);

        // Переход к следующему месяцу
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); // Перейти к следующему месяцу
    }
}

// Обработчик события для генерации календаря
document.getElementById('generateBtn').addEventListener('click', function () {
    let startDate = document.getElementById('startDate').value;
    let numMonths = parseInt(document.getElementById('numMonths').value);

    if (!startDate || isNaN(numMonths) || numMonths <= 0) {
        alert('Пожалуйста, введите корректные данные');
        return;
    }

    // Дата уже в формате d.m.Y, используем её как есть
    let formattedStartDate = startDate;

    // Вычисляем расписание
    let schedule = calculateSchedule(formattedStartDate, numMonths);
    createCalendar(schedule, numMonths, new Date(startDate.split('.').reverse().join('-'))); // Создаем дату в формате ГГГГ-ММ-ДД
});
