const { MessageAttachment, MessageEmbed  } = require('discord.js');

const Mute = require('../../../../Global/Databases/Schemas/Punitives.Mutes')
const GUILDS_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
const { genEmbed } = require('../../../../Global/Init/Embed');
const usersMap = new Map();
const getLimit = new Map();
const LIMIT = 3;
const TIME = 10000;
const DIFF = 1000;

const capsEngel  = /[^A-ZĞÜŞİÖÇ]/g;
const küfürler =  ["amcık","orospu","piç","sikerim","sikik","amına","pezevenk","yavşak","anandır","orospu","evladı","sokuk","yarrak","oç","o ç","siktir","bacını","karını","amq","anaskm","AMK","YARRAK","sıkerım"];
const reklamlar = ["http://","https://","cdn.discordapp.com","discordapp.com","discord.app", "discord.gg","discordapp","discordgg", ".com", ".net", ".xyz", ".pw", ".io", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az"]
const inviteEngel = new RegExp(/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i);


 /**
 * @param {Client} client 
 */

client.on("messageCreate", async (message) => {
    if(message.webhookID || message.author.bot || message.channel.type === "dm") return;
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar
    if(_set.staff.includes(message.member.id)) return;
    if(message.member.permissions.has("ADMINISTRATOR")) return;
    if(_set.chatİzinliler && _set.chatİzinliler.includes(message.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.channel.id == x)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.member.roles.cache.has(x))) return;
    if(_set.kurucuRolleri && _set.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;
    if(_set && !_set.spamEngel) return;
    if(usersMap.has(message.author.id)) {
        const userData = usersMap.get(message.author.id);
        const {lastMessage, timer} = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;
        
            if(difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id);
                    }, TIME);
                usersMap.set(message.author.id, userData)
            } else {
                    msgCount++;
                    if(parseInt(msgCount) === LIMIT) {
                        let datas = await Mute.findOne({_id: message.member.id})
                        if(datas) return;
                        sonMesajlar(message, 30)
                        usersMap.delete(message.author.id);
                        await message.reply({content: `${message.guild.emojiGöster(emojiler.chatSusturuldu)} ${message.member} Sohbet kanallarında fazla hızlı mesaj gönderdiğiniz için \` 1 Dakika \` süresince susturuldunuz.`}).then(x => setTimeout(() => {
                            x.delete().catch(err => {})
                        }, 7500)).catch(err => {})
                      
                        return  message.member.addPunitives(5, message.guild.members.cache.get(client.user.id) ? message.guild.members.cache.get(client.user.id) : message.member, "Metin Kanallarında Flood Yapmak!", message, "1m", true);
                     } else {
          userData.msgCount = msgCount;
          usersMap.set(message.author.id, userData)
        }}}
         else{
        let fn = setTimeout(() => {
          usersMap.delete(message.author.id)
        }, TIME);
        usersMap.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: fn
        
        })
        }
})

module.exports = async (message) => {
    if(message.webhookID || message.author.bot || message.channel.type === "dm") return;
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar

    if(_set.staff.includes(message.member.id)) return;
    if(message.member.permissions.has("ADMINISTRATOR")) return;
    if(_set.chatİzinliler && _set.chatİzinliler.includes(message.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.channel.id == x)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => message.member.roles.cache.has(x))) return;
    if(_set.kurucuRolleri && _set.kurucuRolleri.some(oku => message.member.roles.cache.has(oku))) return;


    if (message.channel.id == kanallar.photoChatKanalı && message.attachments.size < 1) await message.delete();

    if ((message.mentions.roles.size + message.mentions.users.size + message.mentions.channels.size) >= 3) return sendChat(message, "birden fazla etiket atmaktan vazgeç")
 
    if (_set.kufurEngel === true && küfürler.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(message.content))) return sendChat(message, "küfür etmekten vazgeç")

    if (message.activity && message.channel.id !== _set.spotifyKanalı && message.activity.partyId.startsWith("spotify:")) message.delete().catch(err => {})

    if(message.content && message.content.length && message.content.length >= 165)  return sendChat(message, "uzun mesaj atmamaya özen göster")
    const Caps = (message.content.match(/[A-ZĞÇÖIÜ]/gm) || []).length;
    if ((_set && _set.capsEngel) && (Caps / message.content.length) >= 0.7) return  sendChat(message, "Caps-Lock kullanmamalısın")

    if (_set.reklamEngel === true && message.content.match(inviteEngel)) {
        const invites = await message.guild.invites.fetch();
        if ((message.guild.vanityURLCode && message.content.match(inviteEngel).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(inviteEngel).some((i) => i === x))) return;
        return sendChat(message, "reklam yapmaktan vazgeç")
    }

    if(_set.reklamEngel === true && reklamlar.some(word => message.content.toLowerCase().includes(word))) return  sendChat(message, "reklam yapmaktan vazgeç")



}

module.exports.config = {
    Event: "messageCreate"
};

client.on('messageUpdate', async (oldMessage, newMessage) => {
    let _findServer = await GUILDS_SETTINGS.findOne({ guildID: sistem.SERVER.ID })
    const _set = _findServer.Ayarlar 
    if(newMessage.webhookID || newMessage.author.bot || newMessage.channel.type === "dm") return;
    if(_set.staff.includes(newMessage.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.includes(newMessage.member.id)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => newMessage.channel.id == x)) return;
    if(_set.chatİzinliler && _set.chatİzinliler.some(x => newMessage.member.roles.cache.has(x))) return;
    if(newMessage.member.permissions.has("ADMINISTRATOR")) return;
    if(_set.kurucuRolleri && _set.kurucuRolleri.some(oku => newMessage.member.roles.cache.has(oku))) return;
    if (newMessage.channel.id == kanallar.photoChatKanalı && newMessage.attachments.size < 1) await message.delete();
    if (_set.kufurEngel === true && küfürler.some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(newMessage.content))) newMessage.delete().catch(err => {});
    if (newMessage.activity && newMessage.channel.id !== _set.spotifyKanalı && newMessage.activity.partyId.startsWith("spotify:")) newMessage.delete().catch(err => {})
    if (newMessage.content.replace(capsEngel, "").length >= newMessage.content.length / 2) {
        if (newMessage.content.length <= 15) return;
        if (newMessage.deletable) newMessage.delete().catch(err => err);
    }
    if (_set.reklamEngel === true && newMessage.content.match(inviteEngel)) {
        const invites = await newMessage.guild.invites.fetch();
        if ((newMessage.guild.vanityURLCode && newMessage.content.match(inviteEngel).some((i) => i === newMessage.guild.vanityURLCode)) || invites.some((x) => newMessage.content.match(inviteEngel).some((i) => i === x))) return;
        return newMessage.delete().catch(err => {});
    }
    if(_set.kufurEngel === true && reklamlar.some(word => newMessage.content.toLowerCase().includes(word))) return newMessage.delete().catch(err => {})
   
});


client.on("messageDelete", async (message, channel) => {
    if(message.webhookId || message.author.bot || message.channel.type === "dm") return;
      if (message.author.bot) return;
      let silinenMesaj = message.guild.kanalBul("mesaj-log")
      if(!silinenMesaj) return;
      const embed = new genEmbed()
      .setAuthor(`Mesaj Silindi`, message.author.avatarURL())
      .setDescription(`${message.author.tag} üyesi bir mesaj sildi.`)
      .addField("Kanal Adı", `${message.channel.name}`, true)
      .addField("Silinen Mesaj", `${message.content ? `${message.content.length > 0 ? message.content : "Bir mesaj bulunamadı!"}` : "Bir mesaj bulunamadı!"}`)
      .addField("Silinen Resimler", `${message.attachments.size > 0 ? message.attachments.filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL)).map(({ proxyURL }) => proxyURL) : "Silinen resim bulunamadı."}`)
      .setThumbnail(message.author.avatarURL())
      silinenMesaj.send({ embeds: [embed]}).catch(err => {})
      
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(newMessage.webhookId || newMessage.author.bot || newMessage.channel.type === "dm") return;
      let guncellenenMesaj = newMessage.guild.kanalBul("mesaj-log")
      if(!guncellenenMesaj) return;
      if (oldMessage.content == newMessage.content) return;
      let embed = new genEmbed()
      .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
      .setDescription(`${newMessage.author} üyesi bir mesaj düzenledi`)
      .addField("Eski Mesaj", `${oldMessage.content}`, true)
      .addField("Yeni Mesaj", `${newMessage.content}`, true)
      .addField("Kanal Adı", `${newMessage.channel.name}`, true)
      .setThumbnail(newMessage.author.avatarURL())
      guncellenenMesaj.send({embeds: [embed]}).catch(err => {})
});

async function sendChat(message, content) {
    if (getLimit.get(message.author.id) == 3) {
        let datas = await Mute.findOne({_id: message.member.id})
        if(datas) return;
        message.delete().catch(err => {})
        getLimit.delete(message.member.id)
        await message.reply({content: `${message.guild.emojiGöster(emojiler.chatSusturuldu)} ${message.member} Sohbet kanallarında ki kurallara uyum sağlanmadığı için \` 10 Dakika \` süresince susturuldunuz.`}).then(x => setTimeout(() => {
            x.delete().catch(err => {})
        }, 7500)).catch(err => {})
        return message.member.addPunitives(5, message.guild.members.cache.get(client.user.id) ? message.guild.members.cache.get(client.user.id) : message.member, "Sohbet Kurallarına Uyulmadı!", message, "10m", false, true) 
    } else {
        getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
        message.delete().catch(err => {})
        let embed = new MessageEmbed().setColor("RANDOM")
        message.channel.send({content: `${message.member}`, embeds: [embed.setDescription(`**Merhaba!** ${message.member.user.tag}
Sohbet kanalında ${content}, aksi taktirde yaptırım uygulanacaktır.
    `)]}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 6000);
        })
        setTimeout(() => {
            if(getLimit.get(`${message.member.id}`)) getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
          },10000)
    }
    
    
}
async  function sonMesajlar(message, count = 25) {
    let messages = await message.channel.messages.fetch({ limit: 100 });
    let filtered = messages.filter((x) => x.author.id === message.author.id).array().splice(0, count);
    message.channel.bulkDelete(filtered).catch(err => {});
   } 