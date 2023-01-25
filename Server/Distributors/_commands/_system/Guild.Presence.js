const { Client, Message, Util, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const StatsSchema = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats');
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const { genEmbed } = require("../../../../Global/Init/Embed");
const ms = require('ms')
module.exports = {
    Isim: "yapılandırma",
    Komut: ["yapilandir","yapılandır","yapilandirma"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
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
    

      let msg = await message.reply({content: `Yapılandırma hizmeti yükleniyor... Lütfen bekleyin!`});

      let Row = new MessageActionRow().addComponents(
          new MessageButton()
          .setCustomId("isimyapilandirma")
          .setLabel("Toplu İsim Yapılandırması")
          .setStyle("SECONDARY")
          .setEmoji("998210562586583060"),
          new MessageButton()
          .setCustomId("tagyapilandirma")
          .setLabel("Toplu Tag Yapılandırması")
          .setStyle("SECONDARY")
          .setEmoji("998210562586583060"),
          new MessageButton()
          .setCustomId("sunucuyapılandırma")
          .setLabel("Sunucu Yapılandırması")
          .setStyle("SECONDARY")
          .setEmoji("998210562586583060"),
          new MessageButton()
          .setCustomId("kanalrolyapilandirma")
          .setLabel("Toplu Kanal/Rol Yapılandırması")
          .setStyle("SECONDARY")
          .setEmoji("998210562586583060"),
      )

      await msg.edit({content: null,components: [Row], embeds: [
        
        new genEmbed().setThumbnail(message.guild.iconURL({dynamic: true}))
        .setDescription(`Aşağıda bulunan düğmeler ile \`${message.guild.name}\` sunucusunun bot ve sunucu yapılandırma işlemlerini yapabilirsiniz. Yapılandırma işlemi yapıldığında, botunuzun çalışmasını kolaylaştıracaktır. Sunucu yapısı değiştiğinde, sunucu ismi veya tagı değiştiğinde tüm yapılandırmaları bu panelden yapabilirsiniz. Artık tek tek uğraşmaya son.`)
        .setColor("RANDOM")

      ]})

      var filter = (i) => i.user.id == message.author.id;
      let collector = msg.createMessageComponentCollector({filter: filter, time: 60000})

      collector.on("collect", async (i) => {
          if(i.customId == "isimyapilandirma") {
              message.guild.members.cache.filter(x => !x.user.bot)
              .forEach(async (uye) => {
                let data = await Users.findOne({_id: uye.id})
                if(data && data.Name && data.Gender == "Kayıtsız") {
                  if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${data.Name}`).catch(err => {})
                  if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${data.Name}`).catch(err => {})
                  if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} ${data.Name}`).catch(err => {})
                } else {
                  if(uye && uye.manageable && ayarlar.type && ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} İsim | Yaş`).catch(err => {})
                  if(uye && uye.manageable && !ayarlar.type && ayarlar.isimyas) await uye.setNickname(`İsim | Yaş`).catch(err => {})
                  if(uye && uye.manageable && !ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`Kayıtsız`).catch(err => {})
                  if(uye && uye.manageable && ayarlar.type && !ayarlar.isimyas) await uye.setNickname(`${uye.user.username.includes(ayarlar.tag) ? ayarlar.tag : (ayarlar.tagsiz ? ayarlar.tagsiz : (ayarlar.tag || ""))} Kayıtsız`).catch(err => {})
                }

      
              })
              i.reply({content: `**Başarıyla!** ${message.guild.name} sunucusunun isimleri yapılandırıldı! ${message.guild.emojiGöster(emojiler.Onay)}`, ephemeral: true})
          }
         
      })

      collector.on("end", async (i, reason) => {
        if(reason == "time"){
          await msg.delete().catch(err => {})
        }
      })

    }
};