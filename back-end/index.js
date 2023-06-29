import http from 'http';
import jwt from 'jsonwebtoken';

const secretKey = 'your-secret-key';
const hostname = '127.0.0.1';
const port = 5000;

const routes = {
  home: '/',
  register: '/register',
  login: '/login',
};

const server = http.createServer((req, res) => {
  const authHeader = req.headers.authorization;
  const { url, method } = req;

  if (
    url !== routes['login'] &&
    authHeader &&
    Object.values(routes).includes(url)
  ) {
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.writeHead(402, { 'Content-Type': 'application/json' });
        const data = { error: 'Unauthorized' };
        res.end(JSON.stringify(data));
      }
    });
  }

  if (
    url !== routes['login'] &&
    Object.values(routes).includes(url) &&
    !authHeader
  ) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    const data = { error: 'Unauthorized' };
    res.end(JSON.stringify(data));
  }

  if (url === routes['home'] && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const data = { message: 'Hello World!' };
    res.end(JSON.stringify(data));
  }

  if (url === routes['login'] && method === 'POST') {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk.toString(); // convert Buffer to string
    });

    console.log('login');
    const user = {
      id: '12',
      name: 'alireza',
      family: 'ahmad',
      roles: ['user'],
    };
    const payload = {
      sub: user.id,
      iat: Date.now(),
    };
    const options = {
      expiresIn: '1h',
    };
    const TOKEN = jwt.sign(payload, secretKey, options);
    console.log(data);
    req.on('end', () => {
      const parsedData = JSON.parse(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(parsedData));
    });
  }

  if (!Object.values(routes).includes(url)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    const data = { error: 'Not Found' };
    res.end(JSON.stringify(data));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
