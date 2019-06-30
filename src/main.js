const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (!this.hash.startsWith(difficulty)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log(`BLOCK MINED: ${this.hash} WITH NONCE: ${this.nonce}`);
    }
}

class BlockChain {
    constructor(difficulty = '00') {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/29/2019", "Genesis block", "0");
    }

    getLastestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addNewBlock(newBlock) {
    //     newBlock.previousHash = this.getLastestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     console.log(`BLOCK MINED: ${newBlock.hash} WITH NONCE: ${newBlock.nonce}\n`);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceFromAddress(address) {
        let balance = 0;

        for(const block of this.chain){
            for (const trans of block.transactions) {
                if(trans.fromAddress == address)
                    balance -= trans.amount;
                if(trans.toAddress == address)
                    balance += trans.amount;    
            }
        }

        return balance;
    }

    isChainValid() {
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];
            
            if(currentBlock.hash != currentBlock.calculateHash())
                return false;

            if(currentBlock.previousHash != previousBlock.hash)
                return false;
        }
        return true;
    }
}

let sympCoin = new BlockChain('0000');
sympCoin.createTransaction(new Transaction('address1', 'address2', 100));
sympCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
sympCoin.minePendingTransactions('Joel-address');

console.log(`\n Balance of Joel: ${sympCoin.getBalanceFromAddress('Joel-address')}`);

console.log('\n Starting the miner again...');
sympCoin.minePendingTransactions('Joel-address');

console.log(`\n Balance of Joel: ${sympCoin.getBalanceFromAddress('Joel-address')}`);

console.log('\n Starting the miner again 3...');
sympCoin.minePendingTransactions('Joel-address');

console.log(`\n Balance of Joel: ${sympCoin.getBalanceFromAddress('Joel-address')}`);


