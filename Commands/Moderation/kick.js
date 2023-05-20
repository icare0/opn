const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('kick un membre du serveur')
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption(option => 
            option.setName('utilisateur')
            .setDescription('utilisateur à kick')
            .setRequired(true)
        )
    .addStringOption(option => 
            option.setName('raison')
           .setDescription('la raison du kick')
           .setRequired(true)
        ),
    
    async execute(interaction) {
        const {channel, options} = interaction;

        const user = options.getUser('utilisateur');
        const raison = options.getString('raison') || "pas de raison spécifiée"

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`je ne peux pas kick ${user.username} parce que il a un role supérieur à moi`)
            .setColor("Aqua")     

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        
        await member.kick(raison);

        const enbed = new EmbedBuilder()
        .setTitle("Kick")
        .setDescription(`${user.username} a été kick pour **${raison}**`)
        .setColor("Aqua")

        await interaction.reply({embeds: [enbed]});
    }
};