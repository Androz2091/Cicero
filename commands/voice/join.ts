import { Command, CommandoMessage } from "discord.js-commando";
import Cicero from "../../structures/Client";

module.exports = class Join extends Command {

    constructor(client: Cicero) {
        super(client, {
            name: "join",
            group: "voice",
            memberName: "join",
            description: "Joins your voice channel.",
            examples: [ "join" ],
            ownerOnly: true
        });
    }

    async run(message: CommandoMessage) {
        let channelToJoin = message.member.voice.channel;
        if(!channelToJoin) return message.channel.send(":x: You have to be in a voice channel or to give me the name of it!");
        if(channelToJoin){
            channelToJoin.join().then(() => {
                message.channel.send(":speak_no_evil: Joined **"+channelToJoin.name+"**!");
            }).catch(() => {
                message.channel.send(":x: I can't join **"+channelToJoin.name+"**...");
            });
        }
    }
};