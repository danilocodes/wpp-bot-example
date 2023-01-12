/* eslint-disable @typescript-eslint/no-explicit-any */
import BotClient from '../../../utils/interfaces/BotClient';
import { onGroupAdded } from './onGroupAdded';

const groupChat = {
    id: '123456789',
    formattedTitle: 'Test Group',
    groupMetadata: {
        owner: '987654321',
    },
};

const botClient: Partial<BotClient> = {
    ownerId: '987654321@c.us',
    sendMessage: jest.fn().mockResolvedValue(true),
    leaveGroup: jest.fn().mockResolvedValue(true),
};

describe('Handle group added event', () => {
    it('should send a message to owner and call leave group', async () => {
        await onGroupAdded(botClient as BotClient, groupChat as any);
        expect(botClient.sendMessage).toHaveBeenCalledWith(
            botClient.ownerId,
            `New group!\n\n${groupChat.formattedTitle}\nowner: ${groupChat.groupMetadata.owner}`
        );
        expect(botClient.leaveGroup).toHaveBeenCalledWith(groupChat.id);
    });
});
