const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("mute un utilisateur")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => 
            option.setName('utilisateur')
                .setDescription('utilisateur à mute')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('temps')
                .setDescription('temps de mute')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('raison')
                .setDescription('raison du mute')
                .setRequired(true)
        ),

        async execute(interaction) {
            const {guild, options} = interaction;

            const user = options.getUser('utilisateur');
            const member = guild.members.cache.get(user.id);
            const time = options.getString('temps');
            const convertedTime = ms(time);
            const reason = options.getString('raison') || 'Aucune raison fournie';

            const errembed = new EmbedBuilder()
                .setDescription("quellque chose s'est mal passé, réssayez plus tard")
                .setColor("Aqua")

            const successembed = new EmbedBuilder()
                .setTitle("Mute")
                .setDescription(`${user} a été mute pendant **${time}** pour **${reason}**`)
                .setColor("Aqua")


            if (member.roles.highest.position >= interaction.member.roles.highest.position) 
                return interaction.reply({embeds: [errembed], ephemeral: true});

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
                return interaction.reply({embeds: [errembed], ephemeral: true});

            if (!convertedTime)
                return interaction.reply({embeds: [errembed], ephemeral: true});

            try {
                await member.timeout(convertedTime, reason);

                interaction.reply({embeds: [successembed]});
            } catch (error) {
                console.log(error);
            }
        }
    }







    



