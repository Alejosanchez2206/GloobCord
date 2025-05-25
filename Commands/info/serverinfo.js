const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');


module.exports = {
    data : new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Obtener informacion del servidor'),
  
    async execute(interaction) {
        try{
            const guild = interaction.guild;

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Informacion del servidor ${guild.name}`)
                .addFields(
                    { name: 'Sever ID', value: `${guild.id}`  , inline: false },
                    { name : 'Owner', value : `${guild.ownerId}`  , inline: false },	
                    { name: 'Region', value: `${guild.preferredLocale}`  , inline: false },
                    { name: 'Total de miembros', value: `${guild.members.cache.filter(member => !member.user.bot).size} Humanos\n${guild.members.cache.filter(member => member.user.bot).size} Bots`  , inline: false },
                    { name: 'Canal de voz', value: `${guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size}`  , inline: false },
                    { name: 'Canal de texto', value: `${guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size}`  , inline: false },
                    { name: 'Roles', value: `${guild.roles.cache.size}`  , inline: false },
                    { name: 'Emojis', value: `${guild.emojis.cache.size}`  , inline: false },
                
                )
                .setFooter({ text: `Solicitado por ${interaction.user.username}`  , iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
        }catch(err){
            console.log(err);
        }
    }
}