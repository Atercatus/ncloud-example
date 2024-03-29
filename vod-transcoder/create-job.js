require("dotenv").config();
const https = require("https");

const { makeOption } = require("../ncloud/helper");

const vodTranscoder = { host: process.env.VOD_TRANSACTION_HOST };
const now = Date.now().toString();

const rand = Math.ceil(Math.random() * 1000000).toString(36);
const fileName = `${rand}`;
console.log(`${fileName}-360`);
const body = JSON.stringify({
  jobName: "apitest3",
  storageType: process.env.STORAGE_TYPE,
  notificationUrl: process.env.NOTIFICATION_URL,
  inputs: [
    {
      inputBucketName: process.env.BUCKET_NAME,
      inputFilePath: "/sample.mp4"
    }
  ],
  output: {
    outputBucketName: process.env.BUCKET_NAME,
    outputFilePath: "/dest",
    thumbnailOn: "false",
    // thumbnailBucketName: "api-guide",
    // thumbnailFilePath: "/vodtr/",
    // thumbnailFileFormat: "PNG",
    // thumbnailAccessControl: "PRIVATE",
    outputFiles: [
      {
        presetId: process.env.GENERIC_360P_16_9_ID,
        outputFileName: `${fileName}-360`,
        accessControl: "private"
      },
      {
        presetId: process.env.GENERIC_480P_16_9_ID,
        outputFileName: `${fileName}-480`,
        accessControl: "private"
      },
      {
        presetId: process.env.GENERIC_720P_ID,
        outputFileName: `${fileName}-720`,
        accessControl: "private"
      },
      {
        presetId: process.env.GENERIC_1080_ID,
        outputFileName: `${fileName}-1080`,
        accessControl: "private"
      }
    ]
  }
});

const option = makeOption({
  host: vodTranscoder.host,
  method: "POST",
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

req.write(body);

req.end();
