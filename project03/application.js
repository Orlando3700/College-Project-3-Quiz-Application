document.addEventListener("DOMContentLoaded", function () {
  const nameType = document.getElementById("nameType");
  const submitName = document.getElementById("submitName");
  const formType = document.getElementById("formType");
  const quizButtons = document.querySelector(".quiz-buttons");
  const javaScriptQuizButton = document.getElementById("javaScriptQuizButton");
  const pythonQuizButton = document.getElementById("pythonQuizButton");

  const submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", checkAnswer);

  /* Variables */
  let currentQuestion = 0;
  let correctAnswer;
  let feedback;
  let selectedQuiz;
  let correctAnswersCount = 0;
  let totalQuestionsAttempted = 0;

  submitName.addEventListener("click", function () {
    const userName = nameType.value.trim();

    if (userName !== "") {
      nameType.style.display = "none";
      submitName.style.display = "none";

      formType.innerHTML = `Hello, ${userName}! Please Select a Quiz`;
      formType.style.fontSize = "22px";
      formType.style.background = "#3923c4";
      formType.style.color = "white";
      formType.style.borderRadius = "10px";
      quizButtons.style.display = "block";
    }
  });

  /* JavaScript Quiz Button */
  javaScriptQuizButton.addEventListener("click", function () {
    quizButtons.style.display = "none";
    formType.style.display = "none";
    selectedQuiz = 1;
    displayQuiz(1);
  });

  /* Python quiz button */
  pythonQuizButton.addEventListener("click", function () {
    quizButtons.style.display = "none";
    formType.style.display = "none";
    selectedQuiz = 2;
    displayQuiz(2);
  });

  function displayQuiz(quizReference) {
    submitButton.style.display = "block";
    fetch(
      `https://my-json-server.typicode.com/Orlando3700/Project03_db/quizzes/${quizReference}`
    )
      .then((response) => response.json())
      .then((data) => 
	{
        if (currentQuestion < data.questions.length) {
          correctAnswer = data.questions[currentQuestion].correctAnswer;
          feedback = data.questions[currentQuestion].feedback;
          renderQuizView(data.questions[currentQuestion]);
        } else {
          renderEndOfQuiz();
        }
    });
}

  function renderQuizView(questionData) {
    const quizElement = document.getElementById("quiz-view").innerHTML;
    const formView = Handlebars.compile(quizElement);
    const html = formView({
      ...questionData,
      isTextQuestion: questionData.type === "text",
    });
    document.querySelector("#main-view").innerHTML = html;
    document.getElementById("scoreboard").style.display = "block";
  }

  function renderCorrectView() {
    submitButton.style.display = "none";
    correctAnswersCount++;
    totalQuestionsAttempted++;
    updateScoreboard();

    const quizElement = document.getElementById("correct-view").innerHTML;
    const formView = Handlebars.compile(quizElement);
    const html = formView({});
    document.querySelector("#main-view").innerHTML = html;

    setTimeout(() => {
      currentQuestion++;
      displayQuiz(selectedQuiz);
    }, 1000);  }

  function renderWrongView() {
    submitButton.style.display = "none";
    totalQuestionsAttempted++;
    updateScoreboard();

    const quizElement = document.getElementById("incorrect-view").innerHTML;
    const formView = Handlebars.compile(quizElement);
    const html = formView({ feedback });
    document.querySelector("#main-view").innerHTML = html;

    document
      .getElementById("nextQuestion")
      .addEventListener("click", function () {
        currentQuestion++;
        displayQuiz(selectedQuiz);
      });
  }

  function renderEndOfQuiz() {
    submitButton.style.display = "none";
    const percentageScore = (correctAnswersCount / totalQuestionsAttempted) * 100;

    let endMessage;
    if (percentageScore >= 80) {
      endMessage = `Congratulations ${
        nameType.value
      }! You passed the quiz with a score of ${percentageScore.toFixed(2)}%.`;
    } else {
      endMessage = `Sorry ${
        nameType.value
      }, you failed the quiz with a score of ${percentageScore.toFixed(2)}%.`;
    }

    const quizElement = document.getElementById("end-view").innerHTML;
    const formView = Handlebars.compile(quizElement);
    const html = formView({ endMessage });
    document.querySelector("#main-view").innerHTML = html;

    document
      .getElementById("retakeQuiz")
      .addEventListener("click", function () {
        currentQuestion = 0;
        correctAnswersCount = 0;
        totalQuestionsAttempted = 0;
        updateScoreboard();
        displayQuiz(selectedQuiz);
      });

    document
      .getElementById("returnToMainPage")
      .addEventListener("click", function () {
        location.reload();
      });
  }

  function updateScoreboard() {
    const correctAnswersElement = document.getElementById("correctAnswers");
    correctAnswersElement.textContent = `${correctAnswersCount} / ${totalQuestionsAttempted}`;
  }

  /* Displays correct view or incorrect view */
  function checkAnswer() {
    const selectedAnswer = document.querySelector(
      'input[type="radio"]:checked'
    );

    if (selectedAnswer && selectedAnswer.value === correctAnswer) {
      renderCorrectView();
    } else if (document.getElementById("textAnswer")) {
      const textAnswer = document.getElementById("textAnswer").value.trim();
      if (textAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        renderCorrectView();
      } else {
        renderWrongView();
      }
    } else {
      renderWrongView();
    }
  }
});
