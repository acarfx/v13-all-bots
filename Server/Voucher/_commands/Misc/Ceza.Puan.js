const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "cezapuan",
    Komut: ["ceza-puan", "cezapuan", "yetkilicezanotu","ceza-notu","cezanotu"],
    Kullanim: "cezapuan <@acar/ID>",
    Aciklama: "Belirtilen üyenin veya komutu kullanan üyenin ceza puanını veya yetkili ceza notunu belirtir.",
    Kategori: "diğer",
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
      let uye =  message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.author.id)
      let embed = new genEmbed().setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true}));
      let cezaPuan = await uye.cezaPuan() || 0
      if((roller.Yetkiler && roller.Yetkiler.some(x => uye.roles.cache.has(x))) || (roller.kurucuRolleri && roller.kurucuRolleri.some(x => uye.roles.cache.has(x))) || uye.permissions.has("ADMINISTRATOR")) {
        let yetkiliCezaNotu = await uye.yetkiliCezaPuan() || 200
        message.reply({embeds: [embed.setDescription(`${uye} isimli yetkilinin yetkili ceza notu **${yetkiliCezaNotu}**, ceza puanı ise **${cezaPuan}** puandır.`)]}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500);
        })
      } else {
        message.reply({embeds: [embed.setDescription(`${uye} isimli üyesinin ceza puanı **${cezaPuan}** puan.`)]}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500);
        })
      }
  }
};