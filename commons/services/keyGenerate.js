const crypto = require("crypto");

function generatePrivateKey() {
  const privateKey = crypto.randomBytes(32).toString("hex");
  return privateKey;
}

module.exports = {
  generatePrivateKey,
};
