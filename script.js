// State Management
const state = {
    mode: 'pomodoro', // 'pomodoro', 'shortBreak', 'longBreak'
    timeLeft: 25 * 60,
    isActive: false,
    timerId: null,
    stats: {
        sessions: 0,
        totalTime: 0 // in seconds
    },
    settings: {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
        autoStartBreaks: false,
        autoStartPomodoros: false
    }
};

// DOM Elements
const elements = {
    timer: document.getElementById('timer'),
    modeButtons: document.querySelectorAll('.mode-btn'),
    startPauseBtn: document.getElementById('start-pause'),
    resetBtn: document.getElementById('reset'),
    alarm: document.getElementById('alarma'),
    themeToggle: document.getElementById('theme-toggle'),
    statsBtn: document.getElementById('stats-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    statsModal: document.getElementById('stats-modal'),
    closeModals: document.querySelectorAll('.close-modal'),
    inputs: {
        pomodoro: document.getElementById('pomodoro-time'),
        shortBreak: document.getElementById('short-break-time'),
        longBreak: document.getElementById('long-break-time'),
        autoBreak: document.getElementById('auto-start-breaks'),
        autoPomodoro: document.getElementById('auto-start-pomodoros'),
        task: document.getElementById('current-task')
    },
    stats: {
        sessions: document.getElementById('stat-total-sessions'),
        totalTime: document.getElementById('stat-total-time')
    }
};

// Initialization
function init() {
    loadSettings();
    loadStats();

    // Sync timeLeft with loaded settings (if fresh load)
    state.timeLeft = state.settings[state.mode] * 60;

    setupEventListeners();
    updateDisplay();
    updateModeUI();

    // Check system preference for dark mode (Optional: user can manually toggle)
    // We default to Hacker mode (Dark) as per request, so valid to ignore system pref or handle gently.
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    //     document.body.classList.add('light-mode');
    // }
}

// Timer Logic
function tick() {
    state.timeLeft--;
    updateDisplay();
    document.title = `${formatTime(state.timeLeft)} - Pomodoro Zen`;

    if (state.timeLeft <= 0) {
        completeSession();
    }
}

function startTimer() {
    if (state.isActive) return;

    state.isActive = true;
    elements.startPauseBtn.textContent = 'Pause';
    elements.startPauseBtn.classList.add('active'); // Style update

    state.timerId = setInterval(tick, 1000);
}

function pauseTimer() {
    if (!state.isActive) return;

    state.isActive = false;
    elements.startPauseBtn.textContent = 'Start';
    elements.startPauseBtn.classList.remove('active');

    clearInterval(state.timerId);
    state.timerId = null;
}

function resetTimer() {
    pauseTimer();
    state.timeLeft = state.settings[state.mode] * 60;
    updateDisplay();
    document.title = 'Pomodoro Zen';
}

function completeSession() {
    pauseTimer();
    elements.alarm.play().catch(e => console.log('Audio error:', e));

    // Update Stats
    if (state.mode === 'pomodoro') {
        state.stats.sessions++;
        state.stats.totalTime += state.settings.pomodoro * 60;
        saveStats();
        updateStatsUI();

        notifyUser('Pomodoro Finished!', 'Time for a break.');
    } else {
        notifyUser('Break Finished!', 'Ready to work?');
    }

    // Auto-switch logic
    if (state.mode === 'pomodoro') {
        // Simple logic: Alternate between short breaks. User selects long break manually for now or we could add count logic.
        switchMode('shortBreak');
        if (state.settings.autoStartBreaks) {
            startTimer();
        }
    } else {
        switchMode('pomodoro');
        if (state.settings.autoStartPomodoros) {
            startTimer();
        }
    }
}

function switchMode(newMode) {
    state.mode = newMode;
    state.timeLeft = state.settings[newMode] * 60;

    updateModeUI();
    updateDisplay();
    pauseTimer(); // Always pause on manual switch unless auto-triggered
}

// UI Updates
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateDisplay() {
    elements.timer.textContent = formatTime(state.timeLeft);
}

function updateModeUI() {
    elements.modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === state.mode);
    });

    // Optional: Change accent color per mode?
    // For now, consistent UI.
}

function updateStatsUI() {
    elements.stats.sessions.textContent = state.stats.sessions;
    const hours = (state.stats.totalTime / 3600).toFixed(1);
    elements.stats.totalTime.textContent = `${hours}h`;
}

// Notifications
function notifyUser(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: 'favicon.ico' });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

// Persistence
function saveSettings() {
    localStorage.setItem('pomodoroSettings', JSON.stringify(state.settings));
}

function loadSettings() {
    const saved = localStorage.getItem('pomodoroSettings');
    if (saved) {
        state.settings = { ...state.settings, ...JSON.parse(saved) };

        // Update input values
        elements.inputs.pomodoro.value = state.settings.pomodoro;
        elements.inputs.shortBreak.value = state.settings.shortBreak;
        elements.inputs.longBreak.value = state.settings.longBreak;
        elements.inputs.autoBreak.checked = state.settings.autoStartBreaks;
        elements.inputs.autoPomodoro.checked = state.settings.autoStartPomodoros;
    }
}

function saveStats() {
    localStorage.setItem('pomodoroStats', JSON.stringify(state.stats));
}

function loadStats() {
    const saved = localStorage.getItem('pomodoroStats');
    if (saved) {
        state.stats = { ...state.stats, ...JSON.parse(saved) };
        updateStatsUI();
    }
}

// Event Listeners
function setupEventListeners() {
    // Timer Controls
    elements.startPauseBtn.addEventListener('click', () => {
        if (state.isActive) pauseTimer();
        else startTimer();
    });

    elements.resetBtn.addEventListener('click', resetTimer);

    // Mode Buttons
    elements.modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => switchMode(e.target.dataset.mode));
    });

    // Theme Toggle
    elements.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });

    // Modals
    elements.settingsBtn.addEventListener('click', () => {
        elements.settingsModal.classList.add('visible');
    });

    elements.statsBtn.addEventListener('click', () => {
        elements.statsModal.classList.add('visible');
    });

    elements.closeModals.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('visible');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('visible');
        }
    });

    // Settings Inputs
    const updateSettingsFromInput = () => {
        state.settings.pomodoro = parseInt(elements.inputs.pomodoro.value) || 25;
        state.settings.shortBreak = parseInt(elements.inputs.shortBreak.value) || 5;
        state.settings.longBreak = parseInt(elements.inputs.longBreak.value) || 15;
        state.settings.autoStartBreaks = elements.inputs.autoBreak.checked;
        state.settings.autoStartPomodoros = elements.inputs.autoPomodoro.checked;

        saveSettings();

        if (!state.isActive) {
            // Update time left if we changed current mode's duration
            state.timeLeft = state.settings[state.mode] * 60;
            updateDisplay();
        }
    };

    Object.values(elements.inputs).forEach(input => {
        input.addEventListener('change', updateSettingsFromInput);
    });

    // Request permissions on first interaction
    document.addEventListener('click', () => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, { once: true });
}

// Run
init();