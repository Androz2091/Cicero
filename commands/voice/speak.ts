interface SpeakArguments {
    language: string;
    text: string;
};

import { Command, CommandoMessage } from "discord.js-commando";
import Cicero from "../../structures/Client";
import getTTS from "../../helpers/getTTS";
import { VoiceConnection } from "discord.js";

module.exports = class Speak extends Command {
    constructor(client: Cicero) {
        super(client, {
            name: "speak",
            group: "voice",
            memberName: "speak",
            description: "Speaks into your voice channel.",
            examples: [ "speak en 1 How are you?", "speak fr 0.25 Comment vas-tu ?" ],
            ownerOnly: true,
            args: [
                {
                    key: "language",
                    prompt: "In what language do you want me to speak? (fr, en, es)",
                    type: "string",
                    oneOf: [ "en", "es", "fr", "it" ]
                },
                {
                    key: "text",
                    prompt: "What do you want me to say?",
                    type: "string",
                    max: 200
                }
            ]
        });
    }

    async run(message: CommandoMessage, args: SpeakArguments) {
        let tts: string = await getTTS(args.language, 1, args.text);
        let voiceConnection: VoiceConnection = null;
        if(!message.guild.me.voice.connection){
            if(message.member.voice.channel){
                let newVoiceConnection = await message.member.voice.channel.join().catch(() => {});
                if(!newVoiceConnection) return message.channel.send(":x: Failed to join your voice channel...");
                else voiceConnection = newVoiceConnection;
            } else {
                return message.channel.send(":x: You must be in a voice channel!");
            }
        } else {
            voiceConnection = message.guild.me.voice.connection;
        }
        let msg = await message.channel.send(":speaking_head: Speaking in **"+voiceConnection.channel.name+"**...");
        let dispatcher = await voiceConnection.play(tts);
        dispatcher.on("finish", () => {
            msg.edit(":speaking_head: Message terminated in **"+voiceConnection.channel.name+"**... I've just stopped to speak.");
        });
    }
};