const Discord = { Client, Message, Util} = require("discord.js");

module.exports = {
    Isim: "emojilistele",
    Komut: ["emojiid", "emojiler"],
    Kullanim: "emojilistele",
    Aciklama: "",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    let veri = message.guild.emojis.cache.map(emoji => `(${emoji.id}) ${emoji.toString()}`).join('\n')
    const arr = Discord.Util.splitMessage(veri, { maxLength: 1950, char: "\n" });
    arr.forEach(element => {
       message.channel.send(Discord.Formatters.codeBlock("diff", element));
    });
  }
};