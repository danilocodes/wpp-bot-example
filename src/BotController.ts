import { ChatId, Client, Message } from '@open-wa/wa-automate';
import { onGroupAdded } from './handlers/events/onGroupAdded/onGroupAdded';
import { onMessage } from './handlers/events/onMessage/onMessage';
import BotClient from './utils/interfaces/BotClient';
import Command from './utils/interfaces/Command';
import logger, { parseMessage } from './utils/logger';

export default class BotController {
    constructor(readonly client: BotClient, readonly commands: Command[]) {
        if (this.client.waClient) {
            // this.initialiseDatabase();
            this.initialiseHandlers(this.client.waClient);
            this.loadCommands();
            this.sendStartMessage();
            this.listenToIncomingCalls(this.client.waClient);
            this.listenToGroupAdded(this.client.waClient);
            // this.listenToParticipantsChange(waClient);
        } else {
            throw new Error('Missing waClient');
        }
    }

    private initialiseHandlers(waClient: Client): void {
        waClient.onMessage(async (message: Message) => {
            if (!this.client.isActive) return;
            const logMessage = parseMessage(message);
            logger.info(logMessage);
            if (message.type === 'chat') {
                await onMessage(this.client, message);
            }
            // TODO: Handle other message types
        });
    }

    private async initialiseDatabase(): Promise<void> {
        // TODO: Initialise database
        throw new Error('Database not implemented');
    }

    private async sendStartMessage(): Promise<void> {
        const isConnected = await this.client.isConnected();
        if (isConnected) {
            setTimeout(() => {
                this.client.sendMessage(
                    this.client.ownerId as ChatId,
                    `Bot running with version v${this.client.version}`
                );
                logger.info(`Bot running with version v${this.client.version}`);
            }, 5000);
        } else {
            logger.error('Bot not connected');
        }
    }

    private async loadCommands(): Promise<void> {
        this.client.commands = this.commands;
    }

    private listenToGroupAdded(waClient: Client): void {
        waClient.onAddedToGroup(async (chat) => {
            await onGroupAdded(this.client, chat);
        });
    }

    private listenToIncomingCalls(waClient: Client): void {
        waClient.onIncomingCall(async (call) => {
            await waClient.sendText(
                call.peerJid,
                'Sorry I cannot accept calls'
            );
        });
    }

    private listenToParticipantsChange(waClient: Client): void {
        waClient.onGlobalParticipantsChanged(async (evt) => {
            // TODO: Handle participants change
            throw new Error(`Participants change not implemented ${evt}`);
        });
    }
}
