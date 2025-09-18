require('dotenv').config();
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Register slash command (/ping)
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

client.once(Events.ClientReady, () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on(Events.MessageCreate, message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes('hello')) {
    message.reply('hi');
  }
});

client.login(process.env.DISCORD_TOKEN);
