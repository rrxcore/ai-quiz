// AI Quiz Application Logic

// ─── Audio System ───
const AudioSystem = {
  enabled: true,
  ctx: null,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.enabled = false;
    }
  },

  play(type) {
    if (!this.enabled) return;
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      gain.gain.value = 0.15;

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523, this.ctx.currentTime);       // C5
        osc.frequency.setValueAtTime(659, this.ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(784, this.ctx.currentTime + 0.2); // G5
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.4);
      } else if (type === 'incorrect') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.setValueAtTime(200, this.ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.value = 0.06;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.08);
      }
    } catch (e) { /* silence errors */ }
  },

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled && !this.ctx) this.init();
    return this.enabled;
  }
};

// ─── Local Storage Manager ───
const Storage = {
  KEY: 'ai_quiz_records',

  getRecords() {
    try {
      const data = localStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  getBestScore(category) {
    const records = this.getRecords();
    const key = category || '__mixed__';
    return records[key] || null;
  },

  saveScore(category, score, total, accuracy, maxStreak, timeTaken) {
    const records = this.getRecords();
    const key = category || '__mixed__';
    const existing = records[key];
    let isNewRecord = false;

    if (!existing || accuracy > existing.accuracy || (accuracy === existing.accuracy && timeTaken < existing.timeTaken)) {
      records[key] = { score, total, accuracy, maxStreak, timeTaken, date: new Date().toISOString() };
      isNewRecord = !existing || accuracy > existing.accuracy;
    }

    try {
      localStorage.setItem(this.KEY, JSON.stringify(records));
    } catch (e) { /* storage full */ }

    return isNewRecord;
  }
};

// ─── Quiz State ───
let state = {
  currentQuestions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  incorrectAnswers: [],
  selectedCategory: null,
  answered: false,
  hintUsed: false,
  timerInterval: null,
  elapsedSeconds: 0
};

// ─── DOM Elements ───
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

const timerContainer = document.getElementById('timer-container');
const timerDisplay = document.getElementById('timer-display');
const btnSound = document.getElementById('btn-sound');

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
const btnSkip = document.getElementById('btn-skip');

const resultsGreeting = document.getElementById('results-greeting');
const fgCircle = document.getElementById('fg-circle');
const accuracyPercent = document.getElementById('accuracy-percent');
const resultsScoreVal = document.getElementById('results-score-val');
const resultsStreakVal = document.getElementById('results-streak-val');
const resultsTimeVal = document.getElementById('results-time-val');
const resultsBestVal = document.getElementById('results-best-val');
const newRecordBadge = document.getElementById('new-record-badge');
const reviewSection = document.getElementById('review-section');
const reviewList = document.getElementById('review-list');
const btnRestart = document.getElementById('btn-restart');

// ─── Initialize App ───
document.addEventListener('DOMContentLoaded', () => {
  AudioSystem.init();
  renderCategories();
  setupEventListeners();
});

// ─── Render categories on welcome screen ───
function renderCategories() {
  const categories = [...new Set(QUIZ_DATA.map(q => q.group))];

  categoryList.innerHTML = '';

  // 1. "Mixed All Topics" option
  const mixedBtn = document.createElement('button');
  mixedBtn.className = 'category-btn mixed';
  mixedBtn.innerHTML = `
    <span><span class="icon">✨</span> Mixed All Topics (${QUIZ_DATA.length} Questions)</span>
    <span class="arrow">→</span>
  `;
  mixedBtn.addEventListener('click', () => startQuiz(null));
  categoryList.appendChild(mixedBtn);

  // 2. Each category
  const emojiMap = [
    [/Agent/, '🤖'],
    [/Search/, '⚡'],
    [/Fuzzy/, '☁️'],
    [/Logic/, '🧩'],
    [/Expert|Machine/, '🧠'],
    [/Natural|NLP/, '🗣️']
  ];

  categories.forEach(cat => {
    const catQuestions = QUIZ_DATA.filter(q => q.group === cat);
    const btn = document.createElement('button');
    btn.className = 'category-btn';

    let emoji = '📚';
    for (const [regex, icon] of emojiMap) {
      if (regex.test(cat)) { emoji = icon; break; }
    }

    const best = Storage.getBestScore(cat);
    const bestLabel = best ? ` · Best: ${best.accuracy}%` : '';

    btn.innerHTML = `
      <span><span class="icon">${emoji}</span> ${cat} (${catQuestions.length}${bestLabel})</span>
      <span class="arrow">→</span>
    `;
    btn.addEventListener('click', () => startQuiz(cat));
    categoryList.appendChild(btn);
  });
}

// ─── Event Listeners ───
function setupEventListeners() {
  btnCheckAnswer.addEventListener('click', handleCheckAnswer);
  btnToggleHint.addEventListener('click', showMultipleChoiceHint);
  btnNext.addEventListener('click', nextQuestion);
  btnSkip.addEventListener('click', skipQuestion);
  btnRestart.addEventListener('click', resetToWelcome);
  btnBack.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit and return to the main menu? Progress will be lost.')) {
      resetToWelcome();
    }
  });

  // Sound toggle
  btnSound.addEventListener('click', () => {
    const enabled = AudioSystem.toggle();
    btnSound.textContent = enabled ? '🔊' : '🔇';
    if (enabled) AudioSystem.play('click');
  });

  // Enter key to submit text answer OR advance to next question
  textAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (state.answered) {
        nextQuestion();
      } else {
        handleCheckAnswer();
      }
    }
  });

  // Global keyboard shortcut: Enter/Space to advance when Next is visible
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && state.answered && document.activeElement !== textAnswerInput) {
      e.preventDefault();
      nextQuestion();
    }
  });
}

