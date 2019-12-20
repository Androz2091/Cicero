import { Command, CommandoMessage } from "discord.js-commando";
import Cicero from "../../structures/Client";

module.exports = class Leave extends Command {

    cicero: Cicero;

    constructor(client: Cicero) {
        super(client, {
            name: "leave",
            group: "voice",
            memberName: "leave",
            description: "Leaves your voice channel.",
            examples: [ "leave" ],
            ownerOnly: true
        });
        this.cicero = client;
    }

    async run(message: CommandoMessage) {
        let channelToLeave = message.guild.me.voice.channel;
        if(!channelToLeave) return message.channel.send(":x: I'm not in a voice channel!");
        if(channelToLeave){
            await channelToLeave.leave();
            message.channel.send(":speak_no_evil: Left **"+channelToLeave.name+"**!");
            this.cicero.guildsData.delete(message.guild.id);
        }
    }
};