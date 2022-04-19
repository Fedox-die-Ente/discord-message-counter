const Messages = require('../models/messages');
const Discord = require("discord.js")
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
    ], partials: ["CHANNEL"]
})
module.exports.run = async (client, message, args) => {
    const userMessages = await Messages.findOne({
        userID: message.author.id
    });
    // get first mention in message
    let firstMention = message.mentions.members.first();
    if(!firstMention) {
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: 'Counting', iconURL: client.user.displayAvatarURL()})
            .setDescription(`> Du hast **${userMessages.messages}** Nachrichten geschrieben.`)
            .setColor("#f5d611")
            .setFooter({text: "Message Counter by Fedox#1929"});
        message.channel.send({ embeds: [embed ]});
    } else {
        const memberMessages = await Messages.findOne({
            userID: firstMention.id
        });
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: 'Counting', iconURL: client.user.displayAvatarURL()})
            .setDescription(`> **${firstMention}** hat **${memberMessages.messages}** Nachrichten geschrieben.`)
            .setColor("#f5d611")
            .setFooter({text: "Message Counter by Fedox#1929"});
        message.channel.send({ embeds: [embed ]});
    }
    
}