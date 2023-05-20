const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const mongoose = require("mongoose");
const { database } = require("../../config");

mongoose.set("strictQuery", true);
// Connect to Mongoose
mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a model for testing purposes
const Test = mongoose.model("Test", { name: String });

module.exports = {
  ownerOnly: true, // Makes the command owner-only.
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong! permet voir le ping du bot et de la db")
    .setDMPermission(false),
  async execute(interaction, client) {
    const icon = interaction.user.displayAvatarURL();
    const tag = interaction.user.tag;
    // Get Mongoose ping
    const dbPingStart = Date.now();
    await Test.findOne();
    const dbPing = Date.now() - dbPingStart;

    const embed = new EmbedBuilder()
      .setTitle("🏓 **PONG!**")
      .setDescription(
        `<:latency:1107364456008253531> | **ping bot:** \`${client.ws.ping}ms\`\n<:DatabaseCheck:1107364787983241398> | **ping database:** \`${dbPing}ms\``
      )
      .setColor("Aqua")
      .setFooter({ text: `demandé par ${tag}`, iconURL: icon })
      .setTimestamp();

    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("btn")
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`relancer`)
        .setEmoji("<a:3042loading:1107366010601873418>")
    );

    const msg = await interaction.reply({ embeds: [embed], components: [btn] });

    const collector = msg.createMessageComponentCollector();
    collector.on("collect", async (i) => {
      if (i.customId == "btn") {
        i.update({
          content: `refresh le ping`,
          embeds: [
            new EmbedBuilder()
              .setTitle("🏓 **PONG!**")
              .setDescription(
                `<a:ping:946754161389748254> | **ping bot:** \`${client.ws.ping}ms\`\n<:data:944588615403597824> | **ping database:** \`${dbPing}ms\``
              )
              .setColor("Blue")
              .setFooter({ text: `demandé par ${tag}`, iconURL: icon })
              .setTimestamp(),
          ],
          components: [btn],
        });
      }
    });
  },
};