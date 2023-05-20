const { SlashCommandBuilder, PermissionsBitField } = require(`discord.js`);
const ms = require('ms');
const { mongoose } = require(`mongoose`)
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`giveaway`)
    .setDescription(`Start a giveaway or configure already existing ones.`)
    .addSubcommand(command => command.setName('start').setDescription('commencer un giveway.').addStringOption(option => option.setName('temps').setDescription(`Specified duration will be the giveaway's duration (in ms)`).setRequired(true)).addIntegerOption(option => option.setName('gagnants').setDescription('Specified amount will be the amount of winners chosen.').setRequired(true)).addStringOption(option => option.setName('prix').setDescription('Specified prize will be the prize for the giveaway.').setRequired(true)).addChannelOption(option => option.setName('channel').setDescription('Specified channel will receive the giveaway.')).addStringOption(option => option.setName('description').setDescription('Specified content will be used for the giveaway embed.')))
    .addSubcommand(command => command.setName(`edit`).setDescription(`Edits specified giveaway.`).addStringOption(option => option.setName('message-id').setDescription('Specify the message ID of the giveaway you want to edit.').setRequired(true)).addStringOption(option => option.setName('temps').setDescription('Specify the added duration of the giveaway (in ms).').setRequired(true)).addIntegerOption(option => option.setName('gagnants').setDescription('Specify the new ammount of winners.').setRequired(true)).addStringOption(option => option.setName('prix').setDescription('Specify the new prize for the giveaway.').setRequired(true)))
    .addSubcommand(command => command.setName('end').setDescription(`Ends specified giveaway.`).addStringOption(option => option.setName('message-id').setDescription('Specify the message ID of the giveaway you want to end.').setRequired(true)))
    .addSubcommand(command => command.setName(`reroll`).setDescription(`Rerolls specified giveaway.`).addStringOption(option => option.setName('message-id').setDescription('Specify the message ID of the giveaway you want to reroll.').setRequired(true))),
    async execute(interaction, client) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: `You **do not** have the permission to do that!`, ephemeral: true});
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
 
            case 'start':
 
            // GIVEAWAY START COMMAND CODE //
 
            await interaction.reply({ content: `**démarre** le giveway...`, ephemeral: true })
 
            const { GiveawaysManager } = require("discord-giveaways");
 
            const duration = ms(interaction.options.getString("temps") || "")
            const winnerCount = interaction.options.getInteger('gagnants');
            const prize = interaction.options.getString('prix');
            const contentmain = interaction.options.getString(`description`);
            const channel = interaction.options.getChannel("channel");
            const showchannel = interaction.options.getChannel('channel') || interaction.channel;
            if (!channel && !contentmain)
 
            client.giveawayManager.start(interaction.channel, {
 
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: false,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: 'Aqua'
                }
 
            });
 
            else if (!channel)
            client.giveawayManager.start(interaction.channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: true,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: 'Aqua'
                }
            });
            else if (!contentmain)
            client.giveawayManager.start(channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: false,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: 'Aqua'
                }
            });
            else 
            client.giveawayManager.start(channel, {
                prize,
                winnerCount,
                duration,
                hostedBy: interaction.user,
                lastChance: {
                    enabled: true,
                    content: contentmain,
                    threshold: 60000000000_000,
                    embedColor: 'Aqua'
                }
            });
 
            interaction.editReply({ content: `ton **giveaway** a été lancer avec succès! regarde ${showchannel}.`, ephemeral: true })
 
 
            // EDIT GIVEAWAY CODE //
 
            break;
            case 'edit':
 
           await interaction.reply({ content: `**Modifie** ton giveaway..`, ephemeral: true});
 
            const newprize = interaction.options.getString('prix');
            const newduration = interaction.options.getString('temps');
            const newwinners = interaction.options.getInteger('gagnants');
            const messageId = interaction.options.getString('message-id');
            client.giveawayManager.edit(messageId, {
 
                addTime: ms(newduration),
                newWinnerCount: newwinners,
                newPrize: newprize
 
            }).then(() => {
 
                interaction.editReply({ content: `Your **giveaway** has been **edited** successfuly!`, ephemeral: true});
            }).catch((err) => {
 
                interaction.editReply({ content: `An **error** occured! Please contact **icare#9073** if this issue continues. \n> **Error**: ${err}`, ephemeral: true});
            });
 
            // END GIVEAWAY CODE //
            break;
            case 'end':
 
            await interaction.reply({ content: `**Ending** your giveaway..`, ephemeral: true});
 
            const messageId1 = interaction.options.getString('message-id');
                        client.giveawayManager
            .end(messageId1)
            .then(() => {
                interaction.editReply({ content: 'Your **giveaway** has ended **successfuly!**', ephemeral: true});
            })
            .catch((err) => {
                interaction.editReply({ content: `An **error** occured! Please contact **icare#9073** if this issue continues. \n> **Error**: ${err}`, ephemeral: true});
            });
 
            break;
            case 'reroll':
 
            // REROLL GIVEAWAY CODE //
 
            await interaction.reply({ content: `**Rerolling** your giveaway..`, ephemeral: true});
 
            const query = interaction.options.getString('message-id');
            const giveaway =
 
            client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === query) ||
 
            client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === query);
 
 
            if (!giveaway) return interaction.editReply({ content: `**Couldn't** find a **giveaway** with the ID of "**${query}**".`, ephemeral: true});
            const messageId2 = interaction.options.getString('message-id');
            client.giveawayManager.reroll(messageId2).then(() => {
                interaction.editReply({ content: `Your **giveaway** has been **successfuly** rerolled!`});
            })
            .catch((err) => {
                interaction.editReply({ content: `An **error** occured! Please contact **icare#9073** if this issue continues. \n> **Error**: ${err}`, ephemeral: true});
            });
        }
    }
}