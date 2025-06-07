const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpsgame')
        .setDescription('🎮 Desafía al bot en un duelo de piedra, papel o tijeras')
        .addStringOption(option =>
            option.setName('eleccion')
                .setDescription('Tu jugada: piedra, papel o tijeras')
                .setRequired(true)
                .addChoices(
                    { name: 'Piedra', value: 'piedra' },
                    { name: 'Papel', value: 'papel' },
                    { name: 'Tijeras', value: 'tijeras' }
                )
        ),

    async execute(interaction) {
        try {
            const rps = ['tijeras', 'piedra', 'papel']; // Orden importa para la lógica
            const res = ['✂️ Tijeras', '🪨 Piedra', '📄 Papel'];

            const userChoice = interaction.options.getString('eleccion');
            const userIndex = rps.indexOf(userChoice);
            const botIndex = Math.floor(Math.random() * 3);

            let result;

            if (userIndex === botIndex) {
                result = '🤝 ¡Empate!';
            } else if (
                (userIndex === 0 && botIndex === 2) ||  // tijeras > papel
                (userIndex === 1 && botIndex === 0) ||  // piedra > tijeras
                (userIndex === 2 && botIndex === 1)     // papel > piedra
            ) {
                result = `🎉 ¡Has ganado, ${interaction.user.username}!`;
            } else {
                result = `😈 ${interaction.client.user.username} gana esta vez.`;
            }

            const embed = new EmbedBuilder()
                .setColor('#fbd9ff')
                .setTitle('🪨📄✂️ Piedra, Papel o Tijeras')
                .setDescription(`👤 Tú elegiste: **${res[userIndex]}**\n🤖 El bot eligió: **${res[botIndex]}**\n\n**Resultado:** ${result}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(`Error en /clientrps:`, error);
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Error interno')
                    .setDescription('Hubo un problema al procesar tu duelo.')
                ],
                ephemeral: true
            });
        }
    }
};
