console.log("Pomodoro Zen loaded");
let timer;
let isRunning = false;
let timeLeft = 25 * 60; // 25 minutes in seconds
const display = document.querySelector("h1");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
function startTimer() {
    if (isRunning) return;
    isRunning = true; 
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            alert("Time's up! Take a break.");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay();
}
startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);
updateDisplay(); 
