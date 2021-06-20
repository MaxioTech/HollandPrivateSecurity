# Holland Private Security (Discord Bot)

## Commands:
!pb <contract number><br>
!stop <contract number><br>
!cc (clear channel, requires administrator permission)

## How to use:
type `!pb <contract number>` in the "panic-buttons" channel to active the panic alarm
A notification will be giving in the contract channel itself, to inform that the agents has received the alarm
(supports multiple panic buttons, but limited to 1 contract command)

type `!stop <contract number>` in the "alarm-control" channel to deactivate the panic alarm
when the alarm is deactivated, the panic alarm messages will automatically be deleted over time.
A notification will be given in the contract itself, to inform that the agents has responded to the alarm

type `!cc` to delete messages (up to 14 days old) from the channel it's used in.
(this command can only be used if the user has the "administrator" permission)
