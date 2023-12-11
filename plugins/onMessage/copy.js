export function onCall({ message }) {
  if (!global.copy_888 || message.senderID == global.botID) return;

  const array = global.copy_888.get(message.threadID);

  if (!array) return;

  if (message.args[1] == "off") return;

  if (array.includes(message.senderID)) {
    message.send(message.body);
  } else if (array.length == 0) {
    message.send(message.body);
  }
}