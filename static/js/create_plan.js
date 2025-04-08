function addToGoogleCalendar() {
  const frequency = document.getElementById("q1").value;
  let repeatRule = "";

  // Определяем правило повтора на основе частоты мытья головы
  if (frequency === "option2") {
    // "Ежедневно"
    repeatRule = "FREQ=DAILY"; // Каждый день
  } else if (frequency === "option1") {
    // "2-3 раза в неделю"
    repeatRule = "FREQ=WEEKLY;BYDAY=MO,TH"; // Понедельник и Четверг
  } else if (frequency === "option3") {
    // "4-7 раз в неделю"
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

  // Получаем рекомендации
  const answers = {
    q1: document.getElementById("q1").value,
    q2: document.getElementById("q2").value,
    q3: document.getElementById("q3").value,
    q4: document.getElementById("q4").value,
    q5: document.getElementById("q5").value,
    q6: document.getElementById("q6").value,
    q7: document.getElementById("q7").value,
  };
  const recommendations = generateRecommendations(answers);

  // Формируем ссылку для повторений на 1 год
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Hair+Wash+Reminder&details=${encodeURIComponent(
    recommendations
  )}&dates=${startDate}${startTime}/${startDate}${startTime}&recur=RRULE:${repeatRule};UNTIL=${endDate}T235959Z`;

  window.open(calendarUrl, "_blank");
}

let currentQuestion = 1;
const totalQuestions = 7; // Total number of questions

// Update progress steps based on current question
function updateProgressSteps() {
  for (let i = 1; i <= totalQuestions; i++) {
    const step = document.getElementById(`step${i}`);
    if (i < currentQuestion) {
      step.classList.add("completed");
      step.classList.remove("active");
    } else if (i === currentQuestion) {
      step.classList.add("active");
      step.classList.remove("completed");
    } else {
      step.classList.remove("active", "completed");
    }
  }
}

// Show the next question
function nextQuestion(next) {
  document
    .getElementById(`question${currentQuestion}`)
    .classList.remove("active");
  currentQuestion = next;
  document.getElementById(`question${currentQuestion}`).classList.add("active");
  updateProgressSteps();
}

// Show the previous question
function prevQuestion(prev) {
  document
    .getElementById(`question${currentQuestion}`)
    .classList.remove("active");
  currentQuestion = prev;
  document.getElementById(`question${currentQuestion}`).classList.add("active");
  updateProgressSteps();
}

// Initialize the first question as active
document.getElementById(`question${currentQuestion}`).classList.add("active");
updateProgressSteps();

// Show the results after the user finishes the questions
function showResults() {
  const results = [];
  for (let i = 1; i <= 7; i++) {
    const select = document.getElementById("q" + i);
    const question = document.querySelector(
      "#question" + i + " label"
    ).textContent;
    const selectedOption = select.options[select.selectedIndex].text;
    results.push({ question, answer: selectedOption });
  }

  const answerList = document.getElementById("answerList");
  answerList.innerHTML = "";
  results.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.question}</strong><br>${item.answer}`;
    answerList.appendChild(li);
  });

  // Hide all questions and show the result section
  document
    .querySelectorAll(".question")
    .forEach((q) => q.classList.remove("active"));
  document.getElementById("result").style.display = "block";

  // Hide the broken-top-border when showing results
  const brokenTopBorder = document.querySelector(".broken-top-border");
  if (brokenTopBorder) {
    brokenTopBorder.style.display = "none";
  }

  // Show the "Add to Google Calendar" button
  const googleCalendarButton = document.getElementById("googleCalendarButton");
  if (googleCalendarButton) {
    googleCalendarButton.style.display = "inline-block"; // or "block" depending on your layout
  }
}

