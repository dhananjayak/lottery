const assert = require('assert');
const ganache = require('ganache-cli');
//const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface, bytecode} = require('../compile');




let lottery, accounts;

beforeEach(async () => {    
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
                            .deploy({data:bytecode})
                            .send({from:accounts[0], gas:'1000000'});

    lottery.setProvider(provider);
});

describe('Lottery Contract', () => {
    it('deployed successfully', () => {
        assert.ok(lottery.options.address);
    });
    
    it('allows player to enter', async () => {
        console.log(lottery.methods.enter());
        console.log('accounts', accounts[0])
        console.log('0.02 ether', web3.utils.toWei('0.02', 'ether'));

        
        
        await lottery.methods.enter().send({
                                            from: accounts[0], 
                                            value: web3.utils.toWei('0.02', 'ether')
                                           });
        
                                
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(players.length, 1);
        
    });

    it('allows multiple players to enter', async () => {                        
        await lottery.methods.enter().send({
                                            from: accounts[0], 
                                            value: web3.utils.toWei('0.02', 'ether')
                                           });

        await lottery.methods.enter().send({
                                            from: accounts[1], 
                                            value: web3.utils.toWei('0.02', 'ether')
                                           });
                                        
        await lottery.methods.enter().send({
                                            from: accounts[2], 
                                            value: web3.utils.toWei('0.02', 'ether')
                                           });
        
                                
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        assert.equal(players.length, 3);
        
    });

    it('requires a minimum amount to enter', async () => {
            try {
                await lottery.methods.enter().send({
                    from: accounts[1],
                    value : 1
                });

                assert(false);
            } catch (er) {
                assert(er);
            }
    });

    it('requires only manager to pick winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]                
            });

            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('sends money to the winner and resets the lottery', async ()=>{
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[1]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]            
        })

        const finalBalance = await web3.eth.getBalance(accounts[1]);

        const difference = finalBalance - initialBalance;

        console.log(initialBalance, ',', finalBalance, ',', difference);

        assert(difference > web3.utils.toWei('1.8', 'ether'));


    });
});