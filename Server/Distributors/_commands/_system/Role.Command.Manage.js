const { Client, Message, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
const TalentPerms = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const task = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks');
const { genEmbed } = require("../../../../Global/Init/Embed");
const ms = require('ms')
const { 
  Modal,
  TextInputComponent,
  SelectMenuComponent,
  showModal
} = dcmodal = require('discord-modals')

module.exports = {
    Isim: "tp",
    Komut: ["talentperm","talentperms","özelkomut","rolkomut"],
    Kullanim: "",
    Aciklama: "",
    Kategori: "-",
    Extend: true,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) {
    client.on('modalSubmit', async (modal) => {
      let guild = client.guilds.cache.get(modal.guildId);

      if(!guild) {
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel olarak bir hata oluştur` , ephemeral: true })
      }
      let uye = guild.members.cache.get(modal.user.id)
      if(!uye){
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Sistemsel hata oluştu.` , ephemeral: true })
      }
      if(modal.customId == "tp-kaldır") {
        let cmdName = modal.getTextInputValue('tp_isim');
        let check = await TalentPerms.findOne({guildID: guild.id})
        let cmd = check.talentPerms.find(acar => acar.Commands == cmdName)
        if(!cmd) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen isimde aktif bir komut bulunmakta. ${cevaplar.prefix}` , ephemeral: true })
        }
        await TalentPerms.updateOne({guildID: guild.id}, { $pull: { "talentPerms": cmd } }, { upsert: true })
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Başarıyla ${cmdName} komutu <t:${String(Date.now()).slice(0, 10)}:R> kaldırıldı. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })

      }
      if(modal.customId == "tp-detay") {
        let cmdName = modal.getTextInputValue('tp_isim');
        let check = await TalentPerms.findOne({guildID: guild.id})
        let cmd = check.talentPerms.find(acar => acar.Commands == cmdName)
        if(!cmd) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen isimde aktif bir komut bulunmakta. ${cevaplar.prefix}` , ephemeral: true })
        }
       
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({embeds: [new genEmbed().setThumbnail(guild.iconURL({dynamic: true})).setFooter(uye.user.tag, uye.user.avatarURL({dynamic: true})).setDescription(`Aşağı da **${cmdName}** isimli rol (ver/al) veya alt komutun detaylı bilgileri belirtilmiştir.\n
Bu komut ${cmd.Author ? guild.members.cache.get(cmd.Author) ? guild.members.cache.get(cmd.Author) : `<@${cmd.Author}>` : uye} tarafından ${cmd.Date ? `<t:${String(cmd.Date).slice(0, 10)}:R>` : `<t:${String(Date.now()).slice(0, 10)}:R>`} oluşturdu.

**Verilen rol(ler)**:
${cmd.Roles ? cmd.Roles.map(x => guild.roles.cache.get(x)).join(", ") : "@rol bulunamadı"} rol veya rollerini veriyor.
**Kullanacak rol(ler)**:
${cmd.Permission ? cmd.Permission.map(x => guild.roles.cache.get(x)).join(", ") : "@rol bulanamadı"} rol veya rolleri kullanabilir.`)] , ephemeral: true })


      }
      if(modal.customId == "tp-ekle") {
        let cmdName = modal.getTextInputValue('tp_isim');
        let cmdType = modal.getTextInputValue("tp_kullancakroller") || [] 
        let cmdContent = modal.getTextInputValue('tp_vericekroller') || []
        cmdType = cmdType.split(' ');
        cmdContent = cmdContent.split(' ');
        let _Permission = []
        let _Roles = []
        cmdType.forEach((a) => {
          _Permission.push(a)
        })
        cmdContent.forEach((a) => {
          _Roles.push(a)
        })
        let check = await TalentPerms.findOne({guildID: guild.id})
        let cmd = check.talentPerms ? check.talentPerms.find(acar => acar.Commands == cmdName) : undefined
        if(cmd) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen isimde aktif bir komut bulunmakta. ${cevaplar.prefix}` , ephemeral: true })
        }
        if((_Roles && !_Roles.some(x => guild.roles.cache.has(x))) || (_Permission && !_Permission.some(x => guild.roles.cache.has(x)))) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Belirtilen rol veya roller ${guild.name} sunucusunda bulunamadı. ${cevaplar.prefix}` , ephemeral: true })
        }
        await TalentPerms.updateOne({guildID: guild.id}, { $push: {"talentPerms": {
          Name: başHarfBüyült(cmdName),
          Commands: cmdName,
          Permission: _Permission,
          Roles: _Roles,
          Date: Date.now(),
          Author: uye.id,
        }}}, {upsert: true})
        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `Başarıyla ${cmdName} komutu <t:${String(Date.now()).slice(0, 10)}:R> eklendi. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })

      }
    })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    if(!ayarlar.staff.includes(message.member.id) && message.guild.ownerId != message.member.id) return;  
    const embed = new genEmbed()
      let Tp = await TalentPerms.findOne({guildID: message.guild.id})

      let load = await message.reply({
        content: `${message.guild.name} sunucusuna ait rol (ver/al) komut oluşturma sistemi yükleniyor. Lütfen bekleyin!`
      })

      let Row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("SUCCESS")
          .setEmoji("943265806341513287")
          .setLabel("Komut Oluştur")
          .setCustomId("tp_ekle"),
          new MessageButton()
          .setStyle("PRIMARY")
          .setEmoji("963743753036791879")
          .setLabel("Komut Bilgileri")
          .setCustomId("tp_bilgileri"),
          new MessageButton()
          .setStyle("SECONDARY")
          .setEmoji("943265806547038310")
          .setLabel("Komut Kaldır")
          .setCustomId("tp_kaldır"),
      );
    
      let TalentPerm = Tp.talentPerms
      let komutlar = []
      let komutListe = []
        if(Tp && TalentPerm) {
          TalentPerm.filter(x => !Array.isArray(x.Commands)).forEach(x =>  komutlar.push({name: x.Commands, roles: `${x.Roles.map(a => message.guild.roles.cache.get(a) ? message.guild.roles.cache.get(a) : "@rol bulunamadı").join(", ")}`}))
          TalentPerm.filter(x => !Array.isArray(x.Commands)).forEach(data => {
            komutListe.push([
              {label: başHarfBüyült(data.Commands), value: data.Commands, emoji: {id: "1023821496025612359"}, description: `${data.Roles.map(x => message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x).name : "@rol bulunamadı").join(", ")} veriyor.`},
            ])
          })
        }

      load.edit({content: null, embeds: [
        new genEmbed()
        .setDescription(`Aşağıda ${message.guild.name} sunucusuna ait rol (ver/al) komut oluşturma, görüntüleme ve kaldırma işlemi yapabilirsiniz.\n
