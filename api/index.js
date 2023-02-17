require("dotenv").config();
const Discord = require("discord.js");

async function getStatus(user) {

  const statuses = user.presence.clientStatus;
  
  if (!statuses) {
    return "offline";
  }

  const status = statuses.desktop || statuses.mobile || statuses.web;

  return status;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=30");

  const { id } = req.query;

  const client = new Discord.Client();

  client.login(process.env.DISCORD_BOT_TOKEN).then(async () => {
    const member = await client.guilds.fetch(process.env.DISCORD_GUILD_ID).then(async (guild) => {
      return await guild.members
        .fetch({
          user: id
        })
        .catch((error) => {
          return error;
        });
    });
    client.destroy();

    let status;
    if (member instanceof Discord.DiscordAPIError) {
      status = "offline"
    } else {
      status = await getStatus(member.user);
    }

    return res.send({status: status});
  });
};
