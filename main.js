const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } = require('discord.js');

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Create slash commands
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.token); // GitHub Secret

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.client_id, process.env.guild_id),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();

// Bot ready
client.once(Events.ClientReady, () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

// Slash command interaction
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

// Message response
client.on(Events.MessageCreate, message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes('hello')) {
    message.reply('hi');
  }
});

client.login(process.env.token); // GitHub Secret
