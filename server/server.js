const { exportGamestate } = require("../gameEngineStuff/mechanics")

const httpServer = require("http").createServer()
const io = require('socket.io')(httpServer, {
    serveClient: false,
    cors: {
      //I don't like using *, but figuring out what the hell was going wrong was too much of a bother when I just want to code a prototype.
      origin: "*",
    }
  });

console.log("Server is on!")

io.on('connection', client => {
    client.emit('init', { data: 'Connection established!'})
    console.log('Client connection')

    client.on("requestBoardState", handleRequestEvent)

    function handleRequestEvent(){
      console.log("Request!")
      let exportBoard = exportGamestate()
      client.emit('requestRecd' , exportBoard)
    }

})


httpServer.listen(3000)


