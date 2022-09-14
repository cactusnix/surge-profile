/**
 * Generate subscription info with the url you input and display on the panel
 * Updated: Sep 14, 2022
 * @Author cactusnix
 */
const argument = $argument;
if (!argument) {
  $done({
    title: "No $argument!",
  });
}
const args = Object.fromEntries(
  $argument
    .split("&")
    .map((it) => it.split("=").map(([k, v]) => [k, decodeURIComponent(v)]))
);
console.log("[Temp]");
console.log(args);
$httpClient.get(args.url, (err, resp, _) => {
  console.log(err);
  console.log(resp);
  if (err || resp.status !== 200 || !resp.headers["subscription-userinfo"]) {
    $done({
      title: "Get Info Error or no info in headers",
    });
  }
  const data = resp.headers["subscription-userinfo"];
  const keyValue = {
    Up: {
      regex: /upload=(\d+)/,
      value: 0,
    },
    Down: {
      regex: /download=(\d+)/,
      value: 0,
    },
    Total: {
      regex: /total=(\d+)/,
      value: 0,
    },
  };
  Object.keys(keyValue).forEach((key) => {
    keyValue[key].value = Number(
      (data.match(keyValue[key].regex)[1] / (1024 * 1024 * 1024)).toFixed(2)
    );
  });
  const content = [
    `Used: ${(keyValue.Up.value + keyValue.Down.value).toFixed(2)}GB`,
    `Total: ${keyValue.Total.value}GB`,
    `Expire: ${new Date(
      Number(data.match(/expire=(\d+)/)[1]) * 1000
    ).toLocaleDateString()}`,
  ];
  $done({
    title: "Sub Info",
    content: content.join("\n"),
  });
});
