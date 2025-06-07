const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const hearts = "❤️";
const empty = "🖤";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love')
        .setDescription('💘 Calcula el amor entre dos personas')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El primer usuario 💖')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('usuario2')
                .setDescription('El segundo usuario 💖')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user1 = interaction.options.getUser('usuario');
        const user2 = interaction.options.getUser('usuario2');

        const love = Math.floor(Math.random() * 101);
        const loveLevel = Math.floor(love / 10);
        const loveBar = hearts.repeat(loveLevel) + empty.repeat(10 - loveLevel);

        // Mensaje dependiendo del porcentaje
        let loveMessage = "";
        if (love <= 10) {
            loveMessage = "💔 Mejor ni intentarlo… ¡Son como el agua y el aceite!";
        } else if (love <= 30) {
            loveMessage = "😅 Quizás como amigos... pero no hay mucha chispa.";
        } else if (love <= 50) {
            loveMessage = "🙂 Hay algo... pero necesitan más tiempo juntos.";
        } else if (love <= 70) {
            loveMessage = "💞 ¡Hay química! Esto podría funcionar con esfuerzo.";
        } else if (love <= 90) {
            loveMessage = "💕 ¡El amor está en el aire! Son una gran pareja.";
        } else {
            loveMessage = "💍 ¡Almas gemelas! ¡Casamiento YA!";
        }



        const embed = new EmbedBuilder()
            .setTitle(`💘 Compatibilidad amorosa`)
            .setDescription(`✨ ¡Veamos qué tan fuerte es la conexión entre **${user1.username}** y **${user2.username}**!`)
            .addFields(
                {
                    name: '❤️ Porcentaje de amor',
                    value: `**${love}%** de compatibilidad\n${loveMessage}`,
                    inline: false
                },
                {
                    name: '💞 Termómetro del amor',
                    value: loveBar,
                    inline: false
                }
            )
            .setThumbnail(user1.displayAvatarURL({ format: 'png', size: 256 }))
            .setImage(`https://api.popcatdev.repl.co/ship?user1=${encodeURIComponent(user1.displayAvatarURL({ format: 'png' }))}&user2=${encodeURIComponent(user2.displayAvatarURL({ format: 'png' }))}`)
            .setColor(0xFF69B4)
            .setFooter({ text: '💖 Test de amor 100% real no fake' })
            .setTimestamp();


        await interaction.reply({ embeds: [embed] });
    }
};
