import { resolve, parse, join } from "path";
import Netflix from "./assets/Netflix.json";
import { write } from "bun";

const bunWrite = (fileName: string, data: Record<string, string[]>) => {
  // fix path may garbled, it is bug for bun
  const destination = join(parse(resolve("../Rules")).ext, `${fileName}.list`);
  console.log(`[Start]: Building ${fileName}.list ......`);
  console.log("[Destination]:", destination);
  const rules: string[] = [];
  const info = {
    Total: 0,
    DOMAIN: 0,
    "DOMAIN-SUFFIX": 0,
  };
  Object.entries(data).forEach(([k, v]) => {
    info.Total += v.length;
    info[k] += v.length;
    v.forEach((it) => {
      rules.push(`${k}, ${it}`);
    });
  });
  write(
    destination,
    [
      `# Name: ${fileName} Rules`,
      ...Object.entries(info).map(([k, v]) => {
        return `# ${k}: ${v}`;
      }),
      `# Updated: ${new Date().toString()}\n`,
      ...rules,
    ].join("\n")
  );
};
const buildNetflix = () => {
  bunWrite("Netflix", Netflix);
};

buildNetflix();
