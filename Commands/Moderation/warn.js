const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { Schema } = require('mongoose');
const warnSchema = require('../../Schemas/Warn');
 
module.exports ={
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn un utilisateur.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command
        .setName('ajouter')
        .setDescription('Warn un utilisateur.')
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription('la perssone que tu veux warn.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('raison')
            .setDescription('la raison de ton warn')))
    .addSubcommand(command => command
        .setName('afficher')
        .setDescription('voir les warn d un utilisateur.')
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription('l utilisateur ou que tu veux warn')))
    .addSubcommand(command => command
        .setName('enlever')
        .setDescription('enleve un warn a un utilisateur.')
        .addUserOption(option => option
            .setName('utilisateur')
            .setDescription('l utilisateur que tu veux enlever le warn.')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('lequel')
            .setDescription('le warn que tu veux enlever de l utilisateur')
            .setRequired(true))),
    async execute (interaction)
    {
 
        const command = interaction.options.getSubcommand()
 
        if (command === 'ajouter')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'You need the Moderate Members permission to use this command.', ephemeral: true })
 
            const warnedUser = interaction.options.getUser('utilisateur');
            const reason = interaction.options.getString('raison') || 'pas de raison donné';
 
            if (warnedUser.bot) return await interaction.reply({ content: 'tu ne peux pas warn un bot ', ephemeral: true })
 
            let Data = await warnSchema.findOne({ UserID: interaction.options.getUser('utilisateur').id, GuildID: interaction.guild.id })

            if (Data && Data.Warns.length >= 2) {
                try {
                  const member = await interaction.guild.members.fetch(Data.UserID);
                  await member.ban({ reason: 'il a reçus 3 warn' });
                  await interaction.reply({ content: `${warnedUser} a été banni pour avoir reçu trois avertissements.` });
                  await warnSchema.deleteOne({ UserID: Data.UserID, GuildID: interaction.guild.id });
                  return;
                } catch (err) {
                  console.error(err);
                  await interaction.reply({ content: `Impossible de bannir ${warnedUser}.` });
                }
              }

              
 
            const unwarnedEmbed = new EmbedBuilder()
            .setTitle('Warn Command')
            .addFields({ name: 'warn arrêter!', value: `> le warn n'as pas aboutis pour **${warnedUser}** avec la raison **${reason}**.\n> \n> tu a arrêter ce warn` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warnedEmbed = new EmbedBuilder()
            .setTitle('Warn Command')
            .addFields({ name: 'une perssone a été warn!', value: `> tu as warn **${warnedUser}** avec la raison **${reason}**.` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warningEmbed = new EmbedBuilder()
            .setTitle('warn')
            .addFields({ name: 'une perssone a été warn!', value: `> tu as warn **${warnedUser}** avec la raison **${reason}**.\n> \n> est ce que tu confirme?` })
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
                        Data = new warnSchema({
                            UserID: warnedUser.id,
                            GuildID: interaction.guild.id,
                        })
 
                    }
 
                    await i.reply({ content: 'confirmé!', ephemeral: true })
                    await interaction.editReply({ embeds: [warnedEmbed], components: [] })
                    Data.Warns.push(reason)
 
                    const dmEmbed = new EmbedBuilder()
                    .setTitle('warn!')
                    .addFields({ name: 'tu as été warn!', value: `tu as été warn dans ${interaction.guild.name} pour ${reason}` })
                    .setColor('Aqua')
                    .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                    await warnedUser.send({ embeds: [dmEmbed] }).catch(err => {
                        return;
                    })
 
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
 
            let DataWarns = await warnSchema.findOne({ UserID: warnsUser.id, GuildID: interaction.guild.id })
 
            if ((!DataWarns || DataWarns.Warns.length == 0) && command === 'afficher')
            {
 
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle(' pas de warn!')
                .addFields({ name: '0 warn!', value: `${warnsUser} n'as pas de warn!` })
                .setColor('Aqua')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
 
            }
 
            else {
 
                let numberOfWarns1 = 0
                let numberOfWarns = 1
                let warns = ''
 
                for (i in DataWarns.Warns)
                {
 
                    warns += `**Warn** **__${numberOfWarns}__**\n${DataWarns.Warns[numberOfWarns1]}\n\n`
 
                    numberOfWarns += 1
                    numberOfWarns1 += 1
 
                }
 
                const showWarnsEmbed = new EmbedBuilder()
                .setAuthor({ name: `${warnsUser.username}' | warn dans ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTitle('voici tous les warn de cette utilisateur')
                .setDescription(warns)
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
 
            let DataUnwarned = await warnSchema.findOne({ UserID: interaction.options.getUser('utilisateur').id, GuildID: interaction.guild.id })
 
            if (!DataUnwarned || DataUnwarned.Warns.length == 0)
            {
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('pas de warn!')
                .addFields({ name: '0 warn!', value: `${removeWarnUser} n'as pas de warn a enlever!` })
                .setColor('Aqua')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
            }
 
            if (DataUnwarned.Warns[warnRemoved] == undefined)
            {
                const highWarnEmbed = new EmbedBuilder()
                .setTitle('pas de warn trouvé!')
                .addFields({ name: 'pas de warn trouvé', value: `tu n'as pas spécifié ${removeWarnUser}'s warns.\nUtilisé \`/warn show\` pour voir c'est warn.` })
                .setColor('Aqua')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [highWarnEmbed] })
            }
 
 
            const removedWarnEmbed = new EmbedBuilder()
            .setTitle('Warn enlever')
            .addFields({ name: 'Warn enlever!', value: `tu as enlever ${removeWarnUser}' le warn étais : **${DataUnwarned.Warns[warnRemoved]}**` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            const dmEmbed = new EmbedBuilder()
            .setTitle('Unwarned!')
            .addFields({ name: 'tu as été unwarn!', value: `tu as été unwarn dans ${interaction.guild.name}!\n le warn enlever étais : ${DataUnwarned.Warns[warnRemoved]}` })
            .setColor('Aqua')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            await removeWarnUser.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
            DataUnwarned.Warns.splice(DataUnwarned.Warns[warnRemoved], 1)
            DataUnwarned.save()
            return await interaction.reply({ embeds: [removedWarnEmbed] })
        }
 
    }
}



