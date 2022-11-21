import { resolve, parse, join } from "path";
import { write } from "bun";
import China from "./assets/China.json";
import General from "./assets/General.json";
import Block from "./assets/Block.json";
import Netflix from "./assets/Netflix.json";

type RuleObj = {
  info: {
    Total: number;
    DOMAIN: number;
    "DOMAIN-SUFFIX": number;
    "IP-ASN": number;
    "URL-REGEX": number;
  };
  value: string[];
};

const defaultInfo = {
  Total: 0,
  DOMAIN: 0,
  "DOMAIN-SUFFIX": 0,
  "IP-ASN": 0,
  "URL-REGEX": 0,
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

bunWrite("China", parseDataToRuleObj(China));
bunWrite("General", parseDataToRuleObj(General));
bunWrite("Block", parseDataToRuleObj(Block));
bunWrite("Netflix", parseDataToRuleObj(Netflix));
