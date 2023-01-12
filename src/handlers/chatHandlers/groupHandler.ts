import { Message, MessageId } from '@open-wa/wa-automate';
import BotClient from '../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../utils/interfaces/PopulatedMessage';
import onCommand from '../events/onCommand/onCommand';

export default class GroupChatHandler {
    validateMessage = async (
        client: BotClient,
        message: PopulatedMessage
    ): Promise<boolean> => {
        // TODO: Check if group is in database or user has permission to use bot
        message.validMessage = true;
        return true;
    };

    populateMessage = async (
        client: BotClient,
        message: PopulatedMessage
    ): Promise<PopulatedMessage> => {
        // TODO: Get group info and user info
        message.isRootMessage = message.author === client.ownerId;
        return message;
    };

    command = async (
        client: BotClient,
        message: Message
    ): Promise<boolean | MessageId | undefined> => {
        const populatedMessage = await this.populateMessage(
            client,
            message as PopulatedMessage
        );
        return await onCommand.handle(client, populatedMessage);
    };

    message = async (
        client: BotClient,
        message: Message
    ): Promise<boolean | MessageId> => {
        // TODO: Handle group message, add points to user, etc.
        await this.populateMessage(client, message as PopulatedMessage);
        return true;
    };
}
