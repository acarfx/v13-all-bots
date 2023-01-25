let _sys = require('./Global/Settings/_system.json');
let botcuk = [
  {
    name: "Mainframe",
    namespace: "ACARFX",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Voucher"
  },
  {
    name: "Controller",
    namespace: "ACARFX",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Controller"
  },
  {
    name: "Statistics",
    namespace: "ACARFX",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Statistics"
  },
  {
    name: "Sync",
    namespace: "ACARFX",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Sync"
  },
  {
    name: "Security_I",
    namespace: "ACARFX",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Guard_I"
  },
  {
    name: "Security_II",
    namespace: "ACARFX",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Guard_II"
  },
  {
    name: "API",
    namespace: "Web Synl.io",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Web"
  },
  {
    name: "Distributors",
    namespace: "ACARFX",
    script: 'main.acar',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./Server/Distributors"
  },
]
if(_sys.TOKENS.WELCOME.Active) {
  botcuk.push(
    {
      name: "Voices",
      namespace: "ACARFX",
      script: 'Start.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "../WELCOMES"
    }
  )
}
module.exports = {
  apps: botcuk
};