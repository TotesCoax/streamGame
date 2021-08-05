const io = require('socket.io')({
    cors: {
      origin: "*",
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

