const http = require('http');
const os = require('os');
let networkInterfaces = os.networkInterfaces();
let remoteAddress;
let port = process.argv[2] || 80;
for (var devName in networkInterfaces) {
  var iface = networkInterfaces[devName];
  for (var i = 0; i < iface.length; i++) {
    var alias = iface[i];
    if (
      alias.family === 'IPv4' &&
      alias.address !== '127.0.0.1' &&
      !alias.internal
    ) {
      remoteAddress = alias.address;
    }
  }
}
fetch('http://ip-api.com/json')
  .then((resp) => resp.json())
  .then(({ query }) => {
    remoteAddress = query ?? remoteAddress;
  });
http
  .createServer((request, response) => {
    response.setHeader('Content-Type', 'text/json; charset=utf-8');
    let localAddress =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    let userAgent = request.headers['user-agent'];
    let message = {
      localAddress,
      remoteAddress,
      userAgent,
    };
    response.end(JSON.stringify(message));
  })
  .listen(port, () => console.log(`http://localhost:${port}`));