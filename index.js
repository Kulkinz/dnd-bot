const Discord = require("discord.js");
const client = new Discord.Client();
// Requires file called config.json. Containing {"token":"token"}
const config = require("./config.json");
const fs = require('fs');

// Runs when activated
client.once("ready", () => {
	console.log("Ready!");
	client.user.setPresence({ game: { name: "Rolling a 1", type: 0 } });
	client.user.setStatus("online");
});

// Runs when disconnecting
client.on("disconnect", () => {
	console.log("Shutting down");
	client.user.setStatus("invisible");
});

// Runs when message is sent
client.on('message', message => {

	// Gets the prefix from the config file. {"prefix":"prefix"}
	const prefix = config.prefix;
	// Removes the prefix from message, and then shifts to lowercase
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	// Username of player
	const playerUsername = message.author.username;

	// To prevent addition processing beyond when called upon. As well as to prevent bots from activating.
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	switch(command) {

	case "d20":
		message.channel.send("Rolling a d20.");
		var value = Math.floor(Math.random() * (20)) + 1;
		message.channel.send(value);
		console.log(value);
		break;

	case "prefix":
		// Condition is if the person sending is the owner based on id
		if (message.author.id == config.ownerID) {
			// Gets prefix from command (!prefix + would take the +)
			const newPrefix = message.content.split(" ").slice(1, 2)[0];

			if (typeof newPrefix === "undefined") {
				return;
			} else {
				// Change the configuration in memory
				config.prefix = newPrefix;
				// Responds to changed prefix
				message.channel.send("Prefix changed to " + newPrefix);
				// Console record
				console.log("Prefix changed to " + newPrefix);
				// Save the file
				fs.writeFile("./config.json", JSON.stringify(config), () => console.error);
			}
		} else {
			// Responds to denied user
			message.channel.send("Sorry " + playerUsername + ", but you don't have access to this command.");
			message.channel.send("If you believe this is an error, please check the config.json file, and correct your ownerID.");
			message.channel.send("I mean, if you have access to the file.");
		}
		break;
	}
});

// Allows login
client.login(config.token);