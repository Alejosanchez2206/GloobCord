const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const tempVoicechats = require('../../Models/TempVoicechat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configtempvoice')
        .setDescription('Configurar el voicechat temporal')
        .addChannelOption(option => option.setName('channel').setDescription('Canal de voz').setRequired(true))
        .addChannelOption(option => option.setName('category').setDescription('Categoría').setRequired(true)),
    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel');
            const category = interaction.options.getChannel('category');

            if (!channel || !category) {
                return interaction.reply({ content: '❌ Debes proporcionar un canal de voz y una categoría.', ephemeral: true });
            }

            await tempVoicechats.findOneAndUpdate({ guildId: interaction.guild.id }, { voiceChannelId: channel.id, categoryId: category.id }, { upsert: true });

            const embed = new EmbedBuilder()
                .setTitle('⚙️ Configuración de voicechat temporal')
                .setDescription(`El voicechat temporal ha sido configurado en el canal ${channel} y la categoría ${category}.`)
                .setColor(0x7D5A50)
                .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.log(err);
        }

    }
}