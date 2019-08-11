/*
 * @Description: 
 * @version: 
 * @Date: 2019-08-11 11:37:31
 * @LastEditors: yeyifu
 * @LastEditTime: 2019-08-11 17:23:08
 * @Author: yeyifu
 * @LastModifiedBy: yeyifu
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//一个客户端连接的字典，当一个客户端连接到服务器时，
//会产生一个唯一的socketId，该字典保存socketId到用户信息（昵称等）的映射
var connectionList = {};
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//所有的连接
io.on('connection', function(socket){
  //客户端连接时，保存socketId和用户名
  var socketId = socket.id;
  // 将用户存储在socket里面
  connectionList[socketId] = {
      socket: socket
  };
  // console.log('a user connected',socket)
  // 接收名称
  socket.on("join", function (name) {
    var date=new Date();
    var year=date.getFullYear();      
    io.emit("join", {name:name,date:year});

    console.log("eeee",socketId,name)
    connectionList[socketId].username =name;
  })

  //用户离开聊天室事件，向其他在线用户广播其离开
  socket.on('disconnect', function () {
    console.log("wewewew",connectionList[socketId].username)
    if (connectionList[socketId].username) {
        io.emit('broadcast_quit', {
            username: connectionList[socketId].username
        });
    }
    delete connectionList[socketId];
});
  socket.on("message", function (msg) {
    io.emit("message", msg) //将新消息广播出去
  })
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});