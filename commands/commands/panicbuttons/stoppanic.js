const { MessageEmbed } = require('discord.js');

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
        if (!exists) {
            const err = new MessageEmbed()
            .setColor("RED")
            .setDescription(`Contract: \`${contractNumber}\` does not exist`);

            message.delete();
            spamChannel.send(err).then(m=>m.delete({timeout:3000}));
            return;
        }
    
        const panicAlarms = client.panics.get(contractNumber);
        
        if (panicAlarms.user) {
            const contract = message.guild.channels.cache.find(c=>c.name === `contract-${contractNumber}`);
            clearInterval(client.panicSpam.get(contractNumber));
            
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
            client.panics.delete(contractNumber);
        }

    }
};