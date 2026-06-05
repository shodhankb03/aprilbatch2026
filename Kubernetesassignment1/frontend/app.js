const result = document.getElementById('result');

async function loadMessage() {
  try {
    const response = await fetch('/api/message');
    const data = await response.json();
    result.textContent = response.ok ? `Saved message: ${data.message}` : `Error: ${data.error}`;
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  }
}

async function saveMessage() {
  try {
    const note = document.getElementById('note').value.trim() || 'Hello from frontend';
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    const data = await response.json();
    result.textContent = response.ok ? `Saved: ${data.note}` : `Error: ${data.error}`;
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  }
}

window.addEventListener('load', loadMessage);
document.getElementById('loadBtn').addEventListener('click', loadMessage);
document.getElementById('saveBtn').addEventListener('click', saveMessage);
