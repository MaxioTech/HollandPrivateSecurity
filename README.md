# Holland Private Security (Discord Bot)

## Commands:
!pb <contract number><br>
!stop <contract number><br>
!cc (clear channel, requires administrator permission)

## How to use:
type `!pb <contract number>` in the "panic-buttons" channel to active the panic alarm<br>
A notification will be giving in the contract channel itself, to inform that the agents has received the alarm<br>
(supports multiple panic buttons, but limited to 1 contract command)<br>

type `!stop <contract number>` in the "alarm-control" channel to deactivate the panic alarm<br>
when the alarm is deactivated, the panic alarm messages will automatically be deleted over time.<br>
A notification will be given in the contract itself, to inform that the agents has responded to the alarm<br>

type `!cc` to delete messages (up to 14 days old) from the channel it's used in.<br>
(this command can only be used if the user has the "administrator" permission)

## Why it cannot run?
The project is missing the `config.json` file on purpose, to keep the token secret.<br>
Simply create a new file named `config.json` and copy paste the following into the file
```json
{
    "prefix": "!",
    "Bot": {
        "token": "INSERT TOKEN HERE",
        "guild": "GUILD ID"
    },
    "Channels": {
        "spamchannel": "CHANNEL ID",
        "panicbutton": "CHANNEL ID"
    },
    "Categories": {
        "reports": "CATEGORY ID"
    }
}
```
Then insert the TOKEN and IDs required.<br>
Once the config file is done, simply type `npm install` in the terminal/console to install the required dependencies.
  
### Bugs/Issues
If you experience bugs/issues, please report them and they'll be fixed asap.
