const express = require('express')
const app = express()
let http = require('http').createServer(app)
const port = process.env.PORT || 5000

let io = require('socket.io')(http)
// app.use(express.static('/Users/sumeetsingh/Documents/Webrtc Sample Apps/App3/index.html'))
app.use(express.static(__dirname, {index:'/index.html'}));
http.listen(port, () => {
console.log('listening on', port)
// console.log(__dirname + '/index.html')
})

io.on('connection', socket => {
    console.log('a user connected')

    socket.on('create or join', room => {
        console.log('create or join', room)
        // console.log(socket, 'socket =')
        // const selfRoom = io.sockets.adapter.rooms
        let myRoom = io.sockets.adapter.rooms.get(room)|| {size: 0}
        console.log('room_value =', io.sockets.adapter.rooms)
        // console.log('sumeet' in io.sockets.adapter.rooms)
        // console.log('room =', io.sockets.adapter.rooms['sumeet'])
        // var room = io.sockets.adapter.rooms
        // console.log('Selfroom =', myRoom)
        
        console.log('my_room_value =', myRoom.size)
        var numClients = myRoom.size
        console.log(room, 'has', numClients, 'clients')
        // console.log(io.sockets, 'value =')

        if(numClients == 0){
            socket.join(room)
            console.log('first join')
            socket.emit('created', room)  
            // const numClients = 1  
        }
        else if(numClients == 1)
        {
            socket.join(room)
            console.log('second join')
            socket.emit('joined', room) 
        }
        // else if(numClients == 2)
        // {
        //     socket.join(room)
        //     console.log('third join')
        //     socket.emit('joined', room) 
        // }
        else 
        {
            socket.emit('full', room) 
        }
    })

    socket.on('ready', room => {
        console.log('I am in ready')
        socket.broadcast.to(room).emit('ready')
    })

    socket.on('candidate', event => {
        console.log('I am in candidate')
        socket.broadcast.to(event.room).emit('candidate', event)
    })

    socket.on('offer', event => {
        console.log('I am in offer')
        socket.broadcast.to(event.room).emit('offer', event.sdp)
    })
    
    socket.on('answer', event => {
        console.log('I am in answer')
        socket.broadcast.to(event.room).emit('answer', event.sdp)
    })
})

