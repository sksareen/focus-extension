let sessionActive = false;
let startTime;
let timerInterval;

// Function to start the timer
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const timeElapsed = new Date(currentTime - startTime);
    const minutes = timeElapsed.getUTCMinutes();
    const seconds = timeElapsed.getUTCSeconds();
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateTimerDisplay(formattedTime);
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  const endTime = new Date();
  updateTimerDisplay("00:00");
  return { startTime, endTime };
}

// Function to update the timer display on the UI
function updateTimerDisplay(time) {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) {
    timerDisplay.textContent = time;
  }
}

// Function to toggle the start and stop of the focus session
function toggleStartStop() {
  sessionActive = !sessionActive;
  if (sessionActive) {
    startTimer();
    logEvent('Start');
  } else {
    const { startTime, endTime } = stopTimer();
    logSession(startTime, endTime);
    logEvent('End');
    getSessionSummary();
  }
}

// Placeholder functions for logging events and sessions, and getting session summary
function logEvent(eventType) {
  // Implementation for logging the event
}

function logSession(start, end) {
  // Implementation for logging the session
}

function getSessionSummary() {
  // Implementation for getting the session summary
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'toggleSession') {
    toggleStartStop();
  }
});