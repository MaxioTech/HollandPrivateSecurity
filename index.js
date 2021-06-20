require('module-alias/register');
const Discord = require('discord.js');
const { Bot } = require('@root/config.json');

const client = new Discord.Client({partials: ["USER","GUILD_MEMBER","MESSAGE","REACTION"], presence: {status: "online", afk: false, activity: { name: '!pb <contract number>', type: 'LISTENING' }}});
client.panics = new Discord.Collection();
client.panicSpam = new Discord.Collection();
client.commands = new Discord.Collection();
client.maintenanceMode = false;

client.on('ready', () => {

    // Load Commands
    require('@root/commands/load-commands')(client);

    // Event Listeners
    require("@root/util/listeners")(client);
    
    console.log('====== Bot Is Ready ======');

});

client.login(Bot.token)