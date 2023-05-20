const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const LockSchema =require("../../Schemas/lock");
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("lock un salon spécifique")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option => 
        option.setName("temps")
        .setDescription("spécifie un temps de lock pour le salon")
        .setRequired(false)
        )
        .addStringOption(option => option.setName("raison")
        .setDescription("spécifie une raison de lock du salon")
        .setRequired(false)
        ),

        async execute(interaction, client) {
            const { guild, channel, options } = interaction;

        const raison = options.getString("raison") || "pas de raison spécifié"
        const temps = options.getString("temps") || "pas de temps spécifié"

        const embed = new EmbedBuilder()

        if(!channel.permissionsFor(guild.id).has("SendMessages"))
        return interaction.reply({
            embeds: [
                embed.setColor("Aqua").setDescription("ce salon est déja lock")
            ],
            ephemeral: true
        })

        channel.permissionOverwrites.edit(guild.id, {
            SendMessages: false,
        })

        interaction.reply({ embeds: [embed.setColor("Aqua").setDescription(`ce salon est maintenant lock pendant ${temps} pour ${raison}`)
        ]
        })
        const Temps = options.getString("temps")
        if (Temps) {
            const ExpireDate = Date.now() + ms(Temps);
            LockSchema.create({
                GuildID: guild.id,
                ChannelID: channel.id,
                Temps: ExpireDate,
            });

            setTimeout(async () => {
                channel.permissionOverwrites.edit(guild.id, {
                    SendMessages: null,
                });

                interaction.editReply({ embeds: [
                    embed.setColor("Aqua").setDescription(`le lock pour la raison ${raison} et pour le temps ${temps} a été enlevé`)
                ]
            })
            .catch(() => {});

            await LockSchema.deleteOne({ ChannelID: channel.id})
            }, ms(Temps))
        }
    }




}