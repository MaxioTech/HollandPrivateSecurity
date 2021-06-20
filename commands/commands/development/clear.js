module.exports = {
    enabled: true,
    commands: ['cc'],
    description: 'Clears a channel of messages. [Up to 14 Days Old]',
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    requiredChannels: [],
    callback: (message, args=undefined, client=undefined) => {

        message.channel.messages.fetch()
        .then((results) => {
            message.channel.bulkDelete(results);
        });
    
    }
};