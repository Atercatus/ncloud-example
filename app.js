require("dotenv").config();
const CryptoJS = require("crypto-js");
const https = require("https");

function makeOption({
  host,
  method,
  path,
  timestamp,
  apiKey,
  accessKey,
  secretKey
}) {
  const signature = makeSignature({
    secretKey,
    method,
    url: path,
    timestamp,
    accessKey
  });

  return {
    host,
    method,
    path,
    headers: {
      "Content-Type": "application/json",
      "x-ncp-apigw-timestamp": timestamp,
      "x-ncp-apigw-api-key": apiKey,
      "x-ncp-iam-access-key": accessKey,
      "x-ncp-apigw-signature-v2": signature
    }
  };
}

function makeSignature({ secretKey, method, url, timestamp, accessKey }) {
  const space = " ";
  const newLine = "\n";

  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();

  return hash.toString(CryptoJS.enc.Base64);
}

// const signature = makeSignature(
//   process.env.SECRET_KEY,
//   "GET",
//   "/api/v2/jobs",
//   now,
//   process.env.ACCESS_KEY_ID
// );

// const option = {
//   host: "vodtranscoder.apigw.ntruss.com",
//   method: "GET",
//   path: "/api/v2/jobs",
//   headers: {
//     "Content-Type": "application/json",
//     "x-ncp-apigw-timestamp": now,
//     "x-ncp-apigw-api-key": process.env.API_KEY_PRI,
//     "x-ncp-iam-access-key": process.env.ACCESS_KEY_ID,
//     "x-ncp-apigw-signature-v2": signature
//   }
// };

const vodTranscoder = { host: "vodtranscoder.apigw.ntruss.com" };
const now = Date.now().toString();

const option = makeOption({
  host: vodTranscoder.host,
  method: "GET",
  path: "/api/v2/jobs",
  timestamp: now,
  apiKey: process.env.API_KEY_PRI,
  accessKey: process.env.ACCESS_KEY_ID,
  secretKey: process.env.SECRET_KEY
});

const req = https.request(option, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding("utf8");
  res.on("data", chunk => {
    console.log(`BODY: ${chunk}`);
  });
  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.on("error", e => {
  console.error(`problem with request: ${e.message}`);
});

// req.write();

req.end();
