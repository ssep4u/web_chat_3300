# 실시간 채팅 서비스 제작

1. 개발 환경 구축, JavaScript 실행
   - Visual Studio Code
     - Codex 확장기능
   - Git
   - Node.js
   ```shell
   node server.js
   ```
2. 정적 파일(html, css, js) 서버
   - server.js
     - server = http.createServer()
     - server.listen()
   - index.html
     - #app
       - header
       - ul#messages
       - form#chat-form
         - input#chat-input
         - button
   - reset.css
     - -
     - ul
   - style.css
   - client.js
     - addEventListener("submit", (event) => {})
     - addMessage()
