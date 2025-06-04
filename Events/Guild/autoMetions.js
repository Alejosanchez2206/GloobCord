const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

const GIPHY_API_KEY = config.GIFAPI;
const LIMIT = 10;

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        try {
            if (message.author.bot) return;

            // Verificar si el mensaje contiene la mención del autor
            const userMention = `<@${message.author.id}>`;
            const userNicknameMention = `<@!${message.author.id}>`;

            if (message.content.includes(userMention) || message.content.includes(userNicknameMention)) {

                const query = 'me abrazo a mi mismo'; // Palabra clave para búsqueda de GIF

                const response = await axios.get('https://api.giphy.com/v1/gifs/search',  {
                    params: {
                        q: query,
                        api_key: GIPHY_API_KEY,
                        limit: LIMIT,
                        rating: 'pg',
                        lang: 'es' // Cambiado a español por ejemplo
                    }
                });

                const gifs = response.data.data;

                if (!gifs.length) {
                    return message.channel.send({ content: 'No se encontraron GIFs 😕' });
                }

                const randomIndex = Math.floor(Math.random() * gifs.length);
                const gifUrl = gifs[randomIndex].images.original.url;

                // Crear embed con el GIF
                const embed = new EmbedBuilder()
                    .setDescription(`${message.author} se está mencionando a sí mismo... 🤨`)
                    .setImage(gifUrl)
                    .setColor('Random');

                // Enviar mensaje
                await message.channel.send({ embeds: [embed] });
            }

        } catch (err) {
            console.error('Error en evento messageCreate:', err);
            await message.channel.send({ content: 'Hubo un error al procesar tu solicitud.' });
        }
    }
};