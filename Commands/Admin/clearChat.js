const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpiar el chat')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes a borrar (máximo 100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');

        try {
            // Fetch de los últimos "X" mensajes
            const messages = await interaction.channel.messages.fetch({ limit: cantidad });

            // Filtramos los mensajes que tengan menos de 14 días
            const filteredMessages = messages.filter(msg => {
                const diffDays = (Date.now() - msg.createdAt) / 1000 / 60 / 60 / 24;
                return diffDays < 14;
            });

            if (filteredMessages.size === 0) {
                return interaction.reply({
                    content: 'No hay mensajes recientes (menores a 14 días) para borrar.',
                    ephemeral: true
                });
            }

            // Borrado masivo
            await interaction.channel.bulkDelete(filteredMessages, true); // true = allow partial deletion

            // Confirmación
            await interaction.reply({
                content: `Se han borrado ${filteredMessages.size} mensajes (máximo permitido: 100 o menores a 14 días).`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error al ejecutar clear:', error);
            await interaction.reply({
                content: 'Hubo un error al intentar borrar los mensajes.',
                ephemeral: true
            });
        }
    }
};