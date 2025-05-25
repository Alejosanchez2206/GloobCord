const { ChannelType } = require('discord.js');
const GuildConfig = require('../../Models/TempVoicechat');

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(oldState, newState) {
        const guild = newState.guild;
        const guildId = guild.id;

        // Obtener configuración del servidor
        const config = await GuildConfig.findOne({ guildId });

        if (!config || !config.enabled) {
            console.log(`[voiceStateUpdate] Sistema desactivado o sin configuración en ${guildId}`);
            return;
        }

        const mainChannelId = config.voiceChannelId;
        const categoryId = config.categoryId;

        if (!mainChannelId || !categoryId) {
            console.warn(`[voiceStateUpdate] Canal o categoría no configurados`);
            return;
        }

        let mainChannel, category;

        try {
            mainChannel = await guild.channels.fetch(mainChannelId);
            category = await guild.channels.fetch(categoryId);
        } catch (err) {
            console.error('[voiceStateUpdate] Error al buscar canales:', err);
            return;
        }

        // Validaciones de tipo de canal
        if (!mainChannel || mainChannel.type !== ChannelType.GuildVoice) {
            console.error(`[voiceStateUpdate] Canal principal no encontrado o no es de voz`);
            return;
        }

        if (!category || category.type !== ChannelType.GuildCategory) {
            console.error(`[voiceStateUpdate] Categoría no encontrada`);
            return;
        }

        // Usuario entra a un canal
        if (newState.channelId && !oldState.channelId) {
            const newChannel = newState.channel;

            if (newChannel.id === mainChannelId) {
                try {
                    // Crear nuevo canal temporal
                    const tempChannel = await guild.channels.create({
                        name: `Sala  #${guild.channels.cache.filter(c => c.parentId === categoryId && c.type === ChannelType.GuildVoice).size + 1}`,
                        type: ChannelType.GuildVoice,
                        parent: categoryId,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                allow: ['ViewChannel', 'Connect']
                            }
                        ]
                    });

                    console.log(`[voiceStateUpdate] Canal creado: ${tempChannel.name}`);

                    // Mover usuario al canal recién creado
                    await newState.member.voice.setChannel(tempChannel);
                } catch (err) {
                    console.error(`[voiceStateUpdate] Error al crear o mover al usuario:`, err);
                }
            }
        }

        // Usuario sale de un canal
        if (oldState.channelId) {
            const oldChannel = oldState.channel;

            if (
                oldChannel &&
                oldChannel.parentId === categoryId &&
                oldChannel.type === ChannelType.GuildVoice &&
                oldChannel.members.size === 0 &&
                oldChannel.id !== mainChannelId // no eliminar el canal principal
            ) {
                try {
                    await oldChannel.delete();
                    console.log(`[voiceStateUpdate] Canal eliminado: ${oldChannel.name}`);
                } catch (err) {
                    console.error(`[voiceStateUpdate] Error al eliminar el canal:`, err);
                }
            }
        }
    }
};
