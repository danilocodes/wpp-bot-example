import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import logger from '../../../utils/logger';

export const pingHandler = async (
    client: BotClient,
    message: PopulatedMessage
) => {
    try {
        return await client.sendMessage(message.from, 'Pong!');
    } catch (err) {
        logger.error(err);
    }
};
