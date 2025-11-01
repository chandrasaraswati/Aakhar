// Import API functions
import { getAvailableCategories, getCategoryData } from '../api.js';

// --- Module-Level State Variables ---
let mainContainer = null;
let allCategoryData = []; // Full data for the selected category
let questions = [];       // The 10 generated questions
let currentQuestionIndex = 0;
let score = 0;
let selectedLanguage = ''; // 'Garhwali', 'Kumaoni', or 'Jaunsari'

// --- Helper: Shuffle Array (Fisher-Yates) ---
function shuffle(array) {
  let a = [...array]; // Create a copy
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Renders the "Quiz" page.
 * This is the main entry point called by the router.
 * @param {HTMLElement} mainContentElement - The <main> element.
 */
export function renderQuizPage(mainContentElement) {
  mainContainer = mainContentElement;
  renderQuizSetup();
}

/**
 * Renders the initial setup screen (category & language select).
 */
function renderQuizSetup() {
  const categories = getAvailableCategories();
  
  const setupHtml = `
    <div class="card quiz-setup-container">
      <h2>Take a Quiz</h2>
      <p>Select a category and a language to start your 10-question quiz.</p>
      
      <form id="quiz-setup-form">
        <div class="form-group">
          <label for="category-select">1. Choose a Category:</label>
          <select id="category-select" required>
            <option value="">-- Select Category --</option>
            ${categories.map(cat => `<option value="${cat.id}">${cat.title}</option>`).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label for="language-select">2. Choose a Language to Test:</label>
          <select id="language-select" required>
            <option value="">-- Select Language --</option>
            <option value="Garhwali">Garhwali</option>
            <option value="Kumaoni">Kumaoni</option>
            <option value="Jaunsari">Jaunsari</option>
          </select>
        </div>
        
        <button type="submit" class="btn" id="start-quiz-btn">Start Quiz</button>
      </form>
    </div>
  `;
  
  mainContainer.innerHTML = setupHtml;
  
  // Add form submit listener
  document.getElementById('quiz-setup-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting
    const categoryId = document.getElementById('category-select').value;
    selectedLanguage = document.getElementById('language-select').value;
    
    if (categoryId && selectedLanguage) {
      startQuiz(categoryId, selectedLanguage);
    }
  });
}

/**
 * Fetches data, generates questions, and starts the quiz.
 * @param {string} categoryId
 * @param {string} language
 */
async function startQuiz(categoryId, language) {
  mainContainer.innerHTML = '<div class="card"><p>Loading quiz...</p></div>';
  
  const rawData = await getCategoryData(categoryId);
  
  // CRITICAL: Filter out items that have no answer for the selected language
  allCategoryData = rawData.filter(item => item[language] && item[language] !== 'N/A');
  
  if (allCategoryData.length < 10) {
    mainContainer.innerHTML = `
      <div class="card">
        <h2>Not Enough Data</h2>
        <p>Sorry, there isn't enough data for the "${language}" language in this category to generate a 10-question quiz.</p>
        <button class="btn" id="quiz-back-btn">Back to Setup</button>
      </div>
    `;
    document.getElementById('quiz-back-btn').addEventListener('click', renderQuizSetup);
    return;
  }
  
  // Reset state
  score = 0;
  currentQuestionIndex = 0;
  
  // Generate the questions
  generateQuestions();
  
  // Render the main quiz view
  renderQuestionView();
}

/**
 * Generates 10 MCQs from the `allCategoryData`.
 */
function generateQuestions() {
  questions = [];
  
  // 1. Get 10 random "correct" items
  const questionItems = shuffle(allCategoryData).slice(0, 10);
  
  // 2. Create a pool of all possible answers
  const answerPool = [...new Set(allCategoryData.map(item => item[selectedLanguage]))];
  
  // 3. Build each question
  for (const item of questionItems) {
    const correctAnswer = item[selectedLanguage];
    
    // Get 4 unique wrong answers
    const wrongAnswers = shuffle(answerPool.filter(ans => ans !== correctAnswer)).slice(0, 4);
    
    const options = shuffle([correctAnswer, ...wrongAnswers]);
    
    questions.push({
      question: {
        english: item.English,
        hindi: item.Hindi
      },
      options: options,
      correct: correctAnswer
    });
  }
}

/**
 * Renders the main quiz UI shell (header, question area, controls).
 */
