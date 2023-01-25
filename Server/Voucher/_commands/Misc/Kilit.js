const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "kilit",
    Komut: ["chatkilit", "kitle"],
    Kullanim: "kilit @acar/ID",
    Aciklama: "Komutun kullanıldığı metin kanalına yazmayı engeller.",
    Kategori: "yönetim",
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
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
    let embed = new genEmbed()
    if(!roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
    if (message.channel.permissionsFor(everyone).has('SEND_MESSAGES')) {
      await message.channel.permissionOverwrites.edit(everyone.id, { SEND_MESSAGES: false });
      await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} \`#${message.channel.name}\`  isimli metin kanalına yazmanız kapatıldı.`)] })
    } else {
      await message.channel.permissionOverwrites.edit(everyone.id, { SEND_MESSAGES: true });
      await message.channel.send({ embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`#${message.channel.name}\`  isimli metin kanalına yazmanız açıldı.`)] });
    };

    }
};