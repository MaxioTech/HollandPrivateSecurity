const { MessageEmbed, Channel, Collection } = require('discord.js');
const { Channels } = require("@root/config.json");

module.exports = {
    enabled: true,
    commands: ['pb'],
    expectedArgs: '<contract number>',
    description: 'Alerts the agents',
    minArgs: 1,
    permissions: [],
    requiredRoles: [],
    requiredChannels: ["837247572003127306"],
    callback: async (message, args, client) => {

        const spamChannel = message.guild.channels.cache.get(Channels.spamchannel);

        const contractNumber = args[0].toLowerCase();

        for (cn of client.panics.keys()) {
            if (cn === contractNumber) {
                message.channel.send("The panic button is already active for this contract!")
                .then(m=>m.delete({timeout:5000}));
                return;
            }
        }

        const contract = message.guild.channels.cache.find(c=>c.name === `contract-${contractNumber}`);

        const panicAlarm = new MessageEmbed()
        .setColor("RED")
        .setTitle("🔴ALARM🔴")
        .setDescription(`<@${message.author.id}> has pushed the panic button!!!`)
        .addField("Contract ID:", `<#${contract.id}>`)
        .setFooter(`${message.guild.name}`);

        const panicAlarms = {user: message.author.id, msgs: []};

        function updatePanics(msg) {
            panicAlarms.msgs.push(msg);
            client.panics.set(contractNumber, panicAlarms);
        }

        const panicSpam = setInterval(()=>{
            for (let i=0; i<5; ++i) {
                spamChannel.send(panicAlarm).then(m=>{
                    updatePanics(m);
                });
            }
        }, 10000);

        contract.send(":warning: We have received your alarm :warning:");

        client.panicSpam.set(contractNumber, panicSpam);

        message.delete();

    }
};