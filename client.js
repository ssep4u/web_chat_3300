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

  // ws.send(message); //서버로 message 날리자
  ws.send(JSON.stringify({type: "chat", text: message})); // json -> string
  // addMessage(message);

  chatInput.value = "";
  chatInput.focus();
});

//---------------Welcome WebSocket World-----------------
const ws = new WebSocket(`ws://${location.host}`);

// ws.on("open", () => {});
ws.onopen = () => {
  console.log("서버 연결");
};
ws.onmessage = (event) => {
  //string -> json
  const data = event.data;
  const json = JSON.parse(data);

  //type: chat -> 채팅창에 대화로 추가(li)
  switch(json.type) {
    case "chat":
      //console.log(json.text);
      //화면에 json.text 를 보여주자
      addMessage(json.text);
      break;
  }
};
ws.onclose = () => {
  console.log("서버 연결 해제");
};