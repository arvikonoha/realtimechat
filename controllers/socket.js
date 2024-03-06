const orm = require('../orm')

module.exports = (io, project) => async (socket) => {
    try {
      console.log('Connected to the project ', project)

      const socketID = socket.id;
      
      socket.user = socket.request.user;
      const socketUser = socket.user

      /* 1. Make a list of active users */
      let users = new Map();
      let rooms = new Map();
      
      let projectDocument = await orm.rooms.list({name: project})

      if (!projectDocument.length) {
        projectDocument = await orm.rooms.create({name: project, project})
      } else {
        projectDocument = projectDocument[0]
      }
      
      socket.join(`${project}-${socketUser.id}`)
      for (let [id, socket] of io.of(project).sockets) {

        /* Update the active user list */
        users.set(socket.user.id,{
          socketID: id,
          name: socket.user.name,
          id: socket.user.id,
          messages: []
        });

        /* Send the connected user and their messages to the existing active user */
        io.of(project).to(`${project}-${socket.user.id}`).emit('user connected', {
          socketID,
          name: socketUser.name,
          id: socketUser.id,
          messages: []
        })
      }

      const existingRooms = await orm.rooms.list({project})

      for (let room of existingRooms) {
        
        /* Get the previous convorsation between existing and the new user */
        socket.join(room._id.toString())
        rooms.set(room._id,{
          name: room.name,
          id: room._id,
          project: room.project,
          messages: []
        });
      }

      /* Send the active users, rooms list to the socket connected */
      socket.emit("users", Array.from(users.values()));
      socket.emit("rooms", Array.from(rooms.values()).filter(room => room.name !== room.project));

      socket.on('room:created', async (newRoom) => {
        socket.join(newRoom.id)
        io.of(project).emit('room connected', {...newRoom, messages: []})
      })

      /* Handle chat sent */
      socket.on('chat:send', async ({to, content, targetRoom}, callback) => {
          targetRoom = targetRoom || projectDocument._id

          const result = await orm.messages.create({
            to,
            from: socket.user.id,
            content,
            room: targetRoom,
            project
          })
          const roomName = targetRoom === projectDocument._id ? `${project}-${to}`: targetRoom
          io.of(project).to(roomName).emit('chat:reply', {...result._doc, from: {
            _id: socket.user._id,
            name: socket.user.name
          }})
          if (callback) callback({...result._doc, from: {
            _id: socket.user._id,
            name: socket.user.name
          }})
          
      });
  
      socket.on('disconnect', () => {
        io.of(project).emit('user disconnected', {
          name: socketUser.name,
          id: socketUser.id,
        })
      })
    } catch (error) {
      console.log("Error: ", error)
    }
  }