const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("montre la liste des commandes disponibles du bot"),

    async execute(interaction) {
        const helpmenu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("menu")
                .setPlaceholder("séléctionne la catégoris souhaité")
                .addOptions(
                    {
                        label: "💡 commande utile",
                        description: "montre toute les commandes utiles",
                        value: "menu1"
                    },

                    {
                        label: "🛠️ commande de modération",
                        description: "montre toute les commandes de modérations",
                        value: "menu2"
                    },

                    {
                        label: "📝 commande info",
                        description: "montre toute les commandes info",
                        value: "menu3"
                    },
                ),
        );


        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle(' <:pung:1089116019013976184> voici les commandes disponibles par le bot shortest')
            .setDescription("**choisissez une catégories**")
            .setTimestamp()
        
        const publicem = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("<:6_:1095962392950751242> commande utile")
            .setDescription("`/avatar`permet voir l'avatar d'un utilisateur\n`/utilisateur` permet de voir les informations d'un compte\n")
            .setTimestamp()
            .setFooter({text: "si vous souhaiter de nouvelle commande, hésité a me demander💚"})
        

        const modem = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle(" <:mb_certified_moderator:1101858684398747718> commande de modération")
            .setDescription("**voici toutes les commandes de modérations**")
            .addFields(
                { name: ' ', value: "`/ban`: Ban un utilisateur\n`/unban`: Unban un utilisateur\n`/kick`: Kick un utilisateur\n`/mute`: Mute un utilisateur\n`/unmute`: Unmute un utilisateur\n`/clear`: efface le nombre de message voulus\n `/lock`: lock un salon\n `/unlock`: unlock un salon\n" },
                { name: ':newspaper2: nouveauté', value: "**/sondage**: permet de faire un sondage\n **/Notes**: permet de mettre une notes sur un utilisateur\n **/giveaway**: permet de créer un giveaway\n **/embed**: permet de faire un embed\n **/setup-log**: permet de mettre de choisir un channel ou mettre les logs\n **/enregistrement**: permet d enregistrer toute perssone inscrit dans un googles sheet\n" },
            )
            .setTimestamp()
            .setFooter({text: "si vous souhaiter de nouvelle commande, hésité a me demander💚"})
        
        const info = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle(" <:pung:1089116019013976184> commande d'information")
            .setDescription("`/help` permet de voir toute les commandes du bot\n`/ping`permet de voir la  latence du bot\n")
            .setTimestamp()
            .setFooter({text: "si vous souhaiter de nouvelle commande, hésité a me demander💚"})

        const message = await interaction.reply({embeds: [embed], components: [helpmenu]})

        const collector = await message.createMessageComponentCollector()

        collector.on(`collect`, async (i) => {
            if (i.customId === 'menu') {
                const value = i.values[0];
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Seulement ${interaction.user.tag} peux intéragir avec le menu`, ephemeral: true})
                }
                if (value === "menu1") {
                    await i.update({embeds: [publicem], components: [helpmenu]})
                }

                if (value === "menu2") {
                    await i.update({embeds: [modem], components: [helpmenu]})
                }

                if (value === "menu3") {
                    await i.update({embeds: [info], components: [helpmenu]})
                }
            }

        })
    }
}