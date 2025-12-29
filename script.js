const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which HTML tag is used to link a JavaScript file?",
    options: [
      "<javascript>",
      "<script>",
      "<js>",
      "<link>"
    ],
    answer: 1
  },
  {
    question: "Which property is used in CSS to change text color?",
    options: [
      "text-color",
      "font-color",
      "color",
      "background-color"
    ],
    answer: 2
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: [
      "<!-- -->",
      "//",
      "#",
      "**"
    ],
    answer: 1
  },
  {
    question: "Which method is used to select an element by ID in JavaScript?",
    options: [
      "getElementByClass",
      "querySelectorAll",
      "getElementById",
      "getElementsByName"
    ],
    answer: 2
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: [
      "var",
      "let",
      "const",
      "All of the above"
    ],
    answer: 3
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: 1
  },
  {
    question: "Which JavaScript function runs code repeatedly after a fixed time?",
    options: [
      "setTimeout()",
      "setInterval()",
      "repeat()",
      "loop()"
    ],
    answer: 1
  },
  {
    question: "Which HTML attribute is used to provide extra information about an element?",
    options: [
      "class",
      "id",
      "style",
      "All of the above"
    ],
    answer: 3
  },
  {
    question: "Which method is used to store data in the browser permanently?",
    options: [
      "sessionStorage",
      "cookies",
      "localStorage",
      "cacheStorage"
    ],
    answer: 2
  }
];


// Randomize questions
quizData.sort(() => Math.random() - 0.5);

let currentIndex = 0;
let score = 0;
let timeLeft = 10;
let timer;
let userAnswers = []; // stores selected indices



const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    timerEl.textContent = `Time: ${timeLeft}`;

    const current = quizData[currentIndex];
    questionEl.textContent = current.question;
    optionsEl.innerHTML = "";

    current.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;

        btn.addEventListener("click", () => {
            checkAnswer(index);
        });

        optionsEl.appendChild(btn);
    });

    startTimer();
}

function goToNextQuestion() {
    clearInterval(timer);

    // make sure every question is stored
    if (userAnswers[currentIndex] === undefined) {
        userAnswers[currentIndex] = -1; // -1 = not answered
    }

    currentIndex++;

    if (currentIndex < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}



function checkAnswer(selected) {
    // save the selected answer
    userAnswers[currentIndex] = selected;

    if (selected === quizData[currentIndex].answer) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
    }

    goToNextQuestion();
}


function nextQuestion() {
    clearInterval(timer);
    currentIndex++;

    if (currentIndex < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function startTimer() {
    timer = setInterval(() => {
        if (currentIndex >= quizData.length) {
            clearInterval(timer);
            return;
        }

        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}`;

        if (timeLeft <= 0) {
            goToNextQuestion();
        }
    }, 1000);
}

function updateProgress() {
    const progress = ((currentIndex + 1) / quizData.length) * 100;
    progressBar.style.width = progress + "%";
}

function endQuiz() {
    clearInterval(timer);

    const highScore = localStorage.getItem("highScore") || 0;
    if (score > highScore) {
        localStorage.setItem("highScore", score);
    }

    document.querySelector(".quiz-container").innerHTML = `
        <h2>Quiz Finished!</h2>
        <p>Your Score: ${score}</p>
        <p>High Score: ${localStorage.getItem("highScore")}</p>

        <button onclick="reviewQuiz()">Review My Quiz</button>
        <button onclick="location.reload()">Restart</button>
    `;

}function reviewQuiz() {
    const container = document.querySelector(".quiz-container");
    container.innerHTML = "<h2>Quiz Review</h2>";

    quizData.forEach((q, index) => {
        const userAns = userAnswers[index];
        const correctAns = q.answer;

        let questionHTML = `
            <div style="margin-bottom:15px;">
                <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        `;

        q.options.forEach((opt, i) => {
            let color = "#fff"; // default
            if (i === correctAns) color = "lightgreen"; // correct
            if (userAns !== -1 && i === userAns && i !== correctAns) color = "salmon"; // wrong

            questionHTML += `<p style="margin-left:10px;color:${color}">${opt}</p>`;
        });

        if (userAns === -1) {
            questionHTML += `<p style="margin-left:10px;color:orange;">Not Answered</p>`;
        }

        questionHTML += "</div>";
        container.innerHTML += questionHTML;
    });

    container.innerHTML += `<button onclick="location.reload()">Restart Quiz</button>`;
}



loadQuestion();
