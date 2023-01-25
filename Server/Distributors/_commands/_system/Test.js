const { Client, Message, Util, MessageActionRow, MessageButton, MessageSelectMenu, Collection, Permissions} = Discord = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const voiceCollection = new Collection()
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Private = require('../../../../Global/Databases/Schemas/Plugins/Guild.Private.Rooms.js');
const {VoiceChannels, TextChannels, CategoryChannels, Roles} = require("../../../../Global/Databases/Schemas/Guards/Backup/Guild.Sync");
let vkKategori = "1008826074592968779"
let dcKategori = "1008826046105260113"
let aktiviteKategori = "964168000997572678"
const { 
  Modal,
  TextInputComponent, 
  showModal
} = dcmodal = require('discord-modals')

module.exports = {
    Isim: "komut",
    Komut: ["komutcuk","özeloda"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on('interactionCreate', async i => {

        let konser = client.channels.cache.find(x => x.type == "GUILD_CATEGORY" && x.name.includes("Konser") || x.name.includes("KONSER"))
        let etkınlik = client.channels.cache.find(x => x.type == "GUILD_CATEGORY" && x.name.includes("Etkinlik") || x.name.includes("ETKİNLİK") || x.name.includes("Etkinlık") || x.name.includes("ETKINLIK"))
        vkKategori = etkınlik ? etkınlik.id : undefined
        dcKategori = konser ? konser.id : undefined
   
      let Row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("acaryöneticipaneli")
        .setPlaceholder("Yönetici işlemleri şunlardır...")
        .setOptions(
            {label: "Sunucu Güncelle", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde herhangi bir değişiklik yapabilirsiniz.", value: "sunucuduzenle"},
            {label: "Rolsüz Ver", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde rolü bulunmayanlara kayıtsız vermeyi sağlar.", value: "rolsüzver"},
            {label: "Özel Karakter Temizle", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde isminde ünlem, sembol vs. bulunanları temizler.",value: "özelkarakter"},
            {label: "Etkinlik & Çekiliş Katılımcısı Dağıt", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde, üstünde katılımcı rolleri bulunmayanlara dağıtır.", value: "etkinlikçekilişdağıt"},
            {label: "Public Senkronizasyon", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncpublic"},
            {label: "Streamer Senkronizasyon", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncstreamer"},
            {label: "Teyit Senkronizasyon", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncregister"},
            {label: "Sorun Çözme Senkronizasyon", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncsç"},
            {label: "Diğer Senkronizasyon", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncother"},
            {label: "Genel Senkronizasyon", emoji: {id: "963745852327886888"}, description: "Sunucu üzerinde değişiklikleri, tekrardan senkronize eder." ,value: "syncguild"},
        )
      )
      let everyone = i.guild.roles.everyone
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
        let author = i.guild.members.cache.get(i.user.id)
        if(!author) return i.deferUpdate().catch(err => {});
        if(i.customId == "vkgoster") {
          if((roller.etkinlikSorumlusu && !roller.etkinlikSorumlusu.some(oku => author.roles.cache.has(oku))) && (roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => author.roles.cache.has(oku))) && !author.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
          let kategori = i.guild.channels.cache.get(vkKategori)
          if(!kategori) i.reply({content: `${cevaplar.prefix} Sistem hatası oluştu, lütfen bot sahibi ile iletişime geçin.`, ephemeral: true})
          let everyone = i.guild.roles.everyone
          if (kategori.permissionsFor(everyone).has('VIEW_CHANNEL')) {
            await kategori.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: false });
            await kategori.setPosition(13).catch(err => {})
            i.guild.channels.cache.filter(x => x.parentId == kategori.id).map(async (x) => {
                await x.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: false });
            })
            author.Leaders("etkinlik", 1, {type: "ETKINLIK"})
            RowTwo.components[0].setStyle("PRIMARY").setLabel(`Etkinlik Odası (Göster)`)
            i.update({components: [Row, RowTwo]})
          } else {
            await kategori.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: true });
            await kategori.setPosition(0)
            i.guild.channels.cache.filter(x => x.parentId == kategori.id && !x.name.includes("yönetim")).map(async (x) => {
              await x.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: true });
            })
            RowTwo.components[0].setStyle("SECONDARY").setLabel(`Etkinlik Odası (Gösterme)`)
            i.update({components: [Row, RowTwo]})
          }
        }
        if(i.customId == "konsergoster") {
          if((roller.etkinlikSorumlusu && !roller.etkinlikSorumlusu.some(oku => author.roles.cache.has(oku))) && (roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => author.roles.cache.has(oku))) && !author.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
          let kategori = i.guild.channels.cache.get(dcKategori)
          if(!kategori) i.reply({content: `${cevaplar.prefix} Sistem hatası oluştu, lütfen bot sahibi ile iletişime geçin.`, ephemeral: true})
          let everyone = i.guild.roles.everyone
          if (kategori.permissionsFor(everyone).has('VIEW_CHANNEL')) {
            await kategori.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: false });
            await kategori.setPosition(13).catch(err => {})
            i.guild.channels.cache.filter(x => x.parentId == kategori.id).map(async (x) => {
                await x.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: false });
            })
            author.Leaders("etkinlik", 1, {type: "KONSER"})
            RowTwo.components[1].setStyle("PRIMARY").setLabel(`Konser Odası (Göster)`)
            i.update({components: [Row, RowTwo]})
          } else {
            await kategori.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: true });
            await kategori.setPosition(0)
            i.guild.channels.cache.filter(x => x.parentId == kategori.id && !x.name.includes("yönetim")).map(async (x) => {
              await x.permissionOverwrites.edit(everyone.id, { VIEW_CHANNEL: true });
            })
            RowTwo.components[1].setStyle("SECONDARY").setLabel(`Konser Odası (Gösterme)`)
            i.update({components: [Row, RowTwo]})
          }
        }
        if (!i.isSelectMenu()) return;
        let Data = await GUILDS_SETTINGS.findOne({ _id: 1 })
        let uye = i.guild.members.cache.get(i.user.id)
        ayarlar = Data.Ayarlar
        if (i.customId === 'acaryöneticipaneli') {
          if(i.values[0] == "sunucuduzenle") {
            const modal = new Modal()
            .setCustomId('sunucuDüzenleme')
            .setTitle(`Sunucu Güncelle!`)
            .addComponents(
              new TextInputComponent()
              .setCustomId('name')
              .setLabel('Sunucu İsmi')
              .setStyle('SHORT')
              .setMinLength(3)
              .setMaxLength(120)
              .setPlaceholder(`${i.guild.name}`)
              .setRequired(false),
              new TextInputComponent()
              .setCustomId('avatar')
              .setLabel('Sunucu Resmi')
              .setStyle('SHORT')
              .setMinLength(3)
              .setMaxLength(300)
              .setPlaceholder(`${i.guild.iconURL({dynamic: true, format: "png"})}`)
              .setRequired(false),
              new TextInputComponent()
              .setCustomId('banner')
              .setLabel('Sunucu Arkaplan')
              .setStyle('SHORT')
              .setMinLength(3)
              .setMaxLength(300)
              .setPlaceholder(`${i.guild.bannerURL({dynamic: true, format: "png"})}`)
              .setRequired(false),
            );
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            showModal(modal, {
              client: client,
              interaction: i 
            })
          }
          if(i.values[0] == "rolsüzver") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            let rolsuzuye =  i.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== i.guildId).size == 0);
            rolsuzuye.forEach(roluolmayanlar => { 
                roller.kayıtsızRolleri.some(x => roluolmayanlar.roles.add(x).catch(err => {})) 
            });
            await i.reply({content: `Başarıyla sunucuda rolü olmayan **${rolsuzuye.size}** üyeye kayıtsız rolü verilmeye başlandı! ${i.guild.emojiGöster(emojiler.Onay)}`, ephemeral: true})
          }
          if(i.values[0] == "tagsızver") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            let guild = client.guilds.cache.get(i.guildId)
            if(!guild) return await i.reply({content: `${cevaplar.prefix} Bulunduğunuz sunucu Outage'e düştüğünden dolayı işlem iptal edildi.`, ephemeral: true})
            let tagsizuye = guild.members.cache.filter(m => m.user.username.includes(ayarlar.tag) && !m.roles.cache.has(roller.tagRolü) && !m.roles.cache.has(roller.şüpheliRolü) && !m.roles.cache.has(roller.yasaklıTagRolü) &&  !m.roles.cache.has(roller.jailRolü) && !roller.kayıtsızRolleri.some(x => m.roles.cache.has(x)))
            tagsizuye.forEach(roluolmayanlar => { 
              roluolmayanlar.roles.add(roller.tagRolü).catch(err => {})
              roluolmayanlar.setNickname(roluolmayanlar.displayName.replace(ayarlar.tagsiz, ayarlar.tag)).catch(err => {})
            });
            let rollütagsiz = guild.members.cache.filter(m => m.roles.cache.has(roller.tagRolü) && !m.user.username.includes(ayarlar.tag) && !m.roles.cache.has(roller.şüpheliRolü) && !m.roles.cache.has(roller.yasaklıTagRolü) && !m.roles.cache.has(roller.jailRolü) && !roller.kayıtsızRolleri.some(x => m.roles.cache.has(x)))
            rollütagsiz.forEach(rl => {
                rl.setNickname(rl.displayName.replace(ayarlar.tag, ayarlar.tagsiz)).catch(err => {})
                rl.roles.remove(roller.tagRolü).catch(err => {})
            });
            await i.reply({content: `Başarıyla taglı olup rolü olmayan **${tagsizuye.size}** üyeye taglı rolü verildi, ve tagsız **${rollütagsiz.size}** üyeden geri alınmaya başlandı! ${i.guild.emojiGöster(emojiler.Onay)}`, ephemeral: true})
          } 
          if(i.values[0] == "etkinlikçekilişdağıt") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            let olmayanlar = i.guild.members.cache.filter(x => x && !x.user.bot && (!x.roles.cache.has(roller.etkinlikKatılımcısı) || !x.roles.cache.has(roller.cekilisKatılımcısı)))
            var filter = (member) => member && !member.user.bot && (!member.roles.cache.has(roller.etkinlikKatılımcısı) || !member.roles.cache.has(roller.cekilisKatılımcısı))
            //siktirgit oç
            await i.reply({content: `Başarıyla **${olmayanlar.size}** üyeye **Etkinlik & Çekiliş** katılımcısı dağıtılmaya başlandı! ${i.guild.emojiGöster(emojiler.Onay)} `, ephemeral: true})
          }
          if(i.values[0] == "özelkarakter") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            let ünlemliler = i.guild.members.cache.filter(x => x && !x.user.bot && (x.displayName.includes("!") || x.displayName.includes("!!") || x.displayName.includes("!!!") || 
            x.displayName.includes("-") || x.displayName.includes("+") || x.displayName.includes("'") || x.displayName.includes("^")))
            ünlemliler.forEach(async (uye) => {
              await uye.setNickname(uye.displayName.replace("!","").replace("!!","").replace("!!!","").replace("-","").replace("+","").replace("'","").replace("^", "")).catch(err => {})
            })
            await i.reply({content: `Başarıyla **${ünlemliler.size}** üyenin üzerindeki \`Boşluk, Ünlem vs..\` temizlenmeye başlandı! ${i.guild.emojiGöster(emojiler.Onay)} `, ephemeral: true})
          }
          if(i.values[0] == "syncpublic") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            i.reply({content: `${i.guild.emojiGöster(emojiler.Onay)} Başarıyla tüm public(**${i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.publicKategorisi && x.type == "GUILD_VOICE").size}** kanal) ses kanalları senkronize olmaya başladı. Bu işlem biraz uzun sürebilir...`, ephemeral: true})
            i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.publicKategorisi && x.type == "GUILD_VOICE").map(async (x) => {
              if(x.type == "GUILD_VOICE") {
                let data = await VoiceChannels.findOne({ channelID: x.id })
                if(data) {
                  return x.edit({
                    name: data.name,
                    bitrate: data.bitrate,
                    parentId: data.parentID,
                    userLimit: data.userLimit ? data.userLimit : 0,
                  }).catch(err => {})
                }
              }
            })
          }
          if(i.values[0] == "syncother") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            i.reply({content: `${i.guild.emojiGöster(emojiler.Onay)} Başarıyla diğer tüm (**${i.guild.channels.cache.filter(x => x.parentId && x.parentId != kanallar.publicKategorisi && x.parentId != kanallar.registerKategorisi && x.parentId !=  kanallar.streamerKategorisi && x.parentId != kanallar.sorunCozmeKategorisi && x.type == "GUILD_VOICE").size}** kanal) ses kanalları senkronize olmaya başladı. Bu işlem biraz uzun sürebilir...`, ephemeral: true})
            i.guild.channels.cache.filter(x => x.parentId && x.parentId != kanallar.publicKategorisi && x.parentId != kanallar.registerKategorisi && x.parentId !=  kanallar.streamerKategorisi && x.parentId != kanallar.sorunCozmeKategorisi && x.type == "GUILD_VOICE").map(async (x) => {
              if(x.type == "GUILD_VOICE") {
                let data = await VoiceChannels.findOne({ channelID: x.id })
                if(data) {
                  return x.edit({
                    name: data.name,
                    bitrate: data.bitrate,
                    parentId: data.parentID,
                    userLimit: data.userLimit ? data.userLimit : 0,
                  }).catch(err => {})
                }
              }
            })
          }
          if(i.values[0] == "syncsç") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            i.reply({content: `${i.guild.emojiGöster(emojiler.Onay)} Başarıyla tüm sorun çözme(**${i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.sorunCozmeKategorisi && x.type == "GUILD_VOICE").size}** kanal) ses kanalları senkronize olmaya başladı. Bu işlem biraz uzun sürebilir...`, ephemeral: true})
            i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.sorunCozmeKategorisi && x.type == "GUILD_VOICE").map(async (x) => {
              if(x.type == "GUILD_VOICE") {
                let data = await VoiceChannels.findOne({ channelID: x.id })
                if(data) {
                  return x.edit({
                    name: data.name,
                    bitrate: data.bitrate,
                    parentId: data.parentID,
                    userLimit: data.userLimit ? data.userLimit : 0,
                  }).catch(err => {})
                }
              }
            })
          }
          if(i.values[0] == "syncregister") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            i.reply({content: `${i.guild.emojiGöster(emojiler.Onay)} Başarıyla tüm teyit(**${i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.registerKategorisi && x.type == "GUILD_VOICE").size}** kanal) ses kanalları senkronize olmaya başladı. Bu işlem biraz uzun sürebilir...`, ephemeral: true})
            i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.registerKategorisi && x.type == "GUILD_VOICE").map(async (x) => {
              if(x.type == "GUILD_VOICE") {
                let data = await VoiceChannels.findOne({ channelID: x.id })
                if(data) {
                  return x.edit({
                    name: data.name,
                    bitrate: data.bitrate,
                    parentId: data.parentID,
                    userLimit: data.userLimit ? data.userLimit : 0,
                  }).catch(err => {})
                }
              }
            })
          }
          if(i.values[0] == "syncstreamer") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            i.reply({content: `${i.guild.emojiGöster(emojiler.Onay)} Başarıyla tüm yayıncı (**${i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.streamerKategorisi && x.type == "GUILD_VOICE").size}** kanal) ses kanalları senkronize olmaya başladı. Bu işlem biraz uzun sürebilir...`, ephemeral: true})
            i.guild.channels.cache.filter(x => x.parentId && x.parentId == kanallar.streamerKategorisi && x.type == "GUILD_VOICE").map(async (x) => {
              if(x.type == "GUILD_VOICE") {
                let data = await VoiceChannels.findOne({ channelID: x.id })
                if(data) {
                  return x.edit({
                    name: data.name,
                    bitrate: data.bitrate,
                    parentId: data.parentID,
                    userLimit: data.userLimit ? data.userLimit : 0,
                  }).catch(err => {})
                }
              }
            })
          }
          if(i.values[0] == "syncguild") {
            if((roller.kurucuRolleri && !roller.kurucuRolleri.some(oku => uye.roles.cache.has(oku))) && !uye.permissions.has('ADMINISTRATOR')) return await i.reply({content: `${cevaplar.prefix} Yeterli yetkiye sahip değilsin.`, ephemeral: true})
            i.reply({content: `${i.guild.emojiGöster(emojiler.Onay)} Başarıyla tüm sunucu ses kanalları (**${i.guild.channels.cache.filter(x => x.parentId && x.type == "GUILD_VOICE").size}** kanal)senkronize olmaya başladı. Bu işlem biraz uzun sürebilir...`, ephemeral: true})
            i.guild.channels.cache.filter(x => x.parentId && x.type == "GUILD_VOICE").map(async (x) => {
              if(x.type == "GUILD_VOICE") {
                let data = await VoiceChannels.findOne({ channelID: x.id })
                if(data) {
                  return x.edit({
                    name: data.name,
                    bitrate: data.bitrate,
                    parentId: data.parentID,
                    userLimit: data.userLimit ? data.userLimit : 0,
                  }).catch(err => {})
                }
              }
            })
          }
        }

        async function filterDist(sunucu, filter) {
            let role = [roller.etkinlikKatılımcısı, roller.cekilisKatılımcısı]
            let length = (sunucu.members.cache.filter(filter).array().length + 5);
            const sayı = Math.floor(length / Distributors.length);
            for (let index = 0; index < Distributors.length; index++) {
              const bot = Distributors[index];
              const members = bot.guilds.cache.get(sunucu.id).members.cache.filter(filter).array().slice((index * sayı), ((index + 1) * sayı));
              if (members.length <= 0) return;
              for (const member of members) {
                member.roles.add(roller.etkinlikKatılımcısı)
                member.roles.add(roller.cekilisKatılımcısı)
              }
            }
        }
    });

  },


   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let Row = new MessageActionRow().addComponents(
      new MessageButton()
      .setCustomId("özelOdaOluştur")
      .setLabel("Özel Oda Oluştur")
      .setStyle("SUCCESS")
    )
    message.channel.send({content: `**Merhaba!** Özel Oda Oluşturma Sistemine Hoş Geldiniz!

Bu kısımdan kendin belirleyeceğin isimde ve senin yöneteceğin bir kanal oluşturabilirsin.
Ayrıca bu kanala istediklerin girebilir, istemediklerini odaya almayabilirsin.

Belki odanı gizli yaparak devlet sırlarını konuşabilir,
Ya da herkese açık yaparak halka seslenebilirsin.

Aşağıda bulunan "Özel Oda Oluştur" düğmesine basarak oluşturabilirsiniz, iyi sohbetler dilerim.`, components: [Row]})
  }
};

