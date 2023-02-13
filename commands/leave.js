module.exports = {
  name: 'leave',
  aliases: ['fuckoff'],
  run: async (client, message) => {
    client.distube.voices.leave(message)
  }
}
