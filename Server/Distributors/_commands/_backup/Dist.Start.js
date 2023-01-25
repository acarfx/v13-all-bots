const { Client, Message, MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const { guildBackup } = require('../../../../Global/Init/Guild.Backup');
module.exports = {
    Isim: "start",
    Komut: ["start"],
    Kullanim: "yedek @acar/ID",
    Aciklama: "Sunucudaki üyeler içerisinde tagı olmayanları kayıtsıza at.",
    Kategori: "-",
    Extend: false,
    
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
    if(!client.Distributors && client.Distributors.length < 1) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined); 
    await client.startDistributors()
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
 }
};