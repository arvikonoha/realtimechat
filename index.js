const {Server} = require('socket.io')

const express = require("express");
const cors = require('cors');
const { createServer } = require("http");
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
const routes = require('./routes').routes
const ioHandler = require('./routes').ioHandler

app.use(cors());
app.use(express.json());
app.use('/', routes)

const io = new Server(httpServer, {cors: {origin: "http://localhost:3001"}})
ioHandler(io)

swaggerDocs(app, 4000)
httpServer.listen(4000)