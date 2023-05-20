const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription("rappeler un utilisateur")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addRoleOption(option => 
            option.setName('rôle')
                .setDescription('rôle à rappeler')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('message')
                .setDescription('message à rappeler')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('jours')
                .setDescription('nombre de jours avant le rappel')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('heures')
                .setDescription('nombre d\'heures avant le rappel')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('nombre de minutes avant le rappel')
                .setRequired(false)
        ),
    async execute(interaction) {
        const { guild, member, options } = interaction;
    
        const role = options.getRole('rôle');
        const mes = options.getString('message') || 'aucun message spécifié';
        const jours = options.getInteger('jours') || 0;
        const heures = options.getInteger('heures') || 0;
        const minutes = options.getInteger('minutes') || 0;

        const embed = new EmbedBuilder()
            .setTitle(`Rappel`)
            .setDescription(`${mes}`)
            .setColor("Aqua");

        const delay = (jours * 24 * 60 * 60 * 1000) + (heures * 60 * 60 * 1000) + (minutes * 60 * 1000);
        const rappelDate = new Date(Date.now() + delay);

        setTimeout(async () => {
            try {
                await member.send({ embeds: [embed] });
            } catch (error) {
                console.error(`Impossible d'envoyer au rôle ${role}. Erreur : ${error}`);
            }
        }, delay);
        
        await interaction.reply(`Le rappel sera au rôle ${role} le ${rappelDate.toLocaleString()}.`);
    }
}
