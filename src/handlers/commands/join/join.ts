import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';
import logger from '../../../utils/logger';

const regex = /https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]+/;

export const joinHandler = async (
    client: BotClient,
    message: PopulatedMessage
) => {
    try {
        const groupLinkMsg = message.quotedMsg?.body;
        const linkObj = regex.exec(groupLinkMsg || '');
        if (!linkObj) {
            return await client.sendMessage(message.from, 'Invalid link');
        }
        const groupLink = linkObj[0];
        const groupData = await client.waClient?.inviteInfo(groupLink);
        if (groupData.status === 200) {
            await client.joinGroup(groupLink);
            return await client.sendMessage(
                client.ownerId,
                `Joined group ${groupData.subject}\nby ${message.sender.id}`
            );
        }

        return await client.sendMessage(
            message.from,
            `Error: could not parse ${groupLink}`
        );
    } catch (err) {
        logger.error(err);
    }
};
