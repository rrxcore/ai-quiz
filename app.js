// AI Quiz Application Logic

// Quiz State
let state = {
  currentQuestions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  incorrectAnswers: [],
  selectedCategory: null,
  answered: false,
  hintUsed: false
};

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const btnBack = document.getElementById('btn-back');

const categoryList = document.getElementById('category-list');
const categoryBadge = document.getElementById('category-badge');
const streakCounter = document.getElementById('streak-counter');
const streakVal = document.getElementById('streak-val');
const questionProgress = document.getElementById('question-progress');
const progressBar = document.getElementById('progress-bar');

const questionCard = document.getElementById('question-card');
const questionText = document.getElementById('question-text');
const textAnswerInput = document.getElementById('text-answer-input');
const btnCheckAnswer = document.getElementById('btn-check-answer');
const btnToggleHint = document.getElementById('btn-toggle-hint');
const hintMcContainer = document.getElementById('hint-mc-container');
const mcOptionsList = document.getElementById('mc-options-list');

const feedbackPanel = document.getElementById('feedback-panel');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const btnNext = document.getElementById('btn-next');

const resultsGreeting = document.getElementById('results-greeting');
const fgCircle = document.getElementById('fg-circle');
const accuracyPercent = document.getElementById('accuracy-percent');
const resultsScoreVal = document.getElementById('results-score-val');
const resultsStreakVal = document.getElementById('results-streak-val');
const reviewSection = document.getElementById('review-section');
const reviewList = document.getElementById('review-list');
const btnRestart = document.getElementById('btn-restart');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  setupEventListeners();
});

// Render categories on welcome screen
function renderCategories() {
  // Extract unique categories from QUIZ_DATA
  const categories = [...new Set(QUIZ_DATA.map(q => q.group))];
  
  categoryList.innerHTML = '';
  
  // 1. Create a "Mixed All Topics" option
  const mixedBtn = document.createElement('button');
  mixedBtn.className = 'category-btn mixed';
  mixedBtn.innerHTML = `
    <span><span class="icon">✨</span> Mixed All Topics (${QUIZ_DATA.length} Questions)</span>
    <span class="arrow">→</span>
  `;
  mixedBtn.addEventListener('click', () => startQuiz(null));
  categoryList.appendChild(mixedBtn);
  
  // 2. Add each category button
  categories.forEach(cat => {
    const catQuestions = QUIZ_DATA.filter(q => q.group === cat);
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    
    // Nice emoji based on category
    let emoji = '📚';
    if (cat.includes('Agent')) emoji = '🤖';
    else if (cat.includes('Search')) emoji = '⚡';
    else if (cat.includes('Logic') && !cat.includes('Fuzzy')) emoji = '🧩';
    else if (cat.includes('Fuzzy')) emoji = '☁️';
    else if (cat.includes('Expert') || cat.includes('Machine')) emoji = '🧠';
    else if (cat.includes('Natural') || cat.includes('NLP')) emoji = '🗣️';
    
    btn.innerHTML = `
      <span><span class="icon">${emoji}</span> ${cat} (${catQuestions.length})</span>
      <span class="arrow">→</span>
    `;
    btn.addEventListener('click', () => startQuiz(cat));
    categoryList.appendChild(btn);
  });
}

// Setup event listeners
function setupEventListeners() {
  btnCheckAnswer.addEventListener('click', handleCheckAnswer);
  btnToggleHint.addEventListener('click', showMultipleChoiceHint);
  btnNext.addEventListener('click', nextQuestion);
  btnRestart.addEventListener('click', resetToWelcome);
  btnBack.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit and return to the main menu? Progress will be lost.')) {
      resetToWelcome();
    }
  });
  
  // Allow Enter key to submit text answer
  textAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCheckAnswer();
    }
  });
}

// Start Quiz Session
function startQuiz(category) {
  state.selectedCategory = category;
  
  // Filter questions based on category selection
  let questionsPool = category 
    ? QUIZ_DATA.filter(q => q.group === category)
    : [...QUIZ_DATA];
    
  // Shuffle the selected questions
  state.currentQuestions = shuffleArray(questionsPool);
  state.currentIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.maxStreak = 0;
  state.incorrectAnswers = [];
  
  // UI transition
  welcomeScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  setTimeout(() => {
    quizScreen.classList.add('active');
    btnBack.style.display = 'flex';
    loadQuestion();
  }, 150);
}

