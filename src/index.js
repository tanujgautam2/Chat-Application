
const express= require("express");
const http=require('http')
const path = require("path");
const Filter= require("bad-words");
const socketio=require('socket.io')
const app=express();
const server =http.createServer(app) 
const io=socketio(server)
// if we dont do this experess do it by itselp and it make no change on our program
const port =process.env.PORT || 1000
const publicDirectoryPath= path.join(__dirname ,'../public')
app.use(express.static(publicDirectoryPath)) 
const { generatemessage, generatelocationmessage }= require('./utils/messages')
const{  addUser, removeUser,getUser, getUserInRoom }=require('./utils/user')
// let count=0//
io.on('connection',(socket)=>
{
    console.log("new websocket connection" )
    // socket.emit('countupdated',count)

    // socket.on('increment',()=>
    // {
    //     count++;
    //     io.emit("countupdated",count)
    // })

   
         socket.on('join',({username,room},callback)=>
         {
            const { error, user}= addUser({id:socket.id,username,room})
            if(error)
            {
                return callback(error)
            }
          //hare the main event is applied through only the seperate room got created 
          socket.join(room)
          
    //priviously we had 3 emit events 
    //--socket.emit //--io.emit // --socket.bradcast.emit
    //but for the rooms we have a upgradation of the last two
    //--io.to.emit  // --socket.broadcast.to.emit

    socket.emit('message',generatemessage('Admin','welcome!'))

    socket.broadcast.to(user.room).emit('message',generatemessage('Admin',`${user.username} has joined! `))
    io.to(user.room).emit('roomdata',
    {
        room:user.room,
        users: getUserInRoom(user.room)
    })
         })
         
    socket.on('sendmessage', (message, callback)=>
    {
        const user=getUser(socket.id)
        const filter= new Filter()
        if(filter.isProfane(message))
        {
           return callback('profanity is not allowed') 
        }
        io.to(user.room).emit('message',generatemessage(user.username, message))
        callback()
    })
    

    socket.on('sendlocation',(coords,callback)=>
    {
        const user =getUser(socket.id)
        //  io.emit('message',`Location: ${ coords.latitude}, ${coords.longitude}` )
         io.to(user.room).emit('messagelocation',generatelocationmessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
    })

    socket.on('disconnect', ()=>
    {
        const user =removeUser(socket.id)
       
        if(user)
        {
         io.to(user.room).emit('message', generatemessage('Admin',`${user.username} has left!`))
         io.to(user.room).emit('roomdata',
         {
            room: user.room,
            users: getUserInRoom(user.room)
         })
        }

    })

})


server.listen(port,()=>
{
    console.log(`server is up for the port ${port}!`);
})


