const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const axios = require('axios');
const config = require('../../config.json');

const GIPHY_API_KEY = config.GIFAPI;
const LIMIT = 10; // Puedes aumentar el límite para más variedad

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('💋 Dale un beso a alguien especial')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('El usuario al que deseas besar')
                .setRequired(true)
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('usuario');
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '¡No puedes besarte a ti mismo! 🙃',
                ephemeral: true,
            });
        }

        try {
            const { data } = await axios.get('https://api.giphy.com/v1/gifs/search', {
                params: {
                    q: 'anime kiss',
                    api_key: GIPHY_API_KEY,
                    limit: LIMIT,
                    rating: 'pg', // puedes cambiar a 'g' si prefieres
                },
            });

            if (!data.data.length) {
                return interaction.reply({
                    content: 'No se encontró ningún GIF de beso. 😢',
                    ephemeral: true,
                });
            }

            const gif = data.data[Math.floor(Math.random() * data.data.length)].images.original.url;

            const embed = new EmbedBuilder()
                .setColor(0xFF69B4) // Color rosa
                .setTitle('💋 ¡Beso enviado!')
                .setDescription(`**${interaction.user.username}** le dio un tierno beso a **${targetUser.username}**`)
                .setImage(gif)
                .setFooter({ text: 'Powered by Giphy', iconURL: 'https://giphy.com/static/img/giphy_logo_square_social.png' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al buscar GIF en Giphy:', error);
            return interaction.reply({
                content: 'Ocurrió un error al buscar el GIF. Intenta de nuevo más tarde. 😓',
                ephemeral: true,
            });
        }
    },
};
