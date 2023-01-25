const {MessageEmbed, Message, Util, Client} = require('discord.js')

class genEmbed extends MessageEmbed {
    constructor(...opt) {
        super(opt)
        let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
        if(guild) {
            this.setAuthor({name: guild.name, iconURL: guild.iconURL({dynamic: true})})
            this.setColor("RANDOM")
        } else {
            this.setColor("RANDOM")
        }
    }

  setAuthor(options, deprecatedIconURL, deprecatedURL) {
    if (options === null) {
      this.author = {};
      return this;
    }

    if (typeof options === 'string') {
      options = { name: options, url: deprecatedURL, iconURL: deprecatedIconURL };
    }

    const { name, url, iconURL } = options;
    this.author = { name: Util.verifyString(name, RangeError, 'EMBED_AUTHOR_NAME'), url, iconURL };
    return this;
  }

  setColor(color) {
    this.color = Util.resolveColor(color);
    return this;
  }

  setDescription(description) {
    this.description = Util.verifyString(description, RangeError, 'EMBED_DESCRIPTION');
    return this;
  }

  addField(name, value, inline) {
    return this.addFields({ name, value, inline });
  }

  setFooter(options, deprecatedIconURL) {
    if (options === null) {
      this.footer = {};
      return this;
    }

    if (typeof options === 'string') {
      options = { text: options, iconURL: deprecatedIconURL };
    }

    const { text, iconURL } = options;
    this.footer = { text: Util.verifyString(text, RangeError, 'EMBED_FOOTER_TEXT'), iconURL };
    return this;
  }
}

module.exports = { genEmbed }