// Load current question to UI
function loadQuestion() {
  state.answered = false;
  state.hintUsed = false;
  
  const question = state.currentQuestions[state.currentIndex];
  
  // Set question card info
  categoryBadge.textContent = question.group;
  questionText.textContent = question.question;
  
  // Update progress stats
  questionProgress.textContent = `Q: ${state.currentIndex + 1}/${state.currentQuestions.length}`;
  const progressPercent = ((state.currentIndex) / state.currentQuestions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
  
  // Reset Input Field
  textAnswerInput.value = '';
  textAnswerInput.disabled = false;
  textAnswerInput.placeholder = "Type your answer here...";
  textAnswerInput.className = 'text-input';
  btnCheckAnswer.disabled = false;
  
  // Hide Hint multiple choice options and reset hint toggle button
  hintMcContainer.style.display = 'none';
  btnToggleHint.style.display = 'inline-flex';
  btnToggleHint.disabled = false;
  
  // Hide feedback & next navigation button
  feedbackPanel.style.display = 'none';
  feedbackPanel.className = 'feedback-panel';
  btnNext.style.display = 'none';
  
  // Update Streak Counter display
  updateStreakDisplay();
}

// Update streak UI
function updateStreakDisplay() {
  if (state.streak > 0) {
    streakVal.textContent = state.streak;
    streakCounter.style.display = 'flex';
  } else {
    streakCounter.style.display = 'none';
  }
}

// Handle Check Answer (Text Input submission)
function handleCheckAnswer() {
  const userInput = textAnswerInput.value.trim();
  if (!userInput) return;
  
  const question = state.currentQuestions[state.currentIndex];
  const isCorrect = fuzzyMatch(userInput, question.answer, question.question);
  
  if (isCorrect) {
    // Disable inputs
    textAnswerInput.disabled = true;
    btnCheckAnswer.disabled = true;
    btnToggleHint.style.display = 'none';
    
    // Update Score/Streak
    state.score++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    updateStreakDisplay();
    
    // Correct Feedback CSS
    textAnswerInput.classList.add('correct');
    
    // Show feedback panel
    feedbackTitle.textContent = "✨ Correct! Perfect Match";
    feedbackText.innerHTML = `Your answer matches the expected concept: <strong>${question.answer}</strong>`;
    feedbackPanel.style.display = 'block';
    feedbackPanel.classList.add('correct-feedback');
    
    state.answered = true;
    btnNext.style.display = 'inline-flex';
  } else {
    // Shake question card to show error
    triggerShake();
    
    // Change input box to styling alert without locking it
    textAnswerInput.classList.add('incorrect');
    setTimeout(() => {
      textAnswerInput.classList.remove('incorrect');
    }, 1000);
    
    // Suggest the hint
    textAnswerInput.placeholder = "Not quite correct. Try again or check the hint!";
    textAnswerInput.value = '';
  }
}

// Show Multiple Choice Hint
function showMultipleChoiceHint() {
  state.hintUsed = true;
  btnToggleHint.disabled = true;
  
  const question = state.currentQuestions[state.currentIndex];
  
  // Dynamic Distractors generation
  // Select other questions from same group if possible
  let distractorsPool = QUIZ_DATA.filter(q => q.group === question.group && q.id !== question.id);
  
  // If not enough questions in this category, use general pool
  if (distractorsPool.length < 4) {
    distractorsPool = QUIZ_DATA.filter(q => q.id !== question.id);
  }
  
  // Shuffle distractors and pick 4 unique answers
  const shuffledPool = shuffleArray(distractorsPool);
  const distractors = [];
  const selectedAnswers = new Set([question.answer]);
  
  for (let i = 0; i < shuffledPool.length; i++) {
    const ans = shuffledPool[i].answer;
    if (!selectedAnswers.has(ans)) {
      distractors.push(ans);
      selectedAnswers.add(ans);
    }
    if (distractors.length === 4) break;
  }
  
  // Prepare choices array (1 correct + 4 incorrect)
  const choices = [
    { text: question.answer, isCorrect: true },
    ...distractors.map(d => ({ text: d, isCorrect: false }))
  ];
  
  // Shuffle choices so correct one isn't always first
  const shuffledChoices = shuffleArray(choices);
  
  // Render options as items
  mcOptionsList.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D', 'E'];
  
  shuffledChoices.forEach((choice, idx) => {
    const optBtn = document.createElement('button');
    optBtn.className = 'mc-option';
    optBtn.innerHTML = `
      <div class="option-prefix">${letters[idx]}</div>
      <div class="option-content">${choice.text}</div>
    `;
    optBtn.addEventListener('click', () => handleOptionSelection(optBtn, choice.isCorrect));
    mcOptionsList.appendChild(optBtn);
  });
  
  // Show container
  hintMcContainer.style.display = 'flex';
  
  // Smooth scroll to options container
  setTimeout(() => {
    hintMcContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// Handle MC Hint selection
function handleOptionSelection(selectedBtn, isCorrect) {
  const question = state.currentQuestions[state.currentIndex];
  const allOptions = mcOptionsList.querySelectorAll('.mc-option');
  
  // Disable all options & inputs
  allOptions.forEach(opt => opt.classList.add('disabled'));
  textAnswerInput.disabled = true;
  btnCheckAnswer.disabled = true;
  btnToggleHint.style.display = 'none';
  
  if (isCorrect) {
    selectedBtn.classList.add('correct');
    
    state.score++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    updateStreakDisplay();
    
    feedbackTitle.textContent = "🎉 Correct Answer!";
    feedbackText.innerHTML = `Excellent job! The correct concept is indeed: <strong>${question.answer}</strong>`;
    feedbackPanel.style.display = 'block';
    feedbackPanel.classList.add('correct-feedback');
  } else {
    selectedBtn.classList.add('incorrect');
    
    // Highlight correct answer
    allOptions.forEach(opt => {
      const isCorrectText = opt.querySelector('.option-content').textContent === question.answer;
      if (isCorrectText) {
        opt.classList.add('correct');
      }
    });
    
    triggerShake();
    
    // Reset streak and record incorrect answer
    state.streak = 0;
    updateStreakDisplay();
    state.incorrectAnswers.push(question);
    
    feedbackTitle.textContent = "❌ Incorrect Option";
    feedbackText.innerHTML = `The correct answer was: <strong>${question.answer}</strong>`;
    feedbackPanel.style.display = 'block';
    feedbackPanel.classList.add('incorrect-feedback');
  }
  
  state.answered = true;
  btnNext.style.display = 'inline-flex';
}

// Next Question Navigation
function nextQuestion() {
  // If the user skipped or didn't answer via hint, and it's marked incorrect, add to list
  if (!state.answered) {
    state.incorrectAnswers.push(state.currentQuestions[state.currentIndex]);
    state.streak = 0;
  }
  
  state.currentIndex++;
  
  if (state.currentIndex < state.currentQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Show Results Dashboard
function showResults() {
  quizScreen.classList.remove('active');
  btnBack.style.display = 'none';
  
  // Calculate stats
  const total = state.currentQuestions.length;
  const accuracy = total > 0 ? Math.round((state.score / total) * 100) : 0;
  
  resultsScoreVal.textContent = `${state.score}/${total}`;
  resultsStreakVal.textContent = state.maxStreak;
  
  // Greeting message based on score
  if (accuracy === 100) {
    resultsGreeting.textContent = "🏆 Perfect Score! You are an AI mastermind!";
  } else if (accuracy >= 80) {
    resultsGreeting.textContent = "🌟 Excellent score! Exceptional AI comprehension.";
  } else if (accuracy >= 50) {
    resultsGreeting.textContent = "👍 Good effort! Keep learning to master AI.";
  } else {
    resultsGreeting.textContent = "📚 Keep study, review and try again to improve!";
  }
  
  // Display incorrect review panel if any
  if (state.incorrectAnswers.length > 0) {
    reviewList.innerHTML = '';
    state.incorrectAnswers.forEach(q => {
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = `
        <div class="review-question">${q.question}</div>
        <div class="review-answer">${q.answer}</div>
      `;
      reviewList.appendChild(item);
    });
    reviewSection.style.display = 'block';
  } else {
    reviewSection.style.display = 'none';
  }
  
  // Display screen
  resultsScreen.classList.add('active');
  
  // Animate Circular Progress Bar
  // Circumference of radius 70 is 439.82 -> round to 440
  fgCircle.style.strokeDashoffset = 440;
  accuracyPercent.textContent = '0%';
  
  setTimeout(() => {
    const offset = 440 - (440 * accuracy / 100);
    fgCircle.style.strokeDashoffset = offset;
    
    // Count up accuracy label
    let currentPct = 0;
    const interval = setInterval(() => {
      if (currentPct >= accuracy) {
        accuracyPercent.textContent = `${accuracy}%`;
        clearInterval(interval);
      } else {
        currentPct++;
        accuracyPercent.textContent = `${currentPct}%`;
      }
    }, 15);
  }, 300);
}

// Reset Quiz to Welcome Selection
function resetToWelcome() {
  quizScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  btnBack.style.display = 'none';
  
  setTimeout(() => {
    welcomeScreen.classList.add('active');
  }, 150);
}

// Fuzzy matching text validation helper
function fuzzyMatch(userInput, targetAnswer, questionText) {
  // Normalize strings helper (lowercase, remove punctuation, trim extra space)
  const norm = (str) => {
    return str
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };
  
  const user = norm(userInput);
  const target = norm(targetAnswer);
  
  if (user === target) return true;
  
  // Standard Acronym checks mapping (useful for quick abbreviations)
  const acronyms = {
    "bfs": ["breadthfirst search", "breadth first search"],
    "dfs": ["depthfirst search", "depth first search"],
    "fol": ["firstorder logic", "first order logic"],
    "nlp": ["natural language processing"],
    "cnf": ["conjunctive normal form"],
    "csp": ["constraint satisfaction problems", "constraint satisfaction problem"],
    "rbl": ["relevancebased learning", "relevance based learning"],
    "ai": ["artificial intelligence"],
    "ml": ["machine learning"],
    "kb": ["knowledge base"]
  };
  
  for (const [key, vals] of Object.entries(acronyms)) {
    if (user === key && vals.some(v => target.includes(v))) return true;
  }
  
  // Specific questions standard shortcut evaluations
  // Q14: BFS
  if (target.includes("breadthfirst search") && user === "bfs") return true;
  // Q15: DFS
  if (target.includes("depthfirst search") && user === "dfs") return true;
  // Q16: Iterative Deepening
  if (target.includes("iterative deepening") && user.includes("iterative deepening")) return true;
  // Q18: Goal Formulation
  if (target === "a goal formulation" && (user === "goal formulation" || user === "a")) return true;
  // Q26: CNF
  if (target.includes("conjunctive normal form") && user === "cnf") return true;
  // Q33: AO* Search
  if (target.includes("ao* search") && (user === "ao*" || user === "ao* search")) return true;
  // Q36: Knowledge base
  if (target === "knowledge base" && user === "kb") return true;
  // Q39: Modus Ponens
  if (target.includes("modus ponens") && user.includes("modus ponens")) return true;
  // Q41: CNF expression negation
  if (target.includes("not p and not q") && user.includes("not p")) return true;
  // Q42: First-Order Logic
  if (target.includes("firstorder logic") && user === "fol") return true;
  // Q54: CLIPS and PROLOG
  if (user.includes("clips") && user.includes("prolog")) return true;
  // Q56: Subset
  if (user.includes("subset") && target.includes("subset")) return true;
  // Q61: Three
  if (target.includes("three") && (user === "three" || user === "3" || user === "c")) return true;
  // Q64: Set of predefined rules
  if (target.includes("set of predefined rules") && (user.includes("predefined rules") || user === "b")) return true;
  // Q68: Image Classification
  if (target.includes("image classification") && (user.includes("image classification") || user === "d")) return true;

  // Keyword validation for longer answers:
  // If target answer is long, check if user typed some crucial key terms
  const targetWords = target.split(' ');
  if (targetWords.length >= 4) {
    const userWords = user.split(' ');
    // Filter out common stopwords from target
    const stopwords = new Set(["is", "the", "a", "an", "and", "or", "in", "of", "to", "for", "with", "by", "that", "it", "from", "uses", "only", "on"]);
    const criticalTargetWords = targetWords.filter(w => !stopwords.has(w));
    
    // Count matches
    let matches = 0;
    criticalTargetWords.forEach(tw => {
      // Allow plural/singular variation or substring match
      if (userWords.some(uw => uw.includes(tw) || tw.includes(uw))) {
        matches++;
      }
    });
    
    // If user got 75% of critical words, mark as correct
    const matchRatio = matches / criticalTargetWords.length;
    if (matchRatio >= 0.75) return true;
  }
  
  return false;
}

// Fisher-Yates array shuffling
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Trigger Shake effect on question card
function triggerShake() {
  questionCard.classList.add('card-shake');
  setTimeout(() => {
    questionCard.classList.remove('card-shake');
  }, 400);
}
