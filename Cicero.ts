import * as config from "./config.json";
import { join } from "path";

import { ActivityType } from "discord.js";
import Cicero from "./structures/Client";

const client = new Cicero({
    commandPrefix: config.prefix,
    owner: config.owners,
    nonCommandEditable: true
});

client.registry
.registerGroups([ ["voice", "Voice"] ])
.registerDefaultTypes()
.registerDefaultGroups()
.registerDefaultCommands()
.registerCommandsIn(join(__dirname, "commands"));

client.on("ready", () => {
    client.logger.log("Ready in as "+client.user.tag+" to serve "+client.guilds.size+" servers. ");
    client.voice.connections.forEach((connection) => connection.disconnect());
    client.user.setActivity(config.status.name, {
        url: config.status.options.url,
        type: config.status.options.type as ActivityType
    });
});

client.login(config.token);