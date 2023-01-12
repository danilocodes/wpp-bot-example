import Command from '../../utils/interfaces/Command';
import { joinHandler } from './join/join';
import { pingHandler } from './ping/ping';

export type CommandsList = {
    [key: string]: Command;
};

export const commands: CommandsList = {
    ping: {
        triggers: ['ping', 'pg'],
        description: 'Ping the bot',
        price: 0,
        type: 'other',
        role: 'USER',
        active: true,
        handler: pingHandler,
    },
    join: {
        triggers: ['join', 'jn'],
        description: 'Join a group',
        price: 0,
        type: 'other',
        role: 'OWNER',
        active: true,
        handler: joinHandler,
    },
};