// ─── Timer ───
function startTimer() {
  state.elapsedSeconds = 0;
  timerDisplay.textContent = '0:00';
  timerContainer.classList.remove('warning');

  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.elapsedSeconds++;
    timerDisplay.textContent = formatTime(state.elapsedSeconds);

    // Warning flash when per-question time exceeds 30s
    const perQuestion = state.elapsedSeconds / (state.currentIndex + 1);
    if (perQuestion > 30 && !state.answered) {
      timerContainer.classList.add('warning');
    } else {
      timerContainer.classList.remove('warning');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ─── Start Quiz Session ───
function startQuiz(category) {
  state.selectedCategory = category;

  let questionsPool = category
    ? QUIZ_DATA.filter(q => q.group === category)
    : [...QUIZ_DATA];

  state.currentQuestions = shuffleArray(questionsPool);
  state.currentIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.maxStreak = 0;
  state.incorrectAnswers = [];

  welcomeScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  setTimeout(() => {
    quizScreen.classList.add('active');
    btnBack.style.display = 'flex';
    startTimer();
    loadQuestion();
  }, 150);
}

// ─── Load current question to UI ───
function loadQuestion() {
  state.answered = false;
  state.hintUsed = false;

  const question = state.currentQuestions[state.currentIndex];

  categoryBadge.textContent = question.group;
  questionText.textContent = question.question;

  // Progress
  questionProgress.textContent = `Q: ${state.currentIndex + 1}/${state.currentQuestions.length}`;
  const progressPercent = ((state.currentIndex) / state.currentQuestions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Reset input field
  textAnswerInput.value = '';
  textAnswerInput.disabled = false;
  textAnswerInput.placeholder = "Type your answer here...";
  textAnswerInput.className = 'text-input';
  btnCheckAnswer.disabled = false;

  // Reset hint
  hintMcContainer.style.display = 'none';
  btnToggleHint.style.display = 'inline-flex';
  btnToggleHint.disabled = false;

  // Reset feedback & nav
  feedbackPanel.style.display = 'none';
  feedbackPanel.className = 'feedback-panel';
  btnNext.style.display = 'none';
  btnSkip.style.display = 'inline-flex';

  // Reset timer warning
  timerContainer.classList.remove('warning');

  updateStreakDisplay();

  // Focus the input
  setTimeout(() => textAnswerInput.focus(), 100);
}

// ─── Update streak UI ───
function updateStreakDisplay() {
  if (state.streak > 0) {
    streakVal.textContent = state.streak;
    streakCounter.style.display = 'flex';
  } else {
    streakCounter.style.display = 'none';
  }
}

// ─── Handle Check Answer (Text Input) ───
function handleCheckAnswer() {
  if (state.answered) return;
  const userInput = textAnswerInput.value.trim();
  if (!userInput) return;

  const question = state.currentQuestions[state.currentIndex];
  const isCorrect = fuzzyMatch(userInput, question.answer, question.question);

  if (isCorrect) {
    textAnswerInput.disabled = true;
    btnCheckAnswer.disabled = true;
    btnToggleHint.style.display = 'none';
    btnSkip.style.display = 'none';

    state.score++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    updateStreakDisplay();

    textAnswerInput.classList.add('correct');
    AudioSystem.play('correct');

    feedbackTitle.textContent = "✨ Correct! Perfect Match";
    feedbackText.innerHTML = `Your answer matches the expected concept: <strong>${question.answer}</strong>`;
    feedbackPanel.style.display = 'block';
    feedbackPanel.classList.add('correct-feedback');

    state.answered = true;
    btnNext.style.display = 'inline-flex';
  } else {
    triggerShake();
    AudioSystem.play('incorrect');

    textAnswerInput.classList.add('incorrect');
    setTimeout(() => {
      textAnswerInput.classList.remove('incorrect');
    }, 1000);

    textAnswerInput.placeholder = "Not quite correct. Try again or check the hint!";
    textAnswerInput.value = '';
  }
}

// ─── Show Multiple Choice Hint ───
function showMultipleChoiceHint() {
  state.hintUsed = true;
  btnToggleHint.disabled = true;
  AudioSystem.play('click');

  const question = state.currentQuestions[state.currentIndex];

  // Prefer same-group distractors, fallback to general pool
  let distractorsPool = QUIZ_DATA.filter(q => q.group === question.group && q.id !== question.id);
  if (distractorsPool.length < 4) {
    distractorsPool = QUIZ_DATA.filter(q => q.id !== question.id);
  }

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

  const choices = [
    { text: question.answer, isCorrect: true },
    ...distractors.map(d => ({ text: d, isCorrect: false }))
  ];

  const shuffledChoices = shuffleArray(choices);

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

  hintMcContainer.style.display = 'flex';

  setTimeout(() => {
    hintMcContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// ─── Handle MC Hint selection ───
function handleOptionSelection(selectedBtn, isCorrect) {
  const question = state.currentQuestions[state.currentIndex];
  const allOptions = mcOptionsList.querySelectorAll('.mc-option');

  allOptions.forEach(opt => opt.classList.add('disabled'));
  textAnswerInput.disabled = true;
  btnCheckAnswer.disabled = true;
  btnToggleHint.style.display = 'none';
  btnSkip.style.display = 'none';

  if (isCorrect) {
    selectedBtn.classList.add('correct');

    state.score++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    updateStreakDisplay();

    AudioSystem.play('correct');

    feedbackTitle.textContent = "🎉 Correct Answer!";
    feedbackText.innerHTML = `Excellent job! The correct concept is indeed: <strong>${question.answer}</strong>`;
    feedbackPanel.style.display = 'block';
    feedbackPanel.classList.add('correct-feedback');
  } else {
    selectedBtn.classList.add('incorrect');

    // Highlight correct answer
    allOptions.forEach(opt => {
      const optText = opt.querySelector('.option-content').textContent;
      if (optText === question.answer) {
        opt.classList.add('correct');
      }
    });

    triggerShake();
    AudioSystem.play('incorrect');

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

// ─── Skip Question ───
function skipQuestion() {
  state.incorrectAnswers.push(state.currentQuestions[state.currentIndex]);
  state.streak = 0;
  updateStreakDisplay();
  state.answered = true; // mark as handled
  advanceQuestion();
}

// ─── Next Question Navigation ───
function nextQuestion() {
  if (!state.answered) {
    state.incorrectAnswers.push(state.currentQuestions[state.currentIndex]);
    state.streak = 0;
  }
  advanceQuestion();
}

function advanceQuestion() {
  state.currentIndex++;

  if (state.currentIndex < state.currentQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// ─── Show Results Dashboard ───
function showResults() {
  stopTimer();
  quizScreen.classList.remove('active');
  btnBack.style.display = 'none';

  const total = state.currentQuestions.length;
  const accuracy = total > 0 ? Math.round((state.score / total) * 100) : 0;

  resultsScoreVal.textContent = `${state.score}/${total}`;
  resultsStreakVal.textContent = state.maxStreak;
  resultsTimeVal.textContent = formatTime(state.elapsedSeconds);

  // Save score and check for new record
  const isNewRecord = Storage.saveScore(
    state.selectedCategory, state.score, total, accuracy, state.maxStreak, state.elapsedSeconds
  );

  const best = Storage.getBestScore(state.selectedCategory);
  if (best) {
    resultsBestVal.textContent = `${best.accuracy}%`;
  } else {
    resultsBestVal.textContent = `${accuracy}%`;
  }

  if (isNewRecord) {
    newRecordBadge.style.display = 'block';
  } else {
    newRecordBadge.style.display = 'none';
  }

  // Greeting message based on score
  if (accuracy === 100) {
    resultsGreeting.textContent = "🏆 Perfect Score! You are an AI mastermind!";
  } else if (accuracy >= 80) {
    resultsGreeting.textContent = "🌟 Excellent score! Exceptional AI comprehension.";
  } else if (accuracy >= 50) {
    resultsGreeting.textContent = "👍 Good effort! Keep learning to master AI.";
  } else {
    resultsGreeting.textContent = "📚 Keep studying, review and try again to improve!";
  }

  // Show incorrect questions review
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

  resultsScreen.classList.add('active');

  // Animate circular progress
  fgCircle.style.strokeDashoffset = 440;
  accuracyPercent.textContent = '0%';

  setTimeout(() => {
    const offset = 440 - (440 * accuracy / 100);
    fgCircle.style.strokeDashoffset = offset;

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

// ─── Reset Quiz to Welcome ───
function resetToWelcome() {
  stopTimer();
  quizScreen.classList.remove('active');
  resultsScreen.classList.remove('active');
  btnBack.style.display = 'none';

  setTimeout(() => {
    renderCategories(); // re-render to show updated best scores
    welcomeScreen.classList.add('active');
  }, 150);
}

// ─── Fuzzy Matching ───
function fuzzyMatch(userInput, targetAnswer, questionText) {
  // Normalize: lowercase, remove punctuation EXCEPT *, trim whitespace
  const norm = (str) => {
    return str
      .toLowerCase()
      .replace(/[.,\/#!$%\^&;:{}=\-_`~()?'"→]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const user = norm(userInput);
  const target = norm(targetAnswer);

  if (user === target) return true;

  // Acronym mapping
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
    "kb": ["knowledge base"],
    "ao*": ["ao* search", "heuristic search algorithm for andor graphs"]
  };

  for (const [key, vals] of Object.entries(acronyms)) {
    if (user === key && vals.some(v => target.includes(v))) return true;
  }

  // MCQ shortcut answers (single letter answers for MCQ-style questions)
  const mcqShortcuts = {
    "a": ["a goal formulation"],
    "b": ["b set of predefined rules"],
    "c": ["c three"],
    "d": ["d image classification"]
  };

  for (const [letter, vals] of Object.entries(mcqShortcuts)) {
    if (user === letter && vals.some(v => target.includes(v))) return true;
  }

  // Specific keyword matches for common typed answers
  if (target.includes("modus ponens") && user.includes("modus ponens")) return true;
  if (target.includes("iterative deepening") && user.includes("iterative deepening")) return true;
  if (user.includes("clips") && user.includes("prolog") && target.includes("clips")) return true;
  if (user.includes("subset") && target.includes("subset")) return true;
  if (user.includes("predefined rules") && target.includes("predefined rules")) return true;
  if (user.includes("image classification") && target.includes("image classification")) return true;
  if (target.includes("three") && (user === "three" || user === "3")) return true;

  // Keyword-based scoring for longer answers
  const targetWords = target.split(' ');
  if (targetWords.length >= 4) {
    const userWords = user.split(' ');
    const stopwords = new Set([
      "is", "the", "a", "an", "and", "or", "in", "of", "to", "for",
      "with", "by", "that", "it", "from", "uses", "only", "on", "can", "be"
    ]);
    const criticalTargetWords = targetWords.filter(w => !stopwords.has(w) && w.length > 1);

    let matches = 0;
    criticalTargetWords.forEach(tw => {
      if (userWords.some(uw => uw.includes(tw) || tw.includes(uw))) {
        matches++;
      }
    });

    const matchRatio = criticalTargetWords.length > 0 ? matches / criticalTargetWords.length : 0;
    if (matchRatio >= 0.75) return true;
  }

  return false;
}

// ─── Fisher-Yates Shuffle ───
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Shake Effect ───
function triggerShake() {
  questionCard.classList.add('card-shake');
  setTimeout(() => {
    questionCard.classList.remove('card-shake');
  }, 400);
}
