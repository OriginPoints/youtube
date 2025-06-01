# IP Geolocation Discord Bot

This project contains two main components:

1. A Cloudflare Worker (`bed.js`) that logs visitor IPs to a Discord webhook
2. A Discord bot (`discord-bot.js`) that can look up geolocation information for IP addresses

## Discord Bot Setup

### Prerequisites

- Node.js 16.9.0 or higher
- A Discord bot token (create one at [Discord Developer Portal](https://discord.com/developers/applications))
- Your Discord application's Client ID

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` template:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file and add your Discord bot token and client ID

### Running the Bot

```
npm start
```

### Adding the Bot to Your Server

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to the "OAuth2" tab
4. In the "URL Generator" section, select the "bot" and "applications.commands" scopes
5. Select the permissions your bot needs (at minimum: "Send Messages", "Embed Links")
6. Copy the generated URL and open it in your browser
7. Select the server where you want to add the bot

## Using the Bot

Once the bot is running and added to your server, you can use the following command:

```
/whois [ip]
```

This will display detailed geolocation information about the provided IP address, including:

- City
- Region
- Country
- Geographic coordinates
- ISP/Organization
- Timezone
- Postal code
- Google Maps link

## Cloudflare Worker

The `bed.js` file contains a Cloudflare Worker that:

1. Captures visitor IP addresses
2. Sends the information to a Discord webhook
3. Redirects visitors to a specified URL

It has special handling for Discord's preview bot to avoid duplicate notifications.

### Deployment

To deploy the Cloudflare Worker:

```
npx wrangler deploy
```

## Notes

- The IPInfo client secret is already included in the Discord bot code
- For better security in a production environment, move the IPInfo token to the `.env` file