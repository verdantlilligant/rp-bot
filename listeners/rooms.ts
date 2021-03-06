import { Role } from "discord.js";

import { guild } from "../client";
import { ChannelNotFoundError, ExistingChannelError } from "../config/errors";
import { lineEnd, requireAdmin } from "../helpers/base";
import { CustomMessage } from "../helpers/classes";

import { Action } from "./actions";
import { adjacentRooms, getRoom, parseCommand, sendMessage } from "./baseHelpers";

export const usage: Action = {
  rooms: {
    description: "Lists all rooms that you have visited and can currently access",
    uses: [{
      use: "!rooms"
    }]
  }
};

/**
 * Creates a private room and role
 * Requires admin privileges
 * @param msg the message we are processing
 */
export async function createRoom(msg: CustomMessage): Promise<void> {
  requireAdmin(msg);

  const name: string = parseCommand(msg).params
      .join("");

  if (name === "" || guild.channels.find(c => c.name === name) !== null) {
    throw new ExistingChannelError(name);
  }

  const role: Role = await guild.createRole({
    color: "RANDOM",
    name
  });

  const everyone: string = guild.roles.find(r => r.name === "@everyone").id;

  await guild.createChannel(name, {
    permissionOverwrites: [{
      allow: ["READ_MESSAGES", "SEND_MESSAGES"],
      id: role.id
    }, {
      deny: ["READ_MESSAGES", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
      id: everyone
    }],
    type: "text"
  });

  sendMessage(msg, `Successfully created room ${name}`, true);
}

/**
 * Attempts to destory an existing private room and role
 * Requires admin privileges
 * @param msg the message we are handling
 */
export async function deleteRoom(msg: CustomMessage): Promise<void> {
  requireAdmin(msg);

  const room = await getRoom(msg);

  if (room !== null) {
    const channel = guild.channels.get(room.id)!,
      role: Role = guild.roles.find(r => r.name === name);

    if (channel !== null || role !== null) {
      if (channel !== null) await channel.delete();

      if (role !== null) await role.delete();

      sendMessage(msg, `Deleted room ${name}`, true);
    } else {
      throw new ChannelNotFoundError(name);
    }
  }
}

export async function getAvailableRooms(msg: CustomMessage): Promise<void> {
  return new Promise((resolve: () => void): void => {
    const roomList: string[] = adjacentRooms(msg)
    .sort();

    sendMessage(msg,
      `Here are the rooms you can visit:${lineEnd}${roomList.join(lineEnd)}`,
      true);

    resolve();
  });
}
