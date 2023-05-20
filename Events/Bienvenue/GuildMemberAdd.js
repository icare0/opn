const {EmbedBuilder, GuildMember, WelcomeChannel} = require('discord.js');
const Schema = require("../../Schemas/welcome");

module.exports = {
    name: "guildMemberAdd",
    async execute (member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if (!data) return;

            let channel = data.Channel;
            let Msg = data.Msg || "";

            const {user, guild} = member;
            const avatar = (`${user.displayAvatarURL()}`)
            const salonbvn = member.guild.channels.cache.get(data.Channel);

            const WelcomeEmbed = new EmbedBuilder()
            .setTitle("**nouveau membre!**")
            .setDescription(data.Msg)
            .setColor("NotQuiteBlack")
            .setThumbnail(avatar)
            .setTimestamp();

            salonbvn.send({embeds: [WelcomeEmbed]});
        })
    }

}