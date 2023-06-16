const checkNumberGenerate = async (numDigits) => {
  let digits = [...Array(numDigits).keys()];
  let randomNum = "";
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  for (let i = 0; i < numDigits; i++) {
    randomNum += digits[i];
  }
  return randomNum;
};

module.exports = {
  checkNumberGenerate,
};
