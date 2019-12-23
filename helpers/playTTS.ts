import { VoiceConnection } from "discord.js";
import getTTS from "./getTTS";
import Cicero from "../structures/Client";
import { CommandoMessage } from "discord.js-commando";
import { TTS } from "../structures/Guild";

const playTTS = async (vConnection: VoiceConnection, ttsInfos: TTS, client: Cicero, message: CommandoMessage) => {
    let guildData = client.guildsData.get(message.guild.id);
    if(!guildData) return;
    if(guildData.queue.length < 1){
        client.guildsData.delete(message.guild.id);
        return message.channel.send(":white_check_mark: All your texts were read!");
    }
    let tts = await getTTS(ttsInfos.language, 1, ttsInfos.text);
    let dispatcher = await vConnection.play(tts);
    let msg = await message.channel.send(":speaking_head: Speaking in **"+vConnection.channel.name+"**...\n\n**Content**:\n```\n"+ttsInfos.text+"\n```");
    guildData.playing = true;
    dispatcher.on("finish", () => {
        guildData.queue.shift();
        msg.edit(":speaking_head: Message terminated in **"+vConnection.channel.name+"**... I've just stopped to speak.\n\n**The content was**:\n```\n"+ttsInfos.text+"\n```");
        return playTTS(vConnection, guildData.queue[0], client, message);
    });
};

export default playTTS;