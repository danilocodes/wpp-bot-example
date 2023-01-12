import { Message } from '@open-wa/wa-automate';
import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import logger from '../../../utils/logger';
import PrivateChatHandler from '../../chatHandlers/privateHandler';
import GroupChatHandler from '../../chatHandlers/groupHandler';

export const handlers = {
    group: new GroupChatHandler(),
    private: new PrivateChatHandler(),
};

export const onMessage = async (client: BotClient, message: Message) => {
    try {
        const isText = message.type === 'chat';
        const isGroupMessage = message.isGroupMsg;
        const validPrefixes = ['!', '/', '#'];
        const shouldHandleCommand =
            isText &&
            !message.isForwarded &&
            validPrefixes.includes(message.body[0]);
        const chatType = isGroupMessage ? 'group' : 'private';
        const messageType = shouldHandleCommand ? 'command' : 'message';
        const handler = handlers[chatType][messageType];
        const isValidMessage = await handlers[chatType].validateMessage(
            client,
            message as PopulatedMessage
        );
        if (!isValidMessage) return false;
        return await handler(client, message);
    } catch (err) {
        logger.error(err);
    }
};
