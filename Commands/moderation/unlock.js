const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Desbloquea el canal para todos los roles con acceso.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        try {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return interaction.reply({ content: '🚫 No tienes permiso para usar este comando.', ephemeral: true });
            }

            const channel = interaction.channel;

            if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === interaction.guild.id)) {
                await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });

                const embed = new EmbedBuilder()
                    .setTitle('🔓 Canal desbloqueado')
                    .setDescription('El canal ha sido desbloqueado para todos los roles con acceso.')
                    .setColor(0x7D5A50)
                    .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });
            }


        } catch (err) {
            console.log(err);
        }
    }
}