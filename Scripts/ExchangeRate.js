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
const CodeMap = {
  CNY: "🇨🇳",
  HKD: "🇭🇰",
  USD: "🇺🇸",
  JPY: "🇯🇵",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
};
$httpClient.get(
  `https://v6.exchangerate-api.com/v6/${config.APIKey}/latest/${baseCode}`,
  (err, resp, data) => {
    if (err || resp.status !== 200) {
      $notification.post("🥲[Info]: Request Fail!");
      $done();
    }
    const rates = Object.entries(CodeMap).map(([k, v]) => {
      const value = data.conversion_rates[k];
      // less than one will be exchanged
      if (value < 1) {
        return `1 ${v} = ${1 / value} ${baseCode}`;
      }
      return `1 ${baseCode} = ${value} ${v}`;
    });
    $notification.post(
      `[Total Exchange Rate]: Base is ${baseCode}`,
      `Updated: ${data.time_last_update_utc}`,
      rates.join("\n")
    );
  }
);
