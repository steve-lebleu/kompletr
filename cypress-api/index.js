import http from 'http';
import * as records from './data.json' assert { type: "json" };

/**
 * A small server for E2E tests
 */
http
  .createServer((req, res) => {
    const qs = new URLSearchParams(req.url.split('?')[1])
    const response = qs.get('q') ? records.default.filter(record => record["Name"].toLowerCase().lastIndexOf(qs.get('q').toLowerCase()) === 0) : records.default;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(response));
  })
  .listen(3000, (err) => {
    console.log('server is listening on port 3000');
  });