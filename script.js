const socket = io("YOUR_RENDER_BACKEND_URL");

const room = new URLSearchParams(location.search).get("room");
const username = prompt("Your name") || "Guest";

socket.emit("join-room", { room, username });

roomCode.textContent = "Room: " + room;
roomLink.value = location.origin + "/chat.html?room=" + room;

emojiBtn.onclick = () => {
  emojiPanel.classList.toggle("show");
};

emojiPanel.onclick = (e) => {
  if (e.target.textContent.trim()) {
    message.value += e.target.textContent;
    emojiPanel.classList.remove("show");
    message.focus();
  }
};

form.onsubmit = e => {
  e.preventDefault();
  if (!message.value.trim()) return;

  socket.emit("chat-message", {
    id: Date.now(),
    user: username,
    text: message.value
  });

  message.value = "";
};

socket.on("chat-message", msg => {
  addMessage(msg);
});

socket.on("system", msg => {
  addSystem(msg);
});

socket.on("reaction", data => {
  document.querySelector(`#msg-${data.id} .reactions`).textContent = data.reaction;
});

function addMessage(msg) {
  const div = document.createElement("div");
  div.className = "bubble";
  div.id = `msg-${msg.id}`;

  div.innerHTML = `
    <div class="text">${msg.user}: ${msg.text}</div>
    <div class="meta">
      <small>${msg.time}</small>
      <div class="reactions">
        <span onclick="react(${msg.id},'❤️')">❤️</span>
        <span onclick="react(${msg.id},'😂')">😂</span>
        <span onclick="react(${msg.id},'🔥')">🔥</span>
        <span onclick="react(${msg.id},'👍')">👍</span>
      </div>
    </div>
  `;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addSystem(msg) {
  const div = document.createElement("div");
  div.className = "system";
  div.textContent = `${msg.text} • ${msg.time}`;
  messages.appendChild(div);
}

function react(id, emoji) {
  socket.emit("reaction", { id, reaction: emoji });
}