client.on("voiceChannelLeave", async (member, channel) => {
  let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
  if(!guild) return;
  let Data = await Private.findOne({voiceChannelId: channel.id})
  if(!Data) return;
  let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
  if(Data.permaRoom) return;
  setTimeout(async () => {
    if(sesKanalı && sesKanalı.members.size <= 0) { 
      await Private.deleteOne({guildID: Data.guildID, userID: Data.userID})
      setTimeout(() => {
         sesKanalı.delete().catch(err => {})
      }, 2000); 
    }
  }, 5000);
});

client.on("voiceChannelSwitch", async (member, channel, newChannel) => {
  let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
  if(!guild) return;
  let Data = await Private.findOne({voiceChannelId: channel.id})
  if(!Data) return;
  if(Data.permaRoom) return;
  let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
  setTimeout(async () => {
    if(sesKanalı && sesKanalı.members.size <= 0) {
      await Private.deleteOne({guildID: Data.guildID, userID: Data.userID})
      setTimeout(() => {
         sesKanalı.delete().catch(err => {})
      }, 2000); 
    }
  }, 5000);
});


client.on('modalSubmit', async (modal) => {
  if(modal.customId == "limitOzelOdacik") {
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
    if(ayarlar && !ayarlar.özelOda && !ayarlar.özelOdaOluştur) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
    let privOdalar = guild.channels.cache.get(ayarlar.özelOdaOluştur)
    if(!privOdalar) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
  
    let Data = await Private.findOne({guildID: guild.id, userID: uye.id})
    if(!Data) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Bu kullanıcı için özel oda oluşturma yetkisi yok.` , ephemeral: true })
    }
    let limit = parseInt(modal.getTextInputValue('name'))
    if(isNaN(limit)) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Lütfen geçerli bir sayı girin.` , ephemeral: true })
    }
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) {
      sesKanalı.setUserLimit(Number(limit))
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Özel oda limiti başarıyla değiştirildi.` , ephemeral: true })
    } else {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
    }
  }
  if(modal.customId == "isimDegistirme") {
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
    if(ayarlar && !ayarlar.özelOda && !ayarlar.özelOdaOluştur) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
    let privOdalar = guild.channels.cache.get(ayarlar.özelOdaOluştur)
    if(!privOdalar) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
  
    let Data = await Private.findOne({guildID: guild.id, userID: uye.id})
    if(!Data) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
    }
    let isim = modal.getTextInputValue('name'); 
    if(!isim) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Lütfen isim giriniz.` , ephemeral: true })
    }
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) {
      let kanalIsim = sesKanalı.name.replace("🔓", "").replace("🔒", "")
      await sesKanalı.setName(sesKanalı.name.replace(kanalIsim, isim))
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Özel oda ismi değiştirildi.` , ephemeral: true })
    } else {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
    }
  }
  if(modal.customId == "ozelOdaBanla") {
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
    if(ayarlar && !ayarlar.özelOda && !ayarlar.özelOdaOluştur) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
    let privOdalar = guild.channels.cache.get(ayarlar.özelOdaOluştur)
    if(!privOdalar) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
  
    let Data = await Private.findOne({guildID: guild.id, userID: uye.id})
    if(!Data) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Özel oda oluşturmadığınız için bu işlemi yapmaya hakkınız yok.` , ephemeral: true })
    }
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      let id = modal.getTextInputValue('name'); 
      let izinVerilcek = guild.members.cache.get(id)
      if(izinVerilcek) {
        if(izinVerilcek.voice && izinVerilcek.voice.channel && izinVerilcek.voice.channel.id == sesKanalı.id) izinVerilcek.voice.disconnect()
        sesKanalı.permissionOverwrites.delete(izinVerilcek);
        sesKanalı.permissionOverwrites.create(izinVerilcek, { CONNECT: false, VIEW_CHANNEL: false });
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Başarıyla "${sesKanalı}" kanalında ${izinVerilcek} üyesi yasaklandı. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
      } else {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Belirttiğiniz ID ile bir üye eşleşmedi. Lütfen geçerli bir ID numarası girin. ${cevaplar.prefix}` , ephemeral: true })
      }
    } else {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
  }

  if(modal.customId == "ozelOdaIzin") {
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
    if(ayarlar && !ayarlar.özelOda && !ayarlar.özelOdaOluştur) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
    let privOdalar = guild.channels.cache.get(ayarlar.özelOdaOluştur)
    if(!privOdalar) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
  
    let Data = await Private.findOne({guildID: guild.id, userID: uye.id})
    if(!Data) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Özel oda oluşturmadığınız için bu işlemi yapmaya hakkınız yok.` , ephemeral: true })
    }
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      let id = modal.getTextInputValue('name'); 
      let izinVerilcek = guild.members.cache.get(id)
      if(izinVerilcek) {
        sesKanalı.permissionOverwrites.create(izinVerilcek, { CONNECT: true,  VIEW_CHANNEL: true });
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Başarıyla "${sesKanalı}" kanalına ${izinVerilcek} üyesi eklendi. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
      } else {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Belirttiğiniz ID ile bir üye eşleşmedi. Lütfen geçerli bir ID numarası girin. ${cevaplar.prefix}` , ephemeral: true })
      }
    } else {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
  }

  if(modal.customId == "ozelOdaOlusturma") {
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
    if(ayarlar && !ayarlar.özelOda && !ayarlar.özelOdaOluştur) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
    let privOdalar = guild.channels.cache.get(ayarlar.özelOdaOluştur)
    if(!privOdalar) {
      await modal.deferReply({ ephemeral: true })
      return await modal.followUp({content: `Sistemsel olarak özel oda oluştur kapalı.` , ephemeral: true })
    }
  
    let Data = await Private.findOne({guildID: guild.id, userID: uye.id})
    
    let odaIsmi = modal.getTextInputValue('name'); 
    let odaIzin = modal.getTextInputValue('everyone');
    guild.channels.create(`${odaIzin != "HAYIR"  ? "🔓" : "🔒"} ${odaIsmi}`, {
      parent: privOdalar,
      permissionOverwrites: [{
          id: uye,
          allow: [Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK, Permissions.FLAGS.STREAM,Permissions.FLAGS.PRIORITY_SPEAKER,Permissions.FLAGS.MUTE_MEMBERS, Permissions.FLAGS.DEAFEN_MEMBERS, Permissions.FLAGS.MOVE_MEMBERS],
        },
      ],
      type: 'GUILD_VOICE',
    }).then(async (kanal) => {
      if(odaIzin == "HAYIR") { 
        await kanal.permissionOverwrites.edit(uye.guild.roles.everyone.id, { CONNECT: false,SPEAK: true, STREAM: true });
      } else { 
        await kanal.permissionOverwrites.edit(uye.guild.roles.everyone.id, { CONNECT: true, SPEAK: true, STREAM: true }); 
      }
      setTimeout(async () => {
        if(kanal && kanal.members.size <= 0) {
          setTimeout(async () => {
            await Private.deleteOne({guildID: guild.id, userID: uye.id})
            kanal.delete().catch(err => {})
          }, 1250)
        }
      }, 30000)

      let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("kanalBilgisi_ozelOda")
        .setLabel("Kanal Bilgisi")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("izinVer_ozelOda")
        .setLabel("Oda İzni Ver")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("yasakla_ozelOda")
        .setLabel("Odadan Yasakla")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("limit_ozelOda")
        .setLabel("Oda Limiti Düzenle")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("isimDegistir_ozelOda")
        .setLabel("Odanın İsmini Güncelle")
        .setStyle("SECONDARY"),
      )
      let RowTwo = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("herkeseAcik_ozelOda")
        .setLabel(odaIzin != "HAYIR"  ? "Sadece İzinliler'e Ayarla" : "Herkese Açık Ayarla")
        .setStyle(odaIzin != "HAYIR"  ? "SECONDARY" : "PRIMARY"),
        new MessageButton()
        .setCustomId("odaIzinSıfırla")
        .setLabel("Kanal İzinleri Temizle")
        .setStyle("DANGER"),
        new MessageButton()
        .setCustomId("kaldır_ozelOda")
        .setLabel("Kanalı Kaldır")
        .setStyle("DANGER"),
      )
      if(kanal) kanal.send({content : `Özel Oda Yönetim Paneline Hoş Geldin! ${uye}

Özel odanız herkese açık ise yasakladığınız üyeler dışında herkes giriş yapabilir.
Özel odanız sadece izinliler olarak ayarlandığında izin verdiğiniz herkes giriş yapabilir.`, components: [Row, RowTwo]})
      await modal.deferReply({ ephemeral: true })
      await Private.updateOne({guildID: guild.id, userID: uye.id}, {$set: {"Date": Date.now(), "voiceChannelId": kanal.id, "messageChannelId": kanal.id}}, {upsert: true});
      await Private.updateOne({guildID: guild.id, userID: uye.id}, {$set: {"Date": Date.now(), "voiceChannelId": kanal.id, "messageChannelId": kanal.id}}, {upsert: true})
      await modal.followUp({content: `Ses kanalınız başarıyla oluşturuldu! <#${kanal.id}> (**${odaIzin != "EVET"  ? "Sadece İzinliler!" : "Herkese Açık!"}**)
Oluşturulan kanalınızı yönetmek ister misiniz? Yeni özellikle beraber artık ses kanalınızın sohbet yerinden hem kontrol hem mikrofonu olmayan arkadaşlarınızla oradan sohbet edebilirsiniz.` , ephemeral: true })
    })
  }
  
})


client.on("interactionCreate", async (i) => {
  let guild = client.guilds.cache.get(i.guild.id)
  if(!guild) return;
  let uye = guild.members.cache.get(i.user.id)
  if(!uye) return;
  if(!ayarlar) return;
  if(ayarlar && !ayarlar.özelOda && !ayarlar.özelOdaOluştur) return;
  let privOdalar = guild.channels.cache.get(ayarlar.özelOdaOluştur)
  if(!privOdalar) return;

  let Data = await Private.findOne({guildID: guild.id, userID: uye.id})
  if(i.customId == "limit_ozelOda") {
    if(!Data) return i.reply({content: `Kanal'ın isimi için bir özel oda oluşturmalısınız.`, ephemeral: true});
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      let özelOda = new Modal()
      .setCustomId('limitOzelOdacik')
      .setTitle(`${sesKanalı.name.replace("🔒", "").replace("🔓","")} Kanalı Limiti Düzenle!`)
      .addComponents(
        new TextInputComponent()
        .setCustomId('name')
        .setLabel('Kanal Limiti')
        .setStyle('SHORT')
        .setMinLength(1)
        .setMaxLength(2)
        .setPlaceholder(`Örn: 31`)
        .setRequired(true)
      );
      showModal(özelOda, {
        client: client,
        interaction: i,
      })
    } else {
      return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
    }
  }

  if(i.customId == "odaIzinSıfırla") {
    if(!Data) return i.reply({content: `Kanal'ın isimi için bir özel oda oluşturmalısınız.`, ephemeral: true});
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      sesKanalı.permissionOverwrites.cache.filter(x => x.type == "member" && x.id != i.user.id).map(async (x) => {
        await sesKanalı.permissionOverwrites.delete(x.id)
      })
      return i.reply({content: `Başarıyla sen hariç tüm üyelerin izinleri ve yasakları sıfırlandı.`, ephemeral: true});
    } else {
      return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
    }
  }

  if(i.customId == "isimDegistir_ozelOda") {
    if(!Data) return i.reply({content: `Kanal'ın isimi için bir özel oda oluşturmalısınız.`, ephemeral: true});
    
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      let isimDegistirme = new Modal()
      .setCustomId('isimDegistirme')
      .setTitle(`${sesKanalı.name.replace("🔒", "").replace("🔓","")} Kanalı Düzenle`)
      .addComponents(
        new TextInputComponent()
        .setCustomId('name')
        .setLabel('Kanal İsmi')
        .setStyle('SHORT')
        .setMinLength(2)
        .setMaxLength(32)
        .setPlaceholder(`${sesKanalı.name.replace("🔒", "").replace("🔓","")}`)
        .setRequired(true)
      );
      showModal(isimDegistirme, {
        client: client,
        interaction: i,
      })
    } else {
      return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
    }
  }

  if(i.customId == "herkeseAcik_ozelOda") {
    if(!Data) return i.reply({content: `Kanal'ın görünürlüğü için bir özel oda oluşturmalısınız.`, ephemeral: true});
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("kanalBilgisi_ozelOda")
        .setLabel("Kanal Bilgisi")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("izinVer_ozelOda")
        .setLabel("Oda İzni Ver")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("yasakla_ozelOda")
        .setLabel("Odadan Yasakla")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("limit_ozelOda")
        .setLabel("Oda Limiti Düzenle")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("isimDegistir_ozelOda")
        .setLabel("Odanın İsmini Güncelle")
        .setStyle("SECONDARY"),
      )
      let RowTwo = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("herkeseAcik_ozelOda")
        .setLabel(sesKanalı.permissionsFor(uye.guild.roles.everyone).has('CONNECT') ? "Sadece İzinliler'e Ayarla" : "Herkese Açık Ayarla")
        .setStyle(sesKanalı.permissionsFor(uye.guild.roles.everyone).has('CONNECT') ? "SECONDARY" : "PRIMARY"),
        new MessageButton()
        .setCustomId("odaIzinSıfırla")
        .setLabel("Kanal İzinleri Temizle")
        .setStyle("DANGER"),
        new MessageButton()
        .setCustomId("kaldır_ozelOda")
        .setLabel("Kanalı Kaldır")
        .setStyle("DANGER"),
      )
      if (sesKanalı.permissionsFor(uye.guild.roles.everyone).has('CONNECT')) {
        await sesKanalı.permissionOverwrites.edit(uye.guild.roles.everyone.id, { CONNECT: false, SPEAK: true, STREAM: true });
        sesKanalı.setName(sesKanalı.name.replace("🔓", "🔒"))
        RowTwo.components[0].setStyle("PRIMARY").setLabel(`Herkese Açık Ayarla`)
        i.update({components: [Row, RowTwo]})
      } else {
        await sesKanalı.permissionOverwrites.edit(uye.guild.roles.everyone.id, { CONNECT: true, SPEAK: true, STREAM: true });
        RowTwo.components[0].setStyle("SECONDARY").setLabel(`Sadece İzinliler'e Ayarla`)
        sesKanalı.setName(sesKanalı.name.replace("🔒", "🔓"))
        i.update({components: [Row, RowTwo]})
      } 
    } else {
      return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
    }
}

  if(i.customId == "yasakla_ozelOda") {
    
    if(!Data) return i.reply({content: `Kanal'a izinli kaldırmam için bir özel oda oluşturmalısınız.`, ephemeral: true});
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      let izinOdaBanla = new Modal()
      .setCustomId('ozelOdaBanla')
      .setTitle(`${sesKanalı.name.replace("🔒", "").replace("🔓","")} Kanalı Yasaklama Paneli`)
      .addComponents(
        new TextInputComponent()
        .setCustomId('name')
        .setLabel('ID')
        .setStyle('SHORT')
        .setMinLength(18)
        .setMaxLength(22)
        .setPlaceholder(`Örn: 327236967265861633`)
        .setRequired(true)
      );
      showModal(izinOdaBanla, {
        client: client,
        interaction: i,
      })
    } else {
      return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
    }
}

  if(i.customId == "izinVer_ozelOda") {
      if(!Data) return i.reply({content: `Kanal'a izinli eklemem için bir özel oda oluşturmalısınız.`, ephemeral: true});
      let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
      if(sesKanalı) { 
        let izinOda = new Modal()
        .setCustomId('ozelOdaIzin')
        .setTitle(`${sesKanalı.name.replace("🔒", "").replace("🔓","")} Kanalı İzin Paneli`)
        .addComponents(
          new TextInputComponent()
          .setCustomId('name')
          .setLabel('ID')
          .setStyle('SHORT')
          .setMinLength(18)
          .setMaxLength(22)
          .setPlaceholder(`Örn: 327236967265861633`)
          .setRequired(true)
        );
        showModal(izinOda, {
          client: client,
          interaction: i,
        })
      } else {
        return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
      }
  }
  if(i.customId == "kaldır_ozelOda") {
    if(!Data) return i.reply({content: `Kanal'ı kaldırmam için bir özel oda oluşturmalısınız.`, ephemeral: true});

    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) { 
      setTimeout(async () => {
        await Private.deleteOne({guildID: guild.id, userID: uye.id})
        await sesKanalı.delete().catch(err => {})
      }, 5000);
      i.reply({content: `Başarıyla kanal silme işleminiz tamamlandı.
5 Saniye içerisinde ${sesKanalı} kanalınız silinecektir. ${uye.guild.emojiGöster(emojiler.Onay)}`, ephemeral: true})
    } else {
      return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
    }
  }
  if(i.customId == "kanalBilgisi_ozelOda") {
    if(!Data) return i.reply({content: `Kanal bilginizi görüntüleyebilmem için bir özel oda oluşturmalısınız.`, ephemeral: true});
    let sesKanalı = guild.channels.cache.get(Data.voiceChannelId)
    if(sesKanalı) {
      let yasaklılar = []
      let izinliler = []
      sesKanalı.permissionOverwrites.cache.filter(x => x.type == "member" && x.id != i.user.id).map(x => {
        if(sesKanalı.permissionsFor(x.id) && sesKanalı.permissionsFor(x.id).has("CONNECT")) {
          izinliler.push(x.id)
        } else {
          yasaklılar.push(x.id)
        }
      })

      i.reply({content: `
Ses kanalın görünürlüğü: **${sesKanalı.permissionsFor(uye.guild.roles.everyone).has('CONNECT') ? "Herkese Açık!" : "Sadece İzinliler!"}**
Oluşturulma tarihi: <t:${String(Data.Date).slice(0, 10)}:F> (<t:${String(Data.Date).slice(0, 10)}:R>)

Ses kanalında izinliler:
${izinliler.length > 0 ? izinliler.map(x => `> ${uye.guild.members.cache.get(x)} (\`${x}\`)`).join("\n") : "İzinli bulunamadı!"}

Ses kanalında yasaklılar:
${yasaklılar.length > 0 ? yasaklılar.map(x => `> ${uye.guild.members.cache.get(x)} (\`${x}\`)`).join("\n") : "Yasaklı bulunamadı!"}

`, ephemeral: true})
    } else {
      return i.reply({content: `Sistemsel bir hata oluştu, lütfen yöneticilere başvurun.`, ephemeral: true});
    }
  }

  const modal = new Modal()
  .setCustomId('ozelOdaOlusturma')
  .setTitle('Özel Oda Oluşturma')
  .addComponents(
    new TextInputComponent()
    .setCustomId('name')
    .setLabel('Oda İsmi Giriniz!')
    .setStyle('SHORT')
    .setMinLength(3)
    .setMaxLength(60)
    .setPlaceholder(`Örn: Acar'ın Odası`)
    .setRequired(true),
    new TextInputComponent()
    .setCustomId('everyone')
    .setLabel('SES HERKESE AÇIK MI? (EVET/HAYIR)')
    .setStyle('SHORT')
    .setMinLength(1)
    .setMaxLength(10)
    .setPlaceholder('Sadece "EVET" veya "HAYIR" yazın.')
    .setRequired(true),
  );
  if(i.customId == "özelOdaOluştur") {
    if(Data) return i.reply({content: `Aktif bir özel odanız olduğundan dolayı bir özel oda oluşturmazsınız.`, ephemeral: true});
    showModal(modal, {
      client: client,
      interaction: i 
    })
  }
})

function başHarfBüyült(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

async function voiceKur(idcik, message, embed) {
    let sesKurma = await VoiceChannels.find({ parentID: idcik })
    if(sesKurma) {
      sesKurma.forEach(async (data) => {
         message.guild.channels.create(data.name, {
          type: 'GUILD_VOICE',
          bitrate: data.bitrate,
          parentId: idcik,
          position: data.position,
          userLimit: data.userLimit ? data.userLimit : 0
        }).then(async (gg) => {
          await gg.setParent(idcik)
        })
      })
    }
}

async function textKur(idcik, message, embed) {
  let metinkurma = await TextChannels.find({ parentID: idcik })
  if(metinkurma) {
    metinkurma.forEach(async (data) => {
      await message.guild.channels.create(data.name, {
        type: 'GUILD_TEXT',
        nsfw: data.nsfw,
        parentId: idcik,
        position: data.position,
        rateLimit: data.rateLimit,
      }).then(async (gg) => {
        await gg.setParent(idcik)
      });
    })
  }
}