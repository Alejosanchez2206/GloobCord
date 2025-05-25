const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

const Response = require('../../Structures/8Ball');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pregunta a la bola magica y obtendra una respuesta')
        .addStringOption(option => option.setName('pregunta').setDescription('Pregunta').setRequired(true)),
    async execute(interaction) {
        try {
            const question = interaction.options.getString('pregunta');
            const response = Response[Math.floor(Math.random() * Response.length)];
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('🔮 Bola magica')
                .addFields(
                    { name: 'Pregunta', value: question },
                    { name: 'Respuesta', value: response },
                    { name: 'Requerido por', value: interaction.user.username, inline: true },
                );
            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
}