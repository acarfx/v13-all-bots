const { Client, Message, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const { genEmbed } = require('../../../../Global/Init/Embed');
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives');
const Invite = require('../../../../Global/Databases/Schemas/Global.Guild.Invites')
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Stats = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats')
const Heykeller = require('../../../../Global/Databases/Schemas/Others/Middle.Heykels')
let statConfig;
const moment = require('moment');
require("moment-duration-format");
require("moment-timezone");
const table = require('table');
const { 
  Modal,
  TextInputComponent, 
  showModal
} = dcmodal = require('discord-modals')

dcmodal(client)

let özellikler = [
    { name: "oğlak", type: "burç" },
    { name: "kova", type: "burç"},
    { name: "balık", type: "burç"},
    { name: "koç", type: "burç"},
    { name: "boğa", type: "burç"},
    { name: "ikizler", type: "burç"},
    { name: "yengeç", type: "burç"},
    { name: "aslan", type: "burç"},
    { name: "başak", type: "burç"},
    { name: "terazi", type: "burç"},
    { name: "akrep", type: "burç"},
    { name: "yay", type: "burç"},

    { name: "lovers", type: "ilişki"},
    { name: "alone", type: "ilişki"},

    {name: "pembe", type: "renkler"},
    {name: "mavi", type: "renkler"},
    {name: "turuncu", type: "renkler"},
    {name: "kırmızı", type: "renkler"},
    {name: "mor", type: "renkler"},
    {name: "beyaz", type: "renkler"},
    {name: "sarı", type: "renkler"},
    {name: "yeşil", type: "renkler"},
    {name: "siyah", type: "renkler"},

    {name: "dc", type: "oyun"},
    {name: "vk", type: "oyun"},

    {name: "bestFriendRolü", type: "diğer"},
    
    

 // Tekil, Rol, Kanal, Roller, Acmali, Cogul
  ];
module.exports = {
    Isim: "seçenek",
    Komut: ["seçeneksistem"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on('modalSubmit', async (modal) => {
      statConfig =  require('../../../../Global/Plugins/Staff/Sources/_settings')
      let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
      if(!guild) {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
      }
      let uye = guild.members.cache.get(modal.user.id)
      if(!uye)  {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
      }
      if(modal.customId == "istekoneri") {
        let logKanalı = guild.kanalBul("istek-öneri-log")
        if(!logKanalı) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `İstek-Öneri kanalı bulunmadığından dolayı, işleminize devam edemiyoruz. ${cevaplar.prefix}` , ephemeral: true })
        }
        let text = modal.getTextInputValue('textIstekOneri'); 
        let embed = new genEmbed().setFooter(`${uye.user.tag} • Yeni ${ayarlar.serverName} İstek/Öneri`, uye.user.avatarURL({dynamic: true}))
        let Etiket;
        if(roller && roller.Buttons && roller.Buttons.istekÖneriŞikayetSorumlusu) Etiket = `${uye.guild.roles.cache.get(roller.Buttons.istekÖneriŞikayetSorumlusu)}`
        logKanalı.send({content: Etiket ? Etiket : null, embeds: [embed.setDescription(`**Merhaba!** ${ayarlar.serverName} Yönetimi
${uye} isimli üyenin <t:${String(Date.now()).slice(0,10)}:F> tarihinde aşağıda istek veya önerisi belirtilmiştir.`)
        .addField(`İçerik`, `${text}`)
        ]})
        await modal.deferReply({ ephemeral: true })
        await modal.followUp({content: `Başarıyla istek veya öneriniz yönetime iletilmiştir. Teşekkür Ederiz! ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
      }
      if(modal.customId == "botsorun") {
        let logKanalı = guild.kanalBul("bot-sorun-log")
        if(!logKanalı) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Bot sorun kanalı bulunmadığından dolayı, işleminize devam edemiyoruz. ${cevaplar.prefix}` , ephemeral: true })
        }
        let text = modal.getTextInputValue('textsorun'); 
        let embed = new genEmbed().setFooter(`${uye.user.tag} • Yeni Bot Sorun Bildirimi`, uye.user.avatarURL({dynamic: true}))
        logKanalı.send({content: `<@327236967265861633>`, embeds: [embed.setDescription(`**Merhaba!** ${ayarlar.serverName} Yönetimi
${uye} isimli üyenin <t:${String(Date.now()).slice(0,10)}:F> tarihinde aşağıda bot sorunu bildirdi.`)
        .addField(`İçerik`, `${text}`)
        ]})
        await modal.deferReply({ ephemeral: true })
        await modal.followUp({content: `Başarıyla bot sorunu acar'a iletilmiştir. Teşekkür Ederiz! ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
      }
      if(modal.customId == "soruncozmecagir") {
        let logKanalı = guild.kanalBul("şikayet-log")
        if(!logKanalı) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Şikayet kanalı bulunmadığından dolayı, işleminize devam edemiyoruz. ${cevaplar.prefix}` , ephemeral: true })
        }
        let yetkiliRol = uye.guild.roles.cache.get(roller.altilkyetki);
        let uyeUstRol = uye.guild.roles.cache.get(uye.roles.highest.id)
       // if(yetkiliRol.rawPosition < uyeUstRol.rawPosition) {
       //   await modal.deferReply({ ephemeral: true })
      //    return await modal.followUp({content: `Yetkili olduğunuzdan dolayı, işleminize devam edemiyoruz. ${cevaplar.prefix}` , ephemeral: true })
      //  }
        let sorun = modal.getTextInputValue('sorun');  
        let hakkında = modal.getTextInputValue('hakkında');  
        let embed = new genEmbed().setFooter(`${uye.user.tag} • Yeni ${ayarlar.serverName} Sorun Çözme Çağırma Formu`, uye.user.avatarURL({dynamic: true}))
        logKanalı.send({content: `${roller.sorunÇözmeciler.map(x => uye.guild.roles.cache.get(x)).join(", ")}`, embeds: [embed.setDescription(`${uye} isimli cezalı bir üye sorun çözme çağırmak istiyor. Aktif olan sorun çözmecilerimizin bu olaya bakmasını istiyorum.`)
      .addField("Sorun Tipi",`> ${sorun}`)
      .addField("Sorun",`> ${hakkında}`)
    ]})
    await modal.deferReply({ ephemeral: true })
    await modal.followUp({content: `Başarıyla sorun çözmeye hatalı bildiri iletilmiştir. Teşekkür Ederiz! ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
      }
      if(modal.customId == "ybasvuru") {
        let logKanalı = guild.kanalBul("başvuru-log")
        if(!logKanalı) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Başvuru kanalı bulunmadığından dolayı, işleminize devam edemiyoruz. ${cevaplar.prefix}` , ephemeral: true })
        }
        let yetkiliRol = uye.guild.roles.cache.get(roller.altilkyetki);
        let uyeUstRol = uye.guild.roles.cache.get(uye.roles.highest.id)
        if(yetkiliRol.rawPosition < uyeUstRol.rawPosition) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Yetkili olduğunuzdan dolayı, işleminize devam edemiyoruz. ${cevaplar.prefix}` , ephemeral: true })
        }
        let isimyas = modal.getTextInputValue('isimyas');  
        let aktiflik = modal.getTextInputValue('aktiflik');  
        let yarar = modal.getTextInputValue('yarar');  
        let hakkında = modal.getTextInputValue('hakkında');
        let refernas = modal.getTextInputValue('referans');
        let embed = new genEmbed().setFooter(`${uye.user.tag} • Yeni ${ayarlar.serverName} Yetkili Başvurusu`, uye.user.avatarURL({dynamic: true}))
        let Etiket;
        if(ayarlar && roller.Buttons && roller.Buttons.genelSorumlular && roller.Buttons.sorumlulukSorumlusu) {
          Etiket = [...roller.Buttons.genelSorumlular, ...roller.Buttons.sorumlulukSorumlusu]
        }
        logKanalı.send({content: `${Etiket ? Etiket.map(x => guild.roles.cache.get(x)).join(", ") : `@everyone`}`, embeds: [embed.setDescription(`**Merhaba!** ${Etiket ? Etiket.map(x => guild.roles.cache.get(x)).join(", ") : ayarlar.serverName}

${uye} (**\`${isimyas}\`**) isimli üyesinin yaptığı <t:${String(Date.now()).slice(0,10)}:F> tarihindeki yetkili başvurusunun detayları aşağıda görüntülenmiştir.`)
.addField(`Referans Bilgisi`, `${refernas ? `${guild.members.cache.find(x => x.user.tag == refernas || x.user.username.includes(refernas) || x.id == refernas) ? guild.members.cache.find(x => x.user.tag == refernas || x.user.username.includes(refernas) || x.id == refernas) : `${refernas}`}` : "Bir referans belirtilmemiş."}`)
.addField(`Yetkilik Geçmiş Bilgisi`, `${aktiflik}`)
.addField(`Yaptırım Bilgisi`, `${yarar}`)
.addField(`Hakkında`, `${hakkında}`)
]})
        await modal.deferReply({ ephemeral: true })
        await modal.followUp({content: `Başarıyla yetkili başvuru kaydınız alınmıştır en kısa süreçte sizlere ulaşacağız, lütfen özel mesaj kutunuzu herkese açık yapın. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
      }  
  });

    client.ws.on('INTERACTION_CREATE', async interaction => {
      let GameMap = new Map([
          ["cezaListesi",roller.teyitciRolleri],
          ["lastPunitives",roller.teyitciRolleri],
          ["cezaPuanim",roller.teyitciRolleri],
          ["II", "123"],
          ["III", "123"],
          ["IV", "123"],
          ["V", "123"],
          ["VI", "123"],
          ["VII", "123"],
          ["VIII", "123"],
          ["IX", "123"],
          ["bestFriend", roller.Buttons ? roller.Buttons.bestFriendRolü ? roller.Buttons.bestFriendRolü : "123" : "123"],
  
      ])
      let name = interaction.data.custom_id        
      let guild = client.guilds.cache.get(sistem.SERVER.ID)
      let member = guild.members.cache.get(interaction.member.user.id)
      if(!GameMap.has(name) || !member) return;
      let Cezalar = await Punitives.find({Member: member.id})
      let InviteData = await Invite.findOne({ guildID: member.guild.id, userID: member.user.id });
      let returnText;
      if(name == "bestFriend") {
        let heykelKontrol = await Heykeller.findOne({_id: member.id})
        if(!heykelKontrol) {
          returnText = `**Üzgünüm!** Yakın arkadaş  listesine girebilmek için listeye eklenmen gerekli. Lütfen daha sonra tekrar deneyin! ${member.guild.emojiGöster(emojiler.Iptal)}`
        } else if(heykelKontrol) {
          if(roller.Buttons.bestFriendRolü && member.roles.cache.has(roller.Buttons.bestFriendRolü)) {
            returnText = `${member.guild.emojiGöster(emojiler.Iptal)} **Alınmış!** Daha önce alındığı için 00:00 Saatini beklemelisin.`
          } else if(roller.Buttons.bestFriendRolü && !member.roles.cache.has(roller.Buttons.bestFriendRolü)) {
            member.roles.add(roller.Buttons.bestFriendRolü)
            returnText = `**Başarılı!** Artık Sende Bir Yakın Arkadaş Oldun!  ${member.guild.emojiGöster(emojiler.Onay)}`
          }
        }

      }
if(name == "cezaListesi") {
      let data = [["ID", "🔵", "Ceza Tarihi", "Ceza Türü", "Ceza Sebebi"]];
      data = data.concat(Cezalar.map(value => {          
          return [
              `#${value.No}`,
              `${value.Active == true ? "✅" : `❌`}`,
              `${tarihsel(value.Date)}`,
              `${value.Type}`,
              `${value.Reason}`
          ]
      }));
      let veriler = table.table(data, {
         columns: { 0: { paddingLeft: 1 }, 1: { paddingLeft: 1 }, 2: { paddingLeft: 1 }, 3: { paddingLeft: 1, paddingRight: 1 }, },
         border : table.getBorderCharacters(`void`),  
         drawHorizontalLine: function (index, size) {
             return index === 0 || index === 1 || index === size;
         }
      });
      returnText = `\`\`\`fix
${await Punitives.findOne({Member: member.id}) ? veriler : `Tebrikler! ${member.guild.name} sunucusun da sana ait ceza bilgisine ulaşılamadı.`}\`\`\``
      }
      
      if(name == "lastPunitives") {
          let sesMute = await Punitives.find({Member: member.id, Active: true, Type: "Ses Susturulma"})
          let chatMute = await Punitives.find({Member: member.id, Active: true, Type: "Metin Susturulma"})
          let Cezali = await Punitives.find({Member: member.id, Active: true, Type: "Cezalandırılma"})
          let aktifCezalarList = []
          if(Cezali) Cezali.forEach(ceza => {
              aktifCezalarList.push({
                  No: ceza.No,
                  Tip: ceza.Type,
                  Yetkili: ceza.Staff ? member.guild.members.cache.get(ceza.Staff) ? member.guild.members.cache.get(ceza.Staff) : `<@${ceza.Staff}>` : ayarlar.serverName,
                  Atılan: ceza.Duration? moment.duration(ceza.Duration- Date.now()).format("H [Saat], m [Dakika] s [Saniye]") : "Kalıcı",
                  Kalkma: `${moment.duration(ceza.Duration- Date.now()).format("H [saat], m [dakika] s [saniye]")} kaldı.`
              })
          })
          if(sesMute) sesMute.forEach(ceza => {
              aktifCezalarList.push({
                  No: ceza.No,
                  Tip: ceza.Type,
                  Yetkili: ceza.Staff ? member.guild.members.cache.get(ceza.Staff) ? member.guild.members.cache.get(ceza.Staff) : `<@${ceza.Staff}>` : ayarlar.serverName,
                  Atılan: ceza.Duration? moment.duration(ceza.Duration- Date.now()).format("H [Saat], m [Dakika] s [Saniye]") : "Kalıcı",
                  Kalkma: `${moment.duration(ceza.Duration- Date.now()).format("H [saat], m [dakika] s [saniye]")} kaldı.`
              })
          })
          if(chatMute) chatMute.forEach(ceza => {
              aktifCezalarList.push({
                  No: ceza.No,
                  Tip: ceza.Type,
                  Yetkili: ceza.Staff ? member.guild.members.cache.get(ceza.Staff) ? member.guild.members.cache.get(ceza.Staff) : `<@${ceza.Staff}>` : ayarlar.serverName,
                  Atılan: ceza.Duration? moment.duration(ceza.Duration- Date.now()).format("H [Saat], m [Dakika] s [Saniye]") : "Kalıcı",
                  Kalkma: `${ceza.Duration? moment.duration(ceza.Duration- Date.now()).format("H [Saat], m [Dakika] s [Saniye]") : "Kalıcı"}`
              })
          })

          returnText = `${aktifCezalarList ? 
aktifCezalarList.map(x => `${member.guild.emojiGöster(emojiler.Iptal)} ${x.Yetkili} tarafından **${x.Atılan}** süresince işlenen "__#${x.No}__" numaralı "__${x.Tip}__" türündeki cezalandırmanın kalkmasına **${x.Kalkma}** kaldı.`).join("\n") 
: `${member.guild.emojiGöster(emojiler.Onay)} Tebrikler! \`${member.guild.name}\` sunucusunda size ait aktif aktif cezaya ulaşılamadı.`}`
      }

      if(name == "cezaPuanim") {
              let cezaPuanı = await member.cezaPuan()
              returnText = `${member.guild.name} sunucunda **${await member.cezaPuan()}** ceza puanın bulunmakta.`
      }
      client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
              type: 4,
              data: {
                  content: returnText ? returnText : `${member.guild.emojiGöster(emojiler.Onay)} Tebrikler! \`${member.guild.name}\` sunucusunda size ait aktif cezaya ulaşılamadı.`,
                  flags: "64"
              }
          }
      })
      
  });
    client.on('interactionCreate', async (i) => {
      let member = await i.guild.members.cache.get(i.user.id)
      if(i.customId == "cdestekcik") {
        let canlıDestekBul = i.guild.kanalBul("canlı-destek")
        if(!canlıDestekBul) return i.reply({ephemeral: true, content: `Canlı destek sistemi kurulu olmadığından dolayı işleminize devam edilemiyor. ${cevaplar.prefix}`})
        const canlıDestekKategorisi = canlıDestekBul.parentId
        let canlıDestekRolü = []
        i.guild.roles.cache.array().filter(x => x.name.includes("Canlı Destek")).map(x => canlıDestekRolü.push(x.id))

        const evet = new MessageButton()
        .setCustomId("evt")
        .setLabel("Evet")
        .setStyle("SUCCESS")
  
        const hayır = new MessageButton()
        .setCustomId("hyr")
        .setLabel("Hayır")
        .setStyle("DANGER")
  
        const onay = new MessageButton()
        .setCustomId("onayla")
        .setLabel("Canlı Desteği Onayla")
        .setStyle("SUCCESS")
  
        const red = new MessageButton()
        .setCustomId("reddet")
        .setLabel("Reddet")
        .setStyle("DANGER")

        const dk = new MessageButton()
        .setCustomId("kapatCanliDestek")
        .setLabel("Desteği Sonlandır")
        .setStyle("SECONDARY")
        .setEmoji("🎫")

        const row2 = new MessageActionRow()
        .addComponents([evet, hayır])

        const row3 = new MessageActionRow()
        .addComponents([onay, red])

        const row31 = new MessageActionRow()
        .addComponents([dk])

        await i.reply({ embeds:[new genEmbed().setDescription(`Canlı desteğe bağlanmak istediğinize emin misiniz?`).setFooter(`gereksiz isteklerde yaptırım uygulanacaktır.`)] , components: [row2], ephemeral: true});
        var filter = (c) => c.user.id && i.user.id 
        let collector = i.channel.createMessageComponentCollector({filter: filter, max: 1, time: 30000})
        collector.on('collect', async (collect) => {
          if(collect.customId == "evt") {
            await i.editReply({embeds: [new genEmbed().setDescription(`Canlı destek ekibimize bildirdik, sizi canlı destek ekibine aktarıyorum. Lütfen bekleyin!`)], components: [], ephemeral: true});
            let logKanalı = i.guild.kanalBul("canlı-destek")
            if(logKanalı) logKanalı.send({content: `${canlıDestekRolü.map(x => i.guild.roles.cache.get(x)).join(", ")}`, embeds: [new genEmbed().setDescription(`${member} üyesi canlı desteğe bağlanmak istiyor. Kabul ediyor musunuz?`)], components: [row3]}).then(async (msg) => {
              var filter = (i) => {
                let uyecik = i.guild.members.cache.get(i.user.id)
                return canlıDestekRolü.some(x => uyecik.roles.cache.has(x))
              }
              let collector2 = msg.createMessageComponentCollector({ componentType: 'BUTTON', max: 1 });
              collector2.on("collect", async (interaction) => { 
                if(interaction.customId == "onayla") {
                  msg.edit({
                    content: null,
                    embeds : [new genEmbed().setDescription(`${member} üyesinin canlı desteği <t:${String(Date.now()).slice(0,10)}:F> tarihinde ${interaction.user} tarafından onaylandı. ${member.guild.emojiGöster(emojiler.Onay)}`)],
                    components : []
                  })
                  
                  member.guild.channels.create(`${member.user.tag}-destek`, {
                    parent: canlıDestekKategorisi,
                    topic: member.id,
                    permissionOverwrites: [{
                        id: member,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                      },
            
                      {
                        id: interaction.user,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                      },
                      {
                        id: member.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                      },
                    ],
                    type: 'text',
                  }).then(async c => { 
                    c.send({
                      embeds: [new genEmbed().setDescription(`Canlı destek kanalı başarıyla oluşturuldu.
**NOT:** Canlı destek almaktan vaz geçerseniz veya destek bitti ise aşağıda ki düğmeyi kullanabilirsiniz.`).setFooter(`bu canlı destek 5 dakika sonra kapatılacaktır.`)],
                      components : [row31]
                    }).then(async (cmsg) => {
                      let collectorcuk = cmsg.createMessageComponentCollector({time: 60000*5})
                      collectorcuk.on('collect', async (inte) => {
                        if(inte.customId == "kapatCanliDestek") {
                          inte.deferUpdate().catch(err => {})
                          cmsg.edit({embeds: [new genEmbed().setDescription(`${cmsg.guild.emojiGöster(emojiler.Onay)} ${inte.user} tarafından canlı destek kapatıldı. 10 Saniye içerisinde kanal yok olacaktır.`)],components: []})
                          setTimeout(() => {
                            c.delete().catch(err => {})
                          }, 10000);
                        }
                      })
                      collectorcuk.on('end', async (kapat) => {
                        c.delete().catch(err => {})
                      })
                    })
                    interaction.reply({content: `[ONAYLANDI] Canlı destek kanalı oluşturuldu.`, ephemeral: true})
                    member.send({
                     content: `Canlı destek isteğiniz başarıyla onaylandı!\nSunucumuzda bulunan <#${c.id}> kanalını ziyaret ediniz.`
                    }).catch(err => {});
                    
                  })

                }
                if(interaction.customId == "reddet") {
                  member.send(`Canlı destek isteğiniz, ${interaction.user} tarafından reddedildi. ${cevaplar.prefix}`).catch(err => {})
                  msg.edit({content: null, embeds: [new genEmbed().setDescription(`${cevaplar.prefix} ${member} üyesinin canlı destek isteği <t:${String(Date.now()).slice(0, 10)}:R> ${interaction.user} tarafından reddedildi.`)], components: []}).catch(err => {})
                  await interaction.reply({ephemeral: true, content: `${member.guild.emojiGöster(emojiler.Onay)} Başarıyla ${member} üyesinin, canlı desteğini iptal ettin.`}) 
                  setTimeout(() => {
                    msg.delete().catch(err => {})
                  }, 10000);        
                }
              })
            })

          }
          if(collect.customId == "hyr") {
            await i.editReply({content: `${member.guild.emojiGöster("support")} Canlı destek bağlantısını iptal ettiniz. İyi günler!`, components: [], ephemeral: true})
          }
        })
      }
      if(i.customId == "şüphelidenÇık") {
        let checkWeek = Date.now()-member.user.createdTimestamp <= 1000*60*60*24*7;
        let cezaPuan = await member.cezaPuan() 
        if(cezaPuan >= 50) {
          i.reply({content: `Ceza puanınız 50 ve üzeri olduğu için şüpheliden çıkamazsınız. ${cevaplar.prefix}`, ephemeral: true})
        }  else {
          if(checkWeek) {
            i.reply({content: `Şuan şüpheliden çıkman için çok erken! Daha sonra tekrar deneyin. ${cevaplar.prefix}`, ephemeral: true})
          } else {
            if(!member.roles.cache.has(roller.şüpheliRolü)) return i.reply({content: "Şüpheli değilsin ki!", ephemeral: true})
            member.setRoles(roller.kayıtsızRolleri)
            member.send(`Şüpheli olmadığınız belirlendi. Kayıtsız olarak sunucumuza hoş geldiniz.`).catch(err => {})
            i.reply({content: "Başarıyla şüpheliden çıkartıldın.", ephemeral: true})
          }
        }
        }

      if(i.customId == "sorunÇözmeci") {
        const modal = new Modal()
        .setCustomId('soruncozmecagir')
        .setTitle('Sorun Çözme Çağır')
        .addComponents(
          new TextInputComponent()
          .setCustomId('sorun')
          .setLabel('Sorun çeşiti?')
          .setStyle('SHORT')
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder('Örn: Yetkili şikayeti')
          .setRequired(true),
          new TextInputComponent()
          .setCustomId('hakkında')
          .setLabel('Sorunu anlatır mısınız?')
          .setStyle("LONG")
          .setMinLength(5)
          .setMaxLength(500)
          .setPlaceholder('Örn: Sebepsiz yere karantinaya düştüm, böyle böyle vs.')
          .setRequired(true)
        );
        showModal(modal, {
          client: client,
          interaction: i
        })
      }
       if(i.customId == "basvurucuk") {
          const modal = new Modal()
          .setCustomId('ybasvuru')
          .setTitle('Yetkili Başvuru Formu')
          .addComponents(
            new TextInputComponent()
            .setCustomId('isimyas')
            .setLabel('İsiminiz ve yaşınız ?')
            .setStyle('SHORT')
            .setMinLength(5)
            .setMaxLength(25)
            .setPlaceholder('Örn: Acar 20')
            .setRequired(true),
            new TextInputComponent()
            .setCustomId('referans')
            .setLabel('Referans')
            .setStyle('SHORT')
            .setMinLength(5)
            .setMaxLength(100)
            .setPlaceholder('Örn: acar#0001/ID')
            .setRequired(false),
            new TextInputComponent()
            .setCustomId('aktiflik')
            .setLabel('Daha önce yetkilik yaptınız mı?')
            .setStyle('SHORT')
            .setMinLength(1)
            .setMaxLength(250)
            .setPlaceholder('Örn: Evet yaptım, "xxx" sunucusunun yönetim kadrosundaydım.')
            .setRequired(true),
            new TextInputComponent()
            .setCustomId('yarar')
            .setLabel('Ne yapabilirsin bize açıklar mısınız?')
            .setStyle('LONG')
            .setMinLength(5)
            .setMaxLength(250)
            .setPlaceholder('Örn: Her işi yaparım vs.')
            .setRequired(true),
            new TextInputComponent()
            .setCustomId('hakkında')
            .setLabel('Hakkında bir kaç şey söylemek ister misin?')
            .setStyle("LONG")
            .setMinLength(5)
            .setMaxLength(400)
            .setPlaceholder('Örn: Telli enstrüman çalmayı çok seviyorum.')
            .setRequired(true)
          );
          showModal(modal, {
            client: client,
            interaction: i 
          })
        }
        if(i.customId == "soruniletcik") {
          const modal = new Modal()
          .setCustomId('botsorun')
          .setTitle('Sorunları İlet')
          .addComponents(
            new TextInputComponent()
            .setCustomId('textsorun')
            .setLabel('Sorunu anlatır mısınız?')
            .setStyle("LONG")
            .setMinLength(5)
            .setMaxLength(500)
            .setPlaceholder('Örn: Kayıt ederken bir hata oluştu ve kayıt edemiyorum.')
            .setRequired(true)
          );
          showModal(modal, {
            client: client,
            interaction: i
          })
        }
      if(i.customId == "istekönericik") {
        const istekOneri = new Modal() 
        .setCustomId('istekoneri')
        .setTitle('İstek & Öneri Formu')
        .addComponents(
          new TextInputComponent() 
          .setCustomId('textIstekOneri')
          .setLabel('İstek veya öneriniz nedir?')
          .setStyle('LONG')
          .setMinLength(10)
          .setMaxLength(980)
          .setPlaceholder('İsteğinizi ve önerinizi bizlere iletin..')
          .setRequired(true)
        );
        showModal(istekOneri, {
          client: client,
          interaction: i 
        })
      }
    })

    client.on('interactionCreate', async (i) => {
      let member = await i.guild.members.cache.get(i.user.id)
      let Cezalar = await Punitives.find({Member: member.id})
      let InviteData = await Invite.findOne({ guildID: member.guild.id, userID: member.user.id });
      if(i.customId == "kpaneli") {
      let name = i.values 
        const total = InviteData ? InviteData.total ? InviteData.total  : 0: 0;
    const regular = InviteData ? InviteData.regular ? InviteData.regular  : 0: 0;
    const bonus = InviteData ? InviteData.bonus ? InviteData.bonus  : 0: 0;
    const leave = InviteData ? InviteData.leave ? InviteData.leave  : 0: 0;
    const fake = InviteData ? InviteData.fake ? InviteData.fake  : 0: 0;
    const invMember = await Invite.find({ Inviter: member.user.id });
    const bazıları = invMember ? invMember.filter(value => member.guild.members.cache.get(value.userID)).slice(0, 7).map((value, index) => `\` • \`${member.guild.members.cache.get(value.userID)} (\`${value.userID}\`)`).join("\n") : undefined
    const daily = invMember ? member.guild.members.cache.filter((usr) => invMember.some((x) => x.userID === usr.user.id) && Date.now() - usr.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
    const weekly = invMember ? member.guild.members.cache.filter((usr) => invMember.some((x) => x.userID === usr.user.id) && Date.now() - usr.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;
    let toplamMesaj = 0
    let toplamSes = 0
    let statData = await Stats.findOne({ guildID: member.guild.id, userID: member.id})
        if(statData && statData.voiceStats) statData.voiceStats.forEach(c => toplamSes += c);
        if(statData && statData.chatStats)   statData.chatStats.forEach(c => toplamMesaj += c);
        let returnText;
        if(name == "I") returnText = `**${member.guild.name}** Sunucusuna <t:${Number(String(Date.parse(member.joinedAt)).substring(0, 10))}:R> katılmışsınız.`
        if(name == "II") returnText = `Üstünüzde bulunan rol(ler) şunlardır:
${member.roles.cache.filter(x => x.name != "@everyone" || x.id != roller.boosterRolü).map(x => `${x} (\`${x.id}\`)`).join("\n")} 
Üzeriniz de **${member.roles.cache.size}** adet rol(ler) bulunmaktadır.`
if(name == "XX") {
  let rol = []
  if(roller.Buttons && roller.Buttons.vk && member.roles.cache.has(roller.Buttons.vk)) rol.push(roller.Buttons.vk)
  if(roller.Buttons && roller.Buttons.dc && member.roles.cache.has(roller.Buttons.dc)) rol.push(roller.Buttons.dc)
  if(roller.etkinlikKatılımcısı && member.roles.cache.has(roller.etkinlikKatılımcısı)) rol.push(roller.etkinlikKatılımcısı)
  if(roller.cekilisKatılımcısı && member.roles.cache.has(roller.cekilisKatılımcısı)) rol.push(roller.cekilisKatılımcısı)
  member.roles.remove(rol).catch(err => {})
  returnText = "Üzerinizde bulunan etkinlik ve diğer roller temizlendi."
}
         if(name == "III") returnText = `Hesabını <t:${Number(String(Date.parse(member.user.createdAt)).substring(0, 10))}:F> tarihinde <t:${Number(String(Date.parse(member.user.createdAt)).substring(0, 10))}:R> açılmış.`
         if(name == "IV") returnText = `Aşağı da davet bilgileri detaylı bir şekilde listelendirilmiştir.

\`•\` **Toplam**: \` ${total + bonus} \` (**Bonus**: \` +${bonus} \`)
\`•\` **Girenler**: \` +${regular} \` (**Sahte**: \`${fake}\`, **Ayrılmış**: \` -${leave} \`)
\`•\` **Günlük**: \` +${daily} \`
\`•\` **Haftalık**: \` +${weekly} \`

${bazıları ? `\` ••❯ \` Davet edilen bazı kullanıcılar: 
${bazıları}` : ''}`
if(name == "V") returnText = `**${member.guild.name}** sunucunda **${await member.cezaPuan()}** ceza puanın bulunmakta.`
if(name == "VI") returnText = `**${member.guild.name}** Sunucusunun Bilgisi
Sunucumuz da **${global.sayılıEmoji(member.guild.memberCount)}** üye bulunmakta.
Sunucumuz da **${global.sayılıEmoji(member.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size)}** aktif üye bulunmakta.`
     
if(name == "VII") {
  let isimveri = await Users.findById(member.id)
    if(isimveri && isimveri.Names) {
      let isimler = isimveri.Names.length > 0 ? isimveri.Names.reverse().map((value, index) => `\` • \` ${value.Name}  ${value.Staff ? "(<@"+ value.Staff + ">)" : ""} (<t:${Number(String(value.Date).substring(0, 10))}:R>) [${value.State}]
──────────────────────`).join("\n") : "";
        returnText = `
Aşağıda sunucu içerisinde ki isimleriniz (**${isimveri.Names.length || 0}**) sıralandırılmıştır:
──────────────────────
${isimler}`
    } else {
        returnText = `${member.guild.name} sunucusunda isim kaydınız bulunamadı.`
     }
} 
let saatDakikaCevir = (date) => { return moment.duration(date).format('H [saat,] m [dakika]'); }; 
if(name == "VIII")  returnText = `**Merhaba! ${member.user.tag}** 
Haftalık toplamda **${saatDakikaCevir(toplamSes)}** boyunca zaman geçirmişsin.
Haftalık toplamda **${toplamMesaj} mesaj** istatistiğiniz bulunuyor.`
      
