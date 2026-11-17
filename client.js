const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const messages = document.querySelector("#messages");
chatInput.focus();

function addMessage(senderNickname, message) {
  const li = document.createElement("li");  //<li></li>
  if (senderNickname !== nickname) {
    //nickname
    //<li><div class="nickname">닉네임</div></li>
    //<div> 태그 만들자
    const nicknameDiv = document.createElement("div");
    //class="nickname" 추가하자
    nicknameDiv.classList.add("nickname");
    //textContent=nickname 넣자
    nicknameDiv.textContent = senderNickname;
    //<li>의 자식으로 붙이자
    li.appendChild(nicknameDiv);
  } else {  //내 메시지이면 오른쪽에 표시하자
    li.classList.add("mine");
  }

  //message
  li.appendChild(document.createTextNode(message));  //<li><div class="nickname">닉네임</div>메시지</li>

  //시간 <span class="time">시간</span> -> <li> 자식으로 붙이자

  messages.appendChild(li); //<ul id="messages"><li><div class="nickname">닉네임</div>메시지</li></ul>
  messages.append()
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
const nickname = prompt("당신의 닉네임을 입력하세요.").trim() || "익명";

// ws.on("open", () => {});
ws.onopen = () => {
  console.log("서버 연결");
  ws.send(JSON.stringify({type: "join", text: nickname}));  //server에 nickname 보내기
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
      console.log(json.nickname);
      addMessage(json.nickname, json.text);
      break;
  }
};
ws.onclose = () => {
  console.log("서버 연결 해제");
};