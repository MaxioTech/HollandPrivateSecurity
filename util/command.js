const { prefix } = require('@root/config.json');

/**
 * THIS SCRIPT IS NOT BEING USED!!! 
 */

module.exports = (client, aliases, callback) => {

    if (typeof aliases === 'string') { aliases = [aliases]; }

    client.on('message', message => {

        const { content } = message;
        aliases.forEach(alias => {

            const command = `${prefix}${alias}`;
            if (content.startsWith(`${command}`) || content === command) {
                console.log(`Running the command: ${command}`);
                callback(message);
            }

        });

    });

};