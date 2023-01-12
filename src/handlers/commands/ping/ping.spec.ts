/* eslint-disable @typescript-eslint/no-explicit-any */
import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import { pingHandler } from './ping';

const populatedMessage: Partial<PopulatedMessage> = {
    body: '!ping',
    type: 'chat',
    isGroupMsg: true,
} as any;

const botClient: Partial<BotClient> = {
    ownerId: '987654321@c.us',
    sendMessage: jest.fn().mockResolvedValue(true),
    leaveGroup: jest.fn().mockResolvedValue(true),
    commands: [],
};

describe('Ping Command', () => {
    it('should return a message', async () => {
        populatedMessage.body = '!ping';
        const sendMessage = jest.spyOn(botClient, 'sendMessage');
        const result = await pingHandler(
            botClient as BotClient,
            populatedMessage as any
        );
        expect(result).toBe(true);
        expect(sendMessage).toHaveBeenCalledWith(
            populatedMessage.from,
            'Pong!'
        );
    });
});
