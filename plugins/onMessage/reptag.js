const COOLDOWN = 1000; // 5 seconds

if (!global.autoreply_173_cd) global.autoreply_173_cd = new Map();

export function onCall({ message }) {
  if (!global.autoreply_173 || message.senderID == global.botID) return;

  const option = global.autoreply_173.get(message.threadID);

  if (!option) return;

  const cooldown = global.autoreply_173_cd.get(message.threadID) || 0;

  if (Date.now() - cooldown < COOLDOWN) return;

  global.autoreply_173_cd.set(message.threadID, Date.now());

    if((option.ids_reply.length > 0 && option.ids_reply.includes(message.senderID)) || option.ids_reply.length == 0) {
        message.send(option.content);
    }
}