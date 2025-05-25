const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Bloquea o desbloquea el canal para todos los roles con acceso.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return interaction.reply({ content: '🚫 No tienes permiso para usar este comando.', ephemeral: true });
            }

            const channel = interaction.channel;

            if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === interaction.guild.id)) {
                await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });

                const embed = new EmbedBuilder()
                    .setTitle('🔒 Canal bloqueado')
                    .setDescription('El canal ha sido bloqueado para todos los roles con acceso.')
                    .setColor(0x7D5A50)
                    .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });
            }

        } catch (err) {
            console.error(err);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: '❌ Ocurrió un error al ejecutar el comando.' });
            } else {
                await interaction.reply({ content: '❌ Ocurrió un error inesperado.', ephemeral: true });
            }
        }
    }
};