Sunucuda toplamda ${komutlar.length} alt komut veya rol (ver/al) komutu bulunmakta. Eklemek için aşağıda bulunan "Komut Oluştur" düğmesini kullanabilirsiniz.\n
${komutlar.length > 0 ? `Aşağıda sunucuda bulunan alt komut veya rol (ver/al) komutları listelenmekte:
${komutlar.map(x => `${message.guild.emojiGöster("acar_arrow")} **${x.name}** (${x.roles})`).join("\n")}` : ``}`)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
      ],
      components: [Row]
    })
      var filter = (i) => i.user.id == message.member.id
      let collector = load.createMessageComponentCollector({ filter: filter, time: 60000})
      collector.on('collect', async (i) => {
        if(i.customId == "tp_bilgileri") {
          const modal = new Modal()
          .setCustomId('tp-detay')
          .setTitle(`Alt Komut Bilgi`)
          .addComponents(
            new TextInputComponent()
            .setCustomId('tp_isim')
            .setLabel('Komut İsmi')
            .setStyle('SHORT')
            .setMinLength(3)
            .setMaxLength(120)
            .setPlaceholder(`Örn: vip`)
            .setRequired(true),
          );
          showModal(modal, {
            client: client,
            interaction: i 
          })
        }
        if(i.customId == "tp_kaldır") {
          const modal = new Modal()
          .setCustomId('tp-kaldır')
          .setTitle(`Alt Komut Kaldırma`)
          .addComponents(
            new TextInputComponent()
            .setCustomId('tp_isim')
            .setLabel('Komut İsmi')
            .setStyle('SHORT')
            .setMinLength(3)
            .setMaxLength(120)
            .setPlaceholder(`Örn: vip`)
            .setRequired(true),
          );
          showModal(modal, {
            client: client,
            interaction: i 
          })
        }
        if(i.customId == "tp_ekle") {
          const modal = new Modal()
          .setCustomId('tp-ekle')
          .setTitle(`Alt Komut Komut Ekleme`)
          .addComponents(
            new TextInputComponent()
            .setCustomId('tp_isim')
            .setLabel('Komut İsmi')
            .setStyle('SHORT')
            .setMinLength(3)
            .setMaxLength(120)
            .setPlaceholder(`Örn: vip`)
            .setRequired(true),
            new TextInputComponent()
            .setCustomId('tp_kullancakroller')
            .setLabel('Kullanıcak Rol(ler)')
            .setStyle("LONG")
            .setMinLength(3)
            .setMaxLength(250)
            .setPlaceholder(`Birden fazla için boşluk bırakın.`)
            .setRequired(true),
            new TextInputComponent()
            .setCustomId('tp_vericekroller')
            .setLabel('Verilecek Rol(ler)')
            .setStyle("LONG")
            .setMinLength(3)
            .setMaxLength(250)
            .setPlaceholder(`Birden fazla için boşluk bırakın.`)
            .setRequired(true),
          );
          showModal(modal, {
            client: client,
            interaction: i 
          })
        }
      })
      collector.on('end', (collected, reason) => {
          if(reason == "time") {
            Row.components[0].setDisabled(true)
            Row.components[1].setDisabled(true)
            Row.components[2].setDisabled(true)
            
            load.edit({components: [Row], embeds: [
              new genEmbed().setDescription(`Zaman aşımına uğradığı için işleminiz sonlandırıldı. ${cevaplar.prefix}`)
            ]});
            setTimeout(() => {
              message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {})
              load.delete().catch(err => {})
            }, 7500)
          }
      })
}

};


function başHarfBüyült(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}