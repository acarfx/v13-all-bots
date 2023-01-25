const { Client, Message, MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const Canvas = require('canvas')
Canvas.registerFont(`../../Assets/fonts/theboldfont.ttf`, { family: "Bold" });
Canvas.registerFont(`../../Assets/fonts/SketchMatch.ttf`, { family: "SketchMatch" });
Canvas.registerFont(`../../Assets/fonts/LuckiestGuy-Regular.ttf`, { family: "luckiest guy" });
Canvas.registerFont(`../../Assets/fonts/KeepCalm-Medium.ttf`, { family: "KeepCalm" });
const Users = require('../../../../Global/Databases/Schemas/Client.Users');
const { genEmbed } = require("../../../../Global/Init/Embed");
let cooldown = new Map()
module.exports = {
    Isim: "ship",
    Komut: ["shippe","love","sanal8"],
    Kullanim: "ship @acar/ID",
    Aciklama: "Bir üyenin coin bilgisini görüntüler.",
    Kategori: "eco",
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
      
    }
};

