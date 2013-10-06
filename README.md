RemoteJS
========

Transform your smartphone into a remote/controller.

RemoteJS is a simple app that enables you to transform a smartphone into a remote. It has a simple API that anyone with basic javascript knowledge can understand.

Demo application
================

App: http://demo.mariandev.eu/remotejs/
Remote: http://demo.mariandev.eu/remotejs/remote.html

Demo code
=========

Application: 

	var remote = new RemoteJS('app',{
		server: 'your_remotejs_server.com',//if you don't want to host a server, the app will run on our server
		remote_connected: function(){...},
		remote_disconnected: function(){...},
		receive_data: function(data){...},
		on_error: function(data){...},
		app_id: ''//a string that makes your app unique
	});
	remote.connect();

Remote: 

	var remote = new RemoteJS('remote',{
		server: 'your_remotejs_server.domain_name.com',//if you don't want to host a server, the app will run on our server
		app_disconnected: function(){...},
		receive_data: function(data){...},
		on_error: function(data){...},
		app_id: ''//if you app name in 'remote_test' and you room_id is 'remote_test_123456', you will have to introduce , as room_id , just '123456'
	});
	remote.connect(room_id, function (){
		//callback
	});

After you set this things up you can send messages back and forth with:

	remote.send(data);//data: JSON
