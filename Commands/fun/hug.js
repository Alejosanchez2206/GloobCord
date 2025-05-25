const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const axios = require('axios');
const config = require('../../config.json');

const GIPHY_API_KEY = config.GIFAPI;
const LIMIT = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('🤗 Dale un abrazo a alguien especial')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que deseas abrazar')
                .setRequired(true)
        ),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('usuario');

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '¡No puedes abrazarte a ti mismo! 🫂',
                ephemeral: true
            });
        }

        try {
            const { data } = await axios.get('https://api.giphy.com/v1/gifs/search', {
                params: {
                    q: 'anime hug',
                    api_key: GIPHY_API_KEY,
                    limit: LIMIT,
                    rating: 'pg',
                },
            });

            if (!data.data.length) {
                return interaction.reply({
                    content: 'No se encontró ningún GIF de abrazo. 😢',
                    ephemeral: true,
                });
            }

            const gifUrl = data.data[Math.floor(Math.random() * data.data.length)].images.original.url;

            const embed = new EmbedBuilder()
                .setColor(0xFFC0CB) // Rosa claro
                .setTitle('🫂 ¡Abrazo virtual!')
                .setDescription(`**${interaction.user.username}** le dio un cálido abrazo a **${targetUser.username}** 💞`)
                .setImage(gifUrl)
                .setFooter({ text: 'Powered by Giphy', iconURL: 'https://giphy.com/static/img/giphy_logo_square_social.png' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al obtener GIF de Giphy:', error);
            await interaction.reply({
                content: 'Ocurrió un error al intentar buscar un GIF de abrazo. Intenta de nuevo más tarde.',
                ephemeral: true,
            });
        }
    }
};
