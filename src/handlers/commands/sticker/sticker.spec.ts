/* eslint-disable @typescript-eslint/no-explicit-any */
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import { stickerHandler, stickerHandlers } from './sticker';
import BotClient from '../../../utils/interfaces/BotClient';

const populatedMessage: Partial<PopulatedMessage> = {
    from: '123456789@c.us',
    body: '!sticker',
    type: 'chat',
    isGroupMsg: true,
    quotedMsgObj: {
        type: 'image',
        chat: {
            id: '123456789@g.us'
        }
    },
    chat: {
        id: '123456789@g.us'
    }
} as any;

const botClient: Partial<BotClient> = {
    sendMessage: jest.fn().mockResolvedValue(true),
    getMedia: jest.fn().mockResolvedValue(true),
    sendImageSticker: jest.fn().mockResolvedValue(true),
    sendGifSticker: jest.fn().mockResolvedValue(true),
};

describe('sticker Command', () => {
    it('should call image sticker handler', async () => {
        const imgStickerHandler = jest.spyOn(stickerHandlers, 'image');
        await stickerHandler(botClient as BotClient, populatedMessage as PopulatedMessage);
        expect(imgStickerHandler).toHaveBeenCalled();
    });

    it('should call gif sticker handler', async () => {
        populatedMessage.quotedMsgObj = {
            type: 'video',
            chat: {
                id: '123456789@g.us'
            }
        } as any;
        const gifStickerHandler = jest.spyOn(stickerHandlers, 'gif');
        await stickerHandler(botClient as BotClient, populatedMessage as PopulatedMessage);
        expect(gifStickerHandler).toHaveBeenCalled();
    });
});
