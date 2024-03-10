// session_table.js

const renderSessionTable = () => {
  chrome.storage.local.get(['sessions'], (result) => {
    const sessions = result.sessions || [];
    const sessionTable = document.getElementById('sessionTable');
    sessionTable.innerHTML = ''; // Clear the table first

    sessions.forEach((session) => {
      const row = document.createElement('tr');
      const sessionIdCell = document.createElement('td');
      const startTimeCell = document.createElement('td');
      const endTimeCell = document.createElement('td');
      const commentsCell = document.createElement('td');

      sessionIdCell.textContent = session.sessionId;
      startTimeCell.textContent = session.startTime;
      endTimeCell.textContent = session.endTime;
      commentsCell.textContent = session.comments.length;

      row.appendChild(sessionIdCell);
      row.appendChild(startTimeCell);
      row.appendChild(endTimeCell);
      row.appendChild(commentsCell);

      sessionTable.appendChild(row);
    });
  });
};

const logSession = (sessionId, startTime, endTime, comments) => {
  chrome.storage.local.get(['sessions'], (result) => {
    const sessions = result.sessions || [];
    const newSession = {
      sessionId,
      startTime,
      endTime,
      comments
    };
    sessions.push(newSession);
    chrome.storage.local.set({ sessions }, () => {
      renderSessionTable(); // Update the table after adding a new session
    });
  });
};

// Call renderSessionTable on initial load
document.addEventListener('DOMContentLoaded', renderSessionTable);