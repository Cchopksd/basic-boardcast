const ws = new WebSocket("ws://localhost:3001");

const messagesList = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");

const userIdInput = document.getElementById("userId");

// when connected to server
ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

// receive message from server
ws.onmessage = (event) => {
  const li = document.createElement("li");
  const data = JSON.parse(event.data);
  li.textContent = `${data.user}: ${data.received}`;
  messagesList.appendChild(li);
};

// Send message to server
function sendMessage() {
  const message = messageInput.value.trim();
  const userId = userIdInput.value.trim();
  if (message && userId) {
    ws.send(JSON.stringify({ user: userId, message: message }));

    messageInput.value = "";
  }
}
