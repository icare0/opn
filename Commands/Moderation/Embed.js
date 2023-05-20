const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Envoyer un embed personnalisé")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        let Modal = new ModalBuilder()
            .setCustomId('report')
            .setTitle('Créé ton embed')

        let question1 = new TextInputBuilder()
            .setCustomId('titre')
            .setLabel('Quel titre voulez-vous mettre ?')
            .setRequired(false)
            .setPlaceholder('Ecrit ici... (facultatif)')
            .setStyle(TextInputStyle.Short)

        let question2 = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("Quelle description voulez-vous mettre ?")
            .setRequired(true)
            .setPlaceholder('Ecrit ici...')
            .setStyle(TextInputStyle.Paragraph)

        let question3 = new TextInputBuilder()
            .setCustomId('couleur')
            .setLabel('Quelle couleur voulez-vous mettre ?')
            .setRequired(false)
            .setPlaceholder('Dans ce format : #3dffcc (facultatif)')
            .setStyle(TextInputStyle.Short)

        let question4 = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel('Quelle footer voulez-vous mettre ?')
            .setRequired(false)
            .setPlaceholder('Ecrit ici... (facultatif)')
            .setStyle(TextInputStyle.Short)

        let question5 = new TextInputBuilder()
            .setCustomId('timestamp')
            .setLabel('Voulez-vous mettre le timestamp ?')
            .setRequired(false)
            .setPlaceholder('oui/non (facultatif)')
            .setStyle(TextInputStyle.Short)

        let ActionRow1 = new ActionRowBuilder().addComponents(question1);
        let ActionRow2 = new ActionRowBuilder().addComponents(question2);
        let ActionRow3 = new ActionRowBuilder().addComponents(question3);
        let ActionRow4 = new ActionRowBuilder().addComponents(question4);
        let ActionRow5 = new ActionRowBuilder().addComponents(question5);

        Modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5)

        await interaction.showModal(Modal)

        try {

            let reponse = await interaction.awaitModalSubmit({ time: 300000 })

            let titre = reponse.fields.getTextInputValue('titre')
            let description = reponse.fields.getTextInputValue('description')
            let couleur = reponse.fields.getTextInputValue('couleur')
            let footer = reponse.fields.getTextInputValue('footer')
            let timestamp = reponse.fields.getTextInputValue('timestamp')

            const Embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:grey_exclamation: **Votre embed à été envoyer avec succès !**`)

            if (!couleur) couleur = "Blue"
            if (!footer) footer = ' '
            if (!titre) titre = ' '
            if (!description) description = ' '

            let Embed1 = new EmbedBuilder()
                .setColor(`${couleur}`)
                .setTitle(`${titre}`)
                .setDescription(`${description}`)
                .setFooter({ text: `${footer}` })

            if (reponse.fields.getTextInputValue('timestamp') === 'oui') Embed1.setTimestamp()
            if (!reponse.fields.getTextInputValue('timestamp') === 'oui') return;

            await interaction.channel.send({ embeds: [Embed1] })

            await reponse.reply({ embeds: [Embed], ephemeral: true })


        } catch (err) { return; }
    }
}