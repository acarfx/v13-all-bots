const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require('../../../../Global/Init/Embed');
let _staffs
const Upstaffs = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Staffs')
const Tasks = require('../../../../Global/Databases/Schemas/Plugins/Client.Users.Tasks')
const GUILD_SETTINGS = require('../../../../Global/Databases/Schemas/Global.Guild.Settings');
module.exports = async (member, role) => {
        var reload = require('require-reload')(require);
        _staffs = reload('../../../../Global/Plugins/Staff/Sources/_settings.js');
    const entry = await member.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || entry.executor.bot || entry.createdTimestamp < (Date.now() - 5000)) return;  
    let yapan = member.guild.members.cache.get(entry.executor.id)
    if(!yapan) return;
    let Database = await GUILD_SETTINGS.findOne({guildID: member.guild.id})
    roller = Database.Ayarlar
    ayarlar = Database.Ayarlar
    if(_staffs.staffs.some(x => role.id == x.rol) && roller.altilkyetki != role.id && roller.başlangıçYetki != role.id) {
        let guild = member.guild
        if(!guild) return;
        await member.roles.remove(role.id, "Sağ-tık yetki verildiğinden dolayı çekildi.").catch(err => {})
        let added = guild.members.cache.get(entry.executor.id)
        if(added) added.send({content: `Yetki vermek istediğin ${member} isimli üyeye Sağ-tık ile yetki veremezsin.
Almak istediğin **@${role.name}** rolü sadece komut üzerinden verilmeye ve alınmaya açıktır.
Lütfen websitesi veya komut üzerinden tekrardan verebilir veya da alabilirsiniz. ${guild.emojiGöster(emojiler.Iptal)}`}).catch(err => {})
    } else {
        let görevGetir = await Tasks.findOne({ roleID: role.id }) || await Tasks.findOne({ roleID: role.id })
        let KullaniciData = await Users.findOne({_id: member.id})
        let yetkiliBilgisi = await Upstaffs.findOne({_id: member.id})
        if(görevGetir && !yetkiliBilgisi) {
            await Upstaffs.updateOne({ _id: member.id }, { $set: { "staffNo": 1, "staffExNo": 0, "Point": 0, "ToplamPuan": 0, "Baslama": Date.now(), "Yönetim": true } }, {upsert: true}); 
            await Users.updateOne({ _id: member.id }, { $set: { "Staff": true, "StaffGiveAdmin": entry.executor.id } }, { upsert: true })
            await Users.updateOne({ _id: member.id }, { $push: { "StaffLogs": {
                Date: Date.now(),
                Process: "BAŞLATILMA",
                Role: role.id,
                Author: entry.executor.id
              }}}, { upsert: true }) 
        } 
        if(görevGetir && KullaniciData && yetkiliBilgisi && yetkiliBilgisi.Yönetim && KullaniciData.Staff && KullaniciData.StaffGiveAdmin) {
            await Upstaff.updateOne({_id: member.id}, { $set: {"Rolde": Date.now() }}, {upsert: true})
            await Users.updateOne({ _id: member.id }, { $push: { "StaffLogs": {
                Date: Date.now(),
                Process: "GÜNCELLEME",
                Role: role.id,
                Author: entry.executor.id
              }}}, { upsert: true }) 
        }
        
        if(roller && roller.yasaklıRoller && entry && entry.executor && roller.yasaklıRoller.some(x => role.id == x) && !ayarlar.staff.includes(entry.executor.id)) {
            await member.roles.remove(role.id, "Verilmek istenilen rol yasaklı roller içinde barındırdığından dolayı kaldırıldı.").catch(err => {})
            return;
        }
        await Users.updateOne({_id: member.id},  { $push: { "Roles": { rol: role.id, mod: entry.executor.id, tarih: Date.now(), state: "Ekleme" } } }, { upsert: true })
        let logChannel = member.guild.kanalBul("rol-ver-log")
        if(logChannel) logChannel.send({embeds: [new genEmbed().setDescription(`${member} isimli üyeye <t:${String(Date.now()).slice(0, 10)}:R> ${entry.executor} tarafından ${role} adlı rol verildi.`)]})      
    }
}

module.exports.config = {
    Event: "guildMemberRoleAdd"
}