console.log("Hello, World");
console.log(process.version);
console.log(process.cwd());

// 파일 출력하자
const fs = require('fs');   // file system 라이브러리
console.log(fs.readFileSync(__filename, "utf8"));
