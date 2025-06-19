let timer;
let timeLeft = 1500; // 初期値: 25分
let defaultTime = 1500;
let isBreak = false;

const timerDisplay = document.getElementById('timerDisplay');
const timerInput = document.getElementById('timerInput');
const setTimerBtn = document.getElementById('setTimerBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const presetBtns = document.querySelectorAll('.preset-btn');
const bgSelectDiv = document.querySelector('.bg-select');

// 背景色ボタン
const bgColors = [
  { name: '', value: '#f5f5f5' },
  { name: '', value: '#ffffff' },
  { name: '', value: '#e3f2fd' },
  { name: '', value: '#fffde7' },
  { name: '', value: '#fce4ec' },
  { name: '', value: '#e8f5e9' },
  { name: '', value: '#212121' }
];

// 癒し画像のURL（お好きな画像に変更可）
const relaxImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

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
      if (!isBreak) {
        // 作業タイマー終了→休憩タイマー開始
        startBreak();
      } else {
        // 休憩終了→元の状態に戻す
        endBreak();
      }
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
  if (isBreak) endBreak();
}

setTimerBtn.onclick = () => {
  const minutes = parseInt(timerInput.value, 10);
  if (minutes > 0) {
    defaultTime = minutes * 60;
    timeLeft = defaultTime;
    updateDisplay();
    stopTimer();
    if (isBreak) endBreak();
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
    if (isBreak) endBreak();
  };
});

startBtn.onclick = startTimer;
stopBtn.onclick = stopTimer;
resetBtn.onclick = resetTimer;

// 背景色ボタン生成
if (bgSelectDiv) {
  bgSelectDiv.innerHTML = '<span style="margin-right:8px;">背景色:</span>';
  bgColors.forEach(color => {
    const btn = document.createElement('button');
    btn.textContent = color.name;
    btn.className = 'flat-btn bg-btn';
    btn.style.background = color.value;
    btn.style.color = (color.value === '#212121') ? '#fff' : '#222';
    btn.style.marginRight = '4px';
    btn.style.height = '32px';
    btn.style.width = '32px';
    btn.onclick = () => {
      if (!isBreak) document.body.style.background = color.value;
    };
    bgSelectDiv.appendChild(btn);
  });
}

// 休憩タイマー開始
function startBreak() {
  isBreak = true;
  timeLeft = 300; // 5分
  updateDisplay();
  // 背景を癒し画像に
  document.body.style.background = `url('${relaxImage}') center/cover no-repeat fixed`;
  // ボタン類を無効化
  setTimerBtn.disabled = true;
  presetBtns.forEach(btn => btn.disabled = true);
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
  if (bgSelectDiv) bgSelectDiv.style.opacity = 0.5;
  startTimer();
}

// 休憩終了処理
function endBreak() {
  isBreak = false;
  timeLeft = defaultTime;
  updateDisplay();
  // 背景をリセット（標準色）
  document.body.style.background = bgColors[0].value;
  // ボタン類を有効化
  setTimerBtn.disabled = false;
  presetBtns.forEach(btn => btn.disabled = false);
  startBtn.disabled = false;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
  if (bgSelectDiv) bgSelectDiv.style.opacity = 1;
}

updateDisplay();