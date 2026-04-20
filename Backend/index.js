import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// -----------Created app -----------
const app = express();
app.use(cors());

// ---------- Server Making ----------
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const userSocketMap = {}; // Just a temporary storage variable, to keep a track of which socket id, belongs to which username 

io.on('connection', (socket) => {

  socket.on('join', ({ roomId, username }) => { // username, and roomid are being received from the frontend in here
    userSocketMap[socket.id] = username; // storing them into the storage variable 
    socket.join(roomId); // add this user to the specified roomid room  

    const clients = [...(io.sockets.adapter.rooms.get(roomId) || [])] // adapter is used to get the list of all the users in the room  , sockets refers to the connected users in the room , rooms: Provide with the data of all the room. Overall, we are getting the ids of all the sockets in the room 
      .map(id => ({ socketId: id, username: userSocketMap[id] })); // we get only the id from the upper adapter, so we are also conterting that into format id : username through the use of map in the array itself  

    io.to(roomId).emit('joined', { // when a person joins, emit this message to everyone 
      clients, // The whole list
      username, // who joined
      socketId: socket.id // who joined 
    });
  });

  socket.on('code-change', ({ roomId, code }) => { // Here we are basically taking from that one user, and then sending the data to all the users in the room 
    socket.to(roomId).emit('code-change', { code }); // in other words, that socket is sending to the whole room 
  });

  socket.on('sync-code', ({ socketId, code }) => { // This here is for the new user, who joins the room, and we are sending the current code to him 
    io.to(socketId).emit('code-change', { code }); // here in the room is sending data to the new person, that joined 
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue;

      socket.to(roomId).emit('disconnected', { // Basic disconnect functionality 
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    }

    delete userSocketMap[socket.id];
  });
});

server.listen(5000, () => console.log('Server started on 5000'));