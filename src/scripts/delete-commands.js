const fs = require('node:fs');
const { REST, Routes } = require('discord.js');

require('dotenv').config();
const token = fs.readFileSync(process.env.DISCORD_TOKEN_FILE, 'utf-8').trim();
const guildId = fs.readFileSync(process.env.DISCORD_GUILD_ID_FILE, 'utf-8').trim();
const clientId = fs.readFileSync(process.env.DISCORD_APP_ID_FILE, 'utf-8').trim();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Delete all guild commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
