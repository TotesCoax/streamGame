const io = require('socket.io')({
    cors: {
      //I don't like using *, but figuring out what the hell was gong wrong was too much of a bother when I just want to code a prototype.
      origin: "https://localhost:3000",
    }
  });

console.log("Server is on!")

io.on('connection', client => {
    client.emit('init', { data: 'Connection established!'})
})

io.listen(3000)

function serverSendReadyCheck(){
    //This is run after the game is set up and will inform the players they need to pick Active and Support players
    console.log("Server Ready check!")
}

