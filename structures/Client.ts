import { Client } from "discord.js-commando";
import { Collection, Snowflake } from "discord.js";
import Guild from "./Guild";
import Logger from "../helpers/logger";

export default class Cicero extends Client {

    logger: Logger;
    guildsData: Collection<Snowflake, Guild>;

    constructor(options: object){
        super(options);
        this.logger = new Logger();
        this.guildsData = new Collection();
    }

};