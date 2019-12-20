import { Command, CommandoMessage } from "discord.js-commando";
import Cicero from "../../structures/Client";
import Guild from "../../structures/Guild";

module.exports = class Queue extends Command {

    cicero: Cicero;

    constructor(client: Cicero) {
        super(client, {
            name: "queue",
            group: "voice",
            memberName: "queue",
            description: "Displays the server queue!",
            examples: [ "queue" ],
            ownerOnly: true
        });
        this.cicero = client;
    }

    async run(message: CommandoMessage) {
        let guildData: Guild = this.cicero.guildsData.get(message.guild.id);
        if(!guildData){
            return message.channel.send(":mute: There's no text played actually!");
        }
        message.channel.send(":notepad_spiral: **Cicero queue**\n\n:speaking_head: **Currently playing**:\n```"+guildData.queue[0].text+"```**And "+(guildData.queue.length-1 < 1 ? "no" : guildData.queue.length)+" more texts...**");
    }
};