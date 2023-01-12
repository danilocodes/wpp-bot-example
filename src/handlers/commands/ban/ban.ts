import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import logger from '../../../utils/logger';

export const banHandler = async (client: BotClient, message: PopulatedMessage) => {
    try {
        // TODO: implement ban command
        return await client.sendMessage(message.from, 'ban command handler');
    } catch (err) {
        logger.error(err);
    }
};
