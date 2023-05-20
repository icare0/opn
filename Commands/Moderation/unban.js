const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require ("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("unban un utilisateur")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName("utilisateur")
            .setDescription("utilisateur à unban")
            .setRequired(true)
        )
    .addStringOption(option => 
        option.setName("raison")
            .setDescription("raison du unban")
            .setRequired(true)
    ),
    async execute(interaction) {
        const { channel, options } = interaction;

        const userId = options.getUser("utilisateur");
        const raison = options.getString('raison') || 'Aucune raison spécifiée';

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
            .setTitle("Unban")
            .setDescription(`${userId} a été unban pour: ${raison}`)
            .setColor("Aqua")

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);

            const errembed = new EmbedBuilder()
                .setDescription("entre une id valide")
                .setColor("Aqua");

            interaction.reply({ embeds: [errembed], ephemeral: true });


        }
    }
           
}
