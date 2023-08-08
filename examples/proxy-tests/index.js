import {createServer} from 'http';
//  create a server object:
createServer(function(req, res) {
  let result = [];
  Object.keys(process.env).map(key => {
    result.push(`${key}=${process.env[key]}`);
  });
  res.setHeader('Content-type', 'text/html');
  res.write(result.join(`<br/>`));
  res.end(); // end the response
}).listen(3000, function() {
 console.log('server start at port 3000'); // the server object listens on port 3000
});
