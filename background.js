let sessionActive = false;
let currentSessionId = null;
let startTime = null;
let endTime = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ sessions: [], events: [], comments: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'toggleSession') {
    toggleStartStop();
  } else if (request.message === 'saveComment') {
    saveComment(request.comment);
  } else if (request.message === 'getSessionSummary') {
    getSessionSummary(sendResponse);
    return true; // Indicates that the response is asynchronous
  }
});

function toggleStartStop() {
  sessionActive = !sessionActive;

  if (sessionActive) {
    currentSessionId = Date.now().toString();
    startTime = new Date();
    logSession(currentSessionId, startTime);
    logEvent(currentSessionId, 'Start', startTime);
  } else {
    endTime = new Date();
    logEvent(currentSessionId, 'End', endTime);
    updateSession(currentSessionId, endTime);
    currentSessionId = null;
  }

  chrome.runtime.sendMessage({ message: 'updateTimer', sessionActive });
}

function logSession(sessionId, startTime) {
  chrome.storage.local.get('sessions', (data) => {
    const sessions = data.sessions || [];
    sessions.push({ sessionId, startTime, endTime: null, comments: [] });
    chrome.storage.local.set({ sessions });
  });
}

function logEvent(sessionId, eventType, timestamp) {
  chrome.storage.local.get('events', (data) => {
    const events = data.events || [];
    events.push({ eventId: Date.now().toString(), sessionId, eventType, timestamp });
    chrome.storage.local.set({ events });
  });
}

function updateSession(sessionId, endTime) {
  chrome.storage.local.get('sessions', (data) => {
    const sessions = data.sessions || [];
    const sessionIndex = sessions.findIndex(s => s.sessionId === sessionId);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].endTime = endTime;
      chrome.storage.local.set({ sessions });
    }
  });
}

function saveComment(comment) {
  chrome.storage.local.get('comments', (data) => {
    const comments = data.comments || [];
    comments.push({ commentId: Date.now().toString(), pageUrl: comment.pageUrl, content: comment.content, timestamp: new Date() });
    chrome.storage.local.set({ comments });
  });
}

function getSessionSummary(callback) {
  chrome.storage.local.get(['sessions', 'events', 'comments'], (data) => {
    const { sessions, events, comments } = data;
    const summary = {
      sessionCount: sessions.length,
      eventCount: events.length,
      commentCount: comments.length,
    };
    callback(summary);
  });
}