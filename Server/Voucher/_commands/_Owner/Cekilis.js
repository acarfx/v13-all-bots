const {MessageActionRow, MessageButton, MessageSelectMenu} = Discord = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const ms = require('ms')

const { Modal, TextInputComponent, SelectMenuComponent } = discordModals = require('discord-modals');
let kanal;
module.exports = {
    Isim: "çekiliş",
    Komut: ["cekilis"],
    Kullanim: "cekilis",
    Aciklama: "Belirtilen bir rolün üyelerinin seste olup olmadığını ve rol bilgilerini gösterir.",
    Kategori: "kurucu",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on('modalSubmit', async (modal) => {
 
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
        if(modal.customId == "cekilisOlustur") {
            client.giveawaysManager.start(kanal, {
                time: ms(modal.getTextInputValue("zaman")),
                prize: modal.getTextInputValue("ödül"),
                duration: ms(modal.getTextInputValue("zaman")),
                winnerCount: parseInt(modal.getTextInputValue("winner")),
                lastChance: {
                    enabled: true,
                    content: '**KATILMAK İÇİN SON ŞANS !** ⚠️',
                    threshold: 5000,
                    embedColor: 'RED'
                }
            }).then((gData) => {
            });
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Başarıyla ${kanal} kanalında çekiliş başlatıldı. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
        }
        if(modal.customId == "cekilişBitir") {
            client.giveawaysManager.end(modal.getTextInputValue("id"))
            await modal.deferReply({ ephemeral: true })
            return await modal.followUp({content: `Başarıyla çekiliş bitirildi. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
        }
        if(modal.customId == "geRoll") {
            client.giveawaysManager.reroll(modal.getTextInputValue("id"))
            .then(async (x) => {
                await modal.deferReply({ ephemeral: true })
                return await modal.followUp({content: `Başarıyla çekiliş tekrarlandı. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
            })
            .catch(async (err) => {
                await modal.deferReply({ ephemeral: true })
                return await modal.followUp({content: `Tekrardan kazanan belirlenmesi için çekilişin bitmesi gerek. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
            })
        }
    })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if((roller.çekilişHakkı && !roller.çekilişHakkı.some(x => message.member.roles.cache.has(x))) && !message.member.permissions.has("ADMINISTRATOR") && !roller.kurucuRolleri.some(x => message.member.roles.cache.has(x)))  return message.reply({content: `${cevaplar.noyt}`}).then(x => {
        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => {})
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 7500);
    })
    let embed = new genEmbed()
    
    let Row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("çekilişYap")
        .setLabel("Çekiliş Oluştur")
        .setStyle("SUCCESS")
        .setEmoji(message.guild.emojiGöster("acar_giveaway")),
        new MessageButton()
        .setCustomId("gerollCekilis")
        .setLabel("Kazanan Tekrarla")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("cekilisBitir")
        .setLabel("Çekiliş Bitir")
        .setStyle("SECONDARY"),
        new MessageButton()
        .setCustomId("çekilişListele")
        .setLabel("Çekilişleri Listele")
        .setStyle("SECONDARY"),
        )
    let load = await message.reply({content: `Çekiliş sistemi yükleniyor... Lütfen bekleyin!`})
    
    await load.edit({
        components: [Row],
        content: `${message.guild.emojiGöster("acar_giveaway")} ${message.guild.emojiGöster("acar_giveaway")} **ÇEKİLİŞ** ${message.guild.emojiGöster("acar_giveaway")} ${message.guild.emojiGöster("acar_giveaway")}`,
        embeds: [
            new genEmbed().setColor("YELLOW")
            .setDescription(`Aşağıda ${message.guild.name} sunucusunda çekiliş oluşturma, karıştırmak ve bitirmek için düğmeleri kullanabilirsiniz.`)
        ]
    })

    var filter = (i) => i.user.id == message.author.id
    let collector = load.createMessageComponentCollector({filter:filter, time: 30000, max: 1})
    collector.on('end', (i, reason) => {
        load.delete().catch(err => {})
        if(reason == "time") message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
    })

    collector.on("collect", async (i) => { 
        if(i.customId == "çekilişListele") {
            let dataa = client.giveawaysManager.giveaways.sort((a, b) => b.startAt - a.startAt).slice(0, 10).map((x, index) => {

                return  `\` ${index + 1} \` **${x.prize}**  <t:${String(x.startAt).slice(0, 10)}:R> [${x.winnerIds.length > 0 ? x.winnerIds.map(a => message.guild.members.cache.get(a)) : "**KAZANAN YOK**"}]`
                
            }).join("\n")

            i.reply({content: `Aşağıda **${message.guild.name}** sunucusuna ait son 10 çekiliş listelenmektedir.

${dataa ? dataa : `**Daha önce bir çekiliş yapılmamış.**`}`})
        }
        if(i.customId == "gerollCekilis") {
            let setTasks = new Modal()
            .setCustomId('geRoll')
            .setTitle('Çekiliş Bitir!')
            .addComponents(
              new TextInputComponent()
              .setCustomId('id')
              .setLabel("Mesaj ID")
              .setStyle('SHORT')
              .setPlaceholder('Örn: 997964821771337819')
              .setRequired(true),
            )
            kanal = message.channel
            await i.showModal(setTasks);
            message.react(message.guild.emojiGöster("985341193745473536")).catch(err => {})
            
        }
        if(i.customId == "cekilisBitir") {
            let setTasks = new Modal()
            .setCustomId('cekilişBitir')
            .setTitle('Çekiliş Bitir!')
            .addComponents(
              new TextInputComponent()
              .setCustomId('id')
              .setLabel("Mesaj ID")
              .setStyle('SHORT')
              .setPlaceholder('Örn: 997964821771337819')
              .setRequired(true),
            )
            kanal = message.channel
            await i.showModal(setTasks);
            message.react(message.guild.emojiGöster("985341193745473536")).catch(err => {})
            
        }
        if(i.customId == "çekilişYap") {
            let setTasks = new Modal()
            .setCustomId('cekilisOlustur')
            .setTitle('Çekiliş Oluştur!')
            .addComponents(
              new TextInputComponent()
              .setCustomId('ödül')
              .setLabel("Ödül")
              .setStyle('SHORT')
              .setPlaceholder('Örn: Boostlu Nitro')
              .setRequired(true),
              new TextInputComponent()
              .setCustomId('winner')
              .setLabel("Kaç Kişi Kazanacak?")
              .setStyle('SHORT')
              .setPlaceholder(`Örn: 1`)
              .setRequired(true),
              new TextInputComponent()
              .setCustomId('zaman')
              .setLabel("Kaç Saniye?")
              .setStyle('SHORT')
              .setPlaceholder(`Örn: 1m`)
              .setRequired(true),
            )
            kanal = message.channel
            await i.showModal(setTasks);
            message.react(message.guild.emojiGöster("985341193745473536")).catch(err => {})
            
        }

    })
    }
};

/*
    client.giveawaysManager.start(message.channel, {
        time: ms(args[0]),
        prize: args.slice(2).join(' '),
        duration: ms(args[0]),
        winnerCount: parseInt(args[1])
    }).then((gData) => {
        console.log(gData);
    });
    */