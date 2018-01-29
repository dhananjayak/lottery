const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const ACCOUNT_MNEMONIC = 'coil brain forum palace erase chaos excuse sample immune toddler genre blue';
const RINKBY_URL = 'https://rinkeby.infura.io/7OiJ6uhom2yQ5cLTnxk3';

const provider = new HDWalletProvider(ACCOUNT_MNEMONIC, RINKBY_URL);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('attempting to deploy from a/c ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
                                .deploy({data:bytecode})
                                .send({gas:'1000000', from:accounts[0]});

    console.log(result);
}

deploy();