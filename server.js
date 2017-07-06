
"use strict"

// **************** HTTP ***************

let fs = require("fs");
let ent = require("ent");
let express = require("express");
let app = express();
let server = app.listen("8080");
let io = require("socket.io").listen(server);

let todolist = [];

// Return CSS ( LESS )
app.get("/style", (p_req, p_res) => {

	fs.readFile("./style/style.less", function (p_err,p_data){
		if(p_err){
			console.log("ERROR : " + p_err.message);
			p_res.setHeader('Content-Type', 'text/html ');
			p_res.status(404).send("ERREUR 404 : Page introuvable");
		}
		else{
			p_res.setHeader('Content-Type', 'text/css');
			p_res.end(p_data);
		}
	});
})

// Return JavaScript script
.get("/scripts/:_script", (p_req, p_res) => {

	if(p_req.params._script == 1){
		fs.readFile("./scripts/todolist.js", function (p_err,p_data){
			if(p_err){
				console.log("ERROR : " + p_err.message);
				p_res.setHeader('Content-Type', 'text/html ');
				p_res.status(404).send("ERREUR 404 : Page introuvable");
			}
			else{
				p_res.setHeader('Content-Type', 'text/html');
				p_res.end(p_data);
			}
		});
	}
	else{
		p_res.setHeader('Content-Type', 'text/html ');
		p_res.status(404).send("ERREUR 404 : Page introuvable");
	}
})

// Return View
.get("/app", (p_req, p_res) => {
	p_res.setHeader('Content-Type', 'text/html');
	p_res.sendFile( __dirname + "/views/todo.html");
})


// Else
.use( (p_req, p_res, p_next) => {
	p_res.redirect("/app");
});

// ****************** SOCKET *******************

io.sockets.on("connection", (p_socket) => {

	p_socket.emit("todolist", todolist);

	p_socket.on("add", (p_todo) => {
		todolist.push(ent.encode(p_todo));
		p_socket.broadcast.emit("add", todolist[todolist.length-1]);
	});

	p_socket.on("remove", (p_id) => {
		if(p_id >= 0 && p_id < todolist.length){
			todolist.splice(p_id, 1);
			p_socket.broadcast.emit("remove", p_id);
		}

	});
});

