document.addEventListener('DOMContentLoaded', function() {
    const startStopButton = document.getElementById('startStopButton');
    const timerDisplay = document.getElementById('timerDisplay');
    const sessionSummary = document.getElementById('sessionSummary');
    let sessionActive = false;
    let currentSessionId = null;
    let startTime = null;
    let endTime = null;
    let timerInterval = null;

    function updateTimerDisplay() {
        const now = new Date();
        const elapsed = now - startTime;
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function toggleStartStop() {
        if (!sessionActive) {
            sessionActive = true;
            currentSessionId = Date.now().toString();
            startTime = new Date();
            logSession(currentSessionId, startTime);
            logEvent(currentSessionId, 'Start', startTime);
            timerInterval = setInterval(updateTimerDisplay, 1000);
            startStopButton.textContent = 'End';
        } else {
            sessionActive = false;
            endTime = new Date();
            clearInterval(timerInterval);
            logEvent(currentSessionId, 'End', endTime);
            getSessionSummary(currentSessionId);
            startStopButton.textContent = 'Start';
        }
    }

    function logSession(sessionId, startTime) {
        const session = { sessionId, startTime, endTime: null, comments: [] };
        chrome.storage.local.get('sessions', function(data) {
            const sessions = data.sessions || [];
            sessions.push(session);
            chrome.storage.local.set({ sessions });
        });
    }

    function logEvent(sessionId, eventType, timestamp) {
        const event = { eventId: Date.now().toString(), sessionId, eventType, timestamp };
        chrome.storage.local.get('events', function(data) {
            const events = data.events || [];
            events.push(event);
            chrome.storage.local.set({ events });
        });
    }

    function getSessionSummary(sessionId) {
        chrome.storage.local.get('sessions', function(data) {
            const session = data.sessions.find(s => s.sessionId === sessionId);
            if (session) {
                session.endTime = endTime;
                const summary = `Session ID: ${session.sessionId}\nStart: ${session.startTime}\nEnd: ${session.endTime}`;
                sessionSummary.textContent = summary;
            }
        });
    }

    startStopButton.addEventListener('click', toggleStartStop);
});