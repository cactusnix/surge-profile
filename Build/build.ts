import { resolve, parse, join } from "path";
import { write } from "bun";
import China from "./assets/China.json";

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

const buildGeneral = () => {
  const info = { ...defaultInfo };
  const value = [];
  [].forEach((it) => {
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
bunWrite("China", parseDataToRuleObj(China));
