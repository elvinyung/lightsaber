var http = require('http');
var fs = require('fs');
var execSync = require('child_process').execSync;

if (!execSync) {
  console.error('ERROR: node instance not iojs');
  process.exit(1);
}

function run(index) {
  var server = http.createServer(function(req, res) {
    if (req.method === 'GET') {
      var page = fs.readFileSync(process.cwd() + '/' + index);
      res.end(page);
    }
    else if (req.method === 'POST') {
      cmd = '';
      req.on('data', function(chunk) {
        cmd += chunk.toString();
      });
      req.on('end', function() {
        console.log('got cmd:', cmd);
        try {
          result = execSync(cmd).toString();
          res.end(result);
        }
        catch (e) {
          res.status = 500;
          res.end('error');
        }
      });
    }
    else {
      res.status = 500;
      res.end('NO');
    }
  });

  var port = process.argv[2] || 8000;
  console.log('running on', port);
  server.listen(port);
}

module.exports = run;

