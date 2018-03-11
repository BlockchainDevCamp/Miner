const env = process.env.NODE_ENV || 'development';
/*const Block = require('./modules/Block');
const Node = require('./modules/Node');

let block = new Block;

let node = new Node("SoftuinChain", "Alex", [], [block.generageGenesisBlock()],new Map(), [], 6, new Map());

module.exports = node;*/
const Miner             = require('./modules/Miner');


//TODO all miner properties between the comments to be included in a json config file


/**/
let about = "NodeJs miner";
let minerName = "Simeon";
let minerAddress = "2da8959012043f9d9c6591af22a3d30af986bc2f";
//TODO create a functionality for miner to get all nodes and to connect to the one with lowest ping
let nodeUrl = "http://127.0.0.1:5555/"
/**/

let miner = new Miner(about, minerName,minerAddress,nodeUrl);
miner.mine();

//TODO add miner object and miner.mine

const config = require('./config/config')[env];
const app = require('express')();
require('./config/express')(app);
require('./config/routes')(app);
app.listen(config.port);
console.log("Listening on port: " + config.port)