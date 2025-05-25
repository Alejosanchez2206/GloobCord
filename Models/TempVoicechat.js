
const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
    voiceChannelId: { type: String }, 
    categoryId: { type: String } 
});

module.exports = mongoose.model('tempVoicechats', guildConfigSchema);