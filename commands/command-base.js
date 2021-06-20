const { MessageEmbed } = require('discord.js');
const { prefix: globalPrefix } = require('@root/config.json');
const guildPrefixes = {}; // { 'guildId' : 'prefix' }
let recentlyRan = [];

function validatePermissions(permissions) {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {

    if (!validPermissions.includes(permission)) {

      throw new Error(`Unknown permission node "${permission}"`)

    }

  }
}

function cooldownError(message) {
  let coolembed = new MessageEmbed()
  .setTitle('CoolDown')
  .setColor(0xFF0000)
  .setFooter(`Requested By ${message.author.tag}`)
  .setDescription('You Cannot Run This Command Due To Cool Down');
  message.reply(coolembed).then(m => m.delete({timeout: 8500}))
  return;
}

function invalidSyntaxError(message, prefix, alias, expectedArgs) {
  const ExpectedArgsEmbed = new MessageEmbed()
  .setTitle('Wrong Arguments!')
  .setColor(0xFF0000)
  .setDescription(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
  .setFooter("Oops something went wrong :(");
  message.reply(ExpectedArgsEmbed).then(m => m.delete({timeout: 8500}))
  return;
}

function missingRoleError(message, requiredRole) {
  const requiredRoleEmbed = new MessageEmbed()
  .setTitle('Permission Error')
  .setDescription(`You Must Have The "${requiredRole}" role, To Run This Command`)
  .setFooter('Something Went Wrong:(')
  .setColor(0xFF0000)
  message.reply(requiredRoleEmbed).then(m => m.delete({timeout: 8500}))
  return;
}

function wrongChannelError(guild, channel, requiredChannel, message) {
  const foundChannel = guild.channels.cache.find((channel) => { if (channel.id === requiredChannel) { return channel; } });
  const _requiredChannel = new MessageEmbed()
  .setTitle('Permission Error')
  .setDescription(`You can only run this command inside of <#${foundChannel.id}>.`)
  .setFooter('Something Went Wrong:(')
  .setColor(0xFF0000)
  message.reply(_requiredChannel).then(m => m.delete({timeout: 8500}))
  return;
}

function missingPermissionError(message) {
  const PermissionErrorEmbed = new MessageEmbed()
        .setTitle('Permission Error')
        .setFooter("Oops something went wrong :(")
        .setDescription("You Can't Run This Command Due To Permissions Error")
        .setColor(0xFF0000);
        message.reply(PermissionErrorEmbed).then(m => m.delete({timeout: 8500}))
        return;
}

module.exports = (client, command, message, maintenance=false) => {

  const enabled = command.enabled;
  const commands = command.commands;
  const expectedArgs = command.expectedArgs;
  const minArgs = command.minArgs;
  const maxArgs = command.maxArgs;
  const cooldown = command.cooldown;
  const requiredChannels = command.requiredChannels;
  const permissions = command.permissions;
  const requiredRoles = command.requiredRoles;
  const callback = command.callback;

  if (!commands) { return; }

  if (command.permissions.length) {

    if (typeof permissions === 'string') { permissions = [permissions] }
    validatePermissions(permissions)

  }
  
  const { member, content, guild, channel } = message

  const prefix = guildPrefixes[guild.id] || globalPrefix

  for (const alias of commands) {

    for (requiredChannel of requiredChannels) {
      if (requiredChannel && requiredChannel !== channel.id) {
        wrongChannelError(guild, channel, requiredChannel, message);
        return;
      }
    }

    for (const permission of permissions) {
      
      if (!member.hasPermission(permission)) {
        
        missingPermissionError(message);
        return;

      }

    }

    for (const requiredRole of requiredRoles) {
      
      const role = guild.roles.cache.find((role) => role.name === requiredRole)
      if (!role || !member.roles.cache.has(role.id)) {

        missingRoleError(message, requiredRole);
        return;

      }

    }

    let cooldownString = `${guild.id}-${member.id}-${commands[0]}`

    if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
      
      cooldownError(message);
      return;

    }

    const arguments = content.split(/[ ]+/)
    arguments.shift()
    if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {

      invalidSyntaxError(message, prefix, alias, expectedArgs);
      return;

    }

    if (cooldown > 0) {
      
      recentlyRan.push(cooldownString)

      setTimeout(() => {
        
        console.log('Before:', recentlyRan)

        recentlyRan = recentlyRan.filter((string) => { return string !== cooldownString })

        console.log('After:', recentlyRan)

      }, 1000 * cooldown)
    
    }

    if (!enabled) {
      const embed = new MessageEmbed()
      .setColor('RED')
      .setDescription(`Can't use that command, as it has been disabled!`);
      message.channel.send(embed).then(m=>m.delete({timeout: 5000}));
    }
    else {
      if (maintenance) {
        if (message.member.permissions.has('ADMINISTRATOR')) {
          callback(message, arguments, client);
          return;
        }
        else {
          missingPermissionError(message);
          return;
        }
      }
      else {
        console.log("executing command");
        callback(message, arguments, client);
        return;
      }
    }

  }

}

module.exports.updateCache = (guildId, newPrefix) => { guildPrefixes[guildId] = newPrefix }