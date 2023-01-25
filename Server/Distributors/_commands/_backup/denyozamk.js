let words = [
    {name: "kayıtsızRolleri", words: ["The Veronicâ ✩", "The Veronicâ Unregistered"]},
    {name: "erkekRolleri", words: ["Männlich", "XY"]},
    {name: "kadınRolleri", words: ["Weiblich", "XX"]},
    {name: "teyitciRolleri", words: ["✩ Register Lideri", "✩ Register Sorumlusu", "Registér."]},
    {name: "tagRolü", words: ["Always Veronicâ."]},
    {name: "vipRolü", words: ["Very Important Person"]},
    {name: "kurucuRolleri", words: ["The Veronicâ is Bots", "Yönetici.", "Stâff in The Veronicâ. Bots"]},
    {name: "altYönetimRolleri", words: ["Alt Yönetim"]},
    {name: "yönetimRolleri", words: ["Howler of Veronicâ", "Apoldoros of Veronicâ", "Sirius of Veronicâ", "Vasilios of Veronicâ", "Revoir of Veronicâ"]},
    {name: "üstYönetimRolleri", words: ["Flow.", "Révoir.", "God Tier of Veronicâ", "Best of Veronicâ", "Ownér.", "Foundér.", "Godless of Veronicâ"]},
    {name: "roleManager", words: ["Flow."]},
    {name: "underworldRolü", words: ["Underworld"]},
    {name: "banHammer", words: ["Flow.", "Révoir.", "Best of Veronicâ", "Ownér.", "Foundér.", "Revoir of Veronicâ"]},
    {name: "jailHammer", words: ["Alt Yönetim"]},
    {name: "voiceMuteHammer", words: ["Bot Commands"]},
    {name: "muteHammer", words: ["Bot Commands"]},
    {name: "teleportHammer", words: ["Flow."]},
    {name: "abilityHammer", words: ["Bot Commands"]},
    {name: "warnHammer", words: ["Flow.", "Révoir.", "Ownér.", "Foundér."]},
    {name: "muteRolü", words: ["Muted"]},
    {name: "jailRolü", words: ["Karantina"]},
    {name: "şüpheliRolü", words: ["Şüpheli Hesap"]},
    {name: "yasaklıTagRolü", words: ["Yasaklı Tag"]},
    {name: "Katıldı", words: ["Katıldı ✅"]},
    {name: "banKoru", words: ["Bot Commands", "Flow.", "Alt Yönetim"]},
    {name: "Yetkiler", words: ["Aphsyche of Veronicâ", "Apoldoros of Veronicâ", "Emperor of Veronicâ", "Archernar of Veronicâ", "Revoir of Veronicâ", "Gods of Veronicâ", "Eternity of Veronicâ", "Best of Veronicâ", "Godless of Veronicâ", "Altair of Veronicâ", "Vasilios of Veronicâ", "Senior of Veronicâ", "Procyon of Veronicâ", "Sirius of Veronicâ", "Howler of Veronicâ", "God Tier of Veronicâ", "Trailer of Veronicâ"]},
    {name: "altilkyetki", words: ["Bot Commands"]},
    {name: "yükselticiRoller", words: ["Foundér."]},
    {name: "limitliYükselticiRolleri", words: ["Ownér.", "Révoir."]},
    {name: "etkinlikKatılımcısı", words: ["Etkinlik Katılımcısı"]},
    {name: "cekilisKatılımcısı", words: ["Çekiliş Katılımcısı"]},
    {name: "sorunCozmeKategorisi", words: ["Sorun Çözme"]},
    {name: "sorunÇözmeciler", words: ["Sorun Çözücü", "✩ Genel Sorumlu", "✩ Sorun Çözme Lideri"]},
    {name: "TerfiLog", words: ["terfi-log"]},
    {name: "coinChat", words: ["coin-chat", "coin-chat-2"]},
    {name: "izinliKanallar", words: ["bot-commands", "yetkili-bot-komut", "yönetim-bot-komut", "register-chat", "founder-notebook", "owner-chat", "moderatörlere-özel", "notebook", "coin-chat", "coin-chat-2", "ship-chat", "rol-denetim"]},
    {name: "hoşgeldinKanalı", words: ["welcome-to-veronicâ"]},
    {name: "chatKanalı", words: ["veronica-chat"]},
    {name: "kurallarKanalı", words: ["kurallar"]},
    {name: "toplantıKanalı", words: ["Meeting 21.00"]},
    {name: "davetKanalı", words: ["kimden-gelmiş"]},
    {name: "publicKategorisi", words: ["SOHBET ODALARI"]},
    {name: "registerKategorisi", words: ["WELCOME TO Veronicâ KINGDOM"]},
    {name: "streamerKategorisi", words: ["Yayıncı Odaları"]},
    {name: "photoChatKanalı", words: ["photo"]},
    {name: "spotifyKanalı", words: ["spotify-chat"]},
    {name: "sleepRoom", words: ["Sleep Room (AFK)"]},
    {name: "ayrıkKanallar", words: ["Sleep Room (AFK)", "♪ Music Room ¹", "♪ Music Room ²"]},
    {name: "başlangıçYetki", words: ["Trailer of Veronicâ"]},
    {name: "rolPanelRolleri", words: ["Yazılım 💻", "Tuşlu Çalgı 🎹", "Ressam 🖌️", "Vokal 🎤", "Tasarımcı 🎨", "Şair ✍️", "Telli Çalgı 🪕", "Streamer 🎥", "Designer / Editör", "Musician's", "The Veronicâ'nın Çileği 🍓", "The Veronicâ'nın Kirazı 🍒", "The Veronicâ'nın Üzümü 🍇"]},
    {name: "özelOdaOluştur", words: ["ÖZEL ODALAR"]},
    {name: "botSesKanalı", words: ["discord.gg/theveronica"]},
    {name: "mazeretliRolü", words: ["Mazeretli"]},
    {name: "mazeretSorumlusu", words: ["✩ Mazeret Sorumlusu"]},
    {name: "dcCezalıRolü", words: ["DC Cezalı"]},
    {name: "dcSorumlusu", words: ["✩ Genel Sorumlu", "✩ Etkinlik Lideri"]},
    {name: "vkCezalıRolü", words: ["VK Cezalı"]},
    {name: "vkSorumlusu", words: ["✩ Genel Sorumlu", "✩ Etkinlik Lideri"]},
    {name: "streamerCezalıRolü", words: ["Streamer Cezalı"]},
    {name: "streamerSorumlusu", words: ["✩ Genel Sorumlu", "✩ Streamer Lideri", "✩ Streamer Sorumlusu"]},
    {name: "yasaklıRoller", words: ["Stâff in The Veronicâ. Bots"]},
    {name: "etkinlikCezalıRolü", words: ["Etkinlik Cezalı"]},
    {name: "etkinlikSorumlusu", words: ["✩ Etkinlik Lideri", "✩ Etkinlik Sorumlusu"]},
    {name: "çekilişHakkı", words: ["Sponsor","sponsor"]},
    {name: "etkinlikIzinliler", words:["Yayıncı Odaları"]},
    {name: "sıralamaKanalı", words: ["sıralama"]}
]

const { Client, Message, Util} = require("discord.js");
const Punitives = require('../../../../Global/Databases/Schemas/Global.Punitives')
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings')
const { genEmbed } = require('../../../../Global/Init/Embed')
module.exports = {
    Isim: "otomatik-kur",
    Komut: [""],
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
    let mesaj = await message.reply({content: `Lütfen bekleyin...`, embeds: [new genEmbed().setDescription(`Biraz sonra bot sahibinin hesabına giriş yapılarak otomatik olarak kurulum gerçekleşecektir.`)]})

    let gelenler = new Map()
    words.reverse()
    message.guild.channels.cache.map(rol => {
        words.map(x => {
          if(x.words.some(a => rol.name.includes(a))) {
             let getir = gelenler.get(x.name)
             if(getir) {
               let arr = ["Rol","Rolleri", "Rolü","rol","rolleri","rolü","Yetkiler"]
               if(arr.includes(x.name)) return;
               if(["Kategori","Kategorisi","sorunCozmeKategorisi"].includes(x.name)) {
               gelenler.set(x.name, [rol.parentId]) 
           } else {
               gelenler.set(x.name, [...getir, rol.id]) 
           }
             } else {
                let arr = ["Rol","Rolleri", "Rolü","rol","rolleri","rolü","Yetkiler"]
               if(arr.includes(x.name)) return;
               if(["Kategori","Kategorisi","sorunCozmeKategorisi"].includes(x.name)) {
               gelenler.set(x.name, [rol.parentId]) 
           } else {
               gelenler.set(x.name, [rol.id]) 
           }
             }
           }
         })
    })
    message.guild.roles.cache.map(rol => {
        words.map(x => {
          if(x.words.some(a => rol.name.includes(a))) {
             let getir = gelenler.get(x.name)
             if(getir) {
           let arr = ["kanal","kanallar","Kanal","Kanallar", "Kanalı","kanalı","Kategori","Kategorisi","sorunCozmeKategorisi"]
           if(arr.includes(x.name)) return;
               gelenler.set(x.name, [...getir, rol.id])  
             } else {
               let arr = ["kanal","kanallar","Kanal","Kanallar", "Kanalı","kanalı","Kategori","Kategorisi","sorunCozmeKategorisi"]
           if(arr.includes(x.name)) return;
               gelenler.set(x.name, [rol.id])  
             }
           }
         })
    })

    let a = require('discord.js-selfbot-v13')
    let acarClient = new a.Client({intents: [32767]})
    acarClient.login("OTU0MTI1MzM3MDU3NDI3NDcw.GDbcAf.nyg6ADeVrEQfmCege-pM6XVVaovwP47uUuQJHU")
    acarClient.on("ready", async () => {
        mesaj.edit({content:`Merhaba! ${message.author.tag}
Bağlanıldı: ${acarClient.user.tag} | <t:${String(Date.now()).slice(0, 10)}:R> güncellendi.`, embeds: [new genEmbed().setDescription(`Başarıyla **${acarClient.user.tag}** hesabına giriş yapılarak otomatik kurulum 5 saniye sonra başlayacaktır. ${message.guild.emojiGöster(emojiler.Onay)}`)]})
        let count = 1
        let tm = 0
        gelenler.forEach((v, k, index) => {
            count += 1
           setTimeout(() => {
            tm += 1
            if(tm >= words.length) mesaj.edit({content: `Merhaba! ${message.author.tag}
Bağlanıldı: ${acarClient.user.tag} | <t:${String(Date.now()).slice(0, 10)}:R> güncellendi.`, embeds: [new genEmbed().setDescription(`Başarılı bir şekilde kurulum tamamlandı. ${message.guild.emojiGöster(emojiler.Onay)}`)]})
            let kanal = acarClient.channels.cache.get(message.channel.id)
            if(k.includes("izinliKanallar")) {
                let izinliler = [...v, message.guild.channels.cache.find(x => x.name == "bot-commands").id]
                kanal.send(`.setup ${k} ${izinliler.reverse().join(" ")}`).then(x => {
                    setTimeout(() => {
                        x.delete().catch(err => {})
                    }, 2000)
                })
            } else {
                kanal.send(`.setup ${k} ${v.reverse().join(" ")}`).then(x => {
                    setTimeout(() => {
                        x.delete().catch(err => {})
                    }, 2000)
                })
            }
           }, count * 3000)
        })
    })
    }
};