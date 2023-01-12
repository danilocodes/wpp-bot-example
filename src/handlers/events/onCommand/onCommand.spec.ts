/* eslint-disable @typescript-eslint/no-explicit-any */
import BotClient from '../../../utils/interfaces/BotClient';
import Command from '../../../utils/interfaces/Command';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import onCommand from './onCommand';

const populatedMessage: Partial<PopulatedMessage> = {
    body: '!ping',
    isForwarded: false,
    isGroupMsg: false,
    sender: {
        id: '987654321@c.us',
    } as any,
    chat: {
        groupMetadata: {
            id: '123456789@g.us',
        },
    } as any,
};

const botClient: Partial<BotClient> = {
    ownerId: '987654321@c.us',
    sendMessage: jest.fn().mockResolvedValue(true),
    leaveGroup: jest.fn().mockResolvedValue(true),
    commands: [
        {
            triggers: ['ping'],
            description: 'Ping the bot',
            handler: jest.fn().mockImplementation(() => Promise.resolve(true)),
            price: 0,
            type: 'any',
            role: 'USER',
            active: true,
        },
        {
            triggers: ['ban'],
            description: 'any',
            handler: jest.fn().mockImplementation(() => Promise.resolve(true)),
            price: 0,
            type: 'any',
            role: 'ADMIN',
            active: true,
        },
        {
            triggers: ['debug'],
            description: 'any',
            handler: jest.fn().mockImplementation(() => Promise.resolve(true)),
            price: 0,
            type: 'any',
            role: 'OWNER',
            active: true,
        },
    ],
};

const getGroupAdmins = jest
    .fn()
    .mockImplementation(() => Promise.resolve([populatedMessage.sender?.id]));
botClient.getGroupAdmins = getGroupAdmins;
const handler = jest.fn().mockImplementation(() => Promise.resolve(true));
botClient.commands = botClient.commands?.map((cmd: Command) => {
    return {
        ...cmd,
        handler: handler,
    };
});

describe('onCommand', () => {
    it('should call command handler for an user', async () => {
        populatedMessage.body = '!ping';
        populatedMessage.isRootMessage = false;
        await onCommand.handle(botClient as BotClient, populatedMessage as any);
        expect(handler).toHaveBeenCalledWith(botClient, populatedMessage);
    });

    it('should call command handler for an admin', async () => {
        populatedMessage.body = '!ban';
        populatedMessage.isRootMessage = false;
        await onCommand.handle(botClient as BotClient, populatedMessage as any);
        expect(handler).toHaveBeenCalledWith(botClient, populatedMessage);
    });

    it('should not call command handler for an admin command called by an user', async () => {
        botClient.getGroupAdmins = jest
            .fn()
            .mockImplementation(() => Promise.resolve([]));
        const sendMessage = jest.spyOn(botClient, 'sendMessage');
        populatedMessage.body = '!ban';
        populatedMessage.isRootMessage = false;
        await onCommand.handle(botClient as BotClient, populatedMessage as any);
        expect(sendMessage).toHaveBeenCalledWith(
            populatedMessage.from,
            'You do not have permission to use this command'
        );
        expect(handler).not.toHaveBeenCalled();
    });

    it('should not call command handler for any user trying to run an onwer only command called by an user', async () => {
        const sendMessage = jest.spyOn(botClient, 'sendMessage');
        populatedMessage.body = '!debug';
        populatedMessage.isRootMessage = false;
        const result = await onCommand.handle(
            botClient as BotClient,
            populatedMessage as any
        );
        expect(sendMessage).toHaveBeenCalledWith(
            populatedMessage.from,
            'You do not have permission to use this command'
        );
        expect(handler).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should call command handler for the owner running an owner only command', async () => {
        populatedMessage.body = '!debug';
        populatedMessage.isRootMessage = true;
        await onCommand.handle(botClient as BotClient, populatedMessage as any);
        expect(handler).toHaveBeenCalledWith(botClient, populatedMessage);
    });

    it('should not call command handler for an user running an owner only command', async () => {
        const sendMessage = jest.spyOn(botClient, 'sendMessage');
        populatedMessage.body = '!debug';
        populatedMessage.isRootMessage = false;
        const result = await onCommand.handle(
            botClient as BotClient,
            populatedMessage as any
        );
        expect(sendMessage).toHaveBeenCalledWith(
            populatedMessage.from,
            'You do not have permission to use this command'
        );
        expect(handler).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should not call command handler for an invalid command', () => {
        populatedMessage.body = '!invalid';
        populatedMessage.isRootMessage = false;
        onCommand.handle(botClient as BotClient, populatedMessage as any);
        expect(handler).not.toHaveBeenCalled();
    });
});
