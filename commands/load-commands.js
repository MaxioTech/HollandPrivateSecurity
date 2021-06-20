const path = require('path');
const fs = require('fs');

function setCommand(client, command) {
    if (command.commands[0] !== "") {
        if (command.commands.length === 1) {
            // debug : return console.log(command.commands[0]);
            client.commands.set(command.commands[0], command);
        }
        else if (command.commands.length > 1) {
            for (_command of command.commands) {
                // debug : return console.log(_command);
                client.commands.set(_command, command);
            }
        }
    }
}

module.exports = (client) => {
    
    const baseFile = 'command-base.js';
    const commandBase = require(`./${baseFile}`);

    const commands = [];

    console.log("====== Loading Commands ======");
    const readCommands = (dir) => {

        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {

            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {

                readCommands(path.join(dir, file));

            }
            else if (file !== baseFile && file !== 'load-commands.js') {

                const command = require(path.join(__dirname, dir, file));

                if (command.enabled) {
                    setCommand(client, command);
                    console.log(`Command: ${command.commands} - Loaded: ✅ | enabled`)
                }
                else {
                    setCommand(client, command);
                    console.log(`Command: ${command.commands} - Loaded: ✅ | disabled`)
                }

            }

        }

    };
    readCommands('.');

};