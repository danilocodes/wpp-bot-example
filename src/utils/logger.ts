import { Message } from '@open-wa/wa-automate';
import winston from 'winston';

export const parseMessage = (message: Message) => {
    const {
        type,
        body,
        isGroupMsg,
        timestamp,
        chat: { formattedTitle },
        sender: { formattedName, pushname },
    } = message;
    return `${new Date(timestamp * 1000).toLocaleString('pt-BR')} | ${
        isGroupMsg ? formattedTitle : 'PRIVATE'
    }: [ ${pushname || formattedName} ] - ${
        type === 'chat' ? body : 'type: ' + type
    }`;
};

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'bot' },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.RUNTIME_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.cli(),
        })
    );
}

export default logger;
