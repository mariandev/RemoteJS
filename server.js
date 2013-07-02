var http = require('http');
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(process.env.VMC_APP_PORT || 1337);

var io = require('socket.io').listen(server);

var connected_apps = []; // [socket id, app id]
var sockets_type = [];

var debug = true;

function log(m){if(debug)console.log(m);};

io.sockets.on('connection', function (socket) {
	socket.on('connect', function (data){

		sockets_type.push({
			sid: socket.id,
			type: data.type
		});

		if(data.type == 'remote'){
			log('Remote init has started ( socket: '+socket.id+' )');
			var f = 0;//app found
			for(var i=0;i<connected_apps.length;i++)
				if(connected_apps[i].room_id == data.id && connected_apps[i].remote_id == null){
					log('App has been founded ( room: '+connected_apps[i].room_id+' )   '+(io.sockets.clients(connected_apps[i].room_id)).length);
					f = 1;
					connected_apps[i].remote_id = socket.id;
					socket.join(connected_apps[i].room_id);
					socket.emit('connection_successful', {rid: connected_apps[i].room_id});
					io.sockets.in(connected_apps[i].room_id).emit('remote_connected', {});
				}
			if(!f)
				socket.emit('error', {err_id: 1});
		}else if(data.type == 'app'){
			
			var connection_id = Math.floor(Date.now()*Math.random()/Math.pow(10,6)),
				rid = data.id+'_'+connection_id;

			socket.join(rid);

			log('App init started ( socket: '+socket.id+' )  '+(io.sockets.clients(rid)).length);

			connected_apps.push({
				id: connection_id,
				app_id: socket.id,
				remote_id: null,
				room_id: rid
			});
			socket.emit('connection_successful', {rid: rid});
		}
	});
	socket.on('send_data', function (data){
		io.sockets.in(data.rid).emit('receive_data', {receive: data.send, to: data.to});
	});

	socket.on('disconnect', function () {
		log('Something disconnected: '+socket.id);
	    for(var i=0;i<connected_apps.length;i++)
	    	if(connected_apps[i].remote_id == socket.id){
	    		io.sockets.in(connected_apps[i].room_id).emit('remote_disconnected', {});
	    		log('Remote disconnected: '+socket.id);
	    		connected_apps[i].remote_id = null;
	    		break;
	    	}else if(connected_apps[i].app_id == socket.id){
	    		log('App disconnected: '+socket.id);
	    		io.sockets.in(connected_apps[i].room_id).emit('app_disconnected', {});
	    		connected_apps.splice(i, 1);
	    		break;
	    	}
	});

});



/*

Errors:
	1. App not found


*/