import 'dotenv/config';
import { create } from '@open-wa/wa-automate';
import options from './utils/clientOptions';
import logger from './utils/logger';
import BotController from './BotController';
import ClientBot from './Client';
import { commands } from './handlers/commands/commands';

// commands
const commandsList = Object.keys(commands).map((key: string) => commands[key]);

create(options)
    .then((client) => {
        const botClient = new ClientBot(client);
        new BotController(botClient, commandsList);
    })
    .catch((err) => logger.error(err));
