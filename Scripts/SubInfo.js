/**
 * Generate subscription info with SubStore script, it can be uploaded to gist.
 * Tips: This script is only for SubStore and the sub name must be 'SubInfo'.
 * Support: SubStore v2.12.7
 * @Author cactusnix
 */
async function operator(proxies, _) {
  const $ = $substore;
  const allSubs = $.read("subs");
  const sub = allSubs.find((it) => it.name === "SubInfo");
  if (!sub) {
    console.log(
      "[Sub Info Log]: There is no subscription that is named SubInfo"
    );
    return proxies;
  }
  const resp = await $.http.get({
    url: sub.url,
  });
  if (resp.status !== 200) {
    console.log(`[Sub Info Log]: Request Error Status - ${resp.status}`);
    return proxies;
  }
  const data = resp.headers["subscription-userinfo"];
  if (!data) {
    console.log(`[Sub Info Log]: There is no info in header`);
    return proxies;
  }
  // suppose that the info is formatted like: upload=653129137; download=22634611295; total=322122547200; expire=1675209600
  const group = [];
  const fakerInfo =
    "=ss,1.2.3.4,8000,encrypt-method=chacha20-ietf,password=1234";
  group.push(
    `Expire: ${new Date(
      Number(data.match(/expire=(\d+)/)[1]) * 1000
    ).toLocaleDateString()}${fakerInfo}`
  );
  const keyValue = {
    Up: /upload=(\d+)/,
    Down: /download=(\d+)/,
    Total: /total=(\d+)/,
  };
  Object.keys(keyValue).forEach((key) => {
    const text =
      (Number(data.match(keyValue[key])[1]) / (1024 * 1024 * 1024)).toFixed(2) +
      "GB";
    group.push(`${key}: ${text}${fakerInfo}`);
  });
  return group;
}
