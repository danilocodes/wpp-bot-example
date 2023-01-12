// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Remove the above lines if you want to use TypeScript
import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import logger from '../../../utils/logger';

export const PLACEHOLDERHandler = async (client: BotClient, message: PopulatedMessage) => {
    try {
        // TODO: implement PLACEHOLDER command
        return await client.sendMessage(message.from, 'PLACEHOLDER command handler');
    } catch (err) {
        logger.error(err);
    }
};
