

const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`avatar`)
    .setDescription(`affiche l'avatar et la bannière d'un utilisateur`)
    .addUserOption(option => option.setName(`utilisateur`).setDescription(`séléctionne un utilisateur`).setRequired(false)),
    async execute (interaction, client) {
        const usermention = interaction.options.getUser(`utilisateur`) || interaction.user;
        let banner = await (await client.users.fetch(usermention.id, { force: true })).bannerURL({ dynamic: true, size: 4096 });

        const cmp = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Avatar`)
            .setCustomId(`avatar`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Bannière`)
            .setCustomId(`Bannière`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setLabel(`Suprimer`)
            .setCustomId(`delete`)
            .setStyle(ButtonStyle.Danger)
        )

        const cmp2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Avatar`)
            .setCustomId(`avatar`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Bannière`)
            .setCustomId(`Bannière`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setLabel(`Suprimer`)
            .setCustomId(`delete`)
            .setStyle(ButtonStyle.Danger)
        )

        const embed = new EmbedBuilder()
        .setColor(`Aqua`)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setTitle(`Télécharger`)
        .setURL(usermention.displayAvatarURL({ size: 1024, format: `png`, dynamic: true}))
        .setImage(usermention.displayAvatarURL({ size: 1024, format: "png", dynamic: true }))

        const embed2 = new EmbedBuilder()
        .setColor(`Aqua`)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setDescription(banner ? " " : "L'utilisateur n'a pas de Bannière ")
        .setTitle(`Télécharger`)
        .setURL(banner)
        .setImage(banner)

        const message = await interaction.reply({ embeds: [embed], components: [cmp] });
        const collector = await message.createMessageComponentCollector();

        collector.on(`collect`, async c => {
      
            if (c.customId === 'avatar') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Seulement ${interaction.user.tag} peux intéragir avec le bouton`, ephemeral: true})
              }
              
              await c.update({ embeds: [embed], components: [cmp]})
            }

            if (c.customId === 'Bannière') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Seulement ${interaction.user.tag} peux intéragir avec le bouton`, ephemeral: true})
              }
                
              await c.update({ embeds: [embed2], components: [cmp2]})
            }

            if (c.customId === 'delete') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Seulement ${interaction.user.tag} peux intéragir avec le bouton`, ephemeral: true})
              }
              
              interaction.deleteReply();
            }
          })
    }
}