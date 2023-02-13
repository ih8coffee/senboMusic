const Discord = require('discord.js')

module.exports = {
    name: 'donate',
    aliases: ['support', 'givememoney'],
    run: async (client, message) => {
        const kofi = "https://ko-fi.com/eralp";
        const embed = new Discord.EmbedBuilder()
        .setTitle("Support me!")
        .setColor('0xFFB6C1')
        .setDescription(`Senbo runs on very little and your support means I can continue working on him :D`)
        .addFields({name:`buy me a coffee!`, value: `${kofi}`})
        .setURL(kofi);
        await message.reply({embeds: [embed]});
    }
  }
  