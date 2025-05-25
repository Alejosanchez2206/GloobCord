const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Cambia el apodo de un usuario.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario al que deseas cambiar el apodo')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('nick')
                .setDescription('El nuevo apodo que deseas asignar')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('usuario');
            const nick = interaction.options.getString('nick');

            const member = interaction.guild.members.cache.get(user.id) 
                        || await interaction.guild.members.fetch(user.id);

            await member.setNickname(nick);

            const embed = new EmbedBuilder()
                .setTitle('👤 Nick cambiado')
                .setDescription(`El nick de ${user} ha sido cambiado a **${nick}**.`)
                .setColor(0x7D5A50)
                .setFooter({ text: `Solicitado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();


            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ No se pudo cambiar el apodo. Verifica que tengo los permisos necesarios.', ephemeral: true });
        }
    }
};
