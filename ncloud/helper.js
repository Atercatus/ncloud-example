const CryptoJS = require("crypto-js");

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

module.exports = {
  makeSignature,
  makeOption
};
