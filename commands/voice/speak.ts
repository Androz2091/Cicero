interface SpeakArguments {
    language: string;
    text: string;
};

import { Command, CommandoMessage } from "discord.js-commando";
import Cicero from "../../structures/Client";
import { VoiceConnection } from "discord.js";
import Guild from "../../structures/Guild";
import playTTS from "../../helpers/playTTS";

module.exports = class Speak extends Command {

    cicero: Cicero;

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
        this.cicero = client;
    }

    async run(message: CommandoMessage, args: SpeakArguments) {
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
        let guildData: Guild = this.cicero.guildsData.get(message.guild.id);
        if(!guildData){
            guildData = new Guild(voiceConnection.channel);
            guildData.connection = voiceConnection;
            this.cicero.guildsData.set(message.guild.id, guildData);
        }
        guildData.queue.push({
            text: args.text,
            language: args.language,
            author: message.author.tag
        });
        if(guildData.playing){
            return message.channel.send(":information_source: The text was added to the server queue!");
        }
        playTTS(voiceConnection, guildData.queue[0], this.cicero, message);
    }
};