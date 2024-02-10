const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const server = jsonServer.create();

// const router = jsonServer.router(path.resolve(__dirname, 'db.json'));
const router = jsonServer.router('./db.json');

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

// Эндпоинт для логина
server.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'UTF-8'));
        const { users = [] } = db;

        const userFromBd = users.find(
            (user) => user.username === username && user.password === password,
        );

        if (userFromBd) {
            if (userFromBd.status === 'Active') {
                console.log(userFromBd);
                return res.json(userFromBd);
            }
            return res.status(401).json({ message: 'User blocked' });
        }

        return res.status(403).json({ message: 'User not found' });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
});

// проверяем, авторизован ли пользователь
server.use((req, res, next) => {
    // if (!req.headers.authorization) {
    //     return res.status(403).json({ message: 'AUTH ERROR' });
    // }

    next();
});

server.use(router);

// запуск сервера
server.listen(8000, () => {
    console.log('server is running on 8000 port');
});
