const { Client, Message, Util, Intents, MessageActionRow, MessageButton, MessageAttachment, MessageSelectMenu} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const GUARDS_SETTINGS = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const { genEmbed } = require('../../../../Global/Init/Embed')

let BOTS = global.allBots = client.allBots = []
module.exports = {
    Isim: "bot",
    Komut: ["bot-dev","update-bots","botsu","acr-bot","bot-setting","dev-discord","bots","botpp"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: async function (client) {
    let callbacks = require('../../../../Global/Settings/_system.json');

    // Bot Token's

let Stat = callbacks.TOKENS.Statistics
let Voucher = callbacks.TOKENS.Voucher
let Controller = sistem.TOKENS.CONTROLLER
let Sync = callbacks.TOKENS.SYNC
let SEC_MAIN = callbacks.TOKENS.SECURITY.MAIN
let SEC_ONE = callbacks.TOKENS.SECURITY.SEC_ONE
let SEC_TWO = callbacks.TOKENS.SECURITY.SEC_TWO
let SEC_THREE = callbacks.TOKENS.SECURITY.SEC_THREE
let SEC_FOUR = callbacks.TOKENS.SECURITY.SEC_FOUR
let DISTS = callbacks.TOKENS.SECURITY.DISTS
let WELCOMES = callbacks.TOKENS.WELCOME.WELCOMES
    // Bot Token's

let allTokens = [Stat, Voucher,Controller, Sync, SEC_MAIN, SEC_ONE, SEC_TWO, ...WELCOMES, ...DISTS]
let guardSettings = await GUARDS_SETTINGS.findOne({guildID: sistem.SERVER.ID})
if(!guardSettings) await GUARDS_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$set: {"auditLimit": 10, auditInLimitTime: "2m"}}, {upsert: true})
allTokens.forEach(async (token) => {
    let botClient;
    if(callbacks.TOKENS.SECURITY.DISTS.includes(token) || SEC_TWO == token) {
        botClient = new Client({
            intents: [32767],
            presence: { status: "invisible" },
          }); 
    } else {
        botClient = new Client({
            intents: [32767],
            presence: {activities: [{name: sistem.botStatus.Name}], status: sistem.botStatus.Status}
          });

    }
      botClient.on("ready", async () => {  
          BOTS.push(botClient)
          let guardSettings = await GUARDS_SETTINGS.findOne({guildID: sistem.SERVER.ID})
          if(!callbacks.TOKENS.WELCOME.WELCOMES.includes(botClient.token)) {
            if(guardSettings && guardSettings.BOTS && !guardSettings.BOTS.includes(botClient.user.id)) {
                await GUARDS_SETTINGS.updateOne({guildID: sistem.SERVER.ID}, {$push: {"BOTS": botClient.user.id} }, {upsert: true})
            }
          }  
      })
      await botClient.login(token).catch(err => {
      })
})

  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    let callbacks = require('../../../../Global/Settings/_system.json');

        // Bot Token's
    let Req = callbacks.TOKENS.Requirements
    let Stat = callbacks.TOKENS.Statistics
    let Voucher = callbacks.TOKENS.Voucher
    let SEC_MAIN = callbacks.TOKENS.SECURITY.MAIN
    let SEC_ONE = callbacks.TOKENS.SECURITY.SEC_ONE
    let SEC_TWO = callbacks.TOKENS.SECURITY.SEC_TWO
    let SEC_THREE = callbacks.TOKENS.SECURITY.SEC_THREE
    let SEC_FOUR = callbacks.TOKENS.SECURITY.SEC_FOUR
    let DISTS = callbacks.TOKENS.SECURITY.DISTS
        // Bot Token's

    let allTokens = [Req, Stat, Voucher, SEC_MAIN, SEC_ONE, SEC_TWO, SEC_THREE, SEC_FOUR, ...DISTS]
    let pubTokens = [Req, Stat, Voucher, SEC_MAIN, SEC_ONE, SEC_TWO, SEC_THREE, SEC_FOUR]
   
    let OWNBOTS = []

    BOTS.forEach(bot => {
        OWNBOTS.push({
            value: bot.user.id,
            emoji: { id: "925127916621291541" },
            label: `${bot.user.tag}`,
            description: `${bot.user.id}`
        })
    })
    let Row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("selectBot")
        .setPlaceholder("G??ncellenmesini istedi??iniz botu se??in.")
        .setOptions(
            [OWNBOTS]
        )
    )

    let msg = await message.channel.send({embeds: [new genEmbed().setColor("WHITE").setAuthor(message.member.user.tag, message.member.user.avatarURL({dynamic: true})).setDescription(`A??a????da s??ralanmakta olan botlar??n ismini, profil foto??raf??n??, durumunu ve hakk??ndas??n?? de??i??mesini istedi??iniz bir botu se??iniz.`)],components: [Row]})
    const filter = i => i.user.id == message.member.id
    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })

    collector.on('collect', async (i) => {
        if(i.customId == "selectBot") {
            let type = i.values
            if(!type) return await i.reply({content: "Bir bot veya i??lem bulunamad??!", ephemeral: true})

                let botId = i.values
                let botClient = BOTS.find(bot => bot.user.id == type)
                if(!botClient) return await i.reply({content: "Bir bot veya i??lem bulunamad??!", ephemeral: true})
                let updateRow = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId("selectAvatar")
                    .setEmoji("943286130357444608")
                    .setLabel("Profil Foto??raf?? De??i??iklili??i")
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId("selectName")
                    .setEmoji("943290426562076762")
                    .setLabel("??sim De??i??iklili??i")
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId("selectAbout")
                    .setEmoji("943290446329835570")
                    .setLabel("Hakk??nda De??i??iklili??i")
                    .setStyle("SECONDARY"),
                    new MessageButton()
                    .setCustomId("selectState")
                    .setEmoji("951514358377234432")
                    .setLabel("Durum De??i??iklili??i")
                    .setStyle("SECONDARY"),
                )
                msg.delete().catch(err => {})
                await message.channel.send({embeds: [new genEmbed().setColor("WHITE").setDescription(`${botClient.user} (**${botClient.user.tag}**) isimli bot ??zerinde yapmak istedi??iniz de??i??iklili??i se??iniz?`)], components: [
                    updateRow
                ]}).then(msg => {
                    const filter = i => i.user.id == message.member.id 
                    const collector = msg.createMessageComponentCollector({ filter: filter,  errors: ["time"], time: 35000 })
                    collector.on("collect", async (i) => {
                        let botClient = BOTS.find(bot => bot.user.id == botId)
                        if(!botClient) return await i.reply({content: "Bir bot veya i??lem bulunamad??!", ephemeral: true})
                        if(i.customId == "selectAbout" || i.customId == "selectState") {
                            await i.reply({content:`??uan yap??m a??amas??nda.`, ephemeral: true})
                        }
                        if(i.customId == "selectAvatar") {
                             msg.edit({embeds: [new genEmbed().setColor("DARK_GOLD").setDescription(`${message.guild.emojiG??ster(emojiler.Icon)} ${botClient.user} isimli botun yeni profil resmini y??kleyin veya ba??lant??s??n?? girin. ????lemi iptal etmek i??in (**iptal**) yazabilirsiniz. (**S??re**: \`60 Saniye\`)`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiG??ster(emojiler.Iptal) ? message.guild.emojiG??ster(emojiler.Iptal).id : undefined).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} Profil resmi de??i??tirme i??lemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.avatarURL({dynamic: true})
                                  let bekle = await message.reply(`Bu i??lem biraz uzun s??rebilir, L??tfen bekleyin...`)
                                   let isim = m.content || m.attachments.first().url
                                    if(!isim) {
                                        message.react(message.guild.emojiG??ster(emojiler.Iptal) ? message.guild.emojiG??ster(emojiler.Iptal).id : undefined).catch(err => {})
                                        msg.delete().catch(err => {});
                                        await i.reply({content: `${cevaplar.prefix} Profil resmi belirtilmedi??i i??in i??lem iptal edildi.`, ephemeral: true})
                                        return;
                                    }
                                  botClient.user.setAvatar(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new genEmbed().setFooter(`${tarihsel(Date.now())} tarihinde i??leme koyuldu.`).setDescription(`${message.member} taraf??ndan ${botClient.user} isimli botun profil resmi de??i??tirildi.`).setThumbnail(botClient.user.avatarURL())]})
                                      message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiG??ster(emojiler.Onay)} Ba??ar??yla! ${botClient.user} isimli botun profil resmi g??ncellendi!`).setThumbnail(botClient.user.avatarURL())]}).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Onay) ? message.guild.emojiG??ster(emojiler.Onay).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.tag}**, Ba??ar??s??z! profil resmi g??ncelleyebilmem i??in biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Iptal) ? message.guild.emojiG??ster(emojiler.Iptal).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                        if(i.customId == "selectName") {
                            msg.edit({embeds: [new genEmbed().setColor("DARK_GOLD").setDescription(`${message.guild.emojiG??ster(emojiler.Icon)} ${botClient.user} isimli botun yeni ismini belirtin. ????lemi iptal etmek i??in (**iptal**) yazabilirsiniz. (**S??re**: \`60 Saniye\`)`)],components: []})
                            var isimfilter = m => m.author.id == message.member.id
                            let col = msg.channel.createMessageCollector({filter: isimfilter, time: 60000, max: 1, errors: ["time"]})

                            col.on('collect', async (m) => {
                                if (m.content == ("iptal" || "i")) {
                                    msg.delete().catch(err => {});
                                    message.react(message.guild.emojiG??ster(emojiler.Iptal) ? message.guild.emojiG??ster(emojiler.Iptal).id : undefined).catch(err => {})
                                    await i.reply({content: `${cevaplar.prefix} ??sim de??i??tirme i??lemi iptal edildi.`, ephemeral: true})
                                    return;
                                  };
                                  let eskinick = botClient.user.username
                                  let bekle = await message.reply(`Bu i??lem biraz uzun s??rebilir, L??tfen bekleyin...`)
                                  let isim = m.content
                                  botClient.user.setUsername(isim).then(x => {
                                      bekle.delete().catch(err => {})
                                      msg.delete().catch(err => {})
                                      let logChannel = message.guild.kanalBul("guild-log")
                                      if(logChannel) logChannel.send({embeds: [new genEmbed().setFooter(`${tarihsel(Date.now())} tarihinde i??leme koyuldu.`).setDescription(`${message.member} taraf??ndan ${botClient.user} isimli botun ismi de??i??tirildi.\n**${eskinick}** \` ????????? \` **${botClient.user.username}** olarak g??ncellendi.`)]})
                                      message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiG??ster(emojiler.Onay)} Ba??ar??yla! **${eskinick}** \` ????????? \` **${botClient.user.username}** olarak de??i??tirildi.`)]}).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Onay) ? message.guild.emojiG??ster(emojiler.Onay).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 30000);
                                   })
                                  }).catch(err => {
                                       bekle.delete().catch(err => {})
                                       msg.delete().catch(err => {})
                                      message.channel.send(`${cevaplar.prefix} **${botClient.user.tag}**, Ba??ar??s??z! isim de??i??tirebilmem i??in biraz beklemem gerek!`).then(x => {
                                       message.react(message.guild.emojiG??ster(emojiler.Iptal) ? message.guild.emojiG??ster(emojiler.Iptal).id : undefined).catch(err => {})
                                       setTimeout(() => {
                                           x.delete().catch(err => {})
                                       }, 7500);
                                   })
                                  })
                            });
                            
                            col.on('end', collected => {
                                msg.delete().catch(err => {});
                            });
                        }
                    })
                })
   
        }
    })

    collector.on("end", async () => {
        msg.delete().catch(err => {})
    })
  }
};