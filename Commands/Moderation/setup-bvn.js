const {Message, Client, SlashCommandBuilder, PermissionFlagsBits} = require ("discord.js");
const welcomeSchema = require ("../../Schemas/welcome");
const {model, Shema} = require("mongoose");

module.exports ={
    data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("prepare le message de bienvenue quand quellqu'un rejoin le serveur")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName("salon")
        .setDescription("choisis un salon pour l aparition du message")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("message")
        .setDescription("entre ton message de bienvenue")
        .setRequired(true)
    ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const salonbvn = options.getChannel("salon");
        const messagebvn = options.getString("message");

        welcomeSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {
            if(!data) {
                const newbvn = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: salonbvn.id,
                    Msg: messagebvn,
                });
            }
            interaction.reply({content: "le message de bienvenue à bien été crée", ephemeral: true});
        })
    }

}