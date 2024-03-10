// options.js

document.addEventListener('DOMContentLoaded', function() {
  const startStopButton = document.getElementById('startStopButton');
  const sessionTable = document.getElementById('sessionTable');
  const eventsTable = document.getElementById('eventsTable');
  const sessionSummary = document.getElementById('sessionSummary');

  // Load and display session data
  function loadSessions() {
    chrome.storage.local.get(['sessions'], function(result) {
      const sessions = result.sessions || [];
      renderSessionTable(sessions);
    });
  }

  // Load and display event data
  function loadEvents() {
    chrome.storage.local.get(['events'], function(result) {
      const events = result.events || [];
      renderEventsTable(events);
    });
  }

  // Load and display the last session summary
  function loadLastSessionSummary() {
    chrome.storage.local.get(['sessions'], function(result) {
      const sessions = result.sessions || [];
      const lastSession = sessions[sessions.length - 1];
      if (lastSession) {
        sessionSummary.textContent = `Last session ended at: ${lastSession.endTime}`;
      }
    });
  }

  // Render the session table
  function renderSessionTable(sessions) {
    sessionTable.innerHTML = '';
    sessions.forEach(session => {
      const row = sessionTable.insertRow();
      row.insertCell(0).textContent = session.sessionId;
      row.insertCell(1).textContent = session.startTime;
      row.insertCell(2).textContent = session.endTime;
      row.insertCell(3).textContent = session.comments.length;
    });
  }

  // Render the events table
  function renderEventsTable(events) {
    eventsTable.innerHTML = '';
    events.forEach(event => {
      const row = eventsTable.insertRow();
      row.insertCell(0).textContent = event.eventId;
      row.insertCell(1).textContent = event.sessionId;
      row.insertCell(2).textContent = event.eventType;
      row.insertCell(3).textContent = event.timestamp;
    });
  }

  // Event listeners
  startStopButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({ message: 'toggleSession' });
  });

  // Load data when options page is opened
  loadSessions();
  loadEvents();
  loadLastSessionSummary();
});