import {
    VoiceChannel,
    VoiceConnection
} from "discord.js";

export interface TTS {
    text: string;
    language: string;
    author: string;
};

export default class Guild {

    voice: VoiceChannel;
    connection: VoiceConnection;
    volume: number;
    stopped: boolean;
    playing: boolean;
    queue: Array<TTS>

    constructor(voice: VoiceChannel){
        this.voice = voice;
        this.connection = null;
        this.volume = 100;
        this.stopped = false;
        this.playing = false;
        this.queue = new Array();
    }

}