import {
    ChatId,
    Client,
    ContactId,
    GroupChatId,
    MessageId,
} from '@open-wa/wa-automate';
import { version } from '../package.json';
import BotClient from './utils/interfaces/BotClient';
import Command from './utils/interfaces/Command';

export default class ClientBot implements BotClient {
    clientOptions: unknown;
    clientVersion = '';
    isActive = true;
    version = version;
    isDebug = false;
    ownerId: ChatId;
    runtimeEnv: string;
    receivedCallsList = [];
    commands: Command[] = [];

    constructor(readonly waClient: Client) {
        const ownerIdFromEnv = process.env.OWNER_ID;
        const runtimeEnvFromEnv = process.env.RUNTIME_ENV;
        if (!runtimeEnvFromEnv) throw new Error('Missing runtime env');
        if (!ownerIdFromEnv) throw new Error('Missing owner id env');
        this.runtimeEnv = runtimeEnvFromEnv;
        this.ownerId = ownerIdFromEnv as ChatId;
    }

    async blockContact(chatId: ContactId): Promise<boolean> {
        return await this.waClient.contactBlock(chatId);
    }

    async leaveGroup(chatId: GroupChatId): Promise<boolean> {
        return await this.waClient.leaveGroup(chatId);
    }

    async sendMessage(
        to: ChatId,
        message: string
    ): Promise<boolean | MessageId> {
        return await this.waClient.sendText(to, message);
    }

    async isConnected(): Promise<boolean> {
        return this.waClient.isConnected();
    }

    async joinGroup(link: string) {
        return await this.waClient.joinGroupViaLink(link, true);
    }

    async getGroupAdmins(chatId: GroupChatId): Promise<ContactId[]> {
        return await this.waClient.getGroupAdmins(chatId);
    }
}
