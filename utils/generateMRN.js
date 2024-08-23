const { randomBytes } = require("crypto");

function generateMRN() {
  const min = 100000000; // Smallest 9-digit number
  const max = 999999999; // Largest 9-digit number
  const range = max - min;

  // Generating a random number within the specified range
  const randomNumber = Math.floor(
    (randomBytes(4).readUInt32LE(0) / 0xffffffff) * range + min
  );

  return randomNumber;
}

module.exports = generateMRN;
