// const get               = require('simple-get');
const Request = require('request');
const CandidateBlock    = require('./CandidateBlock');
const Crypto            = require('./Crypto');


class Miner {
    constructor(about, name, address, nodeUrl){
        this.about      = about; // string
        this.name       = name; // string
        this.address    = address; // address
        this.nodeUrl    = nodeUrl; // node url ending with '/'
    }

    mine(nodeUrl, minerAddress) {

        console.log('--Miner Started--');

        // while(true){
            console.log('--STARTING MINNING PROCEDURE--');
            let candidateBlock;
            let nonce;
            const requestOptions = {
                method: 'GET',
                url: nodeUrl+"mine/"+minerAddress,
                // body: {
                //     index: 'value',
                //     transactionsIncluded: 'value',
                //     expectedReward: 'value',
                //     difficulty: 'value',
                //     blockDataHash: 'value'
                // },
                json: true
            };
           /* console.log('-- Request Options (GET BLOCK) --');
            console.log(requestOptions);
            console.log('---------------------');*/
            Request(requestOptions, function(err, res, data) {

                console.log("~~~~ request: " + JSON.stringify(res));

                console.log("~~~~ request data: " + JSON.stringify(data));
            // get.concat(requestOptions, function (err, res, data) {
                if (err) {
                    console.error("~~~~~ err:" + err);
                    return err
                }

                if(res.statusCode == 200){

                    console.log("Response Recieved- 200 OK");

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
                    var hashData;
                    var count=0;
                    var hashFound=false;

                    // loop for finding the block hash according to diffiulty
                    while (!hashFound){
                        date   = new Date().toISOString();
                        nonce  = Crypto.random4BytesInt();

                        hashData = candidateBlock.blockDataHash + "|" + nonce + "|" + date;

                        hash = Crypto.getSHA256(hashData);
                        count++;
                        console.log(hashData +  "-->" + hash);
                        hashFound = hash.startsWith(hashPreffix);
                    }
                    console.log("!!!HASH FOUND!!! DIFICULTY: " + candidateBlock.difficulty);
                    console.log(candidateBlock.blockDataHash + "|" + nonce + "|" + date + "--> " + hash);
                    submitBlock(candidateBlock,nonce,hash,date,nodeUrl,minerAddress);
                } else {
                    console.log("=====NOT RECEIVED 200 OK=====")
                }


            });
            console.log('--------------------------------------');
            // break;

        }

    // }

}

function submitBlock(blockData, nonce, hash, date,nodeUrl,minerAddress) {
    const requestOptions = {
        method: 'POST',
        url: nodeUrl+"mine/submit",
        body: {
            index: blockData.index,
            nonce: nonce,
            dateCreated: date,
            blockHashMiner: hash,
            blockDataHash: blockData.blockDataHash,
            minerAddress: minerAddress
        },
        json: true
    };
    Request(requestOptions, function(err, res, data) {
    // get.concat(requestOptions, function (err, res, data) {
        if (err) {
            console.error("??????? err: " + err);
            return err;
        }
        console.log(res.statusCode + "BLOCK SUBMITED SUCCESSFULLY ") // `data` is an object
    })
}

module.exports = Miner;