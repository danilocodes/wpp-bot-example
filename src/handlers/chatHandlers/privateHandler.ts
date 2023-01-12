import { Message, MessageId } from '@open-wa/wa-automate';
import BotClient from '../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../utils/interfaces/PopulatedMessage';
import onCommand from '../events/onCommand/onCommand';

export default class PrivateChatHandler {
    validateMessage = async (
        client: BotClient,
        message: PopulatedMessage
    ): Promise<boolean> => {
        message.validMessage = message.author === client.ownerId;
        return true;
    };

    populateMessage = async (
        client: BotClient,
        message: PopulatedMessage
    ): Promise<PopulatedMessage> => {
        const populatedMessage = message as PopulatedMessage;
        populatedMessage.isRootMessage = message.author === client.ownerId;
        return populatedMessage;
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
        const populatedMessage = await this.populateMessage(
            client,
            message as PopulatedMessage
        );
        // TODO: Handle private message
        return client.sendMessage(
            populatedMessage.from,
            'Private message received'
        );
    };
}
