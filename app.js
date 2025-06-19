let timer;
let timeLeft = 300; // 初期値: 5分
let defaultTime = 300;

const timerDisplay = document.getElementById('timerDisplay');
const timerInput = document.getElementById('timerInput');
const setTimerBtn = document.getElementById('setTimerBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const presetBtns = document.querySelectorAll('.preset-btn');

function updateDisplay() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      alert('時間切れです！');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  timeLeft = defaultTime;
  updateDisplay();
  stopTimer();
}

setTimerBtn.onclick = () => {
  const minutes = parseInt(timerInput.value, 10);
  if (minutes > 0) {
    defaultTime = minutes * 60;
    timeLeft = defaultTime;
    updateDisplay();
    stopTimer();
  }
};

presetBtns.forEach(btn => {
  btn.onclick = () => {
    const minutes = parseInt(btn.getAttribute('data-min'), 10);
    timerInput.value = minutes;
    defaultTime = minutes * 60;
    timeLeft = defaultTime;
    updateDisplay();
    stopTimer();
  };
});

startBtn.onclick = startTimer;
stopBtn.onclick = stopTimer;
resetBtn.onclick = resetTimer;

updateDisplay();