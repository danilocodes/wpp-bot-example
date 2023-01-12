import { stickerMetadata } from '../../../utils/defaultValues';
import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import logger from '../../../utils/logger';

export const stickerHandlers = {
    image: async (client: BotClient, message: PopulatedMessage) => {
        try {
            await client.sendMessage(message.chat.id, 'Creating sticker...');
            const buffer = await client.getMedia(message);
            return await client.sendImageSticker(
                message.chat.id,
                buffer,
                stickerMetadata
            );
        } catch (err) {
            logger.error(err);
        }
    },
    gif: async (client: BotClient, message: PopulatedMessage) => {
        try {
            await client.sendMessage(message.chat.id, 'Creating sticker...');
            const duration = `${message.duration}`;
            const gifDuration = parseInt(duration);
            gifDuration.toLocaleString('en-US', { minimumIntegerDigits: 2 });
            const buffer = await client.getMedia(message);
            await client.sendGifSticker(
                message.chat.id,
                buffer,
                { crop: false, fps: 10, endTime: `00:00:0${gifDuration}.0` },
                stickerMetadata
            );

            return await client.sendMessage(
                message.from,
                'sticker command handler'
            );
        } catch (err) {
            console.log(err);
            logger.error(err);
        }
    },
};

export const stickerHandler = async (
    client: BotClient,
    message: PopulatedMessage
) => {
    try {
        if (!message.quotedMsgObj) {
            return await client.sendMessage(
                message.from,
                'Please reply to a image or gif'
            );
        }
        const quotedMsgObj = message.quotedMsgObj as PopulatedMessage;
        const isImage = quotedMsgObj.type === 'image';
        const handler = isImage ? stickerHandlers.image : stickerHandlers.gif;
        return await handler(client, quotedMsgObj);
    } catch (err) {
        console.log(err);
        logger.error(err);
    }
};
