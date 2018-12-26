import * as Discord from 'discord.js';
import { initGuild } from './helper';
import { config } from './config/config';
import { RoomManager } from './rooms/roomManager';
import { Room, RoomAttributes } from './rooms/room';

const client = new Discord.Client();
let guild: Discord.Guild;

client.on("ready", () => {
  guild = client.guilds.find((g: Discord.Guild) => g.name === config.guildName);
  initGuild(guild);
  RoomManager.create(__dirname + "/rooms/custom", true);
});

client.login(config.botToken);
