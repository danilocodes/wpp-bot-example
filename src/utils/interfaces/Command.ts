import { MessageId } from '@open-wa/wa-automate';
import BotClient from './BotClient';
import { PopulatedMessage } from './PopulatedMessage';

export default interface Command {
    triggers: string[];
    description: string;
    price: number;
    type: string;
    role: 'OWNER' | 'ADMIN' | 'USER';
    active: boolean;
    handler: (
        client: BotClient,
        message: PopulatedMessage
    ) => Promise<boolean | MessageId | undefined>;
}
