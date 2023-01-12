import { permissionFromRole } from '../../../utils/defaultValues';
import BotClient from '../../../utils/interfaces/BotClient';
import { PopulatedMessage } from '../../../utils/interfaces/PopulatedMessage';

class CommandHandler {
    async handle(client: BotClient, message: PopulatedMessage) {
        const command = await this.selectCommand(client, message);
        if (!command) return false;
        const hasPermission = await this.hasPermission(client, message);
        if (!hasPermission) {
            await client.sendMessage(
                message.from,
                'You do not have permission to use this command'
            );
            return false;
        }

        return command.handler(client, message as PopulatedMessage);
    }

    private async selectCommand(client: BotClient, message: PopulatedMessage) {
        const trigger = message.body.split(' ')[0].toLowerCase();
        const command = client.commands.find((command) =>
            command.triggers.includes(trigger.substring(1))
        );
        if (!command || !command.active) return;
        message.command = command;
        return command;
    }

    public async hasPermission(
        client: BotClient,
        message: PopulatedMessage
    ): Promise<boolean> {
        if (message.isRootMessage) {
            return true;
        }

        const commandLevel =
            permissionFromRole[message?.command?.role || 'OWNER'];

        let userLevel = permissionFromRole.USER;
        if (commandLevel === permissionFromRole.ADMIN) {
            const groupAdmins = await client.getGroupAdmins(
                message.chat.groupMetadata.id
            );
            const isAdmin = groupAdmins.includes(message.sender.id);
            if (!isAdmin) {
                userLevel = permissionFromRole.USER;
                return false;
            }
            userLevel = permissionFromRole.ADMIN;
        }
        return userLevel >= commandLevel;
    }
}

export default new CommandHandler();
