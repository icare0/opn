const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require ("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban un utilisateur")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName("utilisateur")
            .setDescription("utilisateur à ban")
            .setRequired(true)
        )
    .addStringOption(option => 
        option.setName("raison")
            .setDescription("raison du ban")
            .setRequired(true)
    ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser('utilisateur');
        const raison = options.getString('raison') || 'Aucune raison spécifiée';

        const member = await interaction.guild.members.fetch(user.id);

        const errembed = new EmbedBuilder()
            .setDescription(`je ne peux pas ban ${user.usename} parce ce que il a un rôle plus haut que moi`)
            .setColor("Aqua")

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errembed], ephemeral: true});
    
        await member.ban({raison});

        const embed = new EmbedBuilder()
            .setTitle("Ban")
            .setDescription(`${user} a été ban pour: ${raison}`)
            .setColor("Aqua")

        await interaction.reply({
            embeds: [embed]
        });
    }
}
