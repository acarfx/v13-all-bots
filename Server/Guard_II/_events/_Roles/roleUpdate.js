const { MessageEmbed , Guild} = require("discord.js");
const { genEmbed } = require("../../../../Global/Init/Embed");
/**
 * @param {Guild} oldRole
 * @param {Guild} newRole 
 */

module.exports = async (oldRole, newRole) => {
  const Guard = require('../../../../Global/Databases/Schemas/Guards/Global.Guard.Settings');
  let Data = await Guard.findOne({guildID: oldRole.guild.id})
  if(Data && !Data.roleGuard) return;
    const permissionStaff = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS_AND_STICKERS", "MANAGE_WEBHOOKS"];
    let embed = new genEmbed().setTitle("Sunucuda Rol Düzenlendi!")
    let entry = await oldRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || entry.createdTimestamp <= Date.now() - 5000 || await client.checkMember(entry.executor.id, "roles" ,"Rol Düzenleme!")) return;
    client.punitivesAdd(entry.executor.id, "ban")
    client.allPermissionClose()
    if (permissionStaff.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
        newRole.setPermissions(6479482433n)
      };
      await newRole.edit({
        name: oldRole ? oldRole.name : oldRole.name,
        color: oldRole ? oldRole.hexColor : oldRole.hexColor,
        hoist: oldRole ? oldRole.hoist : oldRole.hoist,
        permissions: oldRole ? oldRole.permissions : oldRole.permissions,
        mentionable: oldRole ? oldRole.mentionable : oldRole.mentionable
      });
    embed.setDescription(`${entry.executor} (__${entry.executor.id}__) tarafından **${oldRole.name}** rolü güncellendi! Güncelleyen kişi yasaklandı ve rol eski haline getirildi.`);
    let loged = oldRole.guild.kanalBul("guard-log");
    if(loged) await loged.send({embeds: [embed]});
    const owner = await oldRole.guild.fetchOwner();
    if(owner) owner.send({embeds: [embed]}).catch(err => {})
    client.processGuard({
      type: "Rol Güncelledi!",
      target: entry.executor.id,
  })
}

module.exports.config = {
    Event: "roleUpdate"
}