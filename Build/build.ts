import { resolve, parse, join } from "path";
import { write } from "bun";
import China from "./assets/China.json";
import Block from "./assets/Block.json";
import Netflix from "./assets/Netflix.json";
import Google from "./assets/Google.json";
import General from "./assets/General.json";
import Telegram from "./assets/Telegram.json";
import Tencent from "./assets/Tencent.json";
import Twitter from "./assets/Twitter.json";
import GitHub from "./assets/GitHub.json";
import iCloud from "./assets/iCloud.json";

type RuleObj = {
  info: {
    Total: number;
    DOMAIN: number;
    "DOMAIN-SUFFIX": number;
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
  const destination = join(parse(resolve("../Rules")).ext, `${fileName}.list`);
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
    ].join("\n")
  );
};

const buildGeneral = () => {
  const info = { ...defaultInfo };
  const value = [];
  [
    parseDataToRuleObj(GitHub),
    parseDataToRuleObj(Google),
    parseDataToRuleObj(Netflix),
    parseDataToRuleObj(Telegram),
    parseDataToRuleObj(Twitter),
    parseDataToRuleObj(General),
  ].forEach((it) => {
    info.Total += it.info.Total;
    info.DOMAIN += it.info.DOMAIN;
    info["DOMAIN-SUFFIX"] += it.info["DOMAIN-SUFFIX"];
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

const buildChina = () => {
  const info = { ...defaultInfo };
  const value = [];
  [parseDataToRuleObj(Tencent), parseDataToRuleObj(China)].forEach((it) => {
    info.Total += it.info.Total;
    info.DOMAIN += it.info.DOMAIN;
    info["DOMAIN-SUFFIX"] += it.info["DOMAIN-SUFFIX"];
    info["IP-ASN"] += it.info["IP-ASN"];
    info["URL-REGEX"] += it.info["URL-REGEX"];
    info["DOMAIN-KEYWORD"] += it.info["DOMAIN-KEYWORD"];
    value.push(...it.value);
  });
  bunWrite("China", {
    info,
    value,
  });
};

buildGeneral();
buildChina();
bunWrite("Block", parseDataToRuleObj(Block));
bunWrite("Netflix", parseDataToRuleObj(Netflix));
bunWrite("Telegram", parseDataToRuleObj(Telegram));
bunWrite("Twitter", parseDataToRuleObj(Twitter));
bunWrite("iCloud", parseDataToRuleObj(iCloud));
