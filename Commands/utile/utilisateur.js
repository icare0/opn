const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("utilisateur")
    .setDescription(`obtien des info sur un membre du serveur`)
    .addUserOption(option => option.setName(`utilisateur`).setDescription(`choisis un utilisateur pour obtenir c'est information`).setRequired(false)),
    async execute (interaction, client) {

        const formatter = new Intl.ListFormat(`en-GB`, { style: `narrow`, type: `conjunction` });
        

        const badges = {
            BugHunterLevel1: "<:8_:1095962389909868584>",
            BugHunterLevel2: "<:7_:1095962391721824256>",
            HypeSquadOnlineHouse1: "<:12:1097567469834620961>",
            HypeSquadOnlineHouse2: "<:11:1097567468102361150>",
            HypeSquadOnlineHouse3: "<:2_:1095962399615504434> ",
            Hypesquad: "<:1_:1095962403298103306>",
            Partner: "<:3_:1095962397119877141>",
            PremiumEarlySupporter: "<:6_:1095962392950751242>",
            Staff: "<:pung:1089116019013976184>",
            VerfiedDeveloper: "<:9_:1095962388324438038>",
            ActiveDeveloper: "<:activedeveloper:1095962385384210512>",
        }

        const user = interaction.options.getUser(`utilisateur`) || interaction.user;
        const userFlags = user.flags.toArray();
        const member = await interaction.guild.members.fetch(user.id);
        const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 1)
        const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });
        const booster = member.premiumSince ? `<:10:1095962387292631081> Oui!` : `Non`; //Change the emoji
        const ownerE = `:crown:,`// change the server owner emoji
        const devs = `:sunglasses:` // change the bot dev emoji
        const owners = [
            `914524776079458315`, // id for the devs of the bot
        ]

        const JoinPosition = await interaction.guild.members.fetch().then(Members => Members.sort((a, b) => a.joinedAt - b.joinedAt).map((User) => User.id).indexOf(member.id) + 1)

        const bot = new EmbedBuilder() // you can remove this if you want
        .setColor(`Red`)
        .setDescription(`le bot n'est pas disponible`)
        if (member.user.bot) return await interaction.channel.sendTyping(), await interaction.reply({ embeds: [bot]});

        const embed = new EmbedBuilder()
        .setAuthor({ name: `information`, iconURL: member.displayAvatarURL()})
        .setTitle(`**${member.user.tag}** ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        .setColor(`Aqua`)
        .setThumbnail(member.displayAvatarURL())
        .setDescription(`**Id** - ${member.id}\n• **Boost du serveur** - ${booster}\n• **meilleur Rôle** - ${topRoles}\n• **rejoint** - <t:${parseInt(member.joinedAt / 1000)}:R>\n• **compte crée le** - <t:${parseInt(user.createdAt / 1000)}:R>`)
        .addFields({ name: `Bannière`, value: banner ? " " : "Aucune"})
        .setImage(banner)
        .setFooter({ text: `${member ? `tu es le - ${JoinPosition} a rejoindre le serveur | ` : ''}`})
        
        // owner
        if (member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${ownerE} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        }
        // bot owners
        if (owners.includes(member.id)) {
            embed
            .setTitle(`**${member.user.tag}** ${devs} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        }
        // server owner and bot owners
        if (owners.includes(member.id) && member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${devs} ${ownerE} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        }

        await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed] });
    }
}