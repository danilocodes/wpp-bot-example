/* eslint-disable @typescript-eslint/no-explicit-any */
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import { banHandler } from './ban';
import BotClient from '../../../utils/interfaces/BotClient';

const populatedMessage: Partial<PopulatedMessage> = {
    from: '123456789@c.us',
    body: '!ban',
    type: 'chat',
    isGroupMsg: true,
} as any;

const botClient: Partial<BotClient> = {
    ownerId: '987654321@c.us',
    sendMessage: jest.fn().mockResolvedValue(true),
    leaveGroup: jest.fn().mockResolvedValue(true),
    commands: [],
};

describe('ban Command', () => {
    it('should return a message', async () => {
        populatedMessage.body = '!ban';
        const sendMessage = jest.spyOn(botClient, 'sendMessage');
        const result = await banHandler(botClient as BotClient, populatedMessage as any);
        expect(result).toBe(true);
        expect(sendMessage).toHaveBeenCalled();
    });
});
