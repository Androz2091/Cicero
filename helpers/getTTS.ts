import url from "url";
import { get, WumpResponse } from "wumpfetch";

const XL = (a: any, b: any) => {
    for (let c = 0; c < b.length - 2; c += 3) {
        let d = b.charAt(c + 2);
        d = d >= "a" ? d.charCodeAt(0) - 87 : Number(d);
        d = b.charAt(c + 1) == "+" ? a >>> d : a << d;
        a = b.charAt(c) == "+" ? a + d & 4294967295 : a ^ d;
    }
    return a;
}

const generateToken = (text: any, key: any) => {
    let a = text, b = key, d = b.split(".");
    b = Number(d[0]) || 0;
    let e = [], f = 0;
    for (let g = 0; g < a.length; g++) {
        let m = a.charCodeAt(g);
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
        e[f++] = m >> 18 | 240,
        e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
        e[f++] = m >> 6 & 63 | 128),
        e[f++] = m & 63 | 128);
    }
    a = b;
    for (f = 0; f < e.length; f++) {
        a += e[f];
        a = XL(a, "+-a^+6");
    }
    a = XL(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a = a % 1E6;
    return `${a.toString()}.${(a ^ b)}`;
};

/**
 * Gets audio from a text to a Readable Stream
 * @param {string} language 
 * @param {number} speed
 * @param {string} text
 * @returns {string} URL: the Readable Stream
 */
const getTTS = async (language: string, speed: number, text: string) => {
    let content: WumpResponse = await get("https://translate.google.com").send();
    let expressions: Array<string> = [ "TKK='(\\d+.\\d+)';", "tkk:'(\\d+.\\d+)'" ];
    let matches: Array<RegExpMatchArray> = expressions.map((expr) => String(content.body).match(expr)).filter((res) => res);
    let key: string = matches[0][1];
    return new Promise<string>(async (resolve, reject) => {
        let tts: string =  "https://translate.google.com/translate_tts" + url.format({
            query: {
                ie: "UTF-8",
                q: text,
                tl: language || "en",
                total: 1,
                idx: 0,
                textlen: text.length,
                tk: generateToken(text, key),
                client: "t",
                prev: "input",
                ttsspeed: speed || 1
            }
        });
        resolve(tts);
    });
};

export default getTTS;