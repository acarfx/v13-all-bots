
  


const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const { pageEmbed } = require('../../../../Global/Plugins/Verifed/test');


const mongoose = require('mongoose');
const { 
  Modal,
  TextInputComponent,
  SelectMenuComponent,
  showModal
} = dcmodal = require('discord-modals')


let PrivateCommand = require('../../../../Global/Databases/Schemas/Plugins/Client.Guilds.Private.Commands');

module.exports = {
    Isim: "private-commands",
    Komut: ["pc","pcmd", "private-commands","private-command","privatecommand","privatecommands"],
    Kullanim: "pc @acar/ID",
    Aciklama: "Sunucudaki üyeler içerisinde tagı olmayanları kayıtsıza at.",
    Kategori: "-",
    Extend: false,
    
   /**
   * @param {Client} client 
   */
  onLoad: function (client) { 

    client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.botSettings.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = message.content.split(" ")[0].toLowerCase()
    let command = await PrivateCommand.findOne({name: komutcuklar, prefix: false}) 
    if(!command) {
      if(!global.sistem.botSettings.Prefixs.some(x => message.content.startsWith(x))) return;
      komutcuklar = args[0].toLocaleLowerCase()
      args = args.splice(1);
      command = await PrivateCommand.findOne({name: komutcuklar, prefix: true}) 
    }

    if(command) {
      if(command.prefix && (kanallar.izinliKanallar && !kanallar.izinliKanallar.some(x => message.channel.id == x)) && !message.member.permissions.has("ADMINISTRATOR") && !ayarlar.staff.includes(message.member.id) && !["temizle","sil","booster","b","snipe","afk","kilit"].some(x => komutcuklar == x) ) {
        return message.reply(`${cevaplar.prefix} Belirtilen komut bu kanalda kullanıma izin verilemiyor, lütfen ${message.guild.channels.cache.get(kanallar.izinliKanallar[0])} kanalında tekrar deneyin.`).then(x=> setTimeout(() => {
          x.delete().catch(err => {})
          message.delete().catch(err => {})
        }, 10000));;
      }
      if(command.allowed.length > 0 && !command.allowed.some(x =>  message.author.id == x || (message.member.roles.cache.has(x) && message.member.permissions.has(x)))) {
        let allow_arr = []
        command.allowed.map(x => {

          let role = message.guild.roles.cache.get(x);
          if(role) return allow_arr.push(`<@&${x}>`);
  
          let user = message.guild.members.cache.get(x);
          if(user) return allow_arr.push(`<@${x}>`);

          let yetkiler = [
            "ADMINISTRATOR",
            "MANAGE_GUILD",
            "MANAGE_CHANNELS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "MANAGE_ROLES",
            "MANAGE_WEBHOOKS",
            "MANAGE_EMOJIS",
            "KICK_MEMBERS",
            "BAN_MEMBERS",
            "CREATE_INSTANT_INVITE",
          ]
          if(yetkiler.includes(x)) return allow_arr.push(`**${x.replace("ADMINISTRATOR", "Yönetici")
          .replace("MANAGE_GUILD", "Sunucu Yönet")
          .replace("MANAGE_CHANNELS", "Kanal Yönet")
          .replace("MANAGE_ROLES", "Rol Yönet")
          .replace("MANAGE_NICKNAMES", "Nick Yönet")
          .replace("MANAGE_EMOJIS", "Emoji Yönet")
          .replace("MANAGE_WEBHOOKS", "Webhook Yönet")
          .replace("MANAGE_MESSAGES", "Mesaj Yönet")
          .replace("MANAGE_MESSAGE_DELETE", "Mesaj Silme Yönet")}**`)

        })
        return message.reply({embeds: [
          new genEmbed().setDescription(`Bu komutu kullanmak için yeterli yetkiye sahip değilsin. ${allow_arr.length > 0 ? `${allow_arr.listRoles()} yetkilerine veya kişisi olmalısın.`: ``} ${message.guild.emojiGöster(emojiler.Iptal)}`).setColor("RED")
        ]}).then(x => {
          setTimeout(() => {
            x.delete().catch(err => {})
          }, 10000);
        });
      }
      if(command.type == "EMBED") return message.channel.send({embeds: [new genEmbed().setDescription(`${command.content}`)]}).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 30000);
      });
      if(command.type == "MESSAGE") return message.channel.send({content: `${command.content}`}).then(x => {
        setTimeout(() => {
          x.delete().catch(err => {})
        }, 30000);
      });
      if(command.type == "CODE") return eval(command.content.replace(new RegExp(client.token, "g"), ""));
    }

    })

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
      //  let isim = modal.getTextInputValue('name');
      if(modal.customId == "pcmd_remove") {
        let command = await PrivateCommand.findOne({name: modal.getTextInputValue('pcmd_name')}) 
        if(!command) {
          await modal.deferReply({ ephemeral: true })
          return await modal.followUp({content: `Böyle bir özelleştirilmiş komut bulunamadı. ${guild.emojiGöster(emojiler.Iptal)}` , ephemeral: true })
        }
        await PrivateCommand.deleteOne({name: modal.getTextInputValue('pcmd_name')})
        await modal.deferReply({ ephemeral: true })
        await modal.followUp({content: `Başarıyla **${modal.getTextInputValue('pcmd_name')}** isimli özelleştirilmiş komut silindi. ${guild.emojiGöster(emojiler.Onay)}` , ephemeral: true })
      }
      if(modal.customId == "pcmd_add") {

        // requirements
        let cmdName = modal.getTextInputValue('pcmd_name');
        let cmdType = modal.getTextInputValue("pcmd_type")     
        let cmdContent = modal.getTextInputValue('pcmd_content');
        let cmdAllowed = modal.getTextInputValue('pcmd_allowed');
        let cmdPrefix = modal.getTextInputValue('pcmd_prefix') || false
        cmdType = cmdType
        cmdPrefix = cmdPrefix
        await PrivateCommand.updateOne({name: cmdName}, {
          $set: { 
            name: cmdName,
            type: cmdType,
            prefix: cmdPrefix ? true : false,
            content: cmdContent
            .replace("ButtonBuilder","MessageButton")
            .replace("Secondary", "SECONDARY")
            .replace("Success", "SUCCESS")
            .replace("Danger","DANGER")
            .replace("Primary", "PRIMARY")
            .replace("ModalBuilder()", "Modal()")
            .replace("EmbedBuilder", "MessageEmbed")

            .replace("AttachmentBuilder", "MessageAttachment")
            .replace("ActionRowBuilder","MessageActionRow")
            .replace("SelectMenuBuilder","MessageSelectMenu")
            .replace("TextInputBuilder", "TextInputComponent"),
            allowed: cmdAllowed && cmdAllowed.length > 0 ? cmdAllowed.split(' ') : [],
            created: uye.id, 
          }
        }, {upsert: true});

        await modal.deferReply({ ephemeral: true })
        return await modal.followUp({content: `${guild.emojiGöster(emojiler.Onay)} Başarıyla ${cmdName} (**${cmdType}**) komutu başarıyla <t:${String(Date.now()).slice(0, 10)}:R> eklendi.` , ephemeral: true })

      }
    })
  },

   /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   */

  onRequest: async function (client, message, args) {
    
    let Buttons = [
      new MessageButton()
        .setCustomId("add_pcmd")
        .setLabel("Ekle/Güncelle")
        .setStyle("SECONDARY"),
    ]

    let msg = await message.reply({
      content: `Özelleştirilmiş komut sistemi yükleniyor...`
    })
    let Commands = await PrivateCommand.find({})
    if(Commands && Commands.length > 0) Buttons.push(
      new MessageButton()
        .setCustomId("delete_pcmd")
        .setLabel("Sil")
        .setStyle("DANGER")
    )
    let Listed_Commands = []

    for(let i = 0; i < Commands.length; i++) {
      Listed_Commands.push(`Komut: **${Commands[i].name}**
\` • \` Oluşturan: ${message.guild.members.cache.get(Commands[i].created) ? message.guild.members.cache.get(Commands[i].created) : `<@${Commands[i].created}>`} (<t:${String(Commands[i].date).slice(0, 10)}:R>)
\` • \` Kullanabilen: ${Commands[i].allowed.length > 0 ? Commands[i].allowed.map(x => `${message.guild.members.cache.get(x) ? message.guild.members.cache.get(x) : message.guild.roles.cache.get(x) ? message.guild.roles.cache.get(x) : x}`).join(', ') : "**Herkes kullanabilir.**"} 
\` • \` Özellik(ler): **\`${Commands[i].type}\`**, **\`${Commands[i].prefix ? "Prefix" : "No-Prefix"}\`**`)
    }
    let Row = new MessageActionRow().addComponents(Buttons)
    await msg.edit({content: null, embeds: [ new genEmbed().setDescription(`Aşağıda bulunan düğme ile ${message.guild.name} sunucusuna özel ister mesaj tepkili ister komut tepkili bir komut oluşturabilirsiniz. Ayrıca oluşturulan komutların ismiyle tekrardan ekleme yaparak komutu tekrardan güncelleyebilirsiniz ayrıca kod şeklinde komut oluştururken v13 ve v14 sürümüne ait terimleri kullanabilirsiniz.
Birden fazla tip ile dilediğiniz komutu yaratabilirsiniz.${Listed_Commands.length > 0 ? `

**Oluşturulan komutlar ve özellikleri şunlardır**:
${Listed_Commands.length > 5 ? `${Commands.map(x => x.name).join(", ")}` : Listed_Commands.map((x, index) => `**\` ${index + 1} \`** ${x}`).join("\n──────────────────────────\n")}`: `

Daha önce komut oluşturulmamış. Sana nasıl komut oluşturacağını anlatmamı ister misin?
Aşağıda bulunan "Ekle/Düzenle" düğmesine basarak önünüze açılan menüde ilk komutun ismini yazın.
Komutunuzu bir kişiye özel yapıcaksanız veya rollere özel veyada yetkiye özel yapıcaksanız onları belirtiniz aralarına boşluk koyunuz. (ID veya BitField (ADMINISTRATOR, MANAGE_GUILD vs.))
Komut gibi prefix, slash, context veya da mesaj şeklini seçiniz. 

Komut türlerinde MESSAGE/EMBED/CODE şeklinde 3 adet tür vardır.

"EMBED": Belirtilen içeriği bir embed olarak gösterir.
"MESSAGE": Belirtilen içeriği bir mesaj olarak gösterir.

"CODE":
\`\`\`js
let Row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
  .setCustomId("example")
  .setLabel("Örnek")
  .setStyle("SECONDARY"),
)

message.reply({embeds: [new genEmbed().setDescription("Aşağıdan örnek düğmesine basınız.")], components: [Row]}).then(async (msg) => {

  var filter = (i) => i.user.id == message.author.id
  let collector = msg.createMessageComponentCollector({
    filter: filter,
    timeout: 15000
  });

  collector.on('collect', (i) => {
    if(i.customId == "example") {
      i.reply({
        content: "Düğmeye bastın.",
        ephemeral: true
      })
    }
  })
})
\`\`\``}
`).setFooter(`İşlem yapma süresi 2 dakika'dır. Otomatik silinecektir...`)], components: [Row]})
    .then(async (m) => {
      var filter = (i) => i.user.id === message.author.id;
      let collector = msg.createMessageComponentCollector({filter: filter, timeout: 120000});
      collector.on('end', async (collected, reason) => {
        if(reason == "time") {
          await m.edit({content: null, embeds: [ new genEmbed().setDescription(`2 Dakika boyunca aktif olunduğu için otomatik olarak silinecektir.`) ], components: []})
          setTimeout(() => {
            m.delete().catch(err => {})
          }, 7500)
        }
      })
      collector.on('collect', async (i) => {
        if(i.customId == "delete_pcmd") {
          message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {});
          m.delete().catch(err => {})
          const modal = new Modal()
          .setCustomId('pcmd_remove')
          .setTitle(`Özelleştirilmiş Komut Kaldırma`)
          .addComponents(
            new TextInputComponent()
            .setCustomId('pcmd_name')
            .setLabel('Komut İsmi')
            .setStyle('SHORT')
            .setMinLength(3)
            .setMaxLength(120)
            .setPlaceholder(`Örn: pong`)
            .setRequired(true),
          );
          showModal(modal, {
            client: client,
            interaction: i 
          })
        }
        if(i.customId == "add_pcmd") {
          message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined).catch(err => {});
          m.delete().catch(err => {})
          const modal = new Modal()
            .setCustomId('pcmd_add')
            .setTitle(`Özelleştirilmiş Komut Ekleme`)
            .addComponents(
              new TextInputComponent()
              .setCustomId('pcmd_name')
              .setLabel('Komut İsmi')
              .setStyle('SHORT')
              .setMinLength(3)
              .setMaxLength(120)
              .setPlaceholder(`Örn: ping`)
              .setRequired(true),
              new TextInputComponent()
              .setCustomId('pcmd_allowed')
              .setLabel('Kullanıcak Kişiler/Roller/Yetkiler')
              .setStyle("LONG")
              .setMinLength(3)
              .setMaxLength(250)
              .setPlaceholder(`Birden fazla için boşluk bırakın. Boş bırakılırsa herkes kullanır.`)
              .setRequired(false),
              new TextInputComponent()
              .setCustomId('pcmd_prefix')
              .setLabel('Prefix Olsun Mu?')
              .setStyle("SHORT")
              .setMinLength(3)
              .setMaxLength(250)
              .setPlaceholder(`İstiyorsan Olsun yazabilirsin.`)
              .setRequired(false),
              new TextInputComponent()
              .setCustomId('pcmd_type')
              .setLabel('Komut Türü')
              .setStyle("SHORT")
              .setMinLength(3)
              .setMaxLength(250)
              .setPlaceholder(`CODE/EMBED/MESSAGE şeklinde belirtin.`)
              .setRequired(true),
              new TextInputComponent()
              .setCustomId('pcmd_content')
              .setLabel('Komut İçeriği')
              .setStyle("LONG")
              .setMinLength(3)
              .setMaxLength(2048)
              .setPlaceholder(`Komut içeriği giriniz. Örn: Pong!`)
              .setRequired(true),
            );
            showModal(modal, {
              client: client,
              interaction: i 
            })
        }
      })
    })

  }
};
