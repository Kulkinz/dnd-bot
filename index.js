const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.once("ready", () => {
	console.log("Ready!");
});

client.on('message', message => {
	if (message.content === "%d20") {
		message.channel.send("Rolling a d20.");
		var value = Math.floor(Math.random() * (+20 - +1)) + +1;
		message.channel.send(value);
		console.log(value);

	}
});

client.login(config.token);