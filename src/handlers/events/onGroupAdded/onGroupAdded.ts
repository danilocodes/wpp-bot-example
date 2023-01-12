import { Chat, GroupChatId } from '@open-wa/wa-automate';
import BotClient from '../../../utils/interfaces/BotClient';
import logger from '../../../utils/logger';

export const onGroupAdded = async (client: BotClient, chat: Chat) => {
    try {
        const {
            formattedTitle,
            groupMetadata: { owner },
        } = chat;
        const warningMessage = `New group!\n\n${formattedTitle}\nowner: ${owner}`;
        await client.sendMessage(client.ownerId, warningMessage);
        return await client.leaveGroup(chat.id as GroupChatId);
    } catch (err) {
        logger.error(err);
    }
};
