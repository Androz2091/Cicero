import { Client } from "discord.js-commando";
import Logger from "../helpers/logger";

export default class Cicero extends Client {
    logger: Logger;
    constructor(options: object){
        super(options);
        this.logger = new Logger();
    }
};