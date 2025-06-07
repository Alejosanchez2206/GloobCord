const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require("ms");
const results = require("../../utils/filter.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hack')
        .setDescription('💻 "Hackea" a un miembro del servidor (por diversión).')
        .addUserOption(option =>
            option.setName('miembro')
                .setDescription('El miembro a "hackear"')
                .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.options.getMember('miembro');

        if (!member) {
            return await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("#fbd9ff")
                    .setTitle("❌ Error")
                    .setDescription("No se ha proporcionado una mención válida.")
                ],
                ephemeral: true
            });
        }

        // Mensaje inicial
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("#fbd9ff")
                .setDescription("💾 Recolectando datos del usuario, por favor espere...")
            ]
        });

        const waitTime = "6s";

        setTimeout(() => {
            const random = (field) => {
                const array = results["Resultados del hackeo"][field];
                return array[Math.floor(Math.random() * array.length)];
            };

            const embed = new EmbedBuilder()
                .setColor("#fbd9ff")
                .setAuthor({ name: `📡 Datos recolectados de: ${member.user.tag}` })
                .setDescription(
                    `🧠 Edad actual: ${random("Edad")}
🔮 Signo zodiacal: ${random("Zodiac")}
🩸 Tipo sanguíneo: ${random("Sangre")}
📞 Número de teléfono: ${random("Telefonos")}
📧 Correo electrónico: ${random("Emails")}
🌐 Dirección IP: ${random("IPS")}
🔑 Contraseña de Discord: ${random("Contraseñas")}
🏳️ País de origen: ${random("Pais")}`
                )
                .setFooter({ text: "🛡️ Este 'hackeo' es solo por diversión, no te lo tomes en serio." });

            interaction.editReply({ embeds: [embed] });
        }, ms(waitTime));
    }
};
