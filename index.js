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

let pingCounter = 0;

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

	if (command !== "ping") {
		pingCounter = 0;
	}

	switch(command) {

	case "roll": {
		// Creates variables for use in the try catch
		let number;
		let addition;

		// For both, tries to process, then if there is nothing there, catches the error
		try {
			// Replaces anything not included by the [^] with nothing so that only numbers remain
			number = args[0].replace(/[^0-9-+]/gi, '');
		} catch (error) {
			number = 0;
		}

		try {
			addition = args[1].replace(/[^0-9-+]/gi, '');
		} catch (error) {
			addition = 0;
		}

		// Records number
		console.log("Input: " + number + " Addition: " + addition);

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

	case "multiroll": {
		// Creates variables for use in the try catch
		let number;
		let times;
		let addition;
		let sum;

		// For all, tries to process, then if there is nothing there, catches the error
		try {
			// Replaces anything not included by the [^] with nothing so that only numbers remain
			number = args[0].replace(/[^0-9-+]/gi, '');
		} catch (error) {
			number = 0;
		}

		try {
			times = args[1].replace(/[^0-9]/gi, '');
			if (message.author.id !== config.ownerID) {
				if (times > 20) {times = 20;}
			}
		} catch (error) {
			times = 1;
		}

		try {
			addition = args[2].replace(/[^0-9-+]/gi, '');
		} catch (error) {
			addition = 0;
		}

		if (args[3] === "true") {
			sum = true;
		} else {
			sum = false;
		}

		// Records number
		console.log("Input: " + number + " Times: " + times + " Addition: " + addition);

		/*
		* Run the dice roll, by taking a value between 0 and 1,
		* multiplying it by the number, adding 1 to it to allow
		* for 0 and the actual number, then returns it.
		* Loops over with the set amount of times, and if
		* sum is true, sums up the number.
		*/
		message.channel.send("Rolling a d" + number + " " + times + " times.");

		let totalValue = "";
		let totalModified = "";
		let totalValueSum = 0;
		let totalModifiedSum = 0;

		for (let index = 0; index < times; index++) {
			value = Math.floor(Math.random() * (number)) + 1;
			modified = (value + parseInt(addition));

			if (index > 0) {
				totalValue = totalValue + ", ";
				totalModified = totalModified + ", ";
				if (sum === true) {
					totalValueSum = totalValueSum + value;
					totalModifiedSum = totalModifiedSum + modified;
				}
			}
			totalValue = totalValue + value;
			totalModified = totalModified + modified;
		}
		if (addition === 0) {
			message.channel.send("Rolled: " + totalValue);
			if (sum === true) {message.channel.send("Sum: " + totalValueSum);}
		} else {
			message.channel.send("Rolled: " + totalValue + ".");
			if (sum === true) {message.channel.send("Sum: " + totalValueSum);}
			message.channel.send("With modifier: " + totalModified + ".");
			if (sum === true) {message.channel.send("Sum: " + totalModifiedSum);}
		}
		console.log("Output: " + totalValue);
		client.user.setPresence({ game: { name: "Rolled a " + value, type: 0 } });
		break;
	}

	case "ping": {
		if (pingCounter == 7) {
			message.channel.send("Im still alive okay?");
			pingCounter++;
		} else if (pingCounter == 12) {
			message.channel.send("Plz stop");
			pingCounter++;
		} else if (pingCounter >= 15) {
			pingCounter++;
		} else {
			message.channel.send("Pong!").then((msg) => {
				// Amends message with the time taken.
				msg.edit("Pong! Took " + (new Date().getTime() - message.createdTimestamp) + " ms to respond");
			});
			pingCounter++;
		}
		break;
	}

	// Secret command. Cole wanted a pong command.

	case "pong": {
		message.channel.send("the same thing as ping - Cole Dewis 2019");
		break;
	}

	case "isaiah": {

		const user = message.author.id;

		const record = '\r\n' + "<@" + user + ">";
		const file = config.file;

		fs.appendFile(file, record, function(err) {
			if (err) throw err;
		});

		message.channel.send("<@596693413651546114>");
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

		// Sends to DMs. Creates embed, and sends it.
		const helpEmbed = new Discord.RichEmbed()
			.setColor('#ab2c85')
			.setTitle("Commands")
			.setDescription(playerUsername + ". The current commands are as follows and I quote;")
			.addField(prefix + "help", "This command.")
			.addField(prefix + "roll d[number] <+/-modifier>", "Rolls a dice up to the given number. Can set an optional modifier.")
			.addField(prefix + "multiroll d[number] <amount> <+/-modifier> <sum=true/false>", "Rolls multiple dice up to the given number. Can set amount, modifier, or if you would like to sum the numbers up.")
			.addField(prefix + "github", "Links to the github.")
			.addField(prefix + "ping", "Pong!")
			.setTimestamp();

		message.author.send(helpEmbed);

		// Admin commands
		const adminEmbed = new Discord.RichEmbed()
			.setColor('f542b9')
			.setTitle("Admin Commands")
			.addField(prefix + "prefix [Prefix]", "Changes Prefix.")
			.setTimestamp();

		// If the user is an owner, sends owner commands.
		if (message.author.id == config.ownerID) {
			message.author.send(adminEmbed);
		}
		break;
	}
	}
});

// Allows login
client.login(config.token);