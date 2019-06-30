const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/29/2019", "Genesis block", "0");
    }

    getLastestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.previousHash = this.getLastestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
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

let sympCoin = new BlockChain();
sympCoin.addNewBlock(new Block(1, "30/06/2019", { amount: 4 }));
sympCoin.addNewBlock(new Block(2, "01/07/2019", { amount: 10 }));

console.log(`Is blockchain valid? ${sympCoin.isChainValid()}`);


// console.log(JSON.stringify(sympCoin, null, 4));
