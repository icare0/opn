const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("efface le nombre vous de messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
        option.setName("nombre")
        .setDescription("nombre de messages à effacer")
        .setRequired(true)
    )
    .addUserOption(option =>
        option.setName("utilisateur")
        .setDescription("efface les messages d'un utilisateur")
        .setRequired(false)
        ),
    
    async execute(interaction) {
        const {channel, options} = interaction;

        const nombre = options.getInteger("nombre");
        const utilisateur = options.getUser("utilisateur");

        const messages = await channel.messages.fetch({
            limit: nombre +1,
        });

        const res = new EmbedBuilder()
             .setColor("Aqua")

        if(utilisateur) {
            let i = 0;
            const filtered = [];
        

            (await messages).filter((msg) =>{
                if(msg.author.id === utilisateur.id && nombre > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(` bien effacés ${messages.size} messages de ${utilisateur}`);
                interaction.reply({embeds: [res]}); // ephemeral possible
            });
        } else {
            await channel.bulkDelete(nombre, true).then(messages => {
                res.setDescription(` bien effacés ${messages.size} messages de ce channel`);
                interaction.reply({embeds: [res]}); // ephemeral possible
            });
        }
    }
}