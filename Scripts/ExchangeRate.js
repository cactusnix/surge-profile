/**
 * Show exchange rate every day.
 * Tips: Get Data via api on https://app.exchangerate-api.com/dashboard
 * Updated: Sep 27, 2022
 * @Author cactusnix
 */

const ER_CONFIG = $persistentStore.read("ER_CONFIG");
if (!ER_CONFIG) {
  $notification.post("😢[Warning]: No Config in $persistentStore!");
  $done();
}
const config = JSON.parse(ER_CONFIG);
if (!config.APIKey) {
  $notification.post("😢[Warning]: No API key in $persistentStore!");
  $done();
}
const baseCode = config.baseCode || "CNY";
const codeMap = {
  CNY: ["人民币", "🇨🇳"],
  HKD: ["港币", "🇭🇰"],
  USD: ["美元", "🇺🇸"],
  JPY: ["日元", "🇯🇵"],
  EUR: ["欧元", "🇪🇺"],
  GBP: ["英镑", "🇬🇧"],
};
$httpClient.get(
  `https://v6.exchangerate-api.com/v6/${config.APIKey}/latest/${baseCode}`,
  (err, resp, data) => {
    if (err || resp.status !== 200) {
      $notification.post("🥲[Info]: Request Fail!");
      $done();
    }
    const result = JSON.parse(data);
    const rates = Object.entries(codeMap)
      .map(([k, v]) => {
        const value = result.conversion_rates[k];
        if (k === baseCode) {
          return "REMOVE";
        }
        // less than one will be exchanged
        if (value < 1) {
          const temp = (1 / value).toFixed(4);
          return `${v[1]} 1${v[0]} = ${temp}${codeMap[baseCode][0]}`;
        }
        return `${v[1]} ${value}${v[0]} = 1${codeMap[baseCode][0]}`;
      })
      .filter((text) => text.includes("REMOVE"));
    $notification.post(
      `[Total Exchange Rate]: Base is ${baseCode}`,
      `Updated: ${result.time_last_update_utc.substr(0, 16)}`,
      rates.join("\n")
    );
  }
);
