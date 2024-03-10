// content.js

let sessionActive = false;
let currentSessionId = null;
let startTime = null;
let endTime = null;
let comments = [];

// Function to handle messages from popup.js
function handleMessage(request, sender, sendResponse) {
  if (request.message === 'toggleSession') {
    toggleStartStop();
  } else if (request.message === 'saveComment') {
    saveComment(request.comment);
  }
}

// Function to toggle the start and stop of a focus session
function toggleStartStop() {
  sessionActive = !sessionActive;

  if (sessionActive) {
    // Start session
    currentSessionId = Date.now().toString();
    startTime = new Date();
    chrome.runtime.sendMessage({ message: 'logEvent', eventType: 'Start', sessionId: currentSessionId, timestamp: startTime });
  } else {
    // End session
    endTime = new Date();
    chrome.runtime.sendMessage({ message: 'logEvent', eventType: 'End', sessionId: currentSessionId, timestamp: endTime });
    getSessionSummary();
    currentSessionId = null;
  }
}

// Function to save a comment
function saveComment(commentContent) {
  const commentId = Date.now().toString();
  const pageUrl = window.location.href;
  const timestamp = new Date();

  const comment = {
    commentId,
    pageUrl,
    content: commentContent,
    timestamp
  };

  comments.push(comment);
  chrome.storage.local.get('comments', (data) => {
    const allComments = data.comments || [];
    allComments.push(comment);
    chrome.storage.local.set({ 'comments': allComments });
  });
}

// Function to get the summary of a session
function getSessionSummary() {
  const sessionSummary = {
    sessionId: currentSessionId,
    startTime,
    endTime,
    comments
  };

  chrome.runtime.sendMessage({ message: 'getSessionSummary', sessionSummary });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(handleMessage);

// Inject comment box into the webpage
function injectCommentBox() {
  const commentBox = document.createElement('textarea');
  commentBox.id = 'commentBox';
  commentBox.className = 'comment-box';
  document.body.appendChild(commentBox);

  const saveCommentButton = document.createElement('button');
  saveCommentButton.id = 'saveCommentButton';
  saveCommentButton.textContent = 'Save Comment';
  saveCommentButton.addEventListener('click', () => {
    const commentContent = commentBox.value;
    saveComment(commentContent);
    commentBox.value = ''; // Clear the comment box after saving
  });
  document.body.appendChild(saveCommentButton);
}

// Call the function to inject the comment box when the content script loads
injectCommentBox();