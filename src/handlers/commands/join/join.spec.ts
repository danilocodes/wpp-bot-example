/* eslint-disable @typescript-eslint/no-explicit-any */
import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import { joinHandler } from './join';

const populatedMessage: Partial<PopulatedMessage> = {
    from: '123456789@c.us',
    body: '!ping',
    type: 'chat',
    isGroupMsg: true,
    sender: {
        id: '123456987@c.us',
    },
} as any;

const botClient: Partial<BotClient> = {
    ownerId: '987654321@c.us',
    sendMessage: jest.fn().mockResolvedValue(true),
    leaveGroup: jest.fn().mockResolvedValue(true),
    joinGroup: jest.fn().mockResolvedValue(true),
    waClient: {
        inviteInfo: jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                subject: 'Test Group',
                groupMetadata: {
                    id: '321654987@g.us',
                },
            })
        ),
    } as any,
    commands: [],
};

describe('Join Command', () => {
    it('should not join a group with invalid link', async () => {
        populatedMessage.quotedMsg = {
            body: 'https://whatsapp.com/1234567890',
        } as any;
        const sendMessage = jest.spyOn(botClient, 'sendMessage');
        const joinGroup = jest.spyOn(botClient, 'joinGroup');
        const result = await joinHandler(
            botClient as BotClient,
            populatedMessage as any
        );
        expect(result).toBe(true);
        expect(sendMessage).toBeCalledWith(
            populatedMessage.from,
            'Invalid link'
        );
        expect(joinGroup).not.toBeCalled();
    });

    it('should join a group', async () => {
        populatedMessage.quotedMsg = {
            body: 'https://chat.whatsapp.com/1234567890',
        } as any;
        const joinGroup = jest.spyOn(botClient, 'joinGroup');
        const result = await joinHandler(
            botClient as BotClient,
            populatedMessage as any
        );
        expect(result).toBe(true);
        expect(joinGroup).toBeCalledWith(
            'https://chat.whatsapp.com/1234567890'
        );
    });
});
