const mongoose = require('mongoose')

const schema = mongoose.model('Guild', new mongoose.Schema({
    _id: String,
    guildID: String,
    Date: {type: Date, default: Date.now()},
    Caches: {type: Object, default: {
        leaderboardVoice: undefined,
        leaderboardText: undefined,
        latest: undefined,
        lastRecord: undefined,
        lastTagged: undefined,
        lastStaff: undefined, 
    }},

    Ayarlar: {type: Object, default: {
        // Stat Ayarları
        _chats: [],
        _voices: [],
        _staffs: [],
        izinliKategoriler: [],
        fullPuanKategoriler: [],
        ayrıkKanallar: [],

        Sistem: true,
        tamSesPuan: 5.5,
        yarımSesPuan: 1,
        davetPuan: 1,
        mesajPuan: 0.1,
        taglıPuan: 20,
        yetkiliPuan: 20,
        kayıtPuan: 2.5,
        görevPuan: 5,
        // Stat Ayarları

        
        minYaş: "14",
        chatİltifat: true,
        type: true,
        isimyas: true,
        taglıalım: true,
        otoKayıt: true,
        otoIsim: true,
        kufurEngel: true,
        reklamEngel: true,
        chatİzinliler: [],
        özelRoller: [],
        kurucuRolleri: [],
        yönetimRolleri: [],
        altYönetimRolleri: [],
        üstYönetimRolleri: [],
        teyitciRolleri: [],
        Yetkiler: [],
        musicRooms: [],
        kayıtsızLimit: "3",
        muteLimit: "7",
        voiceMuteLimit: "7",
        jailLimit: "5",
        banLimit: "3",
        teyitZorunlu: true,
        özelOda: false,
        Etkinlik: false,
        Toplantı: false,
        seviyeSistemi: false,
        statRozet: false,
        serverName: sistem.SERVER.Name ? global.sistem.SERVER.Name : "Creatéd by ΛCΛR",
        yükseltimSınırı: "3",
        etkinlikPuan: "0.01",
        tagsiz: "•",
        staff: ["327236967265861633","935539319614078986"],
        yetkiliYasaklıTag: [
            '⍫', 'Ϟ', '☨', '🜾',
            '☆', '†', 'ග', 'ζ',
            '⍭', '✯', '▽', '❃',
            '⚚', '✬', '✦', '✧', 'Ψ',
            "◭","✩", "⧨"
          ]
    }},

    talentPerms: Object,
}));

module.exports = schema;