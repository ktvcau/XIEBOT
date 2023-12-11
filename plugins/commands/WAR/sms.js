import axios from "axios";

const config = {
  name: "sms",
  version: "0.0",
  description: "",
  permissions: [2],
  cooldown: 5
}

async function onCall({ message, args, data }) {
  const user = data.user
  const input = args.join(" ").split(" ")
  const sdt = input[0],
    luot = input[1],
    delay = input[2]

  if (!sdt || !luot || !delay) return message.reply("Thiếu dữ liệu, vui lòng nhập lại!");

  axios.get(encodeURI(`https://spam.sumiproject.io.vn/spam?sdt=${sdt}&luot=${luot}&delay=${delay}`));

  return message.send(`Đang tiến hành spam\n\nSố điện thoại: ${sdt}\n\nSố lần: ${luot}\n\nTime delay: ${delay}\n\nNgười thực thi lệnh: ${user.info.name}`)
}

export {
  config,
  onCall
}