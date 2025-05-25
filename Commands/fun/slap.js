const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const axios = require('axios');
const config = require('../../config.json');

const GIPHY_API_KEY = config.GIFAPI;
const LIMIT = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('👋 Dale una cachetada a alguien (con cariño...)')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que deseas darle una cachetada')
                .setRequired(true)
        ),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('usuario');

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '¡No puedes darte una cachetada a ti mismo! 😅',
                ephemeral: true
            });
        }

        try {
            const { data } = await axios.get('https://api.giphy.com/v1/gifs/search', {
                params: {
                    q: 'anime slap',
                    api_key: GIPHY_API_KEY,
                    limit: LIMIT,
                    rating: 'pg',
                },
            });

            if (!data.data.length) {
                return interaction.reply({
                    content: 'No se encontró ningún GIF de cachetada. 😕',
                    ephemeral: true,
                });
            }

            const gifUrl = data.data[Math.floor(Math.random() * data.data.length)].images.original.url;

            const embed = new EmbedBuilder()
                .setColor(0xFF4500) // Naranja fuerte
                .setTitle('💥 ¡Cachetada!')
                .setDescription(`**${interaction.user.username}** le dio una tremenda cachetada a **${targetUser.username}** 😵`)
                .setImage(gifUrl)
                .setFooter({ text: 'Powered by Giphy', iconURL: 'https://giphy.com/static/img/giphy_logo_square_social.png' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error al obtener GIF de Giphy:', error);
            await interaction.reply({
                content: 'Ocurrió un error al intentar buscar un GIF. Intenta más tarde.',
                ephemeral: true,
            });
        }
    }
};
