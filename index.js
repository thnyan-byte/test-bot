require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = "!";

// ✅ Bot is ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity("!help for commands");
});

// 📩 Message handler
client.on("messageCreate", async (message) => {
  // Ignore bots and messages without prefix
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // 📌 !ping
  if (command === "ping") {
    const latency = Date.now() - message.createdTimestamp;
    message.reply(`🏓 Pong! Latency: **${latency}ms** | API: **${client.ws.ping}ms**`);
  }

  // 📌 !hello
  else if (command === "hello") {
    message.reply(`👋 Hello, **${message.author.username}**! Hope you're doing well!`);
  }

  // 📌 !echo <text>
  else if (command === "echo") {
    if (!args.length) return message.reply("❌ Please provide text to echo!");
    message.channel.send(args.join(" "));
  }

  // 📌 !roll <sides>
  else if (command === "roll") {
    const sides = parseInt(args[0]) || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    message.reply(`🎲 You rolled a **${result}** (d${sides})`);
  }

  // 📌 !userinfo
  else if (command === "userinfo") {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(target.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 User Info - ${target.username}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "Username", value: target.tag, inline: true },
        { name: "ID", value: target.id, inline: true },
        { name: "Joined Server", value: member?.joinedAt?.toDateString() || "N/A", inline: true },
        { name: "Account Created", value: target.createdAt.toDateString(), inline: true }
      )
      .setColor(0x5865f2)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }

  // 📌 !serverinfo
  else if (command === "serverinfo") {
    const { guild } = message;

    const embed = new EmbedBuilder()
      .setTitle(`🖥️ Server Info - ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true },
        { name: "Created", value: guild.createdAt.toDateString(), inline: true },
        { name: "Channels", value: `${guild.channels.cache.size}`, inline: true }
      )
      .setColor(0x57f287)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }

  // 📌 !help
  else if (command === "help") {
    const embed = new EmbedBuilder()
      .setTitle("📖 Bot Commands")
      .setDescription("Here are all available commands:")
      .addFields(
        { name: "`!ping`", value: "Check bot latency" },
        { name: "`!hello`", value: "Get a greeting" },
        { name: "`!echo <text>`", value: "Repeat your text" },
        { name: "`!roll [sides]`", value: "Roll a dice (default: 6)" },
        { name: "`!userinfo [@user]`", value: "Get user information" },
        { name: "`!serverinfo`", value: "Get server information" },
        { name: "`!help`", value: "Show this menu" }
      )
      .setColor(0xfee75c)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
