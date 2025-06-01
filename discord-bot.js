const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');

// Configuration
const TOKEN = process.env.DISCORD_BOT_TOKEN; // Set this as an environment variable
const CLIENT_ID = process.env.CLIENT_ID; // Set this as an environment variable
const IPINFO_TOKEN = 'o2Iuv5ol_VhpA6M-6g_21MEGDMkA0u7l'; // Your IPInfo token

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    registerCommands();
});

// Define the slash command
const commands = [
    new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Get geolocation information for an IP address')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('The IP address to look up')
                .setRequired(true))
        .toJSON()
];

// Register slash commands
async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        const rest = new REST({ version: '10' }).setToken(TOKEN);

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'whois') {
        const ip = interaction.options.getString('ip');
        
        try {
            await interaction.deferReply(); // Show "Bot is thinking..." message
            
            // Get IP info from ipinfo.io
            const response = await axios.get(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
            const data = response.data;
            
            // Format the location data
            const embed = {
                title: `IP Information for ${ip}`,
                color: 0x0099ff,
                fields: [
                    { name: 'City', value: data.city || 'Unknown', inline: true },
                    { name: 'Region', value: data.region || 'Unknown', inline: true },
                    { name: 'Country', value: data.country || 'Unknown', inline: true },
                    { name: 'Location', value: data.loc || 'Unknown', inline: true },
                    { name: 'ISP', value: data.org || 'Unknown', inline: true },
                    { name: 'Timezone', value: data.timezone || 'Unknown', inline: true },
                    { name: 'Postal Code', value: data.postal || 'Unknown', inline: true }
                ],
                footer: {
                    text: 'IP Geolocation powered by ipinfo.io'
                },
                timestamp: new Date()
            };
            
            // If we have coordinates, add a Google Maps link
            if (data.loc) {
                const [lat, long] = data.loc.split(',');
                embed.fields.push({
                    name: 'Map',
                    value: `[View on Google Maps](https://www.google.com/maps?q=${lat},${long})`,
                    inline: false
                });
            }
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching IP information:', error);
            await interaction.editReply({ content: 'Error fetching IP information. Please check if the IP address is valid.' });
        }
    }
});

// Login to Discord with your client's token
client.login(TOKEN);

console.log('Discord bot is starting...');