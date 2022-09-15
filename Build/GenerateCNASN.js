const axios = require("axios");
const cheerio = require("cheerio");
axios.get("https://bgp.he.net/country/CN").then((resp) => {
  const $ = cheerio.load(resp.data);
  console.log("[$]", $);
});

// const a = fetch(
//   "https://bgp.he.net/search?search%5Bsearch%5D=Google&commit=Search"
// ).then((resp) => {
//   return resp.text();
// });
// a.then((value) => {
//   console.log("[resp]", value);
// });
// console.log(
//   decodeURIComponent(
//     "https://bgp.he.net/search?search%5Bsearch%5D=Google&commit=Search"
//   )
// );

// console.log("https://bgp.he.net/country/CN");
