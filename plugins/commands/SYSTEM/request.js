import axios from 'axios';
// import fs from 'fs/promises';

const config = {
  name: "request",
  aliases: ["rq"],
  usage: "[URL]",
  description: "Gửi yêu cầu tới server",
  permissions: [2],
  credits: "XIE",
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let currentLink = null;
let userData = {};

// const getUsernameFromID = async (userID) => {
//   return new Promise((resolve, reject) => {
//     global.api.getUserInfo([userID], (err, result) => {
//       if (err) return reject(err);
//       const userName = result[userID]?.name || '';
//       resolve(userName);
//     });
//   });
// };

// const writeToDataFile = async (userData) => {
//   try {
//     const data = JSON.stringify(userData, null, 2);
//     await fs.writeFile('data/demo.json', data);
//   } catch (error) {
//     console.error(error);
//   }
// };

const simulateDeviceAccess = async (linkToCheck, numberOfDevices) => {
  const devicePromises = Array.from({ length: numberOfDevices }, (_, i) =>
    checkServerStatus(linkToCheck, i + 1)
  );
  await Promise.all(devicePromises);
};

const checkServerStatus = async (linkToCheck => {
  let loadCount = 0;

  while (linkToCheck === currentLink) {
    try {
      const response = await axios.get(linkToCheck);

      if (response.status === 200) {
        logStatus(loadCount + 1, "Ổn định !!");
      } else {
        logStatus(loadCount + 1, `Xảy ra : ${response.status}`);
      }
    } catch (error) {
      logStatus(loadCount + 1, `Xảy ra : ${error.message}`);
    }

    loadCount++;
    await sleep(500);
  }
};

const logStatus = (loadCount, message) => {
  if (userData.consoleOutputEnabled) {
    console.log(`[ XIE - ${loadCount} ] ${message}`);
  }
};

const onCall = async ({ message, args }) => {
  if (args.length === 0) {
    message.reply("Cung cấp URL.");
    return;
  }

  const command = args[0].toLowerCase();
  const url_user = args[1];

  if (command === "on" || command === "off") {
    if (command === "on") {
      userName = await getUsernameFromID(message.author?.id); 
      // userData = {
      //   linkToCheck: url_user,
      //   numberOfDevices: 1000,
      //   consoleOutputEnabled: true,
      //   NameUser: userName,
      // };

      const actionMessage = `Tiến hành thực hiện lên ${url_user}\nCheck console để xem kết quả!!`;
      message.reply(actionMessage);
      // writeToDataFile(userData);
      currentLink = url_user; 
      await checkServerStatus(url_user, 'XIE', message.author?.id);
      simulateDeviceAccess(url_user, userData.numberOfDevices, message.author?.id);
    } else if (command === "off") {
      // userName = await getUsernameFromID(message.author?.id); 
      const actionMessage = `Đã dừng hoạt động lên ${url_user}\nLịch sử của bạn sẽ được ghi lại.`;
      // const actionMessage = `Đã dừng hoạt động lên ${url_user}\nLịch sử của ${userName} sẽ được ghi lại.`;
      message.reply(actionMessage);
      // writeToDataFile({
      //   linkToCheck: url_user,
      //   numberOfDevices: 1000,
      //   consoleOutputEnabled: true,
      //   NameUser: userName,
      // });
      currentLink = null; 
    }
  } else {
    message.reply("Hãy sử dụng đúng định dạng lệnh.\nGợi ý: on/off [url]");
  }
};

export default {
  config,
  onCall,
};


// DM LÀM CÁI XAMLON NÀY TỐN TIME VL. NGỦ ĐÂY, SHARE CÁC BÉ. TỰ UPDATE THÊM >
