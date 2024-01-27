const {Server} = require('socket.io')
const middlewares = require('./middlewares')
const orm = require('./orm')

const express = require("express");
const cors = require('cors');
const { createServer } = require("http");
const uuid = require("uuid");
const mongoose = require('mongoose')

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
    let users = new Map();
    for (let [id, socket] of io.of("/").sockets) {
      const messages = await orm.messages.getMessagesForID(socket.user.id, id === socketID)
      users.set(socket.user.id,{
        socketID: id,
        name: socket.user.name,
        id: socket.user.id,
        messages: messages
      });
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
    const messages = await orm.messages.getMessagesForID(socket.user.id)
    socket.broadcast.emit("user connected", {
      socketID,
      name: socket.user.name,
      id: socket.user.id,
      messages: messages
    });

    socket.on('disconnect', () => {
      users.delete(socket.user.id)
      console.log( Array.from(users.values()))
      io.emit('users', Array.from(users.values()))
    })
})

httpServer.listen(4000)