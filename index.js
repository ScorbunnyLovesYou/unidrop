const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('among us'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);

const discord = require("discord.js");
const client = new discord.Client({
  disableEveryone: true,
});
module.exports=client
const { Database } = require("quickmongo");

require("discord-buttons")(client);
client.config = require("./config.json");
client.prefix = client.config.default_prefix;
client.db = new Database(client.config.DB);
client.formatDuration = require("./utility/formatDuration");
require("./utility/Player");
client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.colors = require("./utility/colors");
client.embeds = require("./utility/embeds");

require("dotenv").config();
["commands", "events"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.db.on("ready", () => {
  console.log("MONGODB CONNECTED");
});

const mongoose = require("mongoose");

const dbOptions = {
  useNewUrlParser: true,
  autoIndex: false,
  poolSize: 5,
  connectTimeoutMS: 10000,
  family: 4,
  useUnifiedTopology: true,
};
mongoose.connect(client.config.DB, dbOptions);
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
mongoose.connection.on("connected", () => {
  console.log("[DB] DATABASE CONNECTED");
});
mongoose.connection.on("err", (err) => {
  console.log(`Mongoose connection error: \n ${err.stack}`);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

const activities = ['>help | 🌌','Prefix = > | 🌌',`>ping  | 🌌`,`>stats | 🌌`,`>invite | 🌌`];

client.on('ready', () => {
  const updateDelay = 3; // in seconds
  let currentIndex = 0;

  setInterval(() => {
    const activity = activities[currentIndex];
    client.user.setActivity(activity);

    // update currentIndex
    // if it's the last one, get back to 0
    currentIndex = currentIndex >= activities.length - 1 
      ? 0
      : currentIndex + 1;
  }, updateDelay * 1000);

});



client.login(process.env.TOKEN);
