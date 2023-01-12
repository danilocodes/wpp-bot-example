import {
    Chat,
    ChatId,
    Client,
    ContactId,
    GroupChatId,
    MessageId,
} from '@open-wa/wa-automate';
import Command from './Command';

export default interface BotClient {
    // variables
    waClient: Client | undefined;
    clientOptions: unknown;
    clientVersion: string;
    isActive: boolean;
    isDebug: boolean;
    version: string;
    ownerId: ChatId;
    runtimeEnv: string;
    receivedCallsList: ChatId[];
    commands: Command[];

    // methods
    sendMessage: (to: ChatId, message: string) => Promise<boolean | MessageId>;
    isConnected: () => Promise<boolean>;
    leaveGroup: (chatId: GroupChatId) => Promise<boolean>;
    joinGroup: (link: string) => Promise<string | number | boolean | Chat>;
    blockContact: (chatId: ContactId) => Promise<boolean>;
    getGroupAdmins: (chatId: GroupChatId) => Promise<ContactId[]>;
}
