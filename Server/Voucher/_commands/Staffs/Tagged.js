const { Client, Message, MessageButton, MessageActionRow } = require("discord.js");

const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "taglı",
    Komut: ["tagaldır","tagli","tag"],
    Kullanim: "tag <@acar/ID>",
    Aciklama: "Belirlenen üyeyi komutu kullanan üyenin taglısı olarak belirler.",
    Kategori: "stat",
    Extend: ayarlar.type,
    
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
    let embed = new genEmbed()
    if(!roller.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return;
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.reply(cevaplar.üye).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(message.author.id === uye.id) return message.reply(cevaplar.kendi).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(ayarlar.type && !uye.user.username.includes(ayarlar.tag)) return message.reply(cevaplar.taglıalım).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    if(Date.now()-uye.user.createdTimestamp < 1000*60*60*24*7) return message.reply(cevaplar.yenihesap).then(x => {
      setTimeout(() => {
        x.delete()
      }, 7500);
    });
    let kontrol = await Users.findOne({_id: uye.id})
    if(kontrol && kontrol.Tagged) return message.reply(`${cevaplar.prefix} ${uye} isimli üye zaten bir başkası tarafından taglı olarak belirlenmiş.`).then(x => {
      setTimeout(() => {
        x.delete().catch(err => {})
      }, 5000)
    });
    embed.setDescription(`${message.member.toString()} isimli yetkili seni taglı olarak belirlemek istiyor. Kabul ediyor musun?`);
    let Row = new MessageActionRow().addComponents(
      new MessageButton()
      .setCustomId("OK")
      .setEmoji(message.guild.emojiGöster(emojiler.Onay))
      .setLabel("Kabul Ediyorum!")
      .setStyle("SUCCESS"),
      new MessageButton()
      .setCustomId("NO")
      .setEmoji(message.guild.emojiGöster(emojiler.Iptal))
      .setLabel("Kabul Etmiyorum!")
      .setStyle("SECONDARY"),
    )
    message.channel.send({content: uye.toString(), embeds: [embed], components: [Row]}).then(async (msg) => {
      const filter = i => i.user.id === uye.id
      const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], time: 30000 })
      collector.on('collect', async (i) => {
        if(i.customId == "OK") { 
          message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
          await Users.updateOne({ _id: uye.id }, { $set: { "Tagged": true, "TaggedGiveAdmin": message.member.id } }, { upsert: true })
          await Users.updateOne({ _id: message.member.id }, { $push: { "Taggeds": { id: uye.id, Date: Date.now() } } }, { upsert: true })
          msg.delete().catch(err => {})
          message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${uye.toString()} üyesi ${message.author} tarafından <t:${String(Date.now()).slice(0, 10)}:R> başarıyla taglı olarak belirledi!`)], components: []}).catch(err => {})
          let taglıLog = message.guild.kanalBul("taglı-log")
          if(taglıLog) taglıLog.send({embeds: [embed.setDescription(`${uye} isimli üye <t:${String(Date.now()).slice(0, 10)}:R> ${message.author} tarafından taglı olarak belirlendi.`)]})      
          client.Upstaffs.addPoint(message.member.id,_statSystem.points.tagged, "Taglı")
          message.member.Leaders("tag", _statSystem.points.tagged, {type: "TAGGED", user: uye.id})
          i.deferUpdate().catch(err => {})
        }
        if(i.customId == "NO") {
          msg.edit({content: message.member.toString(), components: [],embeds: [new genEmbed().setColor("RED").setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} ${uye.toString()} isimli üye, **${message.guild.name}** taglı belirleme teklifini reddetti!`)], components: []}).catch(err => {});
          message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
          i.deferUpdate().catch(err => {})
        }
      })
      collector.on('end', i => {
        msg.delete().catch(err => {})
      }) 
    }).catch(err => {})
    }
};