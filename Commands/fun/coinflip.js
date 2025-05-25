const { SlashCommandBuilder , EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Lanza una moneda al azar'),
    async execute(interaction) {
        const result = Math.floor(Math.random() * 2) + 1;
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🎲 Moneda')
            .addFields(
                { name: 'Resultado', value: result === 1 ? 'Cara' : 'Cruz' },
                { name: 'Requerido por', value: interaction.user.username, inline: true },
            );
        await interaction.reply({ embeds: [embed] });
    }
}
