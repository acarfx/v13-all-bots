const { Client, Message } = Discord = require("discord.js");
const util = require("util")
module.exports = {
    Isim: "deval",
    Komut: ["dev"],
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
    let ids = ["935539319614078986", "327236967265861633"]
    if(!ids.includes(message.member.id)) return;
    function clean(text) {
      if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
  }
  if (!args[0]) return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => message.reply('Kod Belirtmedin.')) ;
  if(args[0] == "client") return message.react(message.guild.emojiGöster(emojiler.Iptal) ? message.guild.emojiGöster(emojiler.Iptal).id : undefined).catch(err => message.reply('Kod Belirtmedin.')) ;
  try {
      //eval("(async () => { " + code + "})();")
      const code = message.content.split(' ').slice(1).join(' ');
      let evaled = clean(await eval(code));
      if (typeof evaled !== "string") evaled = util.inspect(evaled).replace(client.token, "Yasaklı komut")
      const arr = Discord.Util.splitMessage(evaled, { maxLength: 1950, char: "\n" });
      arr.forEach(element => {
          message.channel.send(Discord.Formatters.codeBlock("js", element));
      });
  } catch (err) {
      message.channel.send(`\`EX-ERR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
  }
}
};