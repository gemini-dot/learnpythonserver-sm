function terminal_style_log() {
  const blue = "color: #00ccff; font-weight: bold;";
  const green = "color: #00ff00;";
  const red = "color: #ff3333; font-weight: bold; background: #220000; padding: 2px 5px;";

  console.log("%c[SYSTEM]: %cKhởi động giao thức bảo mật...", blue, "color: white;");
  
  setTimeout(() => {
    console.log("%c[USER]: %croot@dev-user:~$ %ccheck_security", blue, green, "color: white;");
  }, 500);

  setTimeout(() => {
    console.log("%c[ALERT]: %cNGUY HIỂM! KHÔNG ĐƯỢC DÁN CODE LẠ!", red, "color: #ff3333;");
    console.log("%c>> %cTính năng này chỉ dàng riêng cho developer. web make by sam", "color: gray;", "color: gray; font-style: italic;");
  }, 1000);
}

terminal_style_log();