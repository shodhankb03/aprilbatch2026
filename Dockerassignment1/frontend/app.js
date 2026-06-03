const backendUrl = 'http://localhost:3001';

async function loadMessage() {
  const res = await fetch(`${backendUrl}/api/message`);
  const data = await res.json();
  document.getElementById('result').textContent = 'Saved message: ' + data.message;
}

async function saveMessage() {
  const note = document.getElementById('note').value.trim() || 'Hello from frontend';
  const res = await fetch(`${backendUrl}/api/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  const data = await res.json();
  document.getElementById('result').textContent = data.saved ? 'Saved: ' + data.note : 'Error: ' + data.error;
}

window.addEventListener('load', loadMessage);
document.getElementById('loadBtn').addEventListener('click', loadMessage);
document.getElementById('saveBtn').addEventListener('click', saveMessage);
