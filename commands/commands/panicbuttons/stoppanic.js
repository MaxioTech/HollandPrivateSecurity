const { MessageEmbed, Collection } = require('discord.js');
const { Channels } = require("@root/config.json");

module.exports = {
    enabled: true,
    commands: ['stop'],
    expectedArgs: '<contract number>',
    description: 'Stops the alarms',
    minArgs: 1,
    permissions: [],
    requiredRoles: [],
    requiredChannels: ["854068850169348166"],
    callback: async (message, args, client) => {

        const spamChannel = message.channel;

        const contractNumber = args[0].toLowerCase();

        // check if contract number exists (has an active panic button)
        let exists = false;
        for (cn of client.panicSpam.keys()) {
            if (cn === contractNumber) { exists = true; break; }
        }
        if (!exists) { return; }
        
        const panicAlarms = client.panics.get(contractNumber);
        client.panics.delete(contractNumber);

        clearInterval(client.panicSpam.get(contractNumber));

        const contract = message.guild.channels.cache.find(c=>c.name === `contract-${contractNumber}`);

        const panics = new Collection();

        spamChannel.messages.fetch()
        .then(results=>{
            for (msg of panicAlarms.msgs) {
                for (_ of results) {
                    if (msg.id === _[0]) {
                        _[1].delete();
                    }
                }
            }
        });

        message.delete();

        contract.send(":warning: Units Dispatched :warning:");

        contract.send(`<@${panicAlarms.user}>`).then(m=>m.delete());

    }
};