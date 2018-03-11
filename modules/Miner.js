const get               = require('simple-get');
const CandidateBlock    = require('./CandidateBlock');
const Crypto            = require('./Crypto');

class Miner {
    constructor(about, name, address, nodeUrl){
        this.about      = about; // string
        this.name       = name; // string
        this.address    = address; // address
        this.nodeUrl    = nodeUrl; // node url ending with '/'
    }

    mine () {

        while(true){
            let candidateBlock;
            let nonce;
            const requestOptions = {
                method: 'GET',
                url: this.nodeUrl+"mine/"+this.address,
                body: {
                    index: 'value',
                    transactionsIncluded: 'value',
                    expectedReward: 'value',
                    difficulty: 'value',
                    blockDataHash: 'value'
                },
                json: true
            }

            get.concat(requestOptions, function (err, res, data) {
                if (err) return err

                if(res.statusCode == 200){

                    candidateBlock = new CandidateBlock(
                            data.index,
                            data.transactionsIncluded,
                            data.expectedReward,
                            data.difficulty,
                            data.blockDataHash
                    );


                    var date ;
                    var hashPreffix = '0'.repeat(candidateBlock.difficulty);
                    var hash;
                    var hashFound=false;
                    console.log(hashPreffix);

                    // loop for finding the block hash according to diffiulty
                    while (!hashFound){
                        date   = new Date().toISOString();
                        nonce  = Crypto.random4BytesInt();
                       /* console.log("nonce ---> "+nonce);
                        console.log("date ---> "+date);
                        console.log("blockDataHash ---> "+candidateBlock.blockDataHash);*/

                        hash = Crypto.generateSHA256(candidateBlock.blockDataHash+nonce+date);
                        /*console.log("hash ---> "+ hash);
                        console.log("hashPreffix ---> "+ hashPreffix);*/
                        hashFound = hash.startsWith(hashPreffix);
                    }
                    submitBlock(candidateBlock,nonce,hash,date);
                }

            })
            break;
            //1. GET mining data from Node (28 slide)
            //2.
        }
    }

}

function submitBlock(blockData, nonce, hash, date) {
    const requestOptions = {
        method: 'POST',
        url: this.nodeUrl+"mine/submit",
        body: {
            index: blockData.index,
            nonce: nonce,
            dateCreated: date,
            blockHashMiner: hash,
            minerAddress: this.address
        },
        json: true
    }

    get.concat(requestOptions, function (err, res, data) {
        if (err) throw err
        console.log(res.statusCode) // `data` is an object
    })
}

module.exports = Miner;