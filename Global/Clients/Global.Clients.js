const { Client, Collection, Constants, Intents, Options } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const fs = require('fs')
const { bgBlue, black, green } = require("chalk");
global.sistem = global.system = require('../Settings/_system.json');
const DISCORD_LOGS = require('discord-logs')
const { GUILD } = require('../../Global/Init/Settings');
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const EventEmitter = require('events');
class ACAR extends Client {
      constructor (...options) {
            super({
                options,
                intents: [
                    32767,
                    "GUILDS",
                    "GUILD_MEMBERS",
                    "GUILD_PRESENCES"
                ],
                makeCache: Options.cacheWithLimits({
                    MessageManager: 2000,
                    PresenceManager: 50000,
                }),
            });
            DISCORD_LOGS(this)
            Object.defineProperty(this, "location", { value: process.cwd() });
            this.sistem = this.system = require('../Settings/_system.json');
            GUILD.fetch(this.sistem.SERVER.ID)
            this.users.getUser = GetUser;
            this.getUser = GetUser;
            async function GetUser(id) { try { return await this.users.fetch(id); } catch (error) { return undefined; } };
            process.on("multipleResolves", (type, promise, reason) => {
                if (reason.toLocaleString() === "Error: Cannot perform IP discovery - socket closed") return;
            });
            this.logger = require('../Functions/Logger');
            this.genEmbed = global.genEmbed = require('../Init/Embed');
            this.Upstaffs = {}
            this._statSystem = global._statSystem = {}
            require('../Functions/Dates');
            require('../Functions/Numbers');
            require('../Prototypes/_sources');
            require('../Prototypes/_user');
            this.botName;
            this.commands = new Collection();
            this.slashcommands = new Collection();
            this.aliases = new Collection();
            this.eventEmitter = new EventEmitter();
            this.setMaxListeners(10000);

            // Plugins (Stat / Yetkili / Economy)

          
            this.Economy = require('../Plugins/Economy/_index');

            this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
                .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
                .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
                .on("error", (e) => this.logger.log(e, "error"))
                .on("warn", (info) => this.logger.log(info, "warn"));

              //  process.on("unhandledRejection", (err) => { this.logger.log(err, "caution") });
                process.on("warning", (warn) => { this.logger.log(warn, "varn") });
                process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
                process.on("uncaughtException", err => {
                    const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                        console.error("Beklenmedik Hata: ", hata);
                       // process.exit(1);
                });

        }

        async fetchCommands(active = true, slash = false) {
            if(slash) {
                const slashcommands = await globPromise(`../../Server/${this.botName}/_slashcommands/*/*.js`);
                const arrSlash = [];
                slashcommands.map((value) => {
                    const file = require(value);
                    if (!file?.name) return;
                    this.slashcommands.set(file.name, file);
            
                    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
                    arrSlash.push(file);
                    
                });
                this.on("ready", async () => {
                    let fetchGuild = await this.guilds.cache.get(global.sistem.SERVER.ID)
                    if(fetchGuild) await fetchGuild.commands.set(arrSlash);
                })
            }
            if(!active) return;
            let dirs = fs.readdirSync("./_commands", { encoding: "utf8" });
            this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
            await GUILD.fetch(this.sistem.SERVER.ID)
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../Server/${this.botName}/_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
                files.forEach(file => {
                    let referans = require(`../../Server/${this.botName}/_commands/${dir}/${file}`);
                    if(referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
                    this.commands.set(referans.Isim, referans);
                    if (referans.Komut) referans.Komut.forEach(alias => this.aliases.set(alias, referans));
                });
            });
        }

        async fetchEvents(active = true) {
            if(!active) return;
            let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
            dirs.forEach(dir => {
                let files = fs.readdirSync(`../../Server/${this.botName}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
                files.forEach(file => {
                    let referans = require(`../../Server/${this.botName}/_events/${dir}/${file}`);
                    this.on(referans.config.Event, referans);
                });
            });
         }

        connect(token) {
            if(!token) {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`,"error");
                process.exit()
                return;
            }
            this.login(token).then(acar => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} BOT kullanıma aktif edilmiştir.`,"botReady")
                this.user.setPresence({ activities: [{name: global.sistem.botStatus.Name}], status: global.sistem.botStatus.Status })
                this.on("ready", async () => {
                    let guild = client.guilds.cache.get(global.sistem.SERVER.ID);
                    if(!guild) {
                        console.log(`https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=0&scope=bot%20applications.commands`)
                        return process.exit();
                    }
                    this.Upstaffs = require('../Plugins/Staff/_index');
                    this._statSystem = global._statSystem = require('../../Global/Plugins/Staff/Sources/_settings');
                    if(guild) await guild.members.fetch().then(fetch => { })
                    let kanal = this.channels.cache.get(global.ayarlar ? global.ayarlar.botSesKanalı : "123")
                    if(kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator});
                })
                this.on("voiceStateUpdate", async (oldState, newState) => { 
                    if(oldState.member.id === this.user.id && oldState.channelId && !newState.channelId) {
                        let kanal = this.channels.cache.get(global.ayarlar ? global.ayarlar.botSesKanalı : "123")
                        if(kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator});
                        this.user.setPresence({ activities: [{name:sistem.botStatus.Name}], status:sistem.botStatus.Status })
                        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Bot sesten düştü ve tekrardan giriş yaptı.`,"reconnecting")
                    }
                })

            }).catch(acar => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`,"reconnecting")
                setTimeout(() => {
                    this.login().catch(acar => {
                        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`,"error")
                        process.exit()
                    })
                }, 5000 )
            })
        }

}

module.exports = { ACAR }