/* eslint-disable @typescript-eslint/no-explicit-any */
import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import { handlers, onMessage } from './onMessage';

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

describe('Handle new message event', () => {
    it('should call groupchat command handler', async () => {
        const groupCommandHandler = jest.spyOn(handlers.group, 'command');
        await onMessage(botClient as BotClient, populatedMessage as any);
        expect(groupCommandHandler).toHaveBeenCalledWith(
            botClient,
            populatedMessage
        );
    });

    it('should call group chat message handler', async () => {
        populatedMessage.body = 'Hello';
        const groupMessageHandler = jest.spyOn(handlers.group, 'message');
        await onMessage(botClient as BotClient, populatedMessage as any);
        expect(groupMessageHandler).toHaveBeenCalledWith(
            botClient,
            populatedMessage
        );
    });

    it('should call private chat command handler', async () => {
        populatedMessage.body = '!ping';
        populatedMessage.isGroupMsg = false;
        const privateCommandHandler = jest.spyOn(handlers.private, 'command');
        await onMessage(botClient as BotClient, populatedMessage as any);
        expect(privateCommandHandler).toHaveBeenCalledWith(
            botClient,
            populatedMessage
        );
    });

    it('should call private chat message handler', async () => {
        populatedMessage.body = 'Hello';
        const privateMessageHandler = jest.spyOn(handlers.private, 'message');
        await onMessage(botClient as BotClient, populatedMessage as any);
        expect(privateMessageHandler).toHaveBeenCalledWith(
            botClient,
            populatedMessage
        );
    });
});
