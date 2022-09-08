/**
 * Generate subscription info with SubStore script, it can be uploaded to gist.
 * Tips: This script is only for SubStore and the sub name must be 'SubInfo'.
 * Support: SubStore v2.12.7
 * Updated: Aug 30, 2022
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
  // Sub Store use statusCode as return
  if (resp.statusCode !== 200) {
    console.log(`[Sub Info Log]: Request Error Status - ${resp.statusCode}`);
    return proxies;
  }
  const data = resp.headers["subscription-userinfo"];
  if (!data) {
    console.log(`[Sub Info Log]: There is no info in header`);
    return proxies;
  }
  // Suppose that the info is formatted like: upload=653129137; download=22634611295; total=322122547200; expire=1675209600
  /**
   * Proxy type
   * cipher: "chacha20-ietf"
   * password: "password"
   * server: "1.1.1.1"
   * port: 8000
   * type: "ss"
   * name: "name"
   */
  const group = [];
  const fakeExample = {
    cipher: "chacha20-ietf",
    password: "password",
    server: "1.1.1.1",
    port: 8000,
    type: "ss",
  };
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
  group.push({
    ...fakeExample,
    name: `Used: ${(keyValue.Up.value + keyValue.Down.value).toFixed(2)}GB`,
  });
  group.push({
    ...fakeExample,
    name: `Total: ${keyValue.Total.value}GB`,
  });
  group.push({
    ...fakeExample,
    name: `Expire: ${new Date(
      Number(data.match(/expire=(\d+)/)[1]) * 1000
    ).toLocaleDateString()}`,
  });
  return group;
}