// Go back to the questions from the results section
function goBackToQuestions() {
  // Hide the result section
  document.getElementById("result").style.display = "none";

  // Unhide all questions and set the current question as active again
  document
    .querySelectorAll(".question")
    .forEach((q) => q.classList.remove("active"));
  document.getElementById(`question${currentQuestion}`).classList.add("active");

  // Unhide the broken-top-border when going back to questions
  const brokenTopBorder = document.querySelector(".broken-top-border");
  if (brokenTopBorder) {
    brokenTopBorder.style.display = "block";
  }

  // Update progress steps
  updateProgressSteps();
}
function generateRecommendations(answers) {
  let recommendations = "Based on your answers, we have determined that ";

  // Question 1: How often do you wash your hair?
  if (answers.q1 === "option3") {
    recommendations += "you wash your hair 4-7 times a week. ";
  } else if (answers.q1 === "option1") {
    recommendations += "you wash your hair 2-3 times a week. ";
  } else if (answers.q1 === "option2") {
    recommendations += "you wash your hair every day. ";
  }

  // Question 2: What is your hair type?
  if (answers.q2 === "option3") {
    recommendations +=
      "Your hair is straight. In this case, light textures, mousses, and sprays for volume are recommended. ";
  } else if (answers.q2 === "option1") {
    recommendations +=
      "Your hair is wavy. We recommend choosing products that don’t weigh your hair down, to preserve volume. ";
  } else if (answers.q2 === "option2") {
    recommendations +=
      "Your hair is curly. For this type, it is best to use moisturizing and defining products to enhance the shape. ";
  }

  // Question 3: How would you describe your scalp condition?
  if (answers.q3 === "option3") {
    recommendations +=
      "Your scalp is dry, so we recommend using moisturizing shampoos and oils to nourish your scalp. ";
  } else if (answers.q3 === "option1") {
    recommendations +=
      "With your oily scalp, it’s better to use cleansing shampoos that control sebum production. ";
  } else if (answers.q3 === "option2") {
    recommendations +=
      "A normal scalp allows you to use a wide range of shampoos and conditioners for care. ";
  }

  // Question 4: Have you noticed hair thinning or shedding?
  if (answers.q4 === "option3") {
    recommendations +=
      "If you have noticed hair thinning or shedding, it is recommended to use strengthening products, such as serums or anti-hair loss shampoos. ";
  } else if (answers.q4 === "option1") {
    recommendations +=
      "If there is no noticeable hair loss, choose general care products that help maintain hair health. ";
  } else if (answers.q4 === "option2") {
    recommendations +=
      "Seasonal hair shedding can be supported with strengthening products that help reduce the intensity of hair loss. ";
  }

  // Question 5: Do you have dandruff?
  if (answers.q5 === "option1") {
    recommendations +=
      "If you don’t have dandruff, you can use moisturizing products that improve hair condition. ";
  } else if (answers.q5 === "option3") {
    recommendations +=
      "If you have dandruff, use anti-dandruff shampoos and moisturizing products to improve the scalp condition. ";
  }

  // Question 6: Do you use styling products?
  if (answers.q6 === "option2") {
    recommendations +=
      "If you use styling products occasionally, choose light textures so as not to weigh your hair down. ";
  } else if (answers.q6 === "option3") {
    recommendations +=
      "For regular use of styling products, choose those that do not damage the hair and help maintain its shape. ";
  } else if (answers.q6 === "option1") {
    recommendations +=
      "If you don’t use styling products, your hair is naturally free from additional damage, which is great for its health. ";
  }

  // Question 7: Do you use hot tools for styling your hair?
  if (answers.q7 === "option2") {
    recommendations +=
      "When using hot tools occasionally, always apply heat protection to minimize damage to your hair. ";
  } else if (answers.q7 === "option3") {
    recommendations +=
      "If you frequently use hot tools for styling, heat protection is a must to avoid damage and maintain hair health. ";
  } else if (answers.q7 === "option1") {
    recommendations +=
      "If you don’t use hot tools, this is great for your hair as it’s less prone to damage. ";
  }

  // Washing hair recommendations
  recommendations += "\n\nHair washing steps:\n";

  // Washing steps for different hair types
  if (answers.q2 === "option3") {
    // For straight hair
    recommendations +=
      "1. Apply shampoo and massage into your scalp, then rinse thoroughly.\n";
    recommendations +=
      "2. Use conditioner only on the ends of your hair to avoid weighing it down.\n";
    recommendations +=
      "3. You can use a hair mask 1-2 times a week for restoration and nourishment.\n";
    recommendations +=
      "4. After washing, gently blot your hair with a microfiber towel to avoid damage.\n";
    recommendations +=
      "5. Before styling, dry your hair on low heat with heat protection.\n";
  } else if (answers.q2 === "option1") {
    // For wavy hair
    recommendations +=
      "1. Wash your hair with cool water to prevent weighing it down.\n";
    recommendations +=
      "2. After washing, gently comb your damp hair and scrunch styling products to maintain wave shape.\n";
    recommendations += "3. Use moisturizing masks 1-2 times a week.\n";
    recommendations +=
      "4. After washing, blot your hair with a microfiber towel to preserve texture.\n";
    recommendations +=
      "5. Dry your hair on low heat with heat protection before styling.\n";
  } else if (answers.q2 === "option2") {
    // For curly hair
    recommendations +=
      "1. Use warm water to wash your hair, avoiding hot water.\n";
    recommendations +=
      "2. Apply conditioner and mask, distributing evenly along the hair length.\n";
    recommendations +=
      "3. After washing, gently blot your hair with a microfiber towel, avoiding rubbing to prevent damage.\n";
    recommendations +=
      "4. Before styling, always dry your hair with heat protection to prevent damage.\n";
  }

  // Scalp care recommendations
  if (answers.q3 === "option3") {
    // Dry scalp
    recommendations +=
      "6. Use moisturizing masks and oils to improve the condition of your scalp and hair.\n";
  } else if (answers.q3 === "option1") {
    // Oily scalp
    recommendations +=
      "6. Cleansing masks with purifying ingredients will help control oil production on your scalp.\n";
  } else if (answers.q3 === "option2") {
    // Normal scalp
    recommendations +=
      "6. Apply moisturizing or cleansing masks depending on the condition of your hair.\n";
  }

  // Returning all recommendations as a single text
  return recommendations;
}
