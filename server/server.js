const io = require('socket.io')();

io.on('connection', client => {
    client.emit('init', { data: 'Connection established!'})
})

io.listen(3000)