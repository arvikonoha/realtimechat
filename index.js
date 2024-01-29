const {Server} = require('socket.io')
const middlewares = require('./middlewares')
const orm = require('./orm')

const express = require("express");
const cors = require('cors');
const { createServer } = require("http");
const uuid = require("uuid");
const mongoose = require('mongoose')
const swaggerDocs = require('./swagger-init.js')

mongoose.connect(`mongodb://localhost:27016/realtime-chat-db`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Successfully connected to mongo")
})
const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(require('./routes'))

const io = new Server(httpServer, {cors: {origin: "http://localhost:3000"}})

io.engine.generateId = (req) => {
    return uuid.v4(); // must be unique across all Socket.IO servers
}

io.engine.use((req, res, next) => {
  const isHandshake = req._query.sid === undefined;
  if (!isHandshake) {
    return next();
  }

  middlewares.auth.authenticate(req, res, next)
});
io.on('connection', async (socket) => {
    console.log('Connected to the server')
    const socketID = socket.id;
    socket.user = socket.request.user
    const socketUser = socket.user
    let users = new Map();
    for (let [id, socket] of io.of("/").sockets) {
      const receivedMessages = await orm.messages.getMessagesForID(socket.user.id, socketUser.id)
      users.set(socket.user.id,{
        socketID: id,
        name: socket.user.name,
        id: socket.user.id,
        messages: receivedMessages
      });
      
      const sentMessages = await orm.messages.getMessagesForID(socketUser.id, socket.user.id)
      socket.emit('user connected', {
        socketID,
        name: socketUser.name,
        id: socketUser.id,
        messages: sentMessages
      })
    }
    socket.emit("users", Array.from(users.values()));
    socket.on('chat:send', async ({to, targetUserID, content}, callback) => {
        const result = await orm.messages.create({
          to: targetUserID,
          from: socket.user.id,
          content
        })
        io.to(to).emit('chat:reply', result)
        callback(result)
    });

    socket.on('disconnect', () => {
      users.delete(socket.user.id)
      io.emit('users', Array.from(users.values()))
    })
})

swaggerDocs(app, 4000)
httpServer.listen(4000)