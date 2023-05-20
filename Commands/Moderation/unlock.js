const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const LockSchema =require("../../Schemas/lock");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("unlock un salon")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

        async execute(interaction, client) {
            const { guild, channel } = interaction;

            const embed = new EmbedBuilder()

            if(channel.permissionsFor(guild.id).has("SendMessages"))
            return interaction.reply({
                embeds: [
                    embed.setColor("Aqua").setDescription("ce channel est pas lock")
                ],
                ephemeral: true
            })

            channel.permissionOverwrites.edit(guild.id, {
                SendMessages: null,
            });

            await LockSchema.deleteOne({ ChannelID: channel.id})

            interaction.reply({ embeds: [
                embed.setDescription("le lock à été retiré").setColor("Aqua")
            ]})
    
        }
    }