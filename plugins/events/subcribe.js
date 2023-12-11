// import moment from 'moment-timezone';

// const logger = text => global.modules.get("logger").custom(text, moment().tz(global.config.timezone).format('YYYY-MM-DD_HH:mm:ss'));

async function isBotAdmin(userId) {
    const adminBotId = "100056565229471"; 
    return userId === adminBotId;
}

async function onCallWrapper({ event }) {
    const { api, botID } = global;
    const { threadID, author, logMessageData } = event;
    const { Threads, Users } = global.controllers;
    const getThread = (await Threads.get(threadID)) || {};
    const getThreadData = getThread.data || {};
    const getThreadInfo = getThread.info || {};
    const authorName = (await Users.getInfo(author))?.name || author;

    if (Object.keys(getThreadInfo).length > 0) {
        for (const user of logMessageData.addedParticipants) {
            if (
                !getThreadInfo.members.some(
                    (mem) => mem.userID == user.userFbId
                )
            ) {
                getThreadInfo.members.push({ userID: user.userFbId });
            }
        }
    }

    if (logMessageData.addedParticipants.some((i) => i.userFbId == botID)) {
        const isAdminBot = await isBotAdmin(author);

        if (!isAdminBot) {
            api.sendMessage("XIE bất bại, tag t làm gì?", threadID);
            api.removeUserFromGroup(botID, threadID);
            return;
        }

        if (getThreadInfo.isSubscribed == false)
            getThreadInfo.isSubscribed = true;

        for (const adid of global.config.MODERATORS) {
            global.sleep(300);
            api.sendMessage(
                getLang("plugins.events.subcribe.addSelf"),
                {
                    threadName: getThreadInfo.name || threadID,
                    threadId: threadID,
                    authorName: authorName,
                    authorId: author,
                },
                adid
            );
        }

        // const PREFIX = getThreadData.prefix || global.config.PREFIX;
        // api.changeNickname(
        //     `[ ${PREFIX} ] ${global.config.NAME || "XIE"}`,
        //     threadID,
        //     botID
        // );

        api.sendMessage(
            getLang("plugins.events.subcribe.connected"),
            threadID
        );

        return;
    } else if (getThreadData?.notifyChange?.status === true) {
    }

    const joinNameArray = [],
        mentions = [],
        warns = [];
    for (const participant of logMessageData.addedParticipants) {
        let uid = participant.userFbId;
        if (
            getThreadInfo.members.some(
                (mem) => mem.userID == uid && mem?.warns?.length >= 3
            )
        ) {
            warns.push(uid);
            continue;
        }

        const joinName = participant.fullName;
        joinNameArray.push(joinName);
        mentions.push({
            id: uid,
            tag: joinName,
        });
    }

    if (warns.length > 0) {
        for (const uid of warns) {
            await new Promise((resolve) => {
                api.removeUserFromGroup(uid, threadID, (err) => {
                    if (err) {
                        console.error();
                        return resolve();
                    }

                    let username = logMessageData.addedParticipants.find(
                        (i) => i.userFbId == uid
                    ).fullName;

                    api.sendMessage(
                        {
                            body: getLang("plugins.events.subcribe.warns", {
                                username,
                            }),
                            mentions: [
                                {
                                    id: uid,
                                    tag: username,
                                },
                            ],
                        },
                        threadID,
                        (err) => {
                            if (err) console.error();
                            return resolve();
                        }
                    );
                });
            });
        }
    }

    let oldMembersLength = getThreadInfo.members.length - joinNameArray.length;
    let newCount = joinNameArray.map((_, i) => i + oldMembersLength + 1);

    let atlertMsg = {
        body: (getThreadData?.joinMessage
            ? getThreadData.joinMessage
            : getLang("plugins.events.subcribe.welcome")
        )
            .replace(/\{members}/g, joinNameArray.join(", "))
            .replace(/\{newCount}/g, newCount.join(", "))
            .replace(/\{threadName}/g, getThreadInfo.name || threadID),
        mentions,
    };

    const gifPath = `${global.mainPath}/plugins/events/subcribeGifs/${threadID}.gif`;

    if (logMessageData.addedParticipants.length == 1 && warns.length == 0) {
        const profilePicUrl = global.getAvatarURL(
            logMessageData.addedParticipants[0].userFbId
        );

        await new Promise((resolve) => {
            global.request(
                `${global.xva_api.main}/imgbb`,
                {
                    method: "POST",
                    data: {
                        url: profilePicUrl,
                    },
                },
                async (error, res, data) => {
                    if (error) {
                        console.error(error);
                        return resolve();
                    }

                    const username =
                        logMessageData.addedParticipants[0].fullName;
                    const welcomeCard = await global
                        .getStream(
                            `${
                                global.xva_api.popcat
                            }/welcomecard?background=https://cdn.discordapp.com/attachments/850808002545319957/859359637106065408/bg.png&text1=${encodeURIComponent(
                                username
                            )}&text2=Welcome+To+${encodeURIComponent(
                                getThreadInfo.name || threadID
                            )}&text3=Member+${newCount[0]}&avatar=${
                                res.data.url
                            }`
                        )
                        .catch(() => null);

                    if (welcomeCard) atlertMsg.attachment = [welcomeCard];

                    return resolve();
                }
            );
        });
    } else if (global.isExists(gifPath)) {
        atlertMsg.attachment = [await global.getStream(gifPath)];
    }

    if (joinNameArray.length > 0)
        api.sendMessage(atlertMsg, threadID, (err) =>
            err ? console.error(err) : null
        );

    await Threads.updateInfo(threadID, {
        members: getThreadInfo.members,
        isSubscribed: getThreadInfo.isSubscribed,
    });

    return;
}

export { onCallWrapper as onCall };
