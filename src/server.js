require('dotenv').config();
require('./redis/redis.client');

const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {

    console.log('Cliente conectado a Socket.IO:', socket.id);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado de Socket.IO:', socket.id);
    });

});

app.set('io', io);

server.listen(PORT, () => {

    console.log(`Servidor ejecutándose en puerto ${PORT}`);

});

module.exports = {
    app,
    server
};