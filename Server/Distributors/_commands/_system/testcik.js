
const { Client, Message } = Discord = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
const util = require("util")
const Stats = require("../../../../Global/Databases/Schemas/Plugins/Client.Users.Stats");
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs');
const ms = require('ms')
const moment = require('moment')
module.exports = {
    Isim: "yetkidenetim",
    Komut: ["yetkidenetim"],
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
    if(!ayarlar.staff.includes(message.member.id)) return;
    return;
    let data = await Stats.find()
    let yetkiler = data.filter(m => {
        let uyeToplam2 = 0;
        if(m.lifeTotalVoiceStats) uyeToplam2 = Number(m.lifeTotalVoiceStats)
        let uye = message.guild.members.cache.get(m.userID)
        return uyeToplam2 <= ms("12h") && message.guild.members.cache.has(m.userID) && m.userID != "966398944169033788" && !uye.permissions.has("ADMINISTRATOR") && !uye.permissions.has("MANAGE_ROLES") && roller.Yetkiler.some(x => uye.roles.cache.has(x))
    })
    let mesaj = ''
    let yetkiliListesi = yetkiler.forEach((m, index) => {
        let yetkiliCheck = new Promise(async function(yetkili, yetkilidegil) {
            let get = await Users.findOne({_id: m.userID})
            let staffget = await Upstaffs.findOne({_id: m.userID})
            let uye = message.guild.members.cache.get(m.userID)
            if(get && get.Staff) {
                if(staffget && staffget.Baslama && staffget.Baslama >= Date.now() - ms("10h")) {
                    yetkili("yeni yetkili")
                } else {
                    setTimeout(async() => {
                        uye.removeStaff(uye.roles.cache, true)
                        await Users.updateOne({ _id: uye.id }, { $push: { "StaffLogs": {
                          Date: Date.now(),
                          Process: "STATI GEÇERSİZ",
                          Role: uye.roles.hoist ? uye.roles.hoist.id : roller.başlangıçYetki,
                          Author: message.member.id
                        }}}, { upsert: true }) 
                        let altYetki = message.guild.roles.cache.get(roller.altilkyetki)
                        if(altYetki) await uye.roles.remove(uye.roles.cache.filter(rol => altYetki.position <= rol.position)).catch(err => {});
                    
                    }, 1050 * index)
                    yetkili(true)
                }
            } else  {
                yetkili(false)
           }
        });
        let uye = message.guild.members.cache.get(m.userID)
        if(yetkiliCheck) {
            yetkiliCheck.then(
                function(value) {{
                    mesaj += `<@${m.userID}> (${çevirSüre(m.lifeTotalVoiceStats)}) [**Yetkisi Çekildi**] (${value})\n`
                    message.channel.send(`<@${m.userID}> (${çevirSüre(m.lifeTotalVoiceStats)}) [**${value == "yeni yetkili" ? "Yeni Yetkili" : value ? "Yetkisi Çekildi" : "Yetkisi Çekilmedi"}**] (<t:${Number(String(Date.parse(uye.joinedAt)).substring(0, 10))}:R>)\n`)
                }},
              );
        } 
    })   
    let embed = new genEmbed()
    message.channel.send({embeds: [embed.setDescription(`${mesaj.length >= 1 ? mesaj : "İşleminiz biraz sonra başlayacak, lütfen bekleyin."}`)]}).catch(err => {
        const arr = Discord.Util.splitMessage(`${mesaj.length >= 1 ? mesaj : "Tebrikler! 12 Saat Altı Bir Yetkili Bulunamadı!"}`, { maxLength: 1950 });
        arr.forEach(element => {
            message.channel.send({embeds: [embed.setDescription(`${element}`)]});
        }); 
    })

  }
};

function çevirSüre(date) {
    return moment.duration(date).format('H [saat,] m [dakika]');
}