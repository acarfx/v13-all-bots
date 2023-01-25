const { Client, Message, MessageEmbed } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

module.exports = {
    Isim: "etiketle",
    Komut: ["roletiketle"],
    Kullanim: "etiketle <etiketRol/RolID> <Sebep>",
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
   * @param {Message} msg 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!ayarlar.staff.includes(message.member.id) && !message.member.permissions.has('ADMINISTRATOR') && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if(!rol) return message.reply(cevaplar.argümandoldur).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let sebep = args.splice(1).join(" ");
    if(!sebep) return message.reply(cevaplar.sebep).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    message.delete().catch(err => {})
    message.channel.send({content: `${rol}`, embeds: [new genEmbed().setColor("WHITE").setFooter(message.member.user.tag + " tarafından etiketlendirildi.").setDescription(`${sebep}`)]})
  }
}