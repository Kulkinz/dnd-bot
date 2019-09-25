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

// Error handler
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

// Runs when message is sent
client.on('message', message => {

	// Gets the prefix from the config file. {"prefix":"prefix"}
	const prefix = config.prefix;
	// Removes the prefix from message, and then shifts to lowercase
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	// Username of player
	const playerUsername = message.author.username;
	// Time and Date
	const time = new Date().getTime();
	const date = new Date(time);

	// To prevent addition processing beyond when called upon. As well as to prevent bots from activating.
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	console.log(playerUsername + " just tried to run " + command + " at " + date);

	switch(command) {

	case "roll": {
		// Creates variables for use in the try catch
		let number;
		let addition;

		// For both, tries to process, then if there is nothing there, catches the error
		try {
			console.log(args[0]);
			number = args[0].replace(/[^0-9-+]/gi, '');
		} catch (error) {
			number = 0;
		}

		try {
			console.log(args[1]);
			addition = args[1].replace(/[^0-9-+]/gi, '');

		} catch (error) {
			console.log(error);
			addition = 0;
		}

		// Because someone is going to eventually do it
		if (number === "ick") {
			message.channel.send("A dick joke? Really " + playerUsername + "? Low... I took a full night to program this bot and you try to make it say dick? Wow... Im disappointed");
			console.log(playerUsername + " tried to make a dick joke.");
			break;
		}

		// Records number
		console.log("Input: " + number);
		console.log("Addition: " + addition);

		/*
		* Run the dice roll, by taking a value between 0 and 1,
		* multiplying it by the number, adding 1 to it to allow
		* for 0 and the actual number, then returns it.
		*/
		message.channel.send("Rolling a d" + number + ".");
		var value = Math.floor(Math.random() * (number)) + 1;
		var modified = (value + parseInt(addition));
		if (addition === 0) {
			message.channel.send("Rolled: " + value);
		} else {
			message.channel.send("Rolled: " + value + ". With modifier: " + modified);
		}
		console.log("Output: " + value);
		client.user.setPresence({ game: { name: "Rolled a " + value, type: 0 } });
		break;
	}

	case "ping": {
		message.channel.send("Pong!");
		break;
	}

	case "prefix": {
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

	case "github": {
		message.channel.send("Code can be found at: https://github.com/Kulkinz/dnd-bot. So you know it isn't rigged.");
		break;
	}

	case "help": {

		// Sends to channel information that it was DM'd
		message.channel.send("Sent to DMs");

		// Sends to DMs
		message.author.send("@" + playerUsername + ". The current commands are as follows and I quote;");
		message.author.send(prefix + "roll d[number]");
		message.author.send("---Rolls a dice up to the given number.");
		message.author.send(prefix + "github");
		message.author.send("---Links to the github.");

		// If the user is an owner, sends owner commands
		if (message.author.id == config.ownerID) {
			message.author.send("--------ADMIN COMMANDS--------");
			message.author.send(prefix + "prefix [Prefix]");
			message.author.send("---Changes Prefix.");
		}

		// States that all commands are sent. Sent regardless of owner or not
		message.author.send("--------END OF COMMANDS--------");
		break;
	}
	}
});

// Allows login
client.login(config.token);