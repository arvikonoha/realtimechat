const orm = require('../orm')

module.exports = (io, room) => async (socket) => {
    try {
      console.log('Connected to the room ', room)

      const socketID = socket.id;
      
      socket.user = socket.request.user
      const socketUser = socket.user

      socket.join(`${room}-${socketUser.id}`)

      /* 1. Make a list of active users */
      let users = new Map();
      let rooms = new Map();
      for (let [id, socket] of io.of(room).sockets) {

        /* Get the previous convorsation between existing and the new user */
        const previousConversations = await orm.messages.getMessagesForID(socket.user.id, socketUser.id)

        /* Update the active user list */
        users.set(socket.user.id,{
          socketID: id,
          name: socket.user.name,
          id: socket.user.id,
          messages: previousConversations
        });

        /* Send the connected user and their messages to the existing active user */
        io.of(room).to(id).emit('user connected', {
          socketID,
          name: socketUser.name,
          id: socketUser.id,
          messages: previousConversations
        })
      }

      const existingRooms = await orm.room.list()

      for (let room of existingRooms) {
        
        /* Get the previous convorsation between existing and the new user */
        const previousConversations = await orm.messages.getMessagesForRoom(room._id)
        console.log(previousConversations)
        socket.join(room._id.toString())
        console.log(room._id.toString())
        rooms.set(room._id,{
          name: room.name,
          id: room._id,
          messages: previousConversations
        });
      }
      /* Send the active users, rooms list to the socket connected */
      socket.emit("users", Array.from(users.values()));
      socket.emit("rooms", Array.from(rooms.values()));

      socket.on('room:created', async (newRoom) => {
        socket.join(newRoom.id)
        io.of(room).emit('room connected', {...newRoom, messages: []})
      })
      /* Handle chat sent */
      socket.on('chat:send', async ({to, content, targetRoom=room}, callback) => {
          const result = await orm.messages.create({
            to,
            from: socket.user.id,
            content,
            room: targetRoom
          })
          const roomName = targetRoom === room ? `${room}-${to}`: targetRoom
          console.log(roomName, room)
          io.of(room).to(roomName).emit('chat:reply', {...result._doc, from: {
            _id: socket.user._id,
            name: socket.user.name
          }})
          callback({...result._doc, from: {
            _id: socket.user._id,
            name: socket.user.name
          }})
      });
  
      socket.on('disconnect', () => {
        io.of(room).emit('user disconnected', {
          name: socketUser.name,
          id: socketUser.id,
        })
      })
    } catch (error) {
      console.log("Error: ", error)
    }
  }