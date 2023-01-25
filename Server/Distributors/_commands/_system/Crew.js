const { Client, Message, Util, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const Users = require('../../../../Global/Databases/Schemas/Client.Users')
const Crews = require('../../../../Global/Databases/Schemas/Others/Crew/_index.schema');
const TalentPerms = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { genEmbed } = require("../../../../Global/Init/Embed");
module.exports = {
    Isim: "ekip",
    Komut: ["crew"],
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
    let embed = new genEmbed().setColor("WHITE").setFooter(`eklemek için ${sistem.botSettings.Prefixs[0]}crew ekle <isimtag> <etiketag>`)
    let data = await Crews.find({})
    let altIlkYetki = message.guild.roles.cache.get(roller.altilkyetki)
    if(args[0] == "oluştur" || args[0] == "ekle") {
        let isimTag = args[1];
        if(!isimTag) return message.channel.send(`${cevaplar.prefix} Lütfen bir isim tagı veya ekip ismi belirleyiniz.`).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500);
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        });
        let etiketTag = args[2];
        if(!etiketTag) return message.channel.send(`${cevaplar.prefix} Lütfen bir etiket tagı belirleyiniz.`).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500);
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        }); 
        if(etiketTag.length != 4) return message.channel.send(`${cevaplar.prefix} Lütfen bir etiket tagını 4 karakterli ve doğru belirleyin.`).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500);
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        }); 
        let sorumluRol = message.guild.roles.cache.get(args[3])
        if(!sorumluRol) return message.channel.send(`${cevaplar.prefix} Lütfen bir sorumlu rolü belirleyin.`).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500);
            message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined)
        }); 
        let rolVarsa = message.mentions.roles.first() || message.guild.roles.cache.get(args[4])
        message.channel.send({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`${isimTag}#${etiketTag}\` isimli ekip başarıyla eklendi.`)]}).then(x => {
            setTimeout(() => {
                x.delete()
            }, 7500);
        
        })

        

        if(rolVarsa) {
            let komutEkle = {
                Name: başHarfBüyült(isimTag + "#" + etiketTag),
                Commands: [isimTag.toLowerCase(), etiketTag],
                Permission: [sorumluRol.id],
                Roles: [rolVarsa.id],
            }
            await TalentPerms.updateOne({guildID: message.guild.id}, { $push: {"talentPerms": komutEkle}}, {upsert: true})
            return await Crews.updateOne({"name": args[1]}, { $set: {"guildID": message.guild.id, "discriminator": etiketTag, rol: rolVarsa.id }}, {upsert: true}),message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
        }
        if(!rolVarsa) {
            message.guild.roles.create({ name: başHarfBüyült(`${isimTag+"#"+etiketTag}`), reason: `${message.member.user.tag} tarafından ${başHarfBüyült(isimTag)} ekibi için kurdu.` }).then(async (x) => {
                x.setColor("abdfe6")
                await Crews.updateOne({guildID: message.guild.id, name: isimTag  }, {$set: {"rol": x.id} })
                let komutEkle = {
                    Name: başHarfBüyült(isimTag + "#" + etiketTag),
                    Commands: [isimTag.toLowerCase(), etiketTag],
                    Permission: [sorumluRol.id],
                    Roles: [x.id],
                }
                await TalentPerms.updateOne({guildID: message.guild.id}, { $push: {"talentPerms": komutEkle}}, {upsert: true})
                let ekiptekiler = message.guild.members.cache.filter(s => s.user.discriminator.includes(isimTag) || s.user.username.includes(etiketTag));
                ekiptekiler.forEach(async(uye) => {
                    await uye.roles.add(x.id).catch(err => {}) 
                })
                return await Crews.updateOne({"name": args[1]}, { $set: {"guildID": message.guild.id, "discriminator": etiketTag, rol: x.id }}, {upsert: true}),message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            })
            
        } 
        return;
    }
    let ekipListesi  = []
    if(data) {
        data.forEach(async (crews, index) => {
            
            let acarrrrsikbeni = [
                { label: `#${index+1} ${başHarfBüyült(crews.name+"#"+crews.discriminator)}`, description: `Rol ID: ${crews.rol}`, emoji: {id: "947548417289236551"}, value: crews.name, name: crews.name, discriminator: crews.discriminator, rol: crews.rol ? false : true, rolid: crews.rol}
            ]
            ekipListesi.push(...acarrrrsikbeni)
            let ekiptekiler = message.guild.members.cache.filter(s => s.roles.cache.has(crews.rol));
            embed.addField(`\`#${index+1}\` ${başHarfBüyült(`${crews.name}#${crews.discriminator}`)}`,`
> Toplam: \`${ekiptekiler.size} üye\`
> Seste Olmayan: \`${ekiptekiler.filter(s => !s.voice.channel).size} üye\`
> Taglı: \`${ekiptekiler.filter(s => s.user.username.includes(ayarlar.tag)).size} üye\`
> Sesteki: \`${ekiptekiler.filter(s => s.voice.channel).size} üye\`
> Yetkili: \`${ekiptekiler.filter(x => x.roles.highest.position >= altIlkYetki.position).size} üye\`
            `, true)
        })
    }
    if(!data.length >= 1) return message.channel.send({embeds: [embed.setFooter(`eklemek için ${sistem.botSettings.Prefixs[0]}crew ekle <isimtag> <etiketag> <sorumluluk rolü>`).setDescription(`${message.guild.emojiGöster(emojiler.sarıYıldız)} \`${ayarlar.serverName}\` sunucusunda ekip bulunamadı.`)]});
    let satıriki = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("ekipRolsil")
        .setPlaceholder("Ekip silmek için ekip seçiniz!")
        .setOptions(
            ekipListesi
        )
    )
    let satır = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("ekipRolKur")
        .setPlaceholder("Rol kur, dağıtma işlemi için Ekip seçiniz!")
        .setOptions(
            ekipListesi
        )
    )

   let msg = await message.channel.send({components: [satır, satıriki], embeds: [embed.setDescription(`${message.guild.emojiGöster(emojiler.sarıYıldız)} \`${ayarlar.serverName}\` sunucusunda **${data ? data ? data.length : 0 : 0}** ekip bulunmakta.`)]})
    const filter = i => i.user.id == message.member.id 
    const collector = msg.createMessageComponentCollector({ filter,  errors: ["time"], max: 3, time: 35000 })
    collector.on("end", async () => {
        msg.delete().catch(err => {})
    })
    collector.on('collect', async i => { 
        if(i.customId == "ekipRolsil") {
            let ekipBul = ekipListesi.find(x => x.value == i.values[0])
            if(!ekipBul) return;
            msg.delete()
            if(ekipBul.rol) {
                let rolGetirAbime = message.guild.roles.cache.get(ekipBul.rolid)
                if(rolGetirAbime) rolGetirAbime.delete();
            }
            let komutBul = await TalentPerms.findOne({guildID: message.guild.id})
            const findCmd = komutBul.talentPerms.find(acar => acar.Name == `${başHarfBüyült(ekipBul.name)}#${ekipBul.discriminator}`);
              await TalentPerms.updateOne({guildID: message.guild.id}, { $pull: { "talentPerms": findCmd } }, { upsert: true })
            await Crews.deleteOne({name: ekipBul.name})
            message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined)
            return i.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`${ekipBul.name}#${ekipBul.discriminator}\` isimli ekip başarıyla silindi.`)]}).then(x => {
            })
        }
        if(i.customId == "ekipRolKur") {
            let crewFind = ekipListesi.find(x => x.value == i.values[0])
            let ekiptekiler = message.guild.members.cache.filter(s => s.user.discriminator.includes(crewFind.discriminator) || s.user.username.includes(crewFind.name));
            if(!crewFind) return;
            if(crewFind.rol) await message.guild.roles.create({ name: başHarfBüyült(crewFind.name+"#"+crewFind.discriminator), reason: `${message.member.user.tag} tarafından ${crewFind.name} ekibi için kurdu.` }).then(async (x) => {
                x.setColor("abdfe6")
                await Crews.updateOne({guildID: message.guild.id, name: crewFind.name  }, {$set: {"rol": x.id} })
                ekiptekiler.forEach(async(uye) => {
                    await uye.roles.add(x.id).catch(err => {}) 
                })
                i.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.guild.roles.cache.get(x.id)} rolü ${ekiptekiler.size} ekip üyesine dağıtılamaya başlandı.`)]})
                message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined),msg.delete().catch(err => []) 
            })
            if(!crewFind.rol) {
                
                
                let Crewleraq = await Crews.findOne({name: crewFind.name})
                if(message.guild.roles.cache.get(Crewleraq.rol)) {
                    ekiptekiler.forEach(async(uye) => {
                    if(Crewleraq && Crewleraq.rol) await uye.roles.add(Crewleraq.rol).catch(err => {}) 
                    })
                    i.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} ${message.guild.roles.cache.get(Crewleraq.rol)} rolü ${ekiptekiler.size} ekip üyesine dağıtılamaya başlandı.`)]})
                    message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined),msg.delete().catch(err => []) 
                } else {
                    i.reply({embeds: [new genEmbed().setDescription(`${message.guild.emojiGöster(emojiler.Onay)} \`${başHarfBüyült(crewFind.name+"#"+crewFind.discriminator)}\` ekip rolü tekrardan kuruldu ve tekrardan dağıtılıyor.`)]})
                    await message.guild.roles.create({ name: başHarfBüyült(crewFind.name+"#"+crewFind.discriminator), reason: `${message.member.user.tag} tarafından ${crewFind.name} ekibi için kurdu.` }).then(async (x) => {
                        x.setColor("abdfe6")
                        await Crews.updateOne({guildID: message.guild.id, name: crewFind.name  }, {$set: {"rol": x.id} })
                            ekiptekiler.forEach(async(uye) => {
                             await uye.roles.add(x.id).catch(err => {}) 
                            })
                            message.react(message.guild.emojiGöster(emojiler.Onay) ? message.guild.emojiGöster(emojiler.Onay).id : undefined),msg.delete().catch(err => []) 
                    })
                }
            }
          }
        
  
      })
    }
};

function başHarfBüyült(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}