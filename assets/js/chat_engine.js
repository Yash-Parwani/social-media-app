//this file will be handling sockets on the front-end i.e client side i.e of the subscribers of our observer-subscriber pattern
class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
         // initiating connection to port 5000
         //IO is a global variable that is available as soon we include the file { socket_io.js } on CDN.js.

        this.socket = io.connect('http://localhost:5000')


        // calling the connection handler in the constructor only if there is user's Email since if users Email is present it means that user is signed in since from home.ejs we have sent email of signed in user only
        if(this.userEmail){
            this.connectionHandler();
        }
    }
    connectionHandler(){

        let self = this;

        this.socket.on('connect',function(){
            console.log("Connection established using sockets..!");
            // send request to join room
            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom : 'konnect'
            });
            //get notified when a user has joined the room
            self.socket.on('user_joined',function(data){
                console.log('a user joined !',data);
            })
        });
    }
    
}