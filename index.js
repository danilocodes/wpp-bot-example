const {create} = require('@open-wa/wa-automate');

const clientConfig = {
    headless: false,
    sessionId: 'wpp-bot-example',
    disableSpins: true,
    skipUpdateCheck: true,
    useChrome: true,
    waitForRipeSession: true,
    cacheEnabled: false,
    cachedPatch: true,
    multiDevice: true,
    qrTimeout: 0,
    ignoreNuke: true,
};

const stickerMetadata = {
    author: 'WhatsApp Bot',
    keepScale: true,
    pack: 'WhatsApp Bot',
};

const logMessage = (message) => {
    const {
        type,
        body,
        isGroupMsg,
        timestamp,
        chat: {formattedTitle},
        sender: {formattedName, pushname},
    } = message;

    const formattedTimestamp = new Date(timestamp * 1000).toLocaleString(
        'pt-BR'
    );
    const chat = isGroupMsg ? formattedTitle : 'PRIVATE';
    const from = pushname || formattedName;
    const content = type === 'chat' ? body : 'type: ' + type;
    console.log(`${formattedTimestamp} | ${chat}: [ ${from} ] - ${content}`);
};

const handler = async (client) => {
    client.onAnyMessage(async (message) => {
        try {
            logMessage(message);
            const command = message.body.split(' ')[0].toLowerCase();
            const chatId = message.chat.id;
            switch (command) {
                case '!test':
                    await client.sendText(chatId, '👋 Hello World!');
                    break;
                case '!sticker':
                    const quotedMsg = message.quotedMsg;
                    if (quotedMsg && quotedMsg.type === 'image') {
                        const imgBuffer = await client.decryptMedia(quotedMsg);
                        await client.sendImageAsSticker(
                            chatId,
                            imgBuffer,
                            stickerMetadata
                        );
                    } else {
                        await client.sendText(
                            chatId,
                            '❌ Reply to an image to convert it to a sticker.'
                        );
                    }
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.log(err);
        }
    });
};

create(clientConfig)
    .then(handler)
    .catch((err) => console.log(err));
