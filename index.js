const env = process.env.NODE_ENV || 'development';
const Miner = require('./modules/Miner');
const InfiniteLoop = require('infinite-loop');


//TODO all miner properties between the comments to be included in a json config file


/**/
let about = "NodeJs miner";
let minerName = "Simeon";
let minerAddress = "2da8959012043f9d9c6591af22a3d30af986bc2f";
let nodeUrl = process.env.NODE_URL;

if(!nodeUrl){
	console.error("Please Define Node URL as a parameter. (e.g NODE_URL=<nodeurl> npm start)");
	return;
}
/**/

let miner = new Miner(about, minerName,minerAddress,nodeUrl);

var infiniteLoop = new InfiniteLoop();
infiniteLoop.add(miner.mine, nodeUrl, minerAddress);
infiniteLoop.run(); // for your life

// miner.mine(miner.nodeUrl,miner.address);

//TODO add miner object and miner.mine

const config = require('./config/config')[env];
const app = require('express')();
require('./config/express')(app);
require('./config/routes')(app);
app.listen(config.port);
console.log("Listening on port: " + config.port)