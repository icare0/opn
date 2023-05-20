const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { Schema } = require('mongoose');
const NotesSchema = require('../../Schemas/Notes');
 
module.exports ={
    data: new SlashCommandBuilder()
    .setName('notes')
    .setDescription('ajoute une note a un utilisateur')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command
        .setName('ajouter')
        .setDescription('ajoute une note a un utilisateur')
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription('la perssone a qui u veux ajouter une note')
            .setRequired(true))
        .addStringOption(option => option
            .setName('description')
            .setDescription('la description de ta notes')
            .setRequired(true)))
    .addSubcommand(command => command
        .setName('afficher')
        .setDescription('voir la notes d un utilisateur')
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription(' l utilisateur a qui tu veux voir la note')))
    .addSubcommand(command => command
        .setName('enlever')
        .setDescription('enleve la note d un utilisateur')
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription('l utilisateur a qui tu veux enlever la note')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('lequel')
            .setDescription('quelle note veux tu enlever')
            .setRequired(true))),
    async execute (interaction)
    {
 
        const command = interaction.options.getSubcommand()
 
        if (command === 'ajouter')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'You need the Moderate Members permission to use this command.', ephemeral: true })
 
            const warnedUser = interaction.options.getUser('utilisateur');
            const reason = interaction.options.getString('description') || 'pas de description donné';
 
            if (warnedUser.bot) return await interaction.reply({ content: 'tu ne peux pas warn un bot ', ephemeral: true })
 
            let Data = await NotesSchema.findOne({ UserID: interaction.options.getUser('utilisateur').id, GuildID: interaction.guild.id })
 
            const unwarnedEmbed = new EmbedBuilder()
            .setTitle('Notes')
            .addFields({ name: 'Notes arrêter!', value: `> la notes nas pas aboutis pour **${warnedUser}** avec la description **${reason}**.\n> \n> tu a arrêter cette notes` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warnedEmbed = new EmbedBuilder()
            .setTitle('Notes')
            .addFields({ name: 'une notes à été mise!', value: `> tu mis une notes sur **${warnedUser}** avec la description **${reason}**.` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warningEmbed = new EmbedBuilder()
            .setTitle('Notes')
            .addFields({ name: 'une notes à été mise!', value: `> tu mis une notes sur **${warnedUser}** avec la description **${reason}**.\n> \n> est ce que tu confirme?` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const confirmButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirme')
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId('décliné')
                    .setLabel('Decline')
                    .setStyle(ButtonStyle.Danger),
                )
            var message = await interaction.reply({ embeds: [warningEmbed], components: [confirmButton] })
 
            const collector = message.createMessageComponentCollector()
 
            collector.on('collect', async i => {
 
                if (i.user.id != interaction.user.id) return await i.reply({ content: 'ce nest pas ta commande!', ephemeral: true })
 
                if (i.customId == 'confirm')
                {
 
                    if (!Data)
                    {
                        Data = new NotesSchema({
                            UserID: warnedUser.id,
                            GuildID: interaction.guild.id,
                        })
 
                    }
 
                    await i.reply({ content: 'confirmé!', ephemeral: true })
                    await interaction.editReply({ embeds: [warnedEmbed], components: [] })
                    Data.Notes.push(reason)
 
                    await Data.save()
 
                }
                else {
 
                    await i.reply({ content: 'Decliné!', ephemeral: true })
                    await interaction.editReply({ embeds: [unwarnedEmbed], components: [] })
 
                }
 
            })
 
        }
 
 
        if (command === 'afficher')
        {
 
            const warnsUser = interaction.options.getUser('utilisateur') || interaction.user;
 
            let DataNotes = await NotesSchema.findOne({ UserID: warnsUser.id, GuildID: interaction.guild.id })
 
            if ((!DataNotes || DataNotes.Notes.length == 0) && command === 'afficher')
            {
 
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle(' pas de Note!')
                .addFields({ name: '0 Note!', value: `${warnsUser} n'as pas de Note!` })
                .setColor('Aqua')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
 
            }
 
            else {
 
                let numberOfWarns1 = 0
                let numberOfWarns = 1
                let Notes = ''
 
                for (i in DataNotes.Notes)
                {
 
                    Notes += `**Notes** **__${numberOfWarns}__**\n${DataNotes.Notes[numberOfWarns1]}\n\n`
 
                    numberOfWarns += 1
                    numberOfWarns1 += 1
 
                }
 
                const showWarnsEmbed = new EmbedBuilder()
                .setAuthor({ name: `${warnsUser.username}' | Notes dans ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTitle('voici toute les notes de cette utilisateur')
                .setDescription(Notes)
                .setColor('Aqua')
                .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
 
                await interaction.reply({ embeds: [showWarnsEmbed] })
 
            }
        }
 
        if (command === 'enlever')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'tu dois avoir la perssions de modéré des membre pour faire cette commande.', ephemeral: true })
 
            removeWarnUser = interaction.options.getUser('utilisateur');
            warnRemoved = interaction.options.getInteger('lequel')
            warnRemoved -= 1
 
            let DataUnwarned = await NotesSchema.findOne({ UserID: interaction.options.getUser('utilisateur').id, GuildID: interaction.guild.id })
 
            if (!DataUnwarned || DataUnwarned.Notes.length == 0)
            {
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('pas de Notes!')
                .addFields({ name: '0 Notes!', value: `${removeWarnUser} n'as pas de Note à enlever!` })
                .setColor('Aqua')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
            }
 
            if (DataUnwarned.Notes[warnRemoved] == undefined)
            {
                const highWarnEmbed = new EmbedBuilder()
                .setTitle('pas de Notes trouvé!')
                .addFields({ name: 'pas de Notes trouvé', value: `tu n'as pas spécifié ${removeWarnUser} Notes.\nUtilisé \`Notes\` pour voir c'est Notes.` })
                .setColor('Aqua')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [highWarnEmbed] })
            }
 
 
            const removedWarnEmbed = new EmbedBuilder()
            .setTitle('Notes enlever')
            .addFields({ name: 'Notes enlever!', value: `tu as enlever ${removeWarnUser}' la notes étais : **${DataUnwarned.Notes[warnRemoved]}**` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })

            DataUnwarned.Notes.splice(DataUnwarned.Notes[warnRemoved], 1)
            DataUnwarned.save()
            return await interaction.reply({ embeds: [removedWarnEmbed] })
        }
 
    }
}



