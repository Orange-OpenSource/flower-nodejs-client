# Flower NodeJs Client
Package that allows you to implement a [Flower](http://flower.dev) client in NodeJs in order to create [federated learning](https://en.wikipedia.org/wiki/Federated_learning) with [tensorflow.js](https://js.tensorflow.org/api/latest/).
## prerequisite
Install :
- python >= 3.6
- flower library 0.18.0 : `pip install flwr==0.18.0` 
- nodejs
- npm

## How to use
Same usage as the Python version.<br>
Create a client that override the client class and fill the 4 methods, like "example/tfjs_Client.js". <br>
```javascript
const {Client} = require('flower-nodejs-client');

class Tfjs_Client extends Client{
    ...
}
```
Modify if necessary the "server.py" and run it. <br>
Finally, run the clients by using start_tfjs_client.
```javascript
const {start_tfjs_client} = require('flower-nodejs-client');

const tfjs_client = new Tfjs_Client();
await start_tfjs_client('localhost:5006', tfjs_Client,);
```


## Run the example
- Clone repository
- Installation: `npm i`
- Get into the folder example: `cd example`
- Run the server : `python server.py`
- Run client#1 : `node index.js`
- Run client#2 : `node index.js`