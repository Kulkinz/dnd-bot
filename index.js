const Discord = require("discord.js");
const client = new Discord.Client();
// Requires file called config.json. Containing {"token":"token"}
const config = require("./config.json");

// Runs when activated
client.once("ready", () => {
	console.log("Ready!");
});

// Runs when message is sent
client.on('message', message => {

	// Gets the prefix from the config file. {"prefix":"prefix"}
	const prefix = config.prefix;
	// Removes the prefix from message, and then shifts to lowercase
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "d20") {
		message.channel.send("Rolling a d20.");
		var value = Math.floor(Math.random() * (20)) + 1;
		message.channel.send(value);
		console.log(value);

	}
});

// Allows login
client.login(config.token);