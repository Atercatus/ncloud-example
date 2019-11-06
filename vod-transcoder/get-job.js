require("dotenv").config();
const https = require("https");

const { makeOption } = require("../ncloud/helper");

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
