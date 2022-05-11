const http = require('http');

const calculateFullFourier = require('./fourier');
const calculateMNK = require('./MNK');

const server = http.createServer(async function (request, response) {
    response.writeHead(200, {'Content-Type': 'application/json', 
                             'Access-Control-Allow-Origin': '*', 
                             'Access-Control-Allow-Credentials' : true });

    let userUrl = new URL(request.url, `http://${request.headers.host}`);

    let requestObject = Object.fromEntries(new URLSearchParams(userUrl.search).entries());

    let fourierResult = calculateFullFourier(requestObject);
    let mnkResult = calculateMNK(requestObject);

    response.end(JSON.stringify(Object.assign(fourierResult, mnkResult)));
});

server.listen(8080, () => {
    let {address, port} = server.address();
    console.log(`Server is listening on: http://${address}:${port}`);
});

