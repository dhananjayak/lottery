const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

const lottertSource = fs.readFileSync(lotteryPath, 'utf8');

module.exports = solc.compile(lottertSource, 1).contracts[':Lottery'];