const { ButtonStyle } = require('discord.js');
const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'help',
  aliases: ['h', 'cmd', 'command'],
  async run(client, message){
    const prefix = config.prefix;
    const embed1 = new Discord.EmbedBuilder()
    .setTitle('Commands')
    .setDescription(`Click the page buttons to browse the commands!\nThe current prefix is \`${prefix}\` !`)
    .setColor('0xFFB6C1')
    .addFields({name: `${prefix}join`, value: "- Senbo joins the voice channel you are currently in!"})
    .addFields({name: `${prefix}play`, value: `- Senbo plays the requested song!`})
    .addFields({name: `${prefix}queue`, value: "- Displays the queue of songs!"})
    .addFields({name: `${prefix}nowplaying`, value: "- Displays the song playing currently!"})
    .addFields({name: `${prefix}pause`, value: "- Senbo stops playing the song!"})
    .addFields({name: `${prefix}resume`, value: "- Senbo continues playing the song!"})
    .addFields({name: `${prefix}skip`, value: "- Senbo will skip to the next song in the queue!"})

    const embed2 = new Discord.EmbedBuilder()
    .setTitle('Commands')
    .setDescription(`Click the page buttons to browse the commands!\nThe current prefix is \`${prefix}\` !`)
    .setColor('0xFFB6C1')
    .addFields({name: `${prefix}autoplay`, value: "- Senbo will try and find songs that relate to your last played song!"})
    .addFields({name: `${prefix}filters`, value: "- Senbo adds audio filters overlaying the song!"})
    .addFields({name: `${prefix}volume`, value: "- Senbo adjusts the volume!"})
    .addFields({name: `${prefix}repeat`, value: "- Senbo will play the song or queue again and again and again an-"})
    .addFields({name: `${prefix}forward`, value: "- Senbo will skip the amount of time you want him to!"})
    .addFields({name: `${prefix}rewind`, value: "- Senbo will rewind the amount of time you want him to!"})
    .addFields({name: `${prefix}seek`, value: "- Senbo will skip to the specific time you want him to!"});

    const embed3 = new Discord.EmbedBuilder()
    .setTitle('Commands')
    .setDescription(`Click the page buttons to browse the commands!\nThe current prefix is \`${prefix}\` !`)
    .setColor('0xFFB6C1')
    .addFields({name: `${prefix}playtop`, value: "- Senbo will queue a song to the first position of the queue!"})
    .addFields({name: `${prefix}playskip`, value: "- Senbo will queue a song and skip the current one!"})
    .addFields({name: `${prefix}skipto`, value: "- Senbo will skip to a specific part of the queue"})
    .addFields({name: `${prefix}stop`, value: "- Senbo will stop entirely!"})
    .addFields({name: `${prefix}previous`, value: "- Senbo will play the song before this one!"})
    .addFields({name: `${prefix}shuffle`, value: "- Senbo shuffles the queue... randomly!"})
    .addFields({name: `${prefix}help`, value: "- Senbo displays a list of all of his commands!"});

    const button = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
      .setCustomId(`page1`)
      .setLabel(`Page 1`)
      .setStyle(ButtonStyle.Success),
      new Discord.ButtonBuilder()
      .setCustomId('page2')
      .setLabel(`Page 2`)
      .setStyle(ButtonStyle.Success),
      new Discord.ButtonBuilder()
      .setCustomId(`page3`)
      .setLabel(`Page 3`)
      .setStyle(ButtonStyle.Success),
    )

    const msg = await message.reply({ embeds: [embed1], components: [button]});
    const collector = await msg.createMessageComponentCollector();

    collector.on('collect', async i => {
      if(i.customId === 'page1'){

        if(i.user.id !== message.author.id){
          return await i.reply({content: `Only ${message.author.tag} can use these buttons!`, ephemeral: true});
        }
        await i.update({ embeds: [embed1], components: [button]});
      }
      if(i.customId === 'page2'){

        if(i.user.id !== message.author.id){
          return await i.reply({content: `Only ${message.author.tag} can use these buttons!`, ephemeral: true});
        }
        await i.update({ embeds: [embed2], components: [button]});
      }
      if(i.customId === 'page3'){

        if(i.user.id !== message.author.id){
          return await i.reply({content: `Only ${message.author.tag} can use these buttons!`, ephemeral: true});
        }
        await i.update({ embeds: [embed3], components: [button]});
      }
    })
  }
}
