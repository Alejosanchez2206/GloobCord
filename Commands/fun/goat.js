const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const axios = require('axios');
const config = require('../../config.json'); // Asegúrate de tener tu API KEY ahí

const GIPHY_API_KEY = config.GIFAPI;
const LIMIT = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goat')
        .setDescription('Envía un GIF aleatorio de cabras 🐐'),

    async execute(interaction) {
        try {
            const query = 'goat'; // Palabra clave
            const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
                params: {
                    q: query,
                    api_key: GIPHY_API_KEY,
                    limit: LIMIT,
                    rating: 'pg',
                    lang: 'en'
                }
            });

            const gifs = response.data.data;
            if (!gifs.length) {
                return interaction.reply({ content: 'No se encontraron cabras 🐐 :(', ephemeral: true });
            }

            const randomIndex = Math.floor(Math.random() * gifs.length);
            const gifUrl = gifs[randomIndex].images.original.url;

            const embed = new EmbedBuilder()
                .setTitle('🐐 ¡Una cabra salvaje apareció!')
                .setColor(0x7D5A50)
                .setImage(gifUrl)
                .setFooter({ text: 'Powered by Giphy', iconURL: 'https://giphy.com/static/img/giphy_logo_square_social.png' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Hubo un error al buscar cabras.', ephemeral: true });
        }
    }
};
