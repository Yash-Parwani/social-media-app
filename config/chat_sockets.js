//this will be handling sockets on the backend i.e its the observer (server) of our observer-subscriber pattern

module.exports.chatSockets = function(socketServer){
    //socketServer is the chatServer that is sent from the main index.js using above chatSockets function only

    /*
    
To receive the request for establishing a connection, we need a { chat_socket.js }
file.


Whenever a connection request is received, the server automatically will send back
the acknowledgment to the frontend.


Whenever the client disconnects from the server, an automatic disconnect event is
fired.

    */


  let io = require('socket.io')(socketServer);

  io.sockets.on('connection',function(socket){
           console.log('new connection received',socket.id);

           socket.on('disconnect',function(){
              console.log('socket disconnected!');
           });



           // recieve request to join room
           socket.on('join_room',function(data){
            console.log("joining request received",data);


            // join the user to the requested room
            socket.join(data.chatroom);
              //send the data of the joined user back to the client
            io.in(data.chatroom).emit('user_joined', data);
           });
  });
}