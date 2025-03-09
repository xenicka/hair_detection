function addToGoogleCalendar() {
  const frequency = document.getElementById("washingFrequency").value;
  let repeatRule = "";

  // Определяем правило повтора
  if (frequency === "daily") {
    repeatRule = "FREQ=DAILY";
  } else if (frequency === "2-3") {
    repeatRule = "FREQ=WEEKLY;BYDAY=MO,TH"; // Понедельник и Четверг
  } else if (frequency === "4-7") {
    repeatRule = "FREQ=WEEKLY;BYDAY=FR"; // Каждую Пятницу
  }

  // Получаем текущую дату в формате YYYYMMDD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const day = String(now.getDate()).padStart(2, "0");
  const startDate = `${year}${month}${day}`;

  // Дата окончания (1 год с текущей даты)
  const endYear = year + 1;
  const endDate = `${endYear}${month}${day}`;

  // Указываем время начала события
  const startTime = "T090000Z"; // 09:00 UTC (можно изменить)

  // Формируем ссылку для повторений на 1 год
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Hair+Wash+Reminder&details=Reminder+to+wash+your+hair+based+on+your+routine.&dates=${startDate}${startTime}/${startDate}${startTime}&recur=RRULE:${repeatRule};UNTIL=${endDate}T235959Z`;

  window.open(calendarUrl, "_blank");
}
