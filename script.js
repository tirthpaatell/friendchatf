
const socket = io("https://friendchatb.onrender.com");

const params = new URLSearchParams(window.location.search);
const room = params.get("room");
const username = prompt("Enter your name") || "Guest";

socket.emit("join-room", { room, username });

document.getElementById("roomCode").innerText = "Room: " + room;
document.getElementById("roomLink").value =
  window.location.origin + "/chat.html?room=" + room;

const form = document.getElementById("form");
const input = document.getElementById("message");
const messages = document.getElementById("messages");

form.addEventListener("submit", e => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("chat-message", username + ": " + input.value);
    input.value = "";
  }
});

socket.on("chat-message", msg => addMsg(msg));
socket.on("system", msg => addMsg("• " + msg, true));

function addMsg(msg, system=false) {
  const div = document.createElement("div");
  div.textContent = msg;
  if(system) div.classList.add("system");
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
