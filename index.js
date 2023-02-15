const { DisTube } = require('distube')
const Discord = require('discord.js')

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ]
})
const fs = require('fs')
const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

const chalk = require('chalk')
const Ascii = require('ascii-table')

const table = new Ascii().setHeading('Command', 'Status')

client.config = require('./config.json')
client.distube = new DisTube(client, {
  // searchSongs : 5,
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji
client.prefix = config.prefix

fs.readdir('./commands/', (err, files) => {
  if (err) return console.log('Could not find any commands!')
  const jsFiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsFiles.length <= 0) return console.log('Could not find any commands!')
  jsFiles.forEach(file => {
    const cmd = require(`./commands/${file}`)
    table.addRow(cmd.name, '✅')
    client.commands.set(cmd.name, cmd)
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
  console.log(table.toString())
})

client.on('ready', () => {
  console.log(`${chalk.greenBright(client.user.username)} is ready to play music.`)

  client.user.setActivity(`${client.prefix}help`, {
    type: 0
  })
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  const prefix = config.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (message.guildId === '162334486460235777') {
    if (message.channelId !== '778426788011180140') {
      message.delete()
      return message.channel.send(`${message.author} Please use <#778426788011180140>`).then(msg => {
        setTimeout(() => msg.delete(), 10000)
      })
    }
  }
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  }
  try {
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
})

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user.username
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user.username}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))
  .on('searchResult', (message, result) => {
    let i = 0
    message.channel.send(
         `**Choose an option from below**\n${result
             .map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
             .join('"\n"')}\n*Enter anything else or wait 60 seconds to cancel*`
    )
  })
  .on('searchCancel', message => message.channel.send(`${client.emotes.error} | Searching canceled`))
  .on('searchInvalidAnswer', message =>
    message.channel.send(
         `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
    )
  )
  .on('searchDone', () => {})

client.login(config.token)

// cece <3
