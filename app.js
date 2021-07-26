const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
  },
})

app.use("*", (req, res) => {
  res.send('Hello World!')
})

let users = {};


io.on("connection", (socket) => {
    users[socket.id] = 'Anonim'
    broadcast('users', users)

    socket.on('user:name', (name) => {
        users[socket.id] = name
        broadcast('users', users)
    })

    socket.on('message', (message) => {
        broadcast('message', message)
    })

    socket.on('disconnect', () => {
        delete users[socket.id] 
        broadcast('users', users)
    })


    

    function broadcast(event, data) {
        socket.emit(event, data)
        socket.broadcast.emit(event, data)
     }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
