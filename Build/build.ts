import { resolve, join } from "path";
import { write } from "bun";
/**
 * General Parts
 * It's not include the special parts
 */
import Cloudflare from "./assets/general/Cloudflare.json";
import Discord from "./assets/general/Discord.json";
import Google from "./assets/general/Google.json";
import GitHub from "./assets/general/GitHub.json";
import Telegram from "./assets/general/Telegram.json";
import Twitter from "./assets/general/Twitter.json";
import Wiki from "./assets/general/Wiki.json";
import YouTube from "./assets/general/YouTube.json";
import General from "./assets/General.json";
/**
 * Special Parts
 */
import Block from "./assets/Block.json";
import OpenAI from "./assets/OpenAI.json";
import Netflix from "./assets/Netflix.json";
import Speedtest from "./assets/Speedtest.json";

type RuleObj = {
  info: {
    Total: number;
    DOMAIN: number;
    "DOMAIN-SUFFIX": number;
    "DOMAIN-SET": number;
    "IP-ASN": number;
    "URL-REGEX": number;
    "DOMAIN-KEYWORD": number;
  };
  value: string[];
};

const defaultInfo = {
  Total: 0,
  DOMAIN: 0,
  "DOMAIN-SUFFIX": 0,
  "DOMAIN-SET": 0,
  "IP-ASN": 0,
  "URL-REGEX": 0,
  "DOMAIN-KEYWORD": 0,
};

const parseDataToRuleObj = (data: Record<string, string[]>): RuleObj => {
  const value: string[] = [];
  const info = { ...defaultInfo };
  Object.entries(data).forEach(([k, v]) => {
    info.Total += v.length;
    info[k] += v.length;
    v.forEach((it) => {
      value.push(`${k}, ${it}` + (k === "IP-ASN" ? ", no-resolve" : ""));
    });
  });
  return {
    info,
    value: value.sort((a, b) => {
      const s1 = a.toUpperCase();
      const s2 = b.toUpperCase();
      if (s1 < s2) {
        return -1;
      }
      if (s1 > s2) {
        return 1;
      }
      return 0;
    }),
  };
};

const bunWrite = (fileName: string, obj: RuleObj) => {
  // fix path may garbled, it is bug for bun
  const destination = join(resolve("../Rules"), `${fileName}.list`);
  console.log(`[Start]: Building ${fileName}.list ......`);
  console.log("[Destination]:", destination);
  write(
    destination,
    [
      `# Name: ${fileName} Rules`,
      ...Object.entries(obj.info).map(([k, v]) => {
        return `# ${k}: ${v}`;
      }),
      `# Updated: ${new Date().toString()}\n`,
      ...obj.value,
    ].join("\n"),
  );
};

const buildGeneral = () => {
  const info = { ...defaultInfo };
  const value = [];
  [
    parseDataToRuleObj(Cloudflare),
    parseDataToRuleObj(Discord),
    parseDataToRuleObj(GitHub),
    parseDataToRuleObj(Google),
    parseDataToRuleObj(Telegram),
    parseDataToRuleObj(Twitter),
    parseDataToRuleObj(Wiki),
    parseDataToRuleObj(YouTube),
    parseDataToRuleObj(General),
  ].forEach((it) => {
    info.Total += it.info.Total;
    info.DOMAIN += it.info.DOMAIN;
    info["DOMAIN-SUFFIX"] += it.info["DOMAIN-SUFFIX"];
    info["DOMAIN-SET"] += it.info["DOMAIN-SET"];
    info["IP-ASN"] += it.info["IP-ASN"];
    info["URL-REGEX"] += it.info["URL-REGEX"];
    info["DOMAIN-KEYWORD"] += it.info["DOMAIN-KEYWORD"];
    value.push(...it.value);
  });
  bunWrite("General", {
    info,
    value,
  });
};

buildGeneral();
bunWrite("Block", parseDataToRuleObj(Block));
bunWrite("Netflix", parseDataToRuleObj(Netflix));
bunWrite("OpenAI", parseDataToRuleObj(OpenAI));
bunWrite("Speedtest", parseDataToRuleObj(Speedtest));
