const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
module.exports = {
  Isim: "komutdenetim",
  Komut: ["komutkullanimi"],
  Kullanim: "komutdenetim @acar/ID",
  Aciklama: "Bir üyenin kullandığı komut geçmişini gösterir.",
  Kategori: "yönetim",
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
    let embed = new genEmbed()
    if(!roller.üstYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.kurucuRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.altYönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !roller.Yetkiler.some(oku => message.member.roles.cache.has(oku)) && !roller.yönetimRolleri.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.reply(cevaplar.noyt).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    uye = message.guild.members.cache.get(uye.id)
    const button1 = new MessageButton()
                .setCustomId('geri')
                .setLabel('◀ Geri')
                .setStyle('PRIMARY');
    const buttonkapat = new MessageButton()
                .setCustomId('kapat')
 .setEmoji("929001437466357800")               
 .setStyle('DANGER');
                
    const button2 = new MessageButton()
                .setCustomId('ileri')
                .setLabel('İleri ▶')
                .setStyle('PRIMARY');
    Users.findOne({_id: uye.id }, async (err, res) => {
      if (!res) return message.channel.send(`${cevaplar.prefix} Komut bilgisi bulunamadı.`).then(x => setTimeout(() => {x.delete()}, 7500))
      if(!res.CommandsLogs) return message.channel.send(`${cevaplar.prefix} Komut bilgisi bulunamadı.`).then(x => setTimeout(() => {x.delete()}, 7500))
      let pages = res.CommandsLogs.sort((a, b) => b.Tarih - a.Tarih).chunk(20);
      var currentPage = 1
      if (!pages && !pages.length || !pages[currentPage - 1]) return message.reply(`${cevaplar.prefix} Komut bilgisi bulunamadı.`).then(x => setTimeout(() => {x.delete()}, 7500))
      let embed = new genEmbed().setColor("WHITE").setAuthor(uye.user.tag, uye.user.avatarURL({dynamic: true})).setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length}`, message.guild.iconURL({dynamic: true}))
      const row = new MessageActionRow().addComponents([button1, buttonkapat, button2]);
      if (message.deferred == false){
        await message.deferReply()
      };
      const curPage = await message.channel.send({
        embeds: [embed.setDescription(`${uye}, üyesin komut bilgileri yükleniyor... Lütfen bekleyin...`)],
        components: [row], fetchReply: true,
      }).catch(err => {});
    
      await curPage.edit({embeds: [embed.setDescription(`${uye} isimli üyesinin toplamda \`${res.CommandsLogs.length || 0}\` adet komut kullanımı mevcut.

${pages[currentPage - 1].map((value, index) => `\` ${index + 1} \` ${global.sistem.botSettings.Prefixs[0] + value.Komut} ${value.Kanal ? message.guild.channels.cache.get(value.Kanal) ? `(${message.guild.channels.cache.get(value.Kanal)})` : `` : ``} <t:${String(value.Tarih).slice(0, 10)}:R>`).join("\n")} `)]}).catch(err => {})

      const filter = (i) => i.user.id == message.member.id

      const collector = await curPage.createMessageComponentCollector({
        filter,
        time: 30000,
      });

      collector.on("collect", async (i) => {
        switch (i.customId) {
          case "ileri":
            if (currentPage == pages.length) break;
            currentPage++;
            break;
          case "geri":
            if (currentPage == 1) break;
            currentPage--;
            break;
          default:
            break;
          case "kapat": 
            i.deferUpdate().catch(err => {});
            curPage.delete().catch(err => {})
            return message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined);
        }
        await i.deferUpdate();
        await curPage.edit({
          embeds: [embed.setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name} • ${currentPage} / ${pages.length} `, message.guild.iconURL({dynamic: true})).setDescription(`${uye} isimli üyesinin toplamda \`${res.CommandsLogs.length || 0}\` adet komut kullanımı mevcut.

${pages[currentPage - 1].map((value, index) => `\` ${index + 1} \` ${global.sistem.botSettings.Prefixs[0] + value.Komut} ${value.Kanal ? message.guild.channels.cache.get(value.Kanal) ? `(${message.guild.channels.cache.get(value.Kanal)})` : `` : ``} <t:${String(value.Tarih).slice(0, 10)}:R>`).join("\n")}`)]
        }).catch(err => {});
        collector.resetTimer();
      });
      collector.on("end", () => {
        if(curPage) curPage.edit({
          embeds: [embed.setFooter(`${ayarlar.serverName ? ayarlar.serverName : message.guild.name}`, message.guild.iconURL({dynamic: true})).setDescription(`${uye} isimli üyesinin toplamda \`${res.CommandsLogs.length || 0}\` adet komut kullanımı mevcut.`)],
          components: [],
        }).catch(err => {});
      })
    })
  }
};