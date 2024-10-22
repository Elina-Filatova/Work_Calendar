document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    // Данные расписания
    const scheduleData = {
        "home_work": ['2024-10-21', '2024-10-29'],
        "work": ['2024-10-22', '2024-10-23', '2024-10-24', '2024-10-30', '2024-10-31'],
        "work_home": ['2024-10-25'],
        "home": ['2024-10-26', '2024-10-27', '2024-10-28']
    };

    // Преобразуем данные в события для календаря
    const events = [
        ...scheduleData.work.map(date => ({ title: 'Work', start: date, backgroundColor: 'blue', textColor: 'white' })),
        ...scheduleData.work_home.map(date => ({ title: 'Work Home', start: date, backgroundColor: 'green', textColor: 'white' })),
        ...scheduleData.home.map(date => ({ title: 'Home', start: date, backgroundColor: 'orange', textColor: 'white' })),
        ...scheduleData.home_work.map(date => ({ title: 'Home Work', start: date, backgroundColor: 'red', textColor: 'white' }))
    ];

    // Инициализация календаря с событиями
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events
    });

    calendar.render();
});
