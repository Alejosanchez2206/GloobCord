const {
    SlashCommandBuilder , 
    EmbedBuilder, 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('@discordjs/builders');

const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Obtener la informacion del bot'),
    async execute(interaction) {
        try{
           const { client } = interaction;          
           const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
           const totalChannels = client.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0);
           const totalCommands = client.commands.size;
           const totalEvents = client.events.size;
           
           const uptime = client.uptime;
           const days = Math.floor(uptime / 86400000);
           const hours = Math.floor((uptime % 86400000) / 3600000);
           const minutes = Math.floor((uptime % 3600000) / 60000);
           const seconds = Math.floor((uptime % 60000) / 1000);

           const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
           const cpuUsage = os.cpus()[0].model;
           const operatorSystem = os.type() + ' ' + os.release();

           const embed = new EmbedBuilder()
           .setColor(0x0099FF)
           .setTitle('Informacion del bot')
           .addFields(
               {
                 name : "Desarrollador",
                 value : "Alejo Sanchez",
                 inline : false
               } , 
               {
                 name : "Version",
                 value : "1.0.0",
                 inline : false
               },
               {
                 name : "Usuarios en el servidor",
                 value : `${totalMembers}`,
                 inline : false
               } , 
               {
                 name : "Canales del servidor",
                 value : `${totalChannels}`,
                 inline : false
               } , 
               {
                 name : "Comandos del bot",
                 value : `${totalCommands}`,
                 inline : false
               } , 
               {
                 name : "Eventos del bot",
                 value : `${totalEvents}`,
                 inline : false
               } ,
               {
                 name : "Tiempo en linea del bot",
                 value : `${days}d ${hours}h ${minutes}m ${seconds}s`,
                 inline : false
               },
               {
                 name : "Uso de memoria del bot",
                 value : `${memoryUsage.toFixed(2)} MB`,
                 inline : false
               },
               {
                 name : "CPU",
                 value : `${cpuUsage}`,
                 inline : false
               },
               {
                 name : "Sistema operativo",
                 value : `${operatorSystem}`,
                 inline : false
               }
           );
           await interaction.reply({ embeds : [embed] });
           
        }catch(err){
            console.log(err);
        }
    }

}