const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("sondage")
    .setDescription("crée un sondage")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option
        .setName("question")
        .setDescription("question du sondage")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reponse1")
        .setDescription("réponse 1 du sondage")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reponse2")
        .setDescription("réponse 2 du sondage")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("reponse3")
        .setDescription("réponse 3 du sondage")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("reponse4")
        .setDescription("réponse 4 du sondage")
        .setRequired(false)
    ),

async execute(interaction) {
    const sondageQuestion = interaction.options.getString("question");
    const reponse1 = interaction.options.getString("reponse1");
    const reponse2 = interaction.options.getString("reponse2");
    const reponse3 = interaction.options.getString("reponse3");
    const reponse4 = interaction.options.getString("reponse4");

    const sondageEmbed = new EmbedBuilder()
    .setDescription("**Question**\n" + sondageQuestion)
    .setColor("Aqua")

    if (reponse1) {
      sondageEmbed.addFields([
        { name: `${reponse1}`, value: '0', inline: true}
      ])
    }

    if (reponse2) {
      sondageEmbed.addFields([
        { name: `${reponse2}`, value: '0', inline: true }
      ])
    }

    if (reponse3) {
      sondageEmbed.addFields([
        { name: `${reponse3}`, value: '0', inline: true }
      ])
    }

    if (reponse4) {
      sondageEmbed.addFields([
        { name: `${reponse4}`, value: '0', inline: true }
      ])
    }


    const replyObject = await interaction.reply({embeds: [sondageEmbed], fetchReply: true});

    const pollButtons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel(`${reponse1}`)
        .setCustomId(`Poll-reponse1-${replyObject.id}`)
        .setStyle(ButtonStyle.Success),
      )
  
      if (reponse2) {
        pollButtons.addComponents(
          new ButtonBuilder()
          .setLabel(`${reponse2}`)
          .setCustomId(`Poll-reponse2-${replyObject.id}`)
          .setStyle(ButtonStyle.Success),
        )
      }
      if (reponse3) {
        pollButtons.addComponents(
          new ButtonBuilder()
          .setLabel(`${reponse3}`)
          .setCustomId(`Poll-reponse3-${replyObject.id}`)
          .setStyle(ButtonStyle.Success),
        )
      }
      if (reponse4) {
        pollButtons.addComponents(
          new ButtonBuilder()
          .setLabel(`${reponse4}`)
          .setCustomId(`Poll-reponse4-${replyObject.id}`)
          .setStyle(ButtonStyle.Success),
        )
      }

    interaction.editReply({components: [pollButtons]})

    module.exports = {
        name: 'interactionCreate',
        async execute(interaction) {
          if (!interaction.isButton()) return;
      
          const splittedArray = interaction.customId.split('-');
          if (splittedArray[0] !== 'Poll') return;
      
          const key = `${interaction.user.id}-${interaction.message.id}`;
          if (votedMembers.has(key)) {
            return interaction.reply({
              content: 'tu as déjà voté!',
              ephemeral: true,
            });
          }
          votedMembers.add(key);
      
          const pollEmbed = interaction.message.embeds[0];
          if (!pollEmbed) {
            return interaction.reply({
              content: 'Poll non trouvé, contacte le dev.',
              ephemeral: true,
            });
          }
      
          const reponse1 = pollEmbed.fields[0];
          const reponse2 = pollEmbed.fields[1];
          const reponse3 = pollEmbed.fields[2];
          const reponse4 = pollEmbed.fields[3];
      
          const replyContent = 'Ton vote a été pris en compte.';
      
          switch (splittedArray[1]) {
            case 'Poll-reponse1': {
              const newReponse1Count = parseInt(reponse1.value) + 1;
              reponse1.value = newReponse1Count;
      
              interaction.reply({content: replyContent, ephemeral: true})
              interaction.message.edit({embeds: [pollEmbed]});
            }
            break;
            case 'Poll-reponse2': {
              const newReponse2Count = parseInt(reponse2.value) + 1;
              reponse2.value = newReponse2Count;
      
              interaction.reply({content: replyContent, ephemeral: true})
              interaction.message.edit({embeds: [pollEmbed]});
            }
            break;
            case 'Poll-reponse3': {
              const newReponse3Count = parseInt(reponse3.value) + 1;
              reponse3.value = newReponse3Count;
      
              interaction.reply({content: replyContent, ephemeral: true})
              interaction.message.edit({embeds: [pollEmbed]});
            }
            break;
            case 'Poll-reponse4': {
              const newReponse4Count = parseInt(reponse4.value) + 1;
              reponse4.value = newReponse4Count;
      
              interaction.reply({content: replyContent, ephemeral: true})
              interaction.message.edit({embeds: [pollEmbed]});
              
            }
            break;
          }
        }
      };
    }
}      