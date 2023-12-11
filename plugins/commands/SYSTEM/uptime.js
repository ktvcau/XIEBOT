const config = {
  name: "upt",
  aliases: ["time"],
  version: "1.0.0",
  description: "uptime",
  usage: "[]",
  credits: "XIE"
}

function getCurrentTimeInVietnam() {
  const vietnamTimezoneOffset = 7;
  const currentDate = new Date();
  const utcTime = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
  const vietnamTime = new Date(utcTime + (3600000 * vietnamTimezoneOffset));

  const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const day = daysOfWeek[vietnamTime.getDay()];
  const dateString = `${day} - ${vietnamTime.toLocaleDateString('vi-VN')}`;
  const timeString = vietnamTime.toLocaleTimeString('vi-VN');

  return `${dateString} - ${timeString}`;
}

async function onCall({ message }) {
  const uptimeInSeconds = process.uptime();
  const hours = Math.floor(uptimeInSeconds / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeInSeconds % 60);

  try {
    const currentTimeInVietnam = getCurrentTimeInVietnam();
    const replyMessage = await message.send(`✎ ONLINE 𓆙\n◘ Thời gian đã onl\n╰┈➤ ${hours} giờ ${minutes} phút ${seconds} giây\n◘ Thời gian hiện tại\n╰┈➤ ${currentTimeInVietnam}`);
    console.log(replyMessage);
  } catch (error) {
    console.error(error);
  }
}

export default {
  config,
  onCall,
};
