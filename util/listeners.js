const { MessageEmbed } = require("discord.js")
const { prefix } = require("@root/config.json");
const commandBase = require("../commands/command-base");

module.exports = (client, maintenance) => {

    // Message Sent
    client.on('message', message => {

        if (message.author.bot) { return; }

        if (message.content === '!join') { client.emit('guildMemberAdd', message.member); }
        
        const member = message.member;
        const content = message.content;
        const args = content.slice(prefix.length).split(" ");
        const cmdName = args.shift();

        if (message.content.startsWith(prefix)) {
            try {
                // command found
                const command = client.commands.get(cmdName);
                commandBase(client, command, message, maintenance);
            }
            catch(e) {
                // command not found
                const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`${cmdName} is not a command.`);
                message.channel.send(embed).then(m=>m.delete({timeout: 5000}));
                message.delete();
            }
        }

    });

    // New member joined the server
    client.on('guildMemberAdd', member => {
        const guestRole = member.guild.roles.cache.get("842365604547526666");
        member.roles.add(guestRole);
    });

}