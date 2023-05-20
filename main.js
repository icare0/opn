const Discord= require('discord.js');
const client = new Discord.Client({intents: 3276799});
const config = require('./config');
const {ActivityType} = require("discord.js")
const GiveawaysManager = require("./Schemas/giveway");
const logs = require("discord-logs");
const { connect, mongoose } = require('mongoose');
const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
const { handleLogs } = require('./Handlers/handleLogs');
require('@colors/colors');
client.commands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.selectMenus = new Discord.Collection();
client.modals = new Discord.Collection();
client.giveawayManager = new GiveawaysManager(client, {
  default: {
    botsCanWin: false,
    embedColor: "#a200ff",
    embedColorEnd: "#550485",
    reaction: "🎉",
  },
});



logs(client, {
  debug: true,
});

client
  .login(config.token)
  .then(() => {
    console.clear();
    console.log('[Discord API] '.green + client.user.username + ' is been logged.');
    client.user.setPresence({ activities: [{ name: config.status, type: ActivityType.Listening }]});
    mongoose.set('strictQuery', true);
    connect(config.database, {
    }).then(() => {
    console.log('[MongoDB API] '.green + 'is now connected.')
    loadEvents(client);
    loadCommands(client);
    handleLogs(client);
    });
    })
  .catch((err) => console.log(err));

client.on("messageCreate", async (message) => {
  if (message.mentions.has(client.user)) {
    message.reply("Salut ! Pour connaître toutes mes commandes, tape `/help`.");
  }
  if (message.content === "help") {
    message.reply("salut bg ta oublié le /")
  }
  if (message.content.includes("discord.gg")) {
    if (message.member.roles.cache.has("role modérateur")) {
      return;
    } else {
      await message.delete();
      await message.channel.send({
        content: `${message.author} vous ne pouvez pas poster ce lien.`,
      });
    }
  }
});