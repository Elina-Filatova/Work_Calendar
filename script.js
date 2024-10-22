function getDaysListExact(startDateStr, numMonths) {
    let startDateParts = startDateStr.split(".");
    let startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
    let daysList = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < numMonths; i++) {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();

        // Reset to the first day of the current month
        currentDate.setDate(1);
        let daysInMonth = new Date(year, month + 1, 0).getDate();

        // Loop through each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            daysList.push({
                day: ("0" + day).slice(-2),
                month: ("0" + (month + 1)).slice(-2),
                year: year,
                dateStr: ("0" + day).slice(-2) + "." + ("0" + (month + 1)).slice(-2) + "." + year
            });
        }

        // Move to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return daysList;
}

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

function calculateSchedule(startWorkingDay, numMonths) {
    let daysToCalculate = getDaysListExact(startWorkingDay, numMonths);
    return getScheduleDictionary(daysToCalculate);
}

function createCalendar(schedule, numMonths) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear any previous calendar

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let today = new Date();
    for (let i = 0; i < numMonths; i++) {
        let currentMonth = today.getMonth() + i;
        let year = today.getFullYear();
        if (currentMonth > 11) {
            currentMonth -= 12;
            year += 1;
        }

        // Create month section
        const monthContainer = document.createElement('div');
        monthContainer.classList.add('month-section');

        const monthHeader = document.createElement('h3');
        monthHeader.textContent = monthNames[currentMonth] + " " + year;
        monthContainer.appendChild(monthHeader);

        // Create a grid for days of the week
        const daysGrid = document.createElement('div');
        daysGrid.classList.add('days-grid');

        // Add day headers (Sun, Mon, ...)
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-day-header');
            dayHeader.textContent = day;
            daysGrid.appendChild(dayHeader);
        });

        // Get the first day of the month
        const firstDayOfMonth = new Date(year, currentMonth, 1).getDay();
        const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();

        // Fill in empty days before the first day of the month
        for (let j = 0; j < firstDayOfMonth; j++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            daysGrid.appendChild(emptyDay);
        }

        // Fill in the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');

            const dayStr = ("0" + day).slice(-2) + "." + ("0" + (currentMonth + 1)).slice(-2) + "." + year;

            // Check if the day is in the schedule and apply the corresponding class
            if (schedule.work.includes(dayStr)) {
                dayElement.classList.add('work');
            } else if (schedule.home.includes(dayStr)) {
                dayElement.classList.add('home');
            } else if (schedule.home_work.includes(dayStr) || schedule.work_home.includes(dayStr)) {
                dayElement.classList.add('home_work');
            }

            dayElement.textContent = day;
            daysGrid.appendChild(dayElement);
        }

        monthContainer.appendChild(daysGrid);
        calendar.appendChild(monthContainer);
    }
}

document.getElementById('generateBtn').addEventListener('click', function () {
    let startDate = document.getElementById('startDate').value;
    let numMonths = parseInt(document.getElementById('numMonths').value);

    if (!startDate || isNaN(numMonths) || numMonths <= 0) {
        alert('Please enter valid inputs');
        return;
    }

    let schedule = calculateSchedule(startDate, numMonths);
    createCalendar(schedule, numMonths);
});
