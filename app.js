const express = require('express')
const app = express()
let http = require('http').createServer(app)
const port = process.env.PORT || 5000

let io = require('socket.io')(http)

app.use(express.static(__dirname, {index:'/index.html'}));
http.listen(port, () => {
})

io.on('connection', socket => {

    socket.on('create or join', room => {

        let myRoom = io.sockets.adapter.rooms.get(room)|| {size: 0}
    
        var numClients = myRoom.size
    
        if(numClients == 0){
            socket.join(room)
            socket.emit('created', room)  
        }
        else if(numClients == 1)
        {
            socket.join(room)
            socket.emit('joined', room) 
        }
        else 
        {
            socket.emit('full', room) 
        }
    })

    socket.on('ready', room => {
        socket.broadcast.to(room).emit('ready')
    })

    socket.on('candidate', event => {
        socket.broadcast.to(event.room).emit('candidate', event)
    })

    socket.on('offer', event => {
        socket.broadcast.to(event.room).emit('offer', event.sdp)
    })
    
    socket.on('answer', event => {
        socket.broadcast.to(event.room).emit('answer', event.sdp)
    })
})

