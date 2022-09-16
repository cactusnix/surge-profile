const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
axios.get("https://bgp.he.net/country/CN").then((resp) => {
  const $ = cheerio.load(resp.data);
  const fileName = "ChinaASN";
  const writeStream = fs.createWriteStream(
    path.resolve(`../Rules/${fileName}.list`)
  );
  // assert it must have data
  const data = $("#asns tr a").map((_, element) => {
    const keyValue = element.attribs["title"].split(" - ");
    const comment = keyValue[1] ? ` // ${keyValue[1]}` : "";
    return `IP-ASN, ${keyValue[0].replace("AS", "")}, no-resolve` + comment;
  });
  [
    `# Name: ${fileName} Rules`,
    `# Total: ${data.length}`,
    `# Updated: ${new Date().toString()}\n`,
    ...data,
  ].forEach((text) => writeStream.write(`${text}\n`));
  writeStream.on("finish", () => {
    console.log("[success]", `write all data to ${fileName}`);
  });
  writeStream.end();
});
