const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute un utilisateur")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => 
        option.setName("utilisateur")
        .setDescription("Unmute un utilisateur")
        .setRequired(true)
        )
    .addStringOption(option => 
        option.setName('raison')
            .setDescription('raison du unmute')
            .setRequired(true)
        ),
    async execute(interaction) {
        const {guild, options} = interaction;

        const user = options.getUser("utilisateur");
        const member = guild.members.cache.get(user.id);
        const raison = options.getString('raison') || 'Aucune raison spécifiée';

        const errembed = new EmbedBuilder()
            .setDescription("quellque chose s'est mal passé, réssayez plus tard")
            .setColor("Aqua")

        const successembed = new EmbedBuilder()
            .setTitle("Unmute")
            .setDescription(`${user} a été unmute pour: **${raison}**`)
            .setColor("Aqua")
            .setTimestamp();

            
        if (member.roles.highest.position >= interaction.member.roles.highest.position) 
            return interaction.reply({embeds: [errembed], ephemeral: true});

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({embeds: [errembed], ephemeral: true});

        try {
            await member.timeout(null);

            interaction.reply({embeds: [successembed]});
        } catch (err) {
            console.log(error);
        }
    }
}