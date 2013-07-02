function RemoteJS(type, options){

	function log(msg){console.log('RemoteJS: '+msg);}

	if(!options)
		var options = {};
	if(!options.server) options.server = 'http://localhost:8080';
	if(!options.remote_connected) options.remote_connected = function (data){log('Remote connected - '+JSON.stringify(data));};
	if(!options.remote_disconnected) options.remote_disconnected = function (data){log('Remote disconnected - '+JSON.stringify(data));};
	if(!options.app_disconnected) options.app_disconnected = function (data){log('App disconnected - '+JSON.stringify(data));};
	if(!options.receive_data) options.receive_data = function (data){log('Data received - '+JSON.stringify(data));};
	if(!options.app_id) options.app_id = false;
	
	this.type = type;
	this.rid = null;

	var that = this;

	var socket = io.connect(options.server);

	socket.on('remote_connected', function (data){
		options.remote_connected(data);
	});

	socket.on('remote_disconnected', function (data){
		options.remote_disconnected(data);
	});

	socket.on('app_disconnected', function (data){
		options.app_disconnected(data);
	});

	socket.on('receive_data', function (data){
		if(data.to == that.type) options.receive_data(data.receive);
	});

	this.connect = function (id, cb){

		if(this.type == 'remote' && options.app_id) id = options.app_id+'_'+id;
		if(this.type == 'app' && options.app_id){
			cb = id;
			id = options.app_id;
		}
		else{
			log('You need to set an app id.');
		}
		socket.emit('connect', {type: this.type, id: id});
		socket.on('connection_successful', function (data){
			that.rid = data.rid;
			if(cb && typeof cb == 'function') cb(data.rid);
			console.log(that.rid);
		});
	};

	this.send = function (data){
		socket.emit('send_data', {send: data, rid: this.rid, to: (this.type == 'app'?'remote':'app')});
	}
}


/*

var remotejs = new RemoteJS('app', options);
var remotejs = new RemoteJS('remote', options);

options: 
	- server : string
	- remote_connected : function
	- remote_disconnected : function
	- app_disconnected : function

*/