const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Obtiene informacion de un rol')
        .addRoleOption(option => option.setName('rol').setDescription('Rol').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
      
    async execute(interaction) {
        try{
            const role = interaction.options.getRole('rol');
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Informacion del rol ${role.name}`)
                .addFields(
                    { name: 'Nombre', value: `${role.name}`  , inline: false },
                    { name: 'ID', value: `${role.id}`  , inline: false },
                    { name: 'Color', value: `${role.hexColor}`  , inline: false },
                    { 
                        name: 'Permisos', 
                        value: role.permissions.toArray().join(', ').length ? role.permissions.toArray().join(', ') : 'No tiene permisos' , 
                        inline: false 
                    },
                    { name : 'Miembros', value : `${role.members.size}` , inline: false },
                    { name: 'Menciones', value: `${role.mentionable ? 'Si' : 'No'}` , inline: false },
                    { name: 'Posicion', value: `${role.position}`, inline: false },
                )
                .setFooter({ text: `Solicitado por ${interaction.user.username}`  , iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
        }catch(err){
            console.log(err);
        }
    }
}