const socket = io("https://friendchatb.onrender.com");

const room = new URLSearchParams(location.search).get("room");
const username = prompt("Enter your name") || "Guest";

socket.emit("join-room", { room, username });

roomCode.textContent = `Room ${room}`;
roomLink.value = location.href;

let lastUser = null;

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!message.value.trim()) return;

  socket.emit("chat-message", {
    user: username,
    text: message.value,
    time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
  });

  message.value = "";
  socket.emit("typing", false);
});

message.addEventListener("input", () => {
  socket.emit("typing", message.value.length > 0);
});

socket.on("chat-message", msg => {
  const grouped = msg.user === lastUser;
  lastUser = msg.user;

  const div = document.createElement("div");
  div.className = grouped ? "bubble grouped" : "bubble";

  div.innerHTML = grouped
    ? `<p class="group-text">${msg.text}</p>`
    : `
      <div class="avatar">${msg.user[0].toUpperCase()}</div>
      <div class="content">
        <strong>${msg.user}</strong>
        <small>${msg.time}</small>
        <p>${msg.text}</p>
      </div>
    `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("users", list => {
  users.innerHTML = list.map(u => `<li>${u}</li>`).join("");
});

socket.on("typing", data => {
  typing.textContent = data.status ? `${data.user} is typing…` : "";
});

socket.on("system", text => {
  const div = document.createElement("div");
  div.className = "system";
  div.textContent = text;
  messages.appendChild(div);
});
