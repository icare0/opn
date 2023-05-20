  const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
  const TicketSetup = require('../../Schemas/TicketSetup');
  const config = require('../../config');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('ticket')
      .setDescription('la commande pour faire des tickets')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((option) =>
        option
          .setName('salon')
          .setDescription('choisis un channel ou un ticket sera créer')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addChannelOption((option) =>
        option
          .setName('categories')
          .setDescription('choisis une catégory ou le ticket créer sera placer')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildCategory)
      )
      .addChannelOption((option) =>
        option
          .setName('logs')
          .setDescription('choisis un channel pour les logs')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addRoleOption((option) =>
        option
          .setName('modérateur')
          .setDescription('choisis un rôle modérateur pour le ticket')
          .setRequired(true)
      )
      .addRoleOption((option) =>
        option
          .setName('everyone')
          .setDescription('choisis evereyone pour que tous le monde est accès')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('description')
          .setDescription('descripion du panel.')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('boutton')
          .setDescription('choisis un nom pour le boutton')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('emoji')
          .setDescription('choisis un emoji qui iras sur le boutton')
          .setRequired(true)
      ),
    async execute(interaction) {
      const { guild, options } = interaction;
      try {
        const channel = options.getChannel('salon');
        const category = options.getChannel('categories');
        const transcripts = options.getChannel('logs');
        const handlers = options.getRole('modérateur');
        const everyone = options.getRole('everyone');
        const description = options.getString('description');
        const button = options.getString('boutton');
        const emoji = options.getString('emoji');
        await TicketSetup.findOneAndUpdate(
          { GuildID: guild.id },
          {
            Channel: channel.id,
            Category: category.id,
            Transcripts: transcripts.id,
            Handlers: handlers.id,
            Everyone: everyone.id,
            Description: description,
            Button: button,
            Emoji: emoji,
          },
          {
            new: true,
            upsert: true,
          }
        );
        const embed = new EmbedBuilder().setDescription(description);
        const buttonshow = new ButtonBuilder()
          .setCustomId(button)
          .setLabel(button)
          .setEmoji(emoji)
          .setStyle(ButtonStyle.Primary);
        await guild.channels.cache.get(channel.id).send({
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(buttonshow)],
        }).catch(error => {return});
        return interaction.reply({ embeds: [new EmbedBuilder().setDescription('le pannel du ticket a bien été crée.').setColor('Green')], ephemeral: true});
      } catch (err) {
        console.log(err);
        const errEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
        return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => {return});
      }
    },
  };
  