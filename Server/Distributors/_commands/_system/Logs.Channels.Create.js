const { Client, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");

const normalLoglar = [
    "isim-log",
    "kayıt-log",
    "kayıtsız-log",
    "taglı-log",
    "terfi-log",
    "yetki-ver-log",
    "yetki-bırakan",
    "yetki-çek-log",
    "mesaj-log",
    "ses-log",
    "nsfw-log",
    "bkes-log",
    "taşı-log",
    "underworld-log",
    "ban-log",
    "jail-log",
    "şüpheli-log",
    "yasaklı-tag-log",
    "mute-log",
    "sesmute-log",
    "uyarı-log",
    "rol-ver-log",
    "rol-al-log",
    "magaza-log",
    "görev-log",
    "görev-bilgi",
    "görev-tamamlayan",
    "başvuru-log",
    "şikayet-log"
]
const guvenlikLoglar = [
    "guard-log",
    "guild-log",
    "safe-command-log",
    "forceban-log",
]
module.exports = {
    Isim: "logkur",
    Komut: ["logkanalkur"],
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
    if(ayarlar.type) normalLoglar.push("tag-log");
    if(message.guild.channels.cache.find(x => x.name == "EX-SECURITY") && message.guild.channels.cache.find(x => x.name == "A-LOGS")) {
        const buttonSatır = new MessageActionRow()
        .addComponents(
                new MessageButton()
                .setCustomId('kaldıramk')
                .setLabel('Kanalları Kaldır!')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('tekrarkuroç')
                .setLabel('Kanalları Tekrar Kur!')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('iptal')
                .setEmoji(message.guild.emojiGöster(emojiler.Iptal).id)
                .setLabel('İşlemi İptal Et')
                .setStyle('DANGER'),
            );
            let bulNormal = message.guild.channels.cache.find(x => normalLoglar.some(log => x.name == log))
            let bulGuvenlik = message.guild.channels.cache.find(x => guvenlikLoglar.some(log => x.name == log))
            await message.channel.send({components: [buttonSatır] ,embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Iptal)} (\`#${message.guild.channels.cache.find(x => x.name == "A-LOGS").name}\` / \`#${message.guild.channels.cache.find(x => x.name == "EX-SECURITY").name}\`) kategorilere kurulmuş olarak gösterilmektedir. Aşağıdaki düğmelerden yapılmasını istediğiniz işlemi seçiniz!`)]})
            .then(x => {
                const filter = i =>  i.user.id === message.member.id;

                const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
                
                collector.on('collect', async i => {
                    if(i.customId === "tekrarkuroç") {
                        x.delete()
                        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
                        i.deferUpdate()
                        return kanalKur(message)
                    }
                    if (i.customId === 'kaldıramk') {
                        i.deferUpdate()
                        x.delete().catch(err => {})
                        message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
                        await message.guild.channels.cache.filter(k => guvenlikLoglar.some(x => k.name == x)).forEach(x => x.delete().catch(err => {}))
                        await message.guild.channels.cache.filter(k => normalLoglar.some(x => k.name == x)).forEach(x => x.delete().catch(err => {}))
                        await message.guild.channels.cache.find(x => x.name == "EX-SECURITY").delete().catch(err => {})
                        await message.guild.channels.cache.find(x => x.name == "A-LOGS").delete().catch(err => {})

                   
                  }
                    if (i.customId === "iptal") {
                        x.delete()
                        message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
                    }
                   
                });
                
                collector.on('end', collected => {});
            })
    } else {
        kanalKur(message)
    }
    }
};

async function kanalKur(message) {
    const log = await message.guild.channels.create("A-LOGS", {
        type: "GUILD_CATEGORY",
        permissionOverwrites: [{
            id: message.guild.roles.everyone.id,
            deny: ['VIEW_CHANNEL']
        }]
    });
    const secLog = await message.guild.channels.create("EX-SECURITY", {
        type: "GUILD_CATEGORY",
        permissionOverwrites: [{
            id: message.guild.roles.everyone.id,
            deny: ['VIEW_CHANNEL']
        }]
    });
    normalLoglar.some(x => {
        message.guild.channels.create(x, {parent: log});
    })
    guvenlikLoglar.some(x => {
        message.guild.channels.create(x, {parent: secLog});
    })
    message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} Gerekli olan tüm log ve güvenlik kanalları oluşturuldu ve otomatik olarak veri tabanına işlendi.`)]})
    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
}