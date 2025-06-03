let workDuration = 25 * 60; // seconds
let breakDuration = 5 * 60; // seconds
let longBreakDuration = 15 * 60; // after 4 sessions
let sessions = 0;
let timer = workDuration;
let isRunning = false;
let isBreak = false;
let intervalId;

const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');
  timerEl.textContent = `${minutes}:${seconds}`;
}

function tick() {
  if (timer > 0) {
    timer--;
    updateDisplay();
  } else {
    clearInterval(intervalId);
    isRunning = false;
    handleSessionEnd();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  intervalId = setInterval(tick, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(intervalId);
}

function resetTimer() {
  pauseTimer();
  isBreak = false;
  sessions = 0;
  timer = workDuration;
  updateDisplay();
}

function handleSessionEnd() {
  if (isBreak) {
    sessions++;
    isBreak = false;
    timer = (sessions % 4 === 0) ? longBreakDuration : workDuration;
  } else {
    isBreak = true;
    timer = breakDuration;
  }
  updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
