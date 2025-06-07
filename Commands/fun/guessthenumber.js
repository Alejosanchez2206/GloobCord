const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adivinaelnumero')
        .setDescription('🎯 Adivina un número aleatorio entre 1 y 250')
        .addIntegerOption(option =>
            option.setName('numero')
                .setDescription('Tu intento (número entre 1 y 250)')
                .setMinValue(1)
                .setMaxValue(250)
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const userGuess = interaction.options.getInteger('numero');
            const randomNumber = Math.floor(Math.random() * 250) + 1;

            let resultEmbed;

            if (userGuess === randomNumber) {
                resultEmbed = new EmbedBuilder()
                    .setColor('#7CFC00')
                    .setTitle('🎉 ¡Felicidades!')
                    .setDescription(`🎯 Has adivinado el número correctamente.\nEl número era **${randomNumber}**.`);
            } else {
                resultEmbed = new EmbedBuilder()
                    .setColor('#fbd9ff')
                    .setTitle('❌ Fallaste')
                    .setDescription(`🙈 Lo siento, el número correcto era **${randomNumber}**.`);
            }

            await interaction.reply({ embeds: [resultEmbed] });

        } catch (error) {
            console.error(`Error en /guessthenumber: ${error}`);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('⚠️ Error interno')
                    .setDescription('Ha ocurrido un error al intentar ejecutar este comando.')
                ],
                ephemeral: true
            });
        }
    }
};
