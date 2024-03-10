// events_table.js

const renderEventsTable = () => {
  chrome.storage.local.get(['events'], (result) => {
    const events = result.events || [];
    const eventsTable = document.getElementById('eventsTable');
    eventsTable.innerHTML = ''; // Clear the table first

    // Create table headers
    const header = eventsTable.createTHead();
    const row = header.insertRow(0);
    const idHeader = row.insertCell(0);
    const sessionHeader = row.insertCell(1);
    const typeHeader = row.insertCell(2);
    const timestampHeader = row.insertCell(3);
    idHeader.innerHTML = 'Event ID';
    sessionHeader.innerHTML = 'Session ID';
    typeHeader.innerHTML = 'Event Type';
    timestampHeader.innerHTML = 'Timestamp';

    // Inserting each event into the table
    events.forEach((event) => {
      const tr = eventsTable.insertRow(-1);
      const eventIdCell = tr.insertCell(0);
      const sessionIdCell = tr.insertCell(1);
      const eventTypeCell = tr.insertCell(2);
      const timestampCell = tr.insertCell(3);
      eventIdCell.textContent = event.eventId;
      sessionIdCell.textContent = event.sessionId;
      eventTypeCell.textContent = event.eventType;
      timestampCell.textContent = new Date(event.timestamp).toLocaleString();
    });
  });
};

const logEvent = (event) => {
  chrome.storage.local.get(['events'], (result) => {
    const events = result.events || [];
    events.push(event);
    chrome.storage.local.set({ events }, () => {
      renderEventsTable(); // Update the table after adding the new event
    });
  });
};

// Call renderEventsTable to populate the table on initial load
document.addEventListener('DOMContentLoaded', renderEventsTable);