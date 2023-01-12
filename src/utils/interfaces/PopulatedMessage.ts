import { Message } from '@open-wa/wa-automate';
import Command from './Command';

export type PopulatedMessage = Message & {
    command: Command | null;
    isRootMessage: boolean;
    validMessage: boolean;
};
