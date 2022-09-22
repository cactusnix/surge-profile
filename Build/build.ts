import { resolve, parse, join } from "path";
import { write } from "bun";
import Privacy from "./assets/Privacy.json";
import Block from "./assets/Block.json";
import General from "./assets/General.json";
import GitHub from "./assets/GitHub.json";
import Google from "./assets/Google.json";
import Netflix from "./assets/Netflix.json";
import Reddit from "./assets/Reddit.json";
import Telegram from "./assets/Telegram.json";
import Twitter from "./assets/Twitter.json";
import YouTube from "./assets/YouTube.json";

type RuleObj = {
  info: {
    Total: number;
    DOMAIN: number;
    "DOMAIN-SUFFIX": number;
    "IP-ASN": number;
  };
  value: string[];
};

const defaultInfo = {
  Total: 0,
  DOMAIN: 0,
  "DOMAIN-SUFFIX": 0,
  "IP-ASN": 0,
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
    value,
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

const buildTelegram = async () => {
  // Telegram doesn't have domain for service, so use ASN
  const obj = parseDataToRuleObj(Telegram);
  // May need validate
  const data = await fetch(
    "https://bgp.he.net/search?search[search]=Telegram&commit=Search"
  );
  data.text().then((resp) => {
    console.log(resp);
  });
};

const buildGeneral = () => {
  const info = { ...defaultInfo };
  const value = [];
  [
    parseDataToRuleObj(General),
    parseDataToRuleObj(GitHub),
    parseDataToRuleObj(Google),
    parseDataToRuleObj(Reddit),
    parseDataToRuleObj(Telegram),
    parseDataToRuleObj(Twitter),
    parseDataToRuleObj(YouTube),
  ].forEach((it) => {
    info.Total += it.info.Total;
    info.DOMAIN += it.info.DOMAIN;
    info["DOMAIN-SUFFIX"] += it.info["DOMAIN-SUFFIX"];
    info["IP-ASN"] += it.info["IP-ASN"];
    value.push(...it.value);
  });
  bunWrite("General", {
    info,
    value,
  });
};

buildGeneral();
bunWrite("Privacy", parseDataToRuleObj(Privacy));
bunWrite("Block", parseDataToRuleObj(Block));
bunWrite("GitHub", parseDataToRuleObj(GitHub));
bunWrite("Google", parseDataToRuleObj(Google));
bunWrite("Netflix", parseDataToRuleObj(Netflix));
bunWrite("Reddit", parseDataToRuleObj(Reddit));
bunWrite("Telegram", parseDataToRuleObj(Telegram));
bunWrite("Twitter", parseDataToRuleObj(Twitter));
bunWrite("YouTube", parseDataToRuleObj(YouTube));
