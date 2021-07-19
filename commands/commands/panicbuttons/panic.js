const { MessageEmbed, Channel, Collection } = require('discord.js');
const { Channels, Roles } = require("@root/config.json");

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

        const spamChannel = await message.guild.channels.cache.get(Channels.spamchannel);
        const hpsRole = await message.guild.roles.cache.get(Roles.hpsRole);

        const contractNumber = await args[0].toLowerCase();
        await console.log(contractNumber, " : contract number");

        for (cn of client.panics.keys()) {
            if (cn === contractNumber) {
                await message.channel.send("The panic button is already active for this contract!")
                .then(m=>m.delete({timeout:5000}));
                return;
            }
        }

        const contract = await message.guild.channels.cache.find(c=>c.name === `contract-${contractNumber}`);

        if (!contract) {

            const InvalidContract = await new MessageEmbed()
            .setColor("RED")
            .setTitle("ERROR: Invalid Contract")
            .setDescription(`There's no contract with the following name: ${contractNumber} !`);

            await message.delete();
            await message.channel.send(InvalidContract).then(m=>m.delete({timeout: 3000}));
            return;

        }

        async function sendAlarm() {
            const panicAlarm = await new MessageEmbed()
            .setColor("RED")
            .setTitle("🔴ALARM🔴")
            .setDescription(`<@${message.author.id}> has pushed the panic button!!!`)
            .addField("Contract ID:", `<#${contract.id}>`)
            .setFooter(`${message.guild.name}`);

            const panicAlarms = await {user: message.author.id, msgs: []};

            async function updatePanics(msg) {
                await panicAlarms.msgs.push(msg);
                await client.panics.set(contractNumber, panicAlarms);
            }

            const panicSpam = await setInterval(()=>{
                for (let i=0; i<5; ++i) {
                    spamChannel.send(panicAlarm).then(m=>{
                        updatePanics(m);
                    });
                }
            }, 10000);

            await contract.send(":warning: We have received your alarm :warning:");

            await contract.send(`${hpsRole}`).then(msg=>{
                msg.delete();
            });

            await client.panicSpam.set(contractNumber, panicSpam);
        }

        await message.delete();
        await sendAlarm();

    }
};