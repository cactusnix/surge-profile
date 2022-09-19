import { resolve, parse, join } from "path";
import { write } from "bun";
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
  };
  value: string[];
};

const parseDataToRuleObj = (data: Record<string, string[]>): RuleObj => {
  const value: string[] = [];
  const info = {
    Total: 0,
    DOMAIN: 0,
    "DOMAIN-SUFFIX": 0,
  };
  Object.entries(data).forEach(([k, v]) => {
    info.Total += v.length;
    info[k] += v.length;
    v.forEach((it) => {
      value.push(`${k}, ${it}`);
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
};

bunWrite("GitHub", parseDataToRuleObj(GitHub));
bunWrite("Google", parseDataToRuleObj(Google));
bunWrite("Netflix", parseDataToRuleObj(Netflix));
bunWrite("Reddit", parseDataToRuleObj(Reddit));
buildTelegram();
bunWrite("Twitter", parseDataToRuleObj(Twitter));
bunWrite("YouTube", parseDataToRuleObj(YouTube));