function renderQuestionView() {
  const viewHtml = `
    <div class="quiz-view">
      <div class="quiz-header">
        <span id="quiz-progress" class="progress"></span>
        <span id="quiz-score">Score: 0</span>
        <button class="btn" id="quit-quiz-btn">Quit</button>
      </div>
      
      <div class="card quiz-question-card">
        <div id="quiz-question-area">
          </div>
      </div>
      
      <div id="quiz-options-area" class="quiz-options-grid">
        </div>
      
      <div id="quiz-feedback-area"></div>
      <button class="btn" id="next-question-btn" style="display: none;">Next</button>
    </div>
  `;
  
  mainContainer.innerHTML = viewHtml;
  
  // Add listeners
  document.getElementById('quit-quiz-btn').addEventListener('click', renderQuizSetup);
  document.getElementById('next-question-btn').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayCurrentQuestion();
    } else {
      renderResultsView();
    }
  });
  
  // Display the first question
  displayCurrentQuestion();
}

/**
 * Fills the quiz view with the current question.
 */
function displayCurrentQuestion() {
  const q = questions[currentQuestionIndex];
  
  // Update Header
  document.getElementById('quiz-progress').textContent = `Question ${currentQuestionIndex + 1} of 10`;
  document.getElementById('quiz-score').textContent = `Score: ${score}`;
  
  // Update Question
  document.getElementById('quiz-question-area').innerHTML = `
    <p>What is the ${selectedLanguage} for:</p>
    <h2>${q.question.english}</h2>
    <p>(${q.question.hindi})</p>
  `;
  
  // Update Options
  const optionsArea = document.getElementById('quiz-options-area');
  optionsArea.innerHTML = q.options.map(opt => 
    `<button class="quiz-option-btn" data-value="${opt}">${opt}</button>`
  ).join('');
  
  // Clear feedback and hide 'Next' button
  document.getElementById('quiz-feedback-area').innerHTML = '';
  document.getElementById('next-question-btn').style.display = 'none';
  
  // Add listeners to new option buttons
  optionsArea.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', handleAnswerClick);
  });
}

/**
 * Handles the logic when a user clicks an answer.
 */
function handleAnswerClick(e) {
  const selectedBtn = e.currentTarget;
  const selectedAnswer = selectedBtn.dataset.value;
  const correctAnswer = questions[currentQuestionIndex].correct;
  const feedbackArea = document.getElementById('quiz-feedback-area');

  // Disable all buttons
  document.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = true);
  
  // Show 'Next' button
  document.getElementById('next-question-btn').style.display = 'block';

  if (selectedAnswer === correctAnswer) {
    // Correct
    score++;
    selectedBtn.classList.add('correct');
    feedbackArea.innerHTML = `<p class="feedback-correct">Correct!</p>`;
    document.getElementById('quiz-score').textContent = `Score: ${score}`;
  } else {
    // Incorrect
    selectedBtn.classList.add('incorrect');
    feedbackArea.innerHTML = `<p class="feedback-incorrect">Sorry, that's not right.</p>`;
    // Highlight the correct answer
    const correctBtn = document.querySelector(`.quiz-option-btn[data-value="${correctAnswer}"]`);
    if (correctBtn) {
      correctBtn.classList.add('correct');
    }
  }
}

/**
 * Renders the final results screen after the quiz.
 */
function renderResultsView() {
  const percentage = (score / 10) * 100;
  let message = '';

  if (percentage == 100) {
    message = 'Perfect! You\'re a master!';
  } else if (percentage >= 80) {
    message = 'Excellent job! You really know your stuff.';
  } else if (percentage >= 50) {
    message = 'Good effort! Keep practicing.';
  } else {
    message = 'Don\'t give up! Keep learning and try again.';
  }

  const resultsHtml = `
    <div class="card quiz-results-view">
      <h2>Quiz Complete!</h2>
      <p>Your language: <strong>${selectedLanguage}</strong></p>
      <div class="final-score">You scored:</div>
      <div class="final-score-number">${score} / 10</div>
      <div class="final-score-percent">(${percentage}%)</div>
      
      <p class="final-message">"${message}"</p>
      
      <div class="quiz-results-controls">
        <button class="btn" id="quiz-back-btn">Back to Setup</button>
      </div>
    </div>
  `;
  // Note: "Try Again" is removed for simplicity. User can re-select from setup.
  
  mainContainer.innerHTML = resultsHtml;
  
  document.getElementById('quiz-back-btn').addEventListener('click', renderQuizSetup);
}