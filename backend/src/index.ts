import { WebSocketServer} from 'ws';
import type { WebSocket} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket:WebSocket) => {

  socket.on("message", (message) => {
     const parsedMessage = JSON.parse(message.toString());
     if(parsedMessage.type === 'join'){
      allSockets.push({
        socket,
        room : parsedMessage.payload.roomId
      })
     }

     if(parsedMessage.type === 'chat'){
       let currentUserRoom = null;
       for (let i =0 ; i < allSockets.length ; i++){
        const currentSocket = allSockets[i];
        if(currentSocket && currentSocket.socket == socket){
          currentUserRoom = currentSocket.room
        }
       }

       for (let i = 0; i < allSockets.length ; i++){
        const currentSocket = allSockets[i];
        if (currentSocket && currentSocket.room === currentUserRoom){
          currentSocket.socket.send(parsedMessage.payload.message)
        }
       }
     }

  })

  socket.on("disconnect", () => {
    allSockets = allSockets.filter(x => x.socket !== socket);
  })
})


