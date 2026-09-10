const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const messages = document.querySelector("#messages");

function addMessage(message) {
  const li = document.createElement("li");
  li.textContent = message;
  messages.appendChild(li);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();   // 화면 깜빡거리는 기본동작 막기

  const message = chatInput.value.trim();       // 앞 뒤 여백 자르기

  if (!message) return; //메시지 빈칸이면 return

  addMessage(message);

  chatInput.value = "";
  chatInput.focus();
});