if(name == "isimGuncelleme") {
  let modal = new Modal()
	.setCustomId('isimDüzenleme')
	.setTitle('İsim Güncelleme')
	.addComponents(
		new TextInputComponent()
			.setCustomId('isim')
			.setLabel('Yeni İsim')
			.setStyle('SHORT') 
			.setPlaceholder('Yeni isminizi belirtin.')
			.setRequired(true), 

		
	);
  if(!member.roles.cache.has(roller.boosterRolü) && (roller.özelRoller && !roller.özelRoller.some(x => member.roles.cache.has(x))) && !member.permissions.has("ADMINISTRATOR") && !member.permissions.has("MANAGE_ROLES") ) {
   
    return  await i.reply({content: `Sunucumuza **boost** basmanız gerekmektedir.`, ephemeral: true})
}
  return showModal(modal, {
    client: client, 
    interaction: i,
  });
}
        await i.reply({content: `${returnText}`, ephemeral: true})
      }

    })
            client.on("interactionCreate", async (interaction) => {
                let menu = interaction.customId
                const member = await client.guilds.cache.get(sistem.SERVER.ID).members.fetch(interaction.member.user.id)
                if (!member) return;
                let Database = await GUILD_SETTINGS.findOne({guildID: sistem.SERVER.ID})
                const data = Database.Ayarlar.Buttons




                if (menu === "renks") {
                  let color = new Map([
                    ["kirmizi", data.kırmızı],
                    ["turuncu", data.turuncu],
                    ["mavi", data.mavi],
                    ["mor", data.mor],
                    ["pembe", data.pembe],
                    ["beyaz", data.beyaz],
                    ["yeşil", data.yeşil],
                    ["sarı", data.sarı],
                    ["siyah", data.siyah],
                  ])
                  let role = color.get(interaction.values[0])
                  let renkroller = [data.kırmızı, data.turuncu, data.mavi, data.mor, data.pembe, data.yeşil, data.sarı, data.siyah, data.beyaz]
                  if (!member.roles.cache.has(roller.tagRolü) && !member.roles.cache.has(roller.boosterRolü) && !member.permissions.has("ADMINISTRATOR")) {
                    interaction.reply({ content: `Sadece sunucumuza boost basmış ${ayarlar.type ? `veya taglı` : ``} üyeler renk rolü seçebilir. `, ephemeral: true })
                  } else {
                    if (interaction.values[0] === "rolsil") {
                      await member.roles.remove(renkroller)
                    } else if (role) {
                      if (renkroller.some(m => member.roles.cache.has(m))) {
                        await member.roles.remove(renkroller)
                      }
                      await member.roles.add(role)
                    }
                    interaction.reply({ content: `Rolleriniz güncellendi.`, ephemeral: true })
                  }
                } else if (menu === "valantines") {
                    let relationship = new Map([
                      ["couple", data.lovers],
                      ["single", data.alone]
                    ])
                    let role = relationship.get(interaction.values[0])
                    let roles = [data.lovers, data.alone]
                    if (interaction.values[0] === "rolsil") {
                      await member.roles.remove(roles)
                    } else if (role) {
                      if (roles.some(m => member.roles.cache.has(m))) {
                        await member.roles.remove(roles)
                      }
                      await member.roles.add(role)
                    }
                    interaction.reply({ content: "Rolleriniz güncellendi.", ephemeral: true })
                  } else if (menu === "games") {
                    let GameMap = new Map([
                      ["lol", data.lol],
                      ["csgo", data.csgo],
                      ["minecraft", data.minecraft],
                      ["valorant", data.valorant],
                      ["fortnite", data.fortnite],
                      ["gta5", data.gta5],
                      ["pubg", data.pubg],
                      ["wildrift", data.wildrift],
                      ["fivem", data.fivem],
                      ["mlbb", data.mobilelegends],
                    ])

                    let roles = [data.lol,data.csgo,data.minecraft, data.valorant, data.fortnite,data.gta5, data.pubg,data.wildrift, data.fivem, data.mobilelegends]
                    var role = []
                    for (let index = 0; index < interaction.values.length; index++) {
                      let ids = interaction.values[index]
                      let den = GameMap.get(ids)
                      role.push(den)
                    }
                    if (!interaction.values.length) {
                      await member.roles.remove(roles)
                    } else {
                      await member.roles.remove(roles)
                      await member.roles.add(role)
                    }
                    interaction.reply({ content: "Rolleriniz güncellendi.", ephemeral: true })
                  } else if (menu === "horoscope") {
                    let HorosCope = new Map([
                      ["koç", data.koç],
                      ["boğa", data.boğa],
                      ["ikizler", data.ikizler],
                      ["yengeç", data.yengeç],
                      ["aslan", data.aslan],
                      ["başak", data.başak],
                      ["terazi", data.terazi],
                      ["akrep", data.akrep],
                      ["yay", data.yay],
                      ["oğlak", data.oğlak],
                      ["kova", data.kova],
                      ["balık", data.balık],
                    ])
                    let roles = [data.koç, data.boğa, data.ikizler, data.yengeç, data.aslan, data.başak, data.terazi, data.akrep, data.yay, data.oğlak, data.kova, data.balık,
                    ]
                    let role = HorosCope.get(interaction.values[0])
                    if (interaction.values[0] === "rolsil") {
                      await member.roles.remove(roles)
                    } else if (role) {
                      if (roles.some(m => member.roles.cache.has(m))) {
                        await member.roles.remove(roles)
                      }
                      await member.roles.add(role)
                    }
                    interaction.reply({ content: "Rolleriniz güncellendi.", ephemeral: true })
              
                  } else if (menu === "etkinliks") {
                    let eventsMap = new Map([
                      ["etkinlik", roller.etkinlikKatılımcısı],
                      ["cekilis", roller.cekilisKatılımcısı],
                    ])
                    let roles = [roller.etkinlikKatılımcısı, roller.cekilisKatılımcısı]
                    var role = []
                    for (let index = 0; index < interaction.values.length; index++) {
                      let ids = interaction.values[index]
                      let den = eventsMap.get(ids)
                      role.push(den)
                    }
                    if (!interaction.values.length) {
                      await member.roles.remove(roles)
                    } else {
                      await member.roles.remove(roles)
                      await member.roles.add(role)
                    }
                    
                    interaction.reply({ content: "Rolleriniz güncellendi.", ephemeral: true })
                  }
            })

            client.on("interactionCreate", async (i) => { 
              let menu = i.customId
              const member = await client.guilds.cache.get(sistem.SERVER.ID).members.fetch(i.member.user.id)
              if (!member) return;
             if(menu == "KONTROLPANEL") {
              let info = [
                {header: "Yükseltim Nedir? Nasıl Yetki Atlanır?", description: `
Sunucumuz da yetki atlamak için hali hazırda Upstaff (**Terfi**) dediğimiz yani diğer adıyla Yükseltim (\` ${global.sistem.botSettings.Prefixs[0]}yetkim \`) sistemi bulunmaktadır.
Ayrıca sizin rolünüze uygun haftalık görevleriniz var ise \` ${global.sistem.botSettings.Prefixs[0]}görev \` komutu ile görevlerinizi görüntüleyebilirsiniz. Sistem üzerinden ayrıca ${ayarlar.serverName ? ayarlar.serverName : i.guild.name} Parası elde edebilirsiniz.
    
Seste kaldıkça, mesaj attıkça, taglı görevi yaptıkça, davet görevi yaptıkça, kayıt yaptıkça sistem üzerinden belirli bir puan elde ederek otomatik olarak adil bir şekilde yetki atlamanıza yarar fakat Sesteyseniz kulaklığınız kapalı ise hiç bir şekilde puan alamazsınız veya da ses süreniz devam etmez ayrıca mikrofonunuz kapalıysa sizi AFK algılayıp örnek olarak 15 puan vericekse o puan 3/1 olarak bölünecektir. AFK odasında AFK olarak algılanırsanız 3/1 değil 3/2 olarak puan belirlenecektir. 2 Hafta içerisinde hiç bir etkinliğiniz olmaz ise otomatik olarak yetkiniz çekilir ayrıca Toplantı zamanları Mazeretli değilseniz 2 toplantıya üst üste katılmazsanız sistemsel olarak yetkiniz tekrardan çekilir.`
    , image: "https://cdn.discordapp.com/attachments/921409976336007218/942299463253372988/unknown.png", category: "yukseltim"},
                {header: "Nasıl Kayıt Yapılır?", description: `\` 1. Adım \` Sunucumuz da doğru bir kayıt için öncelikle teyit kanalarında bulunmalısın ve gelen kayıtsız bir üyeye direk isim yaş sormak yerine onunla sohbet ederek ismini ve yaşını sormalısın.
    
\` 2. Adım \` Kayıt yapmak için \`.kayıt <@acar/ID> <İsim> <Yaş>\` komutu ile kayıt işlemine başlarsın orda konuştuğun üyenin cinsiyetini belirleyerek kayıt işlemini gerçekleştirirsin ve **5 Saniye** sonra Sohbet odalarına otomatik olarak üyeyi taşıma işlemi yapar.
                
\` ❯ \` Yükseltim sisteminde ki puanınıza (\` +${statConfig.points.record} Puan Etkisi \`) puan olarak ekler fakat kayıt ettiğiniz kişi kayıtsıza atılırsa veya sunucudan çıkarsa size verilen puan geri düşer.
\` ❯ \` Ayrıca kayıt ettiğiniz üye sunucumuzda yetkili olur ise onun kayıt ettiği, taglıya çektiği, davet ettiği ve yetkili başlattığı kadar sizde bonus alırsınız.
    
**Örnek Görsel**`, image: "https://cdn.discordapp.com/attachments/919637452648493116/942304484120461382/unknown.png", category: "kayıt"},
                {header: "Nasıl Davet Yapılır?", description: `\` DAVET (Invite) \` Sunucumuza bir üye davet etmek için öncelikle davet bağlantısı almanız gerekmekte, aldığınız davet bağlantısını davet etmek istediğiniz üyeye atarak sunucuda davet işlemini gerçekleştirirsiniz veya da sunucumuzun resmine basılı tutarak İnsanları Davet Et buttonunu kullanarak, arkadaşlarını davet edebilirsin ve davet ettiğin üye sayısını öğrenmek için \`${global.sistem.botSettings.Prefixs[0]}invite\` komutunu kullanabilirsin.
    
\` ❯ \` Her bir davet size yükseltim sisteminde \` +${statConfig.points.invite} Puan Etkisi \` ekleyecektir. Davet ettiğiniz üye sunucudan ayrılırsa davetinizden üye miktarı düşer ve yükseltim sisteminden kazandığınız (\` -${statConfig.points.invite} Puan Etkisi \`) olarak sisteminize yansır.
    
**Örnek Görsel**`, image: "https://cdn.discordapp.com/attachments/919637452648493116/942305761902592010/unknown.png", category: "davet"},
                {header: "Kaç Puan Kazanıyorum?", description: `Sunucumuz da yükseltim sisteminden kaç puan aldığınızı ve nereler de kaç puan aldığınızı aşağıda tabloda belirtilmektedir. 
Aşağı da verilen görsel de ise hangi işlemlerde toplam kaç puan kazandığınızı veya da hangi kategori ve kanalda kaç puan aldığınızı gösteren tablolar bulunmaktadır.
    
\` ❯ \` **Puan Bilgileri Ve Puanlamalar**
${ayarlar.type ? `\` • \` **Taglı**: \` +${statConfig.points.tagged} Puan Etkisi \`\n` : ``}\` • \` **Davet**: \` +${statConfig.points.invite} Puan Etkisi \`
\` • \` **Kayıt**: \` +${statConfig.points.record} Puan Etkisi \`
\` • \` **Mesaj**: \` +${statConfig.points.message} Puan Etkisi \`
Gereksiz kısa ve random mesajlar algılanarak puan verilmesini engeller ve ceza etkisi olarak size geri yaptırım uygular.
\` • \` **Etkinlik Katılımı**: \`Saatlik +${3600*Number(ayarlar.etkinlikPuan ? ayarlar.etkinlikPuan : 0.01)} Puan Etkisi\`
${ayarlar.etkinlikIzinliler ? `\` • \` Sadece etkinlik kategorileri ve kanallarında bu puan elde edilmektedir, kanal ve kategoriler şunlardır: \`${ayarlar.etkinlikIzinliler.filter(x => i.guild.channels.cache.get(x)).map(x => i.guild.channels.cache.get(x).name).join(", ")}\`` : ""}

\` ❯ \` **Ses Puanlama Bilgisi**
Öne çıkan kategoriler ve kanallar şunlardır: \`${statConfig.fullPointChannels.filter(x => i.guild.channels.cache.get(x)).map(x => i.guild.channels.cache.get(x).name).join(", ")}\`      
Ortalama olarak bu kategori ve kanallardan \` +%${statConfig.points.voice-2.4} \` puan kazanırsınız. Bu puan sizin afk, kulaklık ve mikrofon kapatmanız halinde yaptırımla beraber değişmektedir.
Yukarda belirtilen kategori ve __kanallar dışında ki diğer kanallardan__ ortalama olarak \` +%${statConfig.points.halfVoice} \` puan kazanırsınız. Bu puan sizin afk, kulaklık ve mikrofon kapatmanız halinde yaptırımla beraber değişmektedir.
    
**Puan Detay Bilgisi Görseli**`, image: "https://cdn.discordapp.com/attachments/919637452648493116/942310714989772841/unknown.png" ,category: "kaçpuan"}
    
            ] 
            if(ayarlar.type) info.push({header: "Taglı Nasıl Kullanılır?", description: `\` TAGLI (Tagged) \` Sunucumuz da davet ettiğin, kayıt ettiğin ve arkadaşlarını taga davet edebilirsin ettiğin arkadaşların ile puan kazanmak istemez misin? Ozaman \`${global.sistem.botSettings.Prefixs[0]}tag <@acar/ID>\` komutu ile taglı daveti gönderebilirsin ama ondan önce kesinlikle isminin ister başına ister sonuna \` ${ayarlar.tag} \` sembolünü koymalıdır ayrıca taga davet ettiğin üyeleri \`${global.sistem.botSettings.Prefixs[0]}taglılarım\` komutu ile görüntüleyebilirsin.
    
\` ❯ \` Taga davet ettiğiniz üye başına (\` +${statConfig.points.tagged} Puan Etkisi \`) eklenir ve tagı saldığında size verilen puan otomatik olarak geri düşer.
                
**Örnek Görsel**`, image: "https://cdn.discordapp.com/attachments/919637452648493116/942309234245263391/unknown.png", category: "taglı"})
              
              let kategori = i.values
               if(!kategori) return;
               let getInfo = info.find(x => i.values == x.category) 
               if(getInfo) {
                   let embed = new genEmbed().setTitle(getInfo.header).setDescription(getInfo.description)
                   if(getInfo.image) embed.setImage(getInfo.image)
                   i.reply({embeds: [embed], ephemeral: true})
               }
             }
          })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    
        const embed = new genEmbed()
        let Database = await GUILD_SETTINGS.findOne({guildID: message.guild.id})
        const data = Database.Ayarlar.Buttons
        let secim = args[0];
        let ozelliklerListe = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a))

        const buttonSatır = new MessageActionRow()
        .addComponents(
                new MessageButton()
                .setCustomId('etkinlikçekilişkur')
                .setLabel('🎉 Seçenek(ler) Kur')
                .setStyle('SECONDARY'),
                new MessageButton()
                .setCustomId('otomatikkur')
                .setLabel('Otomatik Oluştur')
                .setEmoji("927196659056791602")
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('yardimkur')
                .setLabel('Yardım Kur')
                .setEmoji("949923926031601724")
                .setStyle('SECONDARY'),
                new MessageButton()
                .setCustomId('ayarlar')
                .setLabel('🔨 Ayarları Görüntüle')
                .setStyle('DANGER'),
                new MessageButton()
                .setCustomId('kapatcik')
                .setLabel('Paneli Kapat')
                .setEmoji("929001437466357800")
                .setStyle('SECONDARY'),
            );
        const sywss = new MessageActionRow().addComponents(
          new MessageButton()
          .setCustomId('otomatikaylikuye')
          .setLabel('Aylık Üye Sistemi')
          .setDisabled(ayarlar.aylikUye && ayarlar.birAy && message.guild.roles.cache.get(ayarlar.birAy) ? true : false)
          .setEmoji("947548413250109520")
          .setStyle('SECONDARY'),
          new MessageButton()
          .setCustomId('otomatiksesrozet')
          .setLabel('Ses Rozeti Sistemi')
          .setDisabled(ayarlar.statRozet && ayarlar.statRozetOne && message.guild.roles.cache.get(ayarlar.statRozetOne) ? true : false)
          .setEmoji("947548413250109520")
          .setStyle('SECONDARY'),
        )
        const buttcuk = new MessageActionRow().addComponents(
            new MessageButton()
            .setCustomId('otomatikrenk')
            .setLabel('Otomatik Renk Kurulumu')
            .setDisabled(ayarlar.Buttons && ayarlar.Buttons.kırmızı && message.guild.roles.cache.get(ayarlar.Buttons.kırmızı) ? true : false)
            .setEmoji("947548413250109520")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('otomatikoyun')
            .setLabel('Otomatik Oyun Kurulumu')
            .setDisabled(ayarlar.Buttons && ayarlar.Buttons.csgo && message.guild.roles.cache.get(ayarlar.Buttons.csgo) ? true : false)
            .setEmoji("947548413250109520")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('otomatikburç')
            .setLabel('Otomatik Burç Kurulumu')
            .setDisabled(ayarlar.Buttons && ayarlar.Buttons.aslan && message.guild.roles.cache.get(ayarlar.Buttons.aslan) ? true : false)
            .setEmoji("947548413250109520")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('otomatikilişki')
            .setLabel('Otomatik Etkinlik & İlişki Kurulumu')
            .setDisabled(ayarlar.Buttons && ayarlar.Buttons.lovers && message.guild.roles.cache.get(ayarlar.Buttons.lovers) ? true : false)
            .setEmoji("947548413250109520")
            .setStyle('SECONDARY'),
            new MessageButton()
            .setCustomId('geriii')
            .setLabel('⏪ Geri Dön')
            .setStyle('PRIMARY'),
        )
            let satir2 = new MessageActionRow().addComponents(
              new MessageButton()
              .setCustomId('kpaneli')
              .setEmoji("947548404307881994")
              .setLabel("Kullanıcı Paneli")
              .setStyle("PRIMARY"),
              new MessageButton()
                .setCustomId('cezapanelikur')
                .setEmoji("948684327959547965")
                .setLabel('Ceza Paneli')
                .setStyle('PRIMARY'),
              new MessageButton()
                .setCustomId('yetkiliPaneli')
                .setEmoji("771063357620092969")
                .setLabel('Yetkili Paneli')
                .setStyle('PRIMARY'),
              new MessageButton()
                .setCustomId('yöneticiPaneli')
                .setEmoji("947548404307881994")
                .setLabel("Yönetici Paneli")
                .setStyle("PRIMARY"),
                new MessageButton()
                .setCustomId('özelmenü')
                .setEmoji("939147205867077662")
                .setLabel("Özel Menü")
                .setStyle("SECONDARY"),
                
            )
            let satircik = new MessageActionRow().addComponents(
              new MessageButton()
              .setCustomId('kisayol')
              .setEmoji("943286130357444608")
              .setLabel("Yakın Arkadaş Sistemi")
              .setStyle("SECONDARY"),
            )
            let satir3 = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId('geriii')
                .setLabel('⏪ Geri Dön')
                .setStyle('PRIMARY'),
            )

            

        if (!secim || !özellikler.some(ozellik => ozellik.name.toLowerCase() == secim.toLowerCase())) {
            let emboo = embed.setDescription(`Merhaba **${message.member.user.tag}** (${message.member}) ${ayarlar.serverName ? ayarlar.serverName : message.guild.name } sunucusuna ait rol menü, düğme ve liste menü sistemi ayarları bu komut ile yapılmaktadır. Bu komut ile isteğe bağlı anlık güncelleme işlemini yapabilirsiniz.

\` ••❯ \` **Örn**: \`${global.sistem.botSettings.Prefixs[0]}seçenek <[Özellik İsmi]> <[Rol ID | @Rol Etiket]>\`

\` ••❯ \` **Özellikler Şunlardır**: ${özellikler.map(x => `${x.name}`).join(", ")}`)
            return message.channel.send({components: [buttonSatır,satir2, satircik],embeds: [emboo]}).then(async (x) => {
                const filter = i =>  i.user.id === message.member.id;

                const collector = await x.createMessageComponentCollector({ filter: filter, time: 30000 });
                
                collector.on('collect', async i => {
                  if(i.customId == "yardimkur") {
                    let Rowck = new MessageActionRow().addComponents(
                      new MessageSelectMenu()
                      .setCustomId("acar_yardim")
                      .setPlaceholder("Benden yardım almak ister misin?")
                      .setOptions(
                          {label: "Üye Komutları", description: "Genel tüm komutları içerir.", value: "diğer"},
                          {label: "Ekonomi Komutları", description: "Genel tüm ekonomi komutlarını içerir.", value: "eco"},
                          {label: "İstatistik Komutları", description: "Genel tüm stat komutlarını içerir.", value: "stat"},
                          {label: "Teyit Komutları", description: "Genel tüm kayıt komutlarını içerir.", value: "teyit"},
                          {label: "Yetkili Komutları", description: "Genel tüm yetkili komutlarını içerir.", value: "yetkili"},
                          {label: "Yetenek ve Diğer Komutlar", description: "Genel tüm yetenek ve diğer komutlar içerir.", value: "talent"},
                          {label: "Yönetim Komutları", description: "Genel tüm yönetim komutlarını içerir.", value: "yönetim"},
                          {label: "Kurucu Komutları", description: "Genel tüm kurucu komutlarını içerir.", value: "kurucu"}
                      )
                  )
                  allBots.forEach(async (cl) => {
                    if(cl.token == sistem.TOKENS.Voucher) {
                      let kanal = cl.channels.cache.get(message.channel.id)
                      kanal.send({content: `**Merhaba!** Yardım almak ister misin?\nAşağıda bulunan menüden yardım almak istediğiniz kategoriyi seçin. :tada:`, components: [Rowck]})
                    }
                  })
                  message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                  }
                  if(i.customId == "kapatcik") {
                    await x.delete().catch(err => {})
                    await i.deferUpdate().catch(err => {})
                  }
                  if(i.customId == "özelmenü") {
                    let kom = client.commands.find(x => x.Isim == "menü")
                    if(kom) kom.onRequest(client, message, args)
                    await x.delete().catch(err => {})
                    await i.deferUpdate().catch(err => {})
                  }
                  if(i.customId == "otomatiksesrozet") {
                    if(ayarlar.statRozet && ayarlar.statRozetOne && message.guild.roles.cache.get(roller.statRozetOne)) return await i.reply({content: `${cevaplar.prefix} Otomatik kurulum sistemini aktif etmek için, aktif bir rol bulunmaması gerekir.`, ephemeral: true});
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla otomatik ses rozet rolleri oluşturularak veritabanına kayıt edildi.`, ephemeral: true})
                    await x.delete().catch(err => {})
                    let aylıkSistem = [
                      {isim: "Bronz 🥉", renk: "#ca9501",  sheet: "statRozetOne"},
                      {isim: "Gümüş 🥈", renk: "#7c818d",  sheet: "statRozetTwo"},
                      {isim: "Altın 🥇", renk: "#efff5d",  sheet: "statRozetThree"},
                      {isim: "Elmas ✨", renk: "#30b7c5", sheet: "statRozetFour"},
                      {isim: "Şampiyon 🏆", renk: "#fff02d",  sheet: "statRozetFive"},
                    ]
                    aylıkSistem.forEach(async (data) => {
                        let rol = message.guild.roles.cache.find(x => x.name == data.isim)
                        if(rol) {
                          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                        } else {
                          const burçRolü = await message.guild.roles.create({
                            name: data.isim,
                            color: data.renk,
                            reason: "Otomatik Ses Rozet Sistemi!"
                          }).then(async (rol) => {
                            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                          })
                        }
                    })

                    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.statRozet`]: true}}, {upsert: true}).catch(e => console.log(e))
                  }
                  if(i.customId == "otomatikaylikuye") {
                    if(ayarlar.aylikUye && ayarlar.birAy && message.guild.roles.cache.get(ayarlar.birAy)) return await i.reply({content: `${cevaplar.prefix} Otomatik kurulum sistemini aktif etmek için, aktif bir rol bulunmaması gerekir.`, ephemeral: true});
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla otomatik aylık üye rolleri oluşturularak veritabanına kayıt edildi.`, ephemeral: true})
                    await x.delete().catch(err => {})
                    let aylıkSistem = [
                      {isim: "1 Aylık Üye", renk: "#96963d", icon: "https://cdn.discordapp.com/attachments/990322473750917120/996913946747470004/image-removebg-preview_1.png", sheet: "birAy"},
                      {isim: "3 Aylık Üye", renk: "#aaaa54", icon: "https://cdn.discordapp.com/attachments/990322473750917120/996914106298810429/image-removebg-preview_2.png", sheet: "ucAy"},
                      {isim: "6 Aylık Üye", renk: "#d1d16d", icon: "https://cdn.discordapp.com/attachments/990322473750917120/996914232090169534/image-removebg-preview_3.png", sheet: "altiAy"},
                      {isim: "9 Aylık Üye", renk: "#f8f825", icon: "https://cdn.discordapp.com/attachments/990322473750917120/996914374918803486/image-removebg-preview_4.png", sheet: "dokuzAy"},
                      {isim: "+1 Yıllık Üye", renk: "#1ad8d3", icon: "https://cdn.discordapp.com/attachments/990322473750917120/996914881225830410/image-removebg-preview_5.png", sheet: "birYil"},
                    ]
                    
                    aylıkSistem.forEach(async (data) => {
                      let rol = message.guild.roles.cache.find(x => x.name == data.isim)
                      if(rol) {
                        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                      } else { 
                            const burçRolü = await message.guild.roles.create({
                              name: data.isim,
                              color: data.renk,
                            //  icon: data.icon,
                              reason: "Otomatik Aylık Üyelik Sistemi!"
                            }).then(async (rol) => {
                      await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                      })
                      }
                    })
                    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.aylikUye`]: true}}, {upsert: true}).catch(e => console.log(e))
                  }
                  if(i.customId == "otomatikburç") {
                    if(ayarlar.Buttons && ayarlar.Buttons.aslan && message.guild.roles.cache.get(ayarlar.Buttons.aslan)) return await i.reply({content: `${cevaplar.prefix} Otomatik kurulum sistemini aktif etmek için, aktif bir rol bulunmaması gerekir.`, ephemeral: true});
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla otomatik burç rolleri oluşturularak veritabanına kayıt edildi.`, ephemeral: true})
                    await x.delete().catch(err => {})
                    let burçSistemi = [
                      {isim: "Koç", renk: "#09040d", sheet: "koç"},
                      {isim: "Boğa", renk: "#09040d", sheet: "boğa"},
                      {isim: "İkizler", renk: "#09040d", sheet: "ikizler"},
                      {isim: "Yengeç", renk: "#09040d", sheet: "yengeç"},
                      {isim: "Aslan", renk: "#09040d", sheet: "aslan"},
                      {isim: "Başak", renk: "#09040d", sheet: "başak"},
                      {isim: "Terazi", renk: "#09040d", sheet: "terazi"},
                      {isim: "Akrep", renk: "#09040d", sheet: "akrep"},
                      {isim: "Yay", renk: "#09040d", sheet: "yay"},
                      {isim: "Oğlak", renk: "#09040d", sheet: "oğlak"},
                      {isim: "Kova", renk: "#09040d", sheet: "kova"},
                      {isim: "Balık", renk: "#09040d", sheet: "balık"},
                    ]


                    burçSistemi.forEach(async (data) => {
                      let rol = message.guild.roles.cache.find(x => x.name == data.isim)
                      if(rol) {
                        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                      } else { 

                     const burçRolü = await message.guild.roles.create({
                            name: data.isim,
                            color: data.renk,
                            reason: "Otomatik Burç Kurulum Sistemi!"
                          }).then(async (rol) => {
                    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                    })
                  }
                    })
                  }
                  if(i.customId == "otomatikilişki") {
                    if(ayarlar.Buttons && ayarlar.Buttons.lovers && message.guild.roles.cache.get(ayarlar.Buttons.lovers)) return await i.reply({content: `${cevaplar.prefix} Otomatik kurulum sistemini aktif etmek için, aktif bir rol bulunmaması gerekir.`, ephemeral: true});
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla otomatik ilişki & etkinlik rolleri oluşturularak veritabanına kayıt edildi.`, ephemeral: true})
                    await x.delete().catch(err => {})
                    let iliskiSistemi = [
                      {isim: "💕 Lovers", renk: "#f1479a", sheet: "lovers"},
                      {isim: "💔 Alone", renk: "#1b0404", sheet: "alone"},
                      {isim: "Etkinlik Katılımcısı", renk: "#ffffff", sheet: "etkinlik", sheetcik: "etkinlikKatılımcısı"},
                      {isim: "Çekiliş Katılımcısı", renk: "#ffffff", sheet: "cekilis", sheetcik: "cekilisKatılımcısı"}
                    ]
                    iliskiSistemi.forEach(async (data) => {
                      let rol = message.guild.roles.cache.find(x => x.name == data.isim)
                      if(rol) {
                        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                        if(data.sheetcik)  await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${data.sheetcik}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                      } else { 

                     const iliskiRolü = await message.guild.roles.create({
                            name: data.isim,
                            color: data.renk,
                            reason: "Otomatik İlişki & Etkinlik Kurulum Sistemi!"
                          }).then(async (rol) => {
                    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                    if(data.sheetcik)  await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.${data.sheetcik}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                  })
                }
                    })
                  }
                  if(i.customId == "otomatikoyun") {
                    if(ayarlar.Buttons && ayarlar.Buttons.csgo && message.guild.roles.cache.get(ayarlar.Buttons.csgo)) return await i.reply({content: `${cevaplar.prefix} Otomatik kurulum sistemini aktif etmek için, aktif bir rol bulunmaması gerekir.`, ephemeral: true});
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla otomatik oyun rolleri oluşturularak veritabanına kayıt edildi.`, ephemeral: true})
                    await x.delete().catch(err => {})
                    let oyunSistemi = [
                      {isim: "League Of Legends", renk: "#ffffff", sheet: "lol"},
                      {isim: "Counter-Strike: Global Offensive", renk: "#ffffff", sheet: "csgo"},
                      {isim: "Minecraft", renk: "#ffffff", sheet: "minecraft"},
                      {isim: "Valorant", renk: "#ffffff", sheet: "valorant"},
                      {isim: "Fortnite", renk: "#ffffff", sheet: "fortnite"},
                      {isim: "Grand Theft Auto V", renk: "#ffffff", sheet: "gta5"},
                      {isim: "PUBG", renk: "#ffffff", sheet: "pubg"},
                      {isim: "Wild Rift", renk: "#ffffff", sheet: "wildrift"},
                      {isim: "Mobile Legends", renk: "#ffffff", sheet: "mobilelegends"},
                      {isim: "FiveM", renk: "#ffffff", sheet: "fivem"},
                    ]
                    oyunSistemi.forEach(async (data) => {
                      let rol = message.guild.roles.cache.find(x => x.name == data.isim)
                      if(rol) {
                        await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                      } else { 
                     const oyunRolü = await message.guild.roles.create({
                            name: data.isim,
                            color: data.renk,
                            reason: "Otomatik Oyun Kurulum Sistemi!"
                          }).then(async (rol) => {
                    await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                    })
                  }
                    })
                  }
                  if(i.customId == "otomatikrenk") {
                    if(ayarlar.Buttons && ayarlar.Buttons.kırmızı && message.guild.roles.cache.get(ayarlar.Buttons.kırmızı)) return await i.reply({content: `${cevaplar.prefix} Otomatik kurulum sistemini aktif etmek için, aktif bir rol bulunmaması gerekir.`, ephemeral: true});
                    await i.reply({content: `${message.guild.emojiGöster(emojiler.Onay)} Başarıyla otomatik renk rolleri oluşturularak veritabanına kayıt edildi.`, ephemeral: true})
                    await x.delete().catch(err => {})
                    let renkSistemi = [
                        {isim: "Kırmızı", renk: "#e43200", sheet: "kırmızı"},
                        {isim: "Turuncu", renk: "#e4b400", sheet: "turuncu"},
                        {isim: "Mavi", renk: "#0055e4", sheet: "mavi"},
                        {isim: "Mor", renk: "#7c00f8", sheet: "mor"},
                        {isim: "Pembe", renk: "#f866c1", sheet: "pembe"},
                        {isim: "Beyaz", renk: "#e9e4e7", sheet: "beyaz"},
                        {isim: "Yeşil", renk: "#0fc708", sheet: "yeşil"},
                        {isim: "Sarı", renk: "#d8e244", sheet: "sarı"},
                        {isim: "Siyah", renk: "#181817", sheet: "siyah"}
                      ]
                      renkSistemi.forEach(async (data) => {
                        let rol = message.guild.roles.cache.find(x => x.name == data.isim)
                        if(rol) {
                          await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                        } else { 
                       const renkRolü = await message.guild.roles.create({
                              name: data.isim,
                              color: data.renk,
                              reason: "Otomatik Renk Kurulum Sistemi!"
                            }).then(async (rol) => {
                      await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${data.sheet}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
                      })
                    }
                      })
                  }
                  if(i.customId == "kisayol") {
                    await x.delete().catch(err => {}),await i.deferUpdate().catch(err => {}).catch(err => {}); 
                    client.api.channels(message.channel.id).messages.post({ data: {"content":`**Merhaba!** Sende **${ayarlar.serverName}** sunucusunda yakın arkadaşımız mısın? ${message.guild.emojiGöster(emojiler.Tag)} 
Ozaman sende "**Yakın Arkadaş Rolü Al**" düğmesine basarak sana özel bir rolü alabilirsin.
Unutma her gün sonunda o rol üzerinden sistem olarak kaldırılmaktadır. Bu kanaldan tekrardan alabilirsin. :tada: :tada: :tada:`,"components":[{"type":1,"components":[

                      {"type":2,"style":2,"custom_id":"bestFriend","label":"Yakın Arkadaş Rolü Al", "emoji": {id: "753663918257209484"}},
                      
                      
                      ]}]} })
                      
                      await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                  }
                  if(i.customId == "kpaneli") {
                    await x.delete().catch(err => {}),await i.deferUpdate().catch(err => {}).catch(err => {}); 
                    let Rowuc = new MessageActionRow().addComponents(
                      new MessageButton()
                      .setCustomId("soruniletcik")
                      .setLabel("Sorunlarımı İletmek İstiyorum")
                      .setStyle("SUCCESS")
                      .setEmoji("1024435034242949120"),
                      new MessageButton()
                      .setCustomId("istekönericik")
                      .setLabel("İsteklerimi İletmek İstiyorum")
                      .setStyle("SECONDARY")
                      .setEmoji("939147205867077662"),

                    )
                    let Rowiki = new MessageActionRow().addComponents(
                      new MessageButton()
                      .setCustomId("basvurucuk")
                      .setLabel("Yetkili Olmak İstiyorum")
                      .setStyle("SUCCESS")
                      .setEmoji("1045351048354738227"),
                      new MessageButton()
                      .setCustomId("cdestekcik")
                      .setLabel("Canlı Destek İstiyorum")
                      .setStyle("SECONDARY")
                      .setEmoji("966192718759985232"),

              
                      
                    )
                    let Row = new MessageActionRow().addComponents(
                      new MessageSelectMenu()
                      .setCustomId("kpaneli")
                      .setOptions(
                        {label: "Ceza Puanı", emoji: {id: "1042946131077902417"},description: "Sunucu içerisinde ki ceza puanım.", value: "V"},
                        {label: "İsim Bilgisi",emoji: {id: "1042946131077902417"}, description: "Sunucudaki eski isim bilgilerinizi görüntüleyin.", value: "VII"},
                        {label: "Hesap Tarihi", emoji: {id: "1042946131077902417"},description: "Hesabınızın açılış tarihini öğrenin.", value: "III"},
                        {label: "Davet Bilgisi",emoji: {id: "1042946131077902417"}, description: "Davet bilgilerinizi öğrenin.", value: "IV"},
                        {label: "Katılım Tarihi", emoji: {id: "1042946131077902417"},description: "Sunucuya giriş tarihinizi öğrenin.", value: "I"},
                        {label: "İsim Güncelleme",emoji: {id: "1042946131077902417"}, description: "Sunucuya takviye bastıysanız buradan isim güncellemesi gerçekleştirebilirsiniz.", value: "isimGuncelleme"},
                        {label: "Haftalık İstatistikler", emoji: {id: "1042946131077902417"},description: "Sunucudaki haftalık ses ve mesaj bilgilerinizi görüntüleyin.", value: "VIII"},
                        {label: "Gereksiz Rol Temizle",emoji: {id: "1042946131077902417"}, description: "Üstünüzde bulunan etkinlik ve diğer rolleri üzerinizden anında temizleyebilirsiniz.", value: "XX"},
                        {label: "Sunucu Bilgisi",emoji: {id: "1042946131077902417"}, description: "Sunucunun anlık aktif listesini görüntüleyin.", value: "VI"},
                        {label: "Rol Bilgisi",emoji: {id: "1042946131077902417"}, description: "Üstünüzde bulunan rollerin listesini alın.", value: "II"},
                      )
                    )
                    message.channel.send({content: `**Merhaba!** ${ayarlar.serverName} ${message.guild.emojiGöster(emojiler.Tag)}
İstek veya önerin mi var?
Yetkili olmak mı istiyorsun?
Bir yetkiliden destek almak ister misin?
Botlarla veya komutlarla ilgili bir sorunun mu var? 
Aşağıda ki menü veya düğmeleri kullanarak yapabileceğiniz kısayollar bulunmaktadır.`, components: [Row,Rowiki,Rowuc]})
await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                  }
                  if(i.customId == "yöneticiPaneli") {
                    let konser = client.channels.cache.find(x => x.type == "GUILD_CATEGORY" && x.name.includes("Konser") || x.name.includes("KONSER"))
                    let etkınlik = client.channels.cache.find(x => x.type == "GUILD_CATEGORY" && x.name.includes("Etkinlik") || x.name.includes("ETKİNLİK") || x.name.includes("Etkinlık") || x.name.includes("ETKINLIK"))
                    let vkKategori = etkınlik ? etkınlik.id : undefined
                    let dcKategori = konser ? konser.id : undefined
                   
                    let Row = new MessageActionRow().addComponents(
                      new MessageSelectMenu()
                      .setCustomId("acaryöneticipaneli")
                      .setPlaceholder("Yönetici işlemleri şunlardır...")
                      .setOptions(
                        {label: "Sunucu Güncelle", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde herhangi bir değişiklik yapabilirsiniz.", value: "sunucuduzenle"},
                        {label: "Rolsüz Ver", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde rolü bulunmayanlara kayıtsız vermeyi sağlar.", value: "rolsüzver"},
                        {label: "Özel Karakter Temizle", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde isminde ünlem, sembol vs. bulunanları temizler.",value: "özelkarakter"},
                        {label: "Public Senkronizasyon", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncpublic"},
                        {label: "Streamer Senkronizasyon", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncstreamer"},
                        {label: "Teyit Senkronizasyon", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncregister"},
                        {label: "Sorun Çözme Senkronizasyon", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncsç"},
                        {label: "Diğer Senkronizasyon", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncother"},
                        {label: "Genel Senkronizasyon", emoji: {id: "1042946131077902417"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncguild"},
                    )
                    )
                    let everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
                    let RowTwo = new MessageActionRow().addComponents(
                      new MessageButton()
                      .setLabel(`Etkinlik Odası (${i.guild.kanalBul(vkKategori).permissionsFor(everyone).has('VIEW_CHANNEL') ? "Gösterme" : "Göster"})`)
                      .setCustomId("vkgoster")
                      .setStyle(i.guild.kanalBul(vkKategori).permissionsFor(everyone).has('VIEW_CHANNEL') ? "SECONDARY" : "PRIMARY"),
                      new MessageButton()
                      .setLabel(`Konser Odası (${i.guild.kanalBul(dcKategori).permissionsFor(everyone).has('VIEW_CHANNEL') ? "Gösterme" : "Göster"})`)
                      .setCustomId("konsergoster")
                      .setStyle(i.guild.kanalBul(dcKategori).permissionsFor(everyone).has('VIEW_CHANNEL') ? "SECONDARY" : "PRIMARY"),
                    )
                
                    message.channel.send({components: [Row,RowTwo], content: `**Merhaba!** ${ayarlar.serverName} ${message.guild.emojiGöster(emojiler.Tag)}\nAşağıda bulunan menü aracılığı ile "${ayarlar.serverName}" sunucusunun üzerinde değişiklilik ve kontrolleri sağlayabilirsin, bu sizin için kolaylık sağlar.`})
                    x.delete().catch(err => {})
                    await i.deferUpdate().catch(err => {}),await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                  }
                  if(i.customId == "yetkiliPaneli") {
                    let opt = [
                      {label: "Uyar",emoji: {id: "1042946131077902417"}, description: "Belirtilen üyeyi belirtilen sebepte uyarabilirsin.", value: "uyari"},
                      {label: "Sustur",emoji: {id: "1042946131077902417"},  description: "Belirtilen üyeyi seste ve metin kanallarında susturursun.", value: "gg3"},
                      {label: "Reklam", emoji: {id: "1042946131077902417"}, description: "Belirtilen üyeyi reklam yapmaktan cezalandırırsın.", value: "reklam"},
                      {label: "Cezalandır", emoji: {id: "1042946131077902417"}, description: "Belirtilen üyeyi karantinaya gönderirsin.", value: "gg"},
                      {label: "Underworld", emoji: {id: "1042946131077902417"}, description: "Belirtilen üyeyi Underworld'e gönderirsin.", value: "underworld"},
                      {label: "Ceza Bilgileri",emoji: {id: "1042946131077902417"}, description: "Belirtilen üyenin son 10 cezasını listelersiniz.", value: "cezakontrol"},
                      {label: "Ceza Kontrolü",emoji: {id: "1042946131077902417"}, description: "Belirtilen ceza numarası ile ceza bilgisini görüntülersiniz.", value: "cezabilgisi"},
                      {label: "Yükseltim Nedir? Nasıl Yetki Atlanır?", emoji: {id: "1042946131077902417"}, value: "yukseltim", description: "Bu konu hakkında bilgi almak istiyorsan tıkla!"},
                      {label: "Puanlama Bilgisi Nedir?", emoji: {id: "1042946131077902417"},value: "kaçpuan", description: "Bu konu hakkında bilgi almak istiyorsan tıkla!"},
                      {label: "Kayıt Nasıl Yapılır?", emoji: {id: "1042946131077902417"},value: "kayıt", description: "Bu konu hakkında bilgi almak istiyorsan tıkla!"},
                      {label: "Davet Nasıl Yapılır?", emoji: {id: "1042946131077902417"},value: "davet", description: "Bu konu hakkında bilgi almak istiyorsan tıkla!"},
                    ]
                    if(ayarlar.type) opt.push({label: "Taglı Nasıl Kullanılır?", emoji: {id: "1042946131077902417"},value: "taglı", description: "Bu konu hakkında bilgi almak istiyorsan tıkla!"})
                    let Row = new MessageActionRow().addComponents(
                      new MessageSelectMenu()
                      .setCustomId("KONTROLPANEL")
                      .setPlaceholder("Yetkili işlemleri şunlardır...")
                      .setOptions(
                        [
                          ...opt,
                          {label: "Yetki Detayı",emoji: {id: "1042946131077902417"}, description: "Belirtilen üyenin yetkili geçmişini görüntüler.", value: "ygeçmiş"},
                          {label: "İstifa",emoji: {id: "1042946131077902417"}, description: "Basıldığı zaman üzerinizdeki tüm yetkileri bırakırsınız.", value: "istifa"}
                        ]
                      )
                    )
                
                    message.channel.send({components: [Row], embeds: [], content: `**Merhaba!** ${ayarlar.serverName} ${message.guild.emojiGöster(emojiler.Tag)}\nAşağı listede yetkili moderasyon işlemleri belirtilmiştir, uygulamak istediğiniz moderasyon işlemini aşağıda ki menüden seçiniz.`})
                    x.delete().catch(err => {})
                    await i.deferUpdate().catch(err => {}),await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                  }
                    if(i.customId === "cezapanelikur") {
                      await x.delete().catch(err => {}),await i.deferUpdate().catch(err => {}).catch(err => {}); 
                        client.api.channels(message.channel.id).messages.post({ data: {"content":`**Merhaba!** ${ayarlar.serverName} ${message.guild.emojiGöster(emojiler.Tag)}
Aşağıda ki düğmelerden cezalarınız hakkında detaylı bilgi alabilirsiniz. Şüpheliyseniz "Şüpheliden Çık!" düğmesi ile çıkabilirsiniz.
Sorun çözmeciye cezanızı itiraz mı etmek istiyorsunuz? "Sorun Çözme Bildir!" düğmesi ile bildirebilirsiniz.`,"components":[{"type":1,"components":[

                            {"type":2,"style":2,"custom_id":"cezaPuanim","label":"Ceza Puanım", "emoji": { "id": "948679866562277456" }},
                             {"type":2,"style":2,"custom_id":"cezaListesi","label":"Cezalarım", "emoji": { "id": "948677924561752104" }},
                            {"type":2,"style":2,"custom_id":"lastPunitives","label":"Kalan Zamanım?", "emoji": { "id": "948684327959547965" }},
                            {"type":2,"style":2,"custom_id":"şüphelidenÇık","label":"Şüpheliden Çık!", "emoji": { "id": "948680304174960662" }},
                            {"type":2,"style":3,"custom_id":"sorunÇözmeci","label":"Sorun Çözme Bildir!", "emoji": { "id": "966192718759985232" }},
                            ]}]} })
                            
                            await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                      
                    }
                    if(i.customId == "otomatikkur") {
                      await x.edit({content: null, components: [buttcuk, sywss], embeds: [new genEmbed().setDescription(`
Aşağıda ki düğmeleri kullanarak otomatik rol ve otomatik ayar listesini oluşturabilirsiniz. Hiç bir komutla veya da hiç bir rol ile uğraşmanıza gerek kalmaz.

**Discord API** kurallarına uyduğunuza emin olunuz.
Gün içerisinde fazla denerseniz rol oluşturmanız ve silmeniz geçici olarak engellenebilir.`)]}), 
                      await i.deferUpdate().catch(err => {}).catch(err => {});
                    }
                    if(i.customId === "geriii")  {
                        await x.edit({content: null, components: [buttonSatır, satir2], embeds: [emboo]}).catch(err => {}), 
                        await i.deferUpdate().catch(err => {});
                    }
                    if(i.customId === "etkinlikçekilişkur") {
                      await x.delete().catch(err => {}),await i.deferUpdate().catch(err => {}).catch(err => {});
                      client.api.channels(message.channel.id).messages.post({ data: {"content":`
**${ayarlar.serverName ? ayarlar.serverName : message.guild.name}** Sunucusuna ait alınabilecek roller aşağı da listelenmektedir. ${message.guild.emojiGöster(emojiler.Konfeti)}
Sunucu içerisinde **\`@everyone\`**, **\`@here\`** ve gereksiz etiketlerden sizleri rahatsız etmek istemiyoruz.
Düzenlenecek etkinlikler, konserler, turnuvalar ve daha fazlasından haberdar olmak için  ${roller ? roller.etkinlikKatılımcısı ? message.guild.roles.cache.get(roller.etkinlikKatılımcısı) ? message.guild.roles.cache.get(roller.etkinlikKatılımcısı) : `@Rol Bulunamadı!`: `@Rol Bulunamadı!` : `@Rol Bulunamadı!`} rolünü alabilirsiniz.
Çekilişlerden ve ürünlerden (${message.guild.emojiGöster(emojiler.boostluNitro)}, ${message.guild.emojiGöster(emojiler.Exxen)}, ${message.guild.emojiGöster(emojiler.Netflix)}, ${message.guild.emojiGöster(emojiler.Spotify)}, ${message.guild.emojiGöster(emojiler.Youtube)}) haberdar olmak için ${roller ? roller.cekilisKatılımcısı ? message.guild.roles.cache.get(roller.cekilisKatılımcısı) ? message.guild.roles.cache.get(roller.cekilisKatılımcısı) : `@Rol Bulunamadı!`: `@Rol Bulunamadı!` : `@Rol Bulunamadı!`} rolünü alabilirsiniz.
`,"components":[
                                                
                                                {
                                                    "type": 1, "components": [{
                                                        "type": 3, "custom_id": "etkinliks", "options": [
                                                            { "label": "Etkinlik Katılımcısı", "description": "Etkinliklerden haberdar olmak için", "value": "etkinlik", "emoji": { "id": "922059128321478666", "name": "monarch_etkinlik" }, },
                                                            { "label": "Çekiliş Katılımcısı", "description": "Çekilişlerden haberdar olmak için", "value": "cekilis", "emoji": { "id": "922059128250195978", "name": "monarch_cekilis" }, },
                                                        ], "placeholder": "Etkinlik Ve Çekiliş Rolleri ", "min_values": 0, "max_values": 2
                                                    }],
                                                }]} }) 
                                                if(ayarlar.Buttons && ayarlar.Buttons.csgo && message.guild.roles.cache.get(ayarlar.Buttons.csgo)) client.api.channels(message.channel.id).messages.post({
                                                  data: {
                                                      "content": `Aşağıda bulunan menüden **Oyun ve eğlence** rollerinden dilediğinizi alabilirsiniz. ${message.guild.emojiGöster(emojiler.Tag)}`,
                                                      "components": [  {
                                                          "type": 1, "components": [{
                                                              "type": 3, "custom_id": "games", "options": [
                                                                  { "label": "League of Legends", "value": "lol", "emoji": { "id": "921864037296398387", "name": "monarch_lol" }, },
                                                                  { "label": "CS:GO", "value": "csgo", "emoji": { "id": "921863992652210246", "name": "monarch_csgo" }, },
                                                                  { "label": "Minecraft", "value": "minecraft", "emoji": { "id": "921864081089122395", "name": "monarch_minecraft" }, },
                                                                  { "label": "Valorant", "value": "valorant", "emoji": { "id": "921863888591519754", "name": "monarch_valorant" }, },
                                                                  { "label": "Fortnite", "value": "fortnite", "emoji": { "id": "921863851652284537", "name": "monarch_fortnite" }, },
                                                                  { "label": "Gta V", "value": "gta5", "emoji": { "id": "921864267584651274", "name": "monarch_gta5" }, },
                                                                  { "label": "PUBG", "value": "pubg", "emoji": { "id": "921863782676975616", "name": "monarch_pubg" }, },
                                                                  { "label": "Wild Rift", "value": "wildrift", "emoji": { "id": "921864162181787708", "name": "monarch_wildrift" }, },
                                                                  { "label": "PUBG: MOBILE", "value": "pubgmobile", "emoji": { "id": "921863818383077418", "name": "monarch_pubgmobile" }, },
                                                                  { "label": "Rust", "value": "rust", "emoji": { "id": "921864315257094214", "name": "monarch_rust" }, },
                                                                  { "label": "Brawlhalla", "value": "brawlhalla", "emoji": { "id": "921863932543655946", "name": "monarch_brawlhalla" }, },
                                                                  { "label": "FiveM", "value": "fivem", "emoji": { "id": "921864209933942835", "name": "monarch_fivem" }, },
                                                                  { "label": "Mobile Legends", "value": "mlbb", "emoji": { "id": "921864119160815627", "name": "monarch_mobilelegends" }, }
                                      
                                                              ], "placeholder": "Oyun Ve Eğlence Rolleri", "min_values": 0, "max_values": 13
                                                          }],
                                                      }
                                                      ]
                                                  }
                                              })
                            if(ayarlar.Buttons && ayarlar.Buttons.aslan && message.guild.roles.cache.get(ayarlar.Buttons.aslan)) client.api.channels(message.channel.id).messages.post({
                              data: {
                                  "content": `Aşağıda bulunan menüden **Burç** rollerinden dilediğinizi alabilirsiniz. ${message.guild.emojiGöster(emojiler.Tag)}`,
                                  "components": [  {
                                      "type": 1, "components": [{
                                          "type": 3, "custom_id": "horoscope", "options": [
                                              { "label": "Koç", "value": "koç", "emoji": { "id": "921860371998990398", "name": "monarch_koc" }, },
                                              { "label": "Boğa", "value": "boğa", "emoji": { "id": "921860427749675049", "name": "monarch_boga" }, },
                                              { "label": "İkizler", "value": "ikizler", "emoji": { "id": "921860478425247755", "name": "monarch_ikizler" }, },
                                              { "label": "Yengeç", "value": "yengeç", "emoji": { "id": "921860522431881236", "name": "monarch_yengec" }, },
                                              { "label": "Aslan", "value": "aslan", "emoji": { "id": "921863570793316362", "name": "monarch_aslan" }, },
                                              { "label": "Başak", "value": "başak", "emoji": { "id": "921863598836432998", "name": "monarch_basak" }, },
                                              { "label": "Terazi", "value": "terazi", "emoji": { "id": "921863669996998667", "name": "monarch_terazi" }, },
                                              { "label": "Akrep", "value": "akrep", "emoji": { "id": "921863704830681098", "name": "monarch_akrep" }, },
                                              { "label": "Yay", "value": "yay", "emoji": { "id": "921863747046350920", "name": "monarch_yay" }, },
                                              { "label": "Oğlak", "value": "oğlak", "emoji": { "id": "921860226662154340", "name": "monarch_oglak" }, },
                                              { "label": "Kova", "value": "kova", "emoji": { "id": "921860274707902525", "name": "monarch_kova" }, },
                                              { "label": "Balık", "value": "balık", "emoji": { "id": "921860308467855411", "name": "monarch_balik" }, },
                                              { "label": "Rol İstemiyorum", "value": "rolsil", "emoji": { "id": "922058306263072860", "name": "monarch_trash" }, }
                  
                                          ], "placeholder": "Burç Rolleri", "min_values": 1, "max_values": 1
                                      }],
                                  }
                                  ]
                              }
                          })
                         
                          if(ayarlar.Buttons && ayarlar.Buttons.mavi && message.guild.roles.cache.get(ayarlar.Buttons.mavi)) client.api.channels(message.channel.id).messages.post({
                          data: {
                              "content": `Aşağıda bulunan menüden **Renk** rollerinden dilediğinizi alabilirsiniz. ${message.guild.emojiGöster(emojiler.Tag)}`,
                              "components": [{
                                  "type": 1, "components": [{
                                      "type": 3, "custom_id": "renks", "options": [
                                          { "label": "Kırmızı", "value": "kirmizi", "emoji": { "name": "🍒" }, },
                                          { "label": "Turuncu", "value": "turuncu", "emoji": {  "name": "🥕" }, },
                                          { "label": "Mavi", "value": "mavi", "emoji": { "name": "🌊" }, },
                                          { "label": "Mor", "value": "mor", "emoji": {  "name": "🍇" }, },
                                          { "label": "Pembe", "value": "pembe", "emoji": { "name": "🌸" }, },
                                          { "label": "Yeşil", "value": "yeşil", "emoji": {  "name": "🥝" }, },
                                          { "label": "Sarı", "value": "sarı", "emoji": {  "name": "🍋" }, },
                                          { "label": "Siyah", "value": "siyah", "emoji": { "name": "🕷️" }, },
                                          { "label": "Beyaz", "value": "beyaz", "emoji": { "name": "🥥" }, },

                                          {
                                              "label": "Rol İstemiyorum", "value": "rolsil", "emoji": { "id": "922058306263072860", "name": "monarch_trash" },
                                          }], "placeholder": "Renk Rolleri", "min_values": 1, "max_values": 1
                                  }],
                              }
                              ]
                          }
                      })
                      if(ayarlar.Buttons && ayarlar.Buttons.alone && message.guild.roles.cache.get(ayarlar.Buttons.alone)) client.api.channels(message.channel.id).messages.post({
                        data: {
                            "content": `Aşağıda bulunan menüden **İlişki** rollerinden dilediğinizi alabilirsiniz. ${message.guild.emojiGöster(emojiler.Tag)}`,
                            "components": [  {
                                "type": 1, "components": [{
                                    "type": 3, "custom_id": "valantines", "options": [
                                        { "label": "Sevgilim Var", "value": "couple", "emoji": { "id": "921864349428121670", "name": "monarch_lovers" }, },
                                        { "label": "Sevgilim Yok", "value": "single", "emoji": { "id": "921864389097844736", "name": "monarch_alone" }, },
                                        { "label": "Rol İstemiyorum", "value": "rolsil", "emoji": { "id": "922058306263072860", "name": "monarch_trash" }, }
                                    ], "placeholder": "İlişki Rolleri", "min_values": 1, "max_values": 1
                                }],
                            }
                            ]
                        }
                    })
                   
                            await message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {}).catch(err => {})
                    }

                    if (i.customId === 'ayarlar') {
                        let ozelliklerListe = Object.keys(data || {}).filter(a => özellikler.find(v => v.name == a)).map(o => {
                            let element = data[o]
                            let ozellik = özellikler.find(z => z.name == o);
                            if(ozellik.type == "diğer") return `[**Sorumluluk & Diğer**] ${başHarfBüyült(o)} (${message.guild.roles.cache.get(element) || "Ayarlı Değil!"})`
                            if(ozellik.type == "oyun") return `[**Oyunlar**] ${başHarfBüyült(o)} (${message.guild.roles.cache.get(element) || "Ayarlı Değil!"})`
                            if(ozellik.type == "burç") return `[**Burçlar**] ${başHarfBüyült(o)} (${message.guild.roles.cache.get(element) || "Ayarlı Değil!"})`
                            if(ozellik.type == "ilişki") return `[**İlişkiler**] ${başHarfBüyült(o)} (${message.guild.roles.cache.get(element) || "Ayarlı Değil!"})`
                            if(ozellik.type == "renkler") return `[**Renkler**] ${başHarfBüyült(o)} (${message.guild.roles.cache.get(element) || "Ayarlı Değil!"})`
                          }).join('\n');
                          await i.deferUpdate().catch(err => {});
		                    await x.edit({ content: null, components: [satir3], embeds: [new genEmbed().setFooter(`yapılan ayar listesi şöyle sıralandı.`).setDescription(ozelliklerListe)] }).catch(err => {});
                    }
                   
                });
                
                collector.on('end', collected => { 
                    x.delete().catch(err => {})
                 });
            })
        }
        let ozellik = özellikler.find(o => o.name.toLowerCase() === secim.toLowerCase());
        if (ozellik.type) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(' '));
            if(!rol) return message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} **${başHarfBüyült(ozellik.name)}** isimli seçenek ayarını hangi rol yapmamı istiyorsun?`)]}).then(x => setTimeout(() => {
              x.delete().catch(err => {});
          }, 7500));
            await GUILD_SETTINGS.findOneAndUpdate({guildID: message.guild.id}, {$set: {[`Ayarlar.Buttons.${ozellik.name}`]: rol.id}}, {upsert: true}).catch(e => console.log(e))
             message.channel.send({embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Başarıyla **${başHarfBüyült(ozellik.name)}** isimli seçenek ayar rolü ${rol} olarak tanımladı.`)]})
            return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})  
        }
    }
};

function başHarfBüyült(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }





 
                   
            