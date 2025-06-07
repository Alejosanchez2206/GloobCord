const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Juega al clásico Tic Tac Toe con otro usuario')
        .addUserOption(option => option.setName('oponente').setDescription('Usuario con el que jugar').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('oponente');
        if (!user || user.bot || user.id === interaction.user.id)
            return interaction.reply("Debes mencionar a otro usuario válido para jugar.");

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
        const tablero = Array(9).fill("⬜");
        let turno = interaction.user.id; // X inicia
        let movimientos = 0;
        let terminado = false;

        const renderTablero = () => {
            return `
${tablero.slice(0, 3).join(" ")}
${tablero.slice(3, 6).join(" ")}
${tablero.slice(6, 9).join(" ")}
            `;
        };

        const getGanador = () => {
            const lineas = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
                [0, 4, 8], [2, 4, 6],           // diagonales
            ];
            for (let [a, b, c] of lineas) {
                if (tablero[a] !== "⬜" && tablero[a] === tablero[b] && tablero[b] === tablero[c]) {
                    return tablero[a];
                }
            }
            return null;
        };

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🎮 Tic Tac Toe')
            .setDescription(`Turno de <@${turno}>\n${renderTablero()}`);

        const gameMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

        // Agregar las reacciones a las casillas del tablero
        for (const emoji of emojis) {
            await gameMessage.react(emoji);
        }

        const collector = gameMessage.createReactionCollector({
            filter: (reaction, userReacting) => {
                return emojis.includes(reaction.emoji.name) && !userReacting.bot && userReacting.id === turno;
            },
            time: 60000,
        });

        collector.on('collect', async (reaction, userReacting) => {
            if (terminado) return;

            const index = emojis.indexOf(reaction.emoji.name);
            if (tablero[index] !== "⬜") {
                reaction.users.remove(userReacting.id);
                return;
            }

            tablero[index] = turno === interaction.user.id ? "❌" : "⭕";
            movimientos++;
            const ganador = getGanador();

            if (ganador) {
                terminado = true;
                embed.setDescription(`🎉 ¡Ganador: ${turno === interaction.user.id ? interaction.user : user}! \n${renderTablero()}`);
                await gameMessage.edit({ embeds: [embed] });
                collector.stop();
                // Eliminar todas las reacciones al final
                await gameMessage.reactions.removeAll();
                return;
            } else if (movimientos === 9) {
                terminado = true;
                embed.setDescription(`🤝 ¡Empate! \n${renderTablero()}`);
                await gameMessage.edit({ embeds: [embed] });
                collector.stop();
                // Eliminar todas las reacciones al final
                await gameMessage.reactions.removeAll();
                return;
            }

            turno = turno === interaction.user.id ? user.id : interaction.user.id;
            embed.setDescription(`Turno de <@${turno}>\n${renderTablero()}`);
            await gameMessage.edit({ embeds: [embed] });

            reaction.users.remove(userReacting.id);
        });

        collector.on("end", async () => {
            if (!terminado) {
                embed.setDescription(`⏰ Tiempo agotado. \n${renderTablero()}`);
                await gameMessage.edit({ embeds: [embed] });
            }
            // Eliminar todas las reacciones al final
            await gameMessage.reactions.removeAll();
        });
    }
};
