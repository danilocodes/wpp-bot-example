// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Remove the above lines if you want to use TypeScript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import { PLACEHOLDERHandler } from './PLACEHOLDER';
import BotClient from '../../../utils/interfaces/BotClient';

const populatedMessage: Partial<PopulatedMessage> = {
    from: '123456789@c.us',
    body: '!PLACEHOLDER',
    type: 'chat',
    isGroupMsg: true,
} as any;

const botClient: Partial<BotClient> = {
    ownerId: '987654321@c.us',
    sendMessage: jest.fn().mockResolvedValue(true),
    leaveGroup: jest.fn().mockResolvedValue(true),
    commands: [],
};

describe('PLACEHOLDER Command', () => {
    it('should return a message', async () => {
        populatedMessage.body = '!PLACEHOLDER';
        const sendMessage = jest.spyOn(botClient, 'sendMessage');
        const result = await PLACEHOLDERHandler(botClient as BotClient, populatedMessage as any);
        expect(result).toBe(true);
        expect(sendMessage).toHaveBeenCalledWith(populatedMessage.from, 'PLACEHOLDER command handler');
    });
});
