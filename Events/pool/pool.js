const { ButtonInteraction } = require("discord.js");

const votedMembers = new Set();

module.exports = {
  name: "interactionCreate",
  /***
   * 
   * 
   * @param {ButtonInteraction} interaction
   */


  async execute(interaction) {
    if(!interaction.isButton()) return;

    const splittedArray = interaction.customId.split('-');
    if(splittedArray[0] !== "Poll") return;

    if(votedMembers.has(`${interaction.user.id}-${interaction.message.id}`))
    return interaction.reply({content: "tu a déja voté",ephemeral: true});

    votedMembers.add(`${interaction.user.id}-${interaction.message.id}`);

    const pollEmbed = interaction.message.embeds[0];
    if(!pollEmbed) return interaction.reply({
      content: "contact le dev : je ne trouve pas la poll",
      ephemeral: true
    })      

    const reponse1field = pollEmbed.fields[0];
    const reponse2field = pollEmbed.fields[1];
    const reponse3field = pollEmbed.fields[2];
    const reponse4field = pollEmbed.fields[3];

    const voteCountReply = "ton vote à été prise en compte";

    switch(splittedArray[1]) {
      case "reponse1" : {
          const newreponse1Count = parseInt(reponse1field.value) + 1;
          reponse1field.value = newreponse1Count;

          interaction.reply({content: voteCountReply, ephemeral: true});
          interaction.message.edit({embeds: [pollEmbed]});
      }
      break;
      case "reponse2" : {
          const newreponse2count = parseInt(reponse2field.value) +1;
          reponse2field.value = newreponse2count

          interaction.reply({content: voteCountReply, ephemeral: true});
          interaction.message.edit({embeds: [pollEmbed]});

      }
      break;
      case "reponse3" : {
          const newreponse3count = parseInt(reponse3field.value) +1;
          reponse3field.value = newreponse3count

          interaction.reply({content: voteCountReply, ephemeral: true});
          interaction.message.edit({embeds: [pollEmbed]});

      }
      break;
      case "reponse4" : {
          const newreponse4count = parseInt(reponse4field.value) +1;
          reponse4field.value = newreponse4count

          interaction.reply({content: voteCountReply, ephemeral: true});
          interaction.message.edit({embeds: [pollEmbed]});
      }



    }
  }


}