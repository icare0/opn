const { EmbedBuilder } = require("discord.js");

function handleLogs(client) {
    const logSchema = require("../Schemas/logs");

    function send_log(guildId, embed) {
        logSchema.findOne({ Guild: guildId }, async (err, data) => {
            if (!data || !data.Channel) {
                console.log("Le canal de journalisation n'est pas défini.");
                return;
            }

            const LogChannel = client.channels.cache.get(data.Channel);
            embed.setTimestamp();
            LogChannel.send({ embeds: [embed] });
        });
    }

    client.on("messageDelete", function (message) {
        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setTitle('Message suprimé')
            .setColor('#009898')
            .setDescription(`
            **auteur : ** <@${message.author.id}> - *${message.author.tag}*
            **Date : ** ${message.createdAt}
            **Salon : ** <#${message.channel.id}> - *${message.channel.name}*
            **message suprimé : **\`${message.content.replace(/`/g, "'")}\`
         `);

        return send_log(message.guild.id, embed);
    });

    // Channel Topic Updating 
    client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {

        const embed = new EmbedBuilder()
            .setTitle('message modifié!')
            .setColor('#009898')
            .setDescription(`${channel} message modifié de **${oldTopic}** en **${newTopic}**`);

        return send_log(channel.guild.id, embed);

    });

    // Channel Permission Updating
    client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {

        const embed = new EmbedBuilder()
            .setTitle('permission changé')
            .setColor('#009898')
            .setDescription(channel.name + 'permission changé');

        return send_log(channel.guild.id, embed);

    })

    // unhandled Guild Channel Update
    client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {

        const embed = new EmbedBuilder()
            .setTitle('salon modifié')
            .setColor('#009898')
            .setDescription("le salon '" + oldChannel.id + "' a été modifié mais je ne trouve pas en quoi...");

        return send_log(oldChannel.guild.id, embed);

    });

    // Member Started Boosting
    client.on("guildMemberBoost", (member) => {

        const embed = new EmbedBuilder()
            .setTitle('un membre a boost le serv')
            .setColor('#009898')
            .setDescription(`**${member.user.tag}** a commencer a booster  ${member.guild.name}!`);
        return send_log(member.guild.id, embed);

    })

    // Member Unboosted
    client.on("guildMemberUnboost", (member) => {

        const embed = new EmbedBuilder()
            .setTitle('un membre a arreter de booster!')
            .setColor('#009898')
            .setDescription(`**${member.user.tag}** a arreter de booster  ${member.guild.name}!`);

        return send_log(member.guild.id, embed);

    })

    // Member Got Role
    client.on("guildMemberRoleAdd", (member, role) => {

        const embed = new EmbedBuilder()
            .setTitle('un membre a eu un rôle')
            .setColor('#009898')
            .setDescription(`**${member.user.tag}** a eu le role \`${role.name}\``);

        return send_log(member.guild.id, embed);

    })

    // Member Lost Role
    client.on("guildMemberRoleRemove", (member, role) => {

        const embed = new EmbedBuilder()
            .setTitle('un membre a perdus un role')
            .setColor('#009898')
            .setDescription(`**${member.user.tag}** a perdus le role \`${role.name}\``);

        return send_log(member.guild.id, embed);

    })

    // Nickname Changed
    client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {

        const embed = new EmbedBuilder()
            .setTitle('changement de pseudo')
            .setColor('#009898')
            .setDescription(`${member.user.tag} a changé de pseudo, de\`${oldNickname}\` a \`${newNickname}\``);

        return send_log(member.guild.id, embed);

    })

    // Member Joined
    client.on("guildMemberAdd", (member) => {

        const embed = new EmbedBuilder()
            .setTitle('un membre est arrivée')
            .setColor('#009898')
            .setDescription(`Membre: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
                member.user.displayAvatarURL({ dynamic: true }));

        return send_log(member.guild.id, embed);

    });

    // Member Joined
    client.on("guildMemberRemove", (member) => {

        const embed = new EmbedBuilder()
            .setTitle('un membre est partis')
            .setColor('#009898')
            .setDescription(`Membre: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
                member.user.displayAvatarURL({ dynamic: true }));

        return send_log(member.guild.id, embed);

    });

    // Server Boost Level Up
    client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {

        const embed = new EmbedBuilder()
            .setTitle('le niveaux de boost du server a augmenté')
            .setColor('#009898')
            .setDescription(`${guild.name} a atteint le boost niveau ${newLevel}`);

        return send_log(guild.id, embed);

    })

    // Server Boost Level Down
    client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {

        const embed = new EmbedBuilder()
            .setTitle('le niveaux de boost du serveur a baissé')
            .setColor('#009898')
            .setDescription(`${guild.name} a perdus un level, de ${oldLevel} a ${newLevel}`);

        return send_log(guild.id, embed);

    })

    // Banner Added
    client.on("guildBannerAdd", (guild, bannerURL) => {

        const embed = new EmbedBuilder()
            .setTitle('le server a changer de bannière')
            .setColor('#009898')
            .setImage(bannerURL)

        return send_log(guild.id, embed);

    })

    // AFK Channel Added
    client.on("guildAfkChannelAdd", (guild, afkChannel) => {

        const embed = new EmbedBuilder()
            .setTitle('salon afk ajouté')
            .setColor('#009898')
            .setDescription(`${guild.name} a un nouveaux salon afk ${afkChannel}`);

        return send_log(guild.id, embed);

    })

    // Guild Vanity Add
    client.on("guildVanityURLAdd", (guild, vanityURL) => {

        const embed = new EmbedBuilder()
            .setTitle('nouvelle url perssonalisé')
            .setColor('#009898')
            .setDescription(`${guild.name} a une nouvelle url perssonalisé ${vanityURL}`);

        return send_log(guild.id, embed);

    })

    // Guild Vanity Remove
    client.on("guildVanityURLRemove", (guild, vanityURL) => {

        const embed = new EmbedBuilder()
            .setTitle('n as plus d url perssonalisé')
            .setColor('#009898')
            .setDescription(`${guild.name} as plus d url perssonalisé ${vanityURL}`);

        return send_log(guild.id, embed);

    })

    // Guild Vanity Link Updated
    client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {

        const embed = new EmbedBuilder()
            .setTitle('a changéson url perssonalisé')
            .setColor('#009898')
            .setDescription(`${guild.name} a chagé son url perssonalisé, de ${oldVanityURL} a ${newVanityURL}!`);

        return send_log(guild.id, embed);

    })

    // Message Pinned
    client.on("messagePinned", (message) => {

        const embed = new EmbedBuilder()
            .setTitle('message épinglé')
            .setColor('#009898')
            .setDescription(`${message} est épinglé par ${message.author}`);

        return send_log(message.guild.id, embed);

    })

    // Message Edited
    client.on("messageContentEdited", (message, oldContent, newContent) => {

        const embed = new EmbedBuilder()
            .setTitle('message modifié')
            .setColor('#009898')
            .setDescription(`message éditer de \`${oldContent}\` a \`${newContent}\` par ${message.author}`);

        return send_log(message.guild.id, embed);

    })

    // Role Position Updated
    client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {

        const embed = new EmbedBuilder()
            .setTitle('position du role changé')
            .setColor('#009898')
            .setDescription(role.name + " le role avais la postion  " + oldPosition + " et maintenant a la position " + newPosition);

        return send_log(role.guild.id, embed);

    })

    // Role Permission Updated
    client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {

        const embed = new EmbedBuilder()
            .setTitle('permission de role changé')
            .setColor('#009898')
            .setDescription(role.name + " avais les permissions de" + oldPermissions + " et maintenant a les permissions de " + newPermissions);

        return send_log(role.guild.id, embed);

    })

    // Avatar Updated
    client.on("userAvatarUpdate", (user, oldAvatarURL, newAvatarURL) => {

        const embed = new EmbedBuilder()
            .setTitle('pp changé')
            .setColor('#009898')
            .setDescription(`${user.tag} a changé de pp, de [ancienne pp](${oldAvatarURL}) a [nouvelle pp(${newAvatarURL})]`);

        return send_log(user.guild.id, embed);

    })

    // Username Updated
    client.on("userUsernameUpdate", (user, oldUsername, newUsername) => {

        const embed = new EmbedBuilder()
            .setTitle('pseudo changé')
            .setColor('#009898')
            .setDescription(`${user.tag} changé son pseudo de ${oldUsername} a ${newUsername}`);

        return send_log(user.guild.id, embed);

    })

    // Discriminator Updated
    client.on("userDiscriminatorUpdate", (user, oldDiscriminator, newDiscriminator) => {

        const embed = new EmbedBuilder()
            .setTitle('a changé son #')
            .setColor('#009898')
            .setDescription(`${user.tag} a changé de ${oldDiscriminator} a ${oldDiscriminator}`);

        return send_log(user.guild.id, embed);

    })

    // Flags Updated
    client.on("a changé c est paramètre", (user, oldFlags, newFlags) => {

        const embed = new EmbedBuilder()
            .setTitle('Flags Updated')
            .setColor('#009898')
            .setDescription(`${user.tag} a changé c est paramètre, de ${oldFlags} en ${newFlags}`);

        return send_log(user.guild.id, embed);

    })

    // Joined VC
    client.on("voiceChannelJoin", (member, channel) => {

        const embed = new EmbedBuilder()
            .setTitle('a rejoin un channel vocal')
            .setColor('#009898')
            .setDescription(member.user.tag + " a rejoint " + `${channel}` + "!");

        return send_log(member.guild.id, embed);

    })

    // Left VC
    client.on("voiceChannelLeave", (member, channel) => {

        const embed = new EmbedBuilder()
            .setTitle('a quitter un channel vocal')
            .setColor('#009898')
            .setDescription(member.user.tag + " a quitté " + `${channel}` + "!");

        return send_log(member.guild.id, embed);

    })

    // VC Switch
    client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {

        const embed = new EmbedBuilder()
            .setTitle('a changé de channel vocal')
            .setColor('#009898')
            .setDescription(member.user.tag + " a quitté " + oldChannel.name + " et a rejoint " + newChannel.name + "!");

        return send_log(member.guild.id, embed);

    })

    // VC Mute
    client.on("voiceChannelMute", (member, muteType) => {

        const embed = new EmbedBuilder()
            .setTitle('utilisateur mute')
            .setColor('#009898')
            .setDescription(member.user.tag + " est maintenant mute (pour: " + muteType + ")");

        return send_log(member.guild.id, embed);

    })

    // VC Unmute
    client.on("voiceChannelUnmute", (member, oldMuteType) => {

        const embed = new EmbedBuilder()
            .setTitle('utilisateur unmute')
            .setColor('#009898')
            .setDescription(member.user.tag + " est maintenant unmute");

        return send_log(member.guild.id, embed);

    })

    // VC Defean
    client.on("voiceChannelDeaf", (member, deafType) => {

        const embed = new EmbedBuilder()
            .setTitle('Utilisateur est devenus muet')
            .setColor('#009898')
            .setDescription(member.user.tag + " est devenus muet");

        return send_log(member.guild.id, embed);

    })

    // VC Undefean
    client.on("voiceChannelUndeaf", (member, deafType) => {

        const embed = new EmbedBuilder()
            .setTitle('utilisateur n est plus muet')
            .setColor('#009898')
            .setDescription(member.user.tag + " n'est plus muet");

        return send_log(member.guild.id, embed);

    })

    // User Started to Stream
    client.on("voiceStreamingStart", (member, voiceChannel) => {


        const embed = new EmbedBuilder()
            .setTitle('un utilisateur est entrée dans un vocal')
            .setColor('#009898')
            .setDescription(member.user.tag + " est entrée dans le vocal " + voiceChannel.name);

        return send_log(member.guild.id, embed);

    })

    // User Stopped to Stream
    client.on("voiceStreamingStop", (member, voiceChannel) => {


        const embed = new EmbedBuilder()
            .setTitle('utilisateur partis du vocal')
            .setColor('#009898')
            .setDescription(member.user.tag + " est partis du vocal " + voiceChannel.name);

        return send_log(member.guild.id, embed);
    });

    // Role Created
    client.on("roleCreate", (role) => {

        const embed = new EmbedBuilder()
            .setTitle('Role ajouté')
            .setColor('#009898')
            .setDescription(`Role: ${role}\nnom du role: ${role.name}\nid du role: ${role.id}\nPosition du role: ${role.position}`);

        return send_log(role.guild.id, embed);

    });

    // Role Deleted
    client.on("roleDelete", (role) => {

        const embed = new EmbedBuilder()
            .setTitle('role suprimé')
            .setColor('#009898')
            .setDescription(`Rôle: ${role}\nnom du role: ${role.name}\nid du role: ${role.id}\nposition du role: ${role.position}`);

        return send_log(role.guild.id, embed);

    });

    client.on("guildBanAdd", ({guild, user}) => {

        const embed = new EmbedBuilder()
            .setTitle('utilisateur ban')
            .setColor('#009898')
            .setDescription(`l utilisateur: ${user} a été ban il avais l id (\`${user.id}\`)\n\`${user.tag}\``,
                user.displayAvatarURL({ dynamic: true }));

        return send_log(guild.id, embed);

    });

    // User Unbanned
    client.on("guildBanRemove", ({guild, user}) => {

        const embed = new EmbedBuilder()
            .setTitle('utilisateur unban')
            .setColor('#009898')
            .setDescription(`l utilisateur: ${user} a été unban il avais l id(\`${user.id}\`)\n\`${user.tag}\``,
                user.displayAvatarURL({ dynamic: true }));

        return send_log(guild.id, embed);

    });

    // Channel Created
    client.on("channelCreate", (channel) => {

        const embed = new EmbedBuilder()
            .setTitle('salon créer')
            .setColor('#009898')
            .setDescription(`${channel.name} a été crée.`);

        return send_log(channel.guild.id, embed);

    });

    // Channel Deleted
    client.on("channelDelete", (channel) => {

        const embed = new EmbedBuilder()
            .setTitle('salon suprimé')
            .setColor('#009898')
            .setDescription(`${channel.name} a été suprimé.`);

        return send_log(channel.guild.id, embed);

    });
}

module.exports = { handleLogs };

// this code will be in the description