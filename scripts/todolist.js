window.addEventListener("load", () => {

	let _host = "http://localhost:8080";
	let socket = io.connect(_host);
	let todolist = [];

	let addEventRemove = function(){
		let listRmTodo = document.getElementsByClassName("todo_remove");
		for(let i = 0; i < listRmTodo.length; i++){
			listRmTodo[i].addEventListener("click", function(e) {
				e.preventDefault();
				todolist.splice( e.target.id, 1 );
				let todolistHtml = todolist.length === 0 ? "Todolist vide ..." : "" ;
				for(let i = 0; i < todolist.length;i++){
					todolistHtml += '<li><a class="todo_remove" href="" title="Supprimer la tache" id="'+i+'"> X</a> - '+todolist[i]+'</li>';
				}
				document.querySelector(".todolist ul").innerHTML = todolistHtml;
				addEventRemove();
				socket.emit("remove", e.target.id);
			});
		}
	}

	socket.on("todolist" , (p_todolist) => {
		todolist = p_todolist;
		let todolistHtml = todolist.length > 0 ? "" : " Todolist vide ...";
		for(let i = 0; i < todolist.length;i++){
			todolistHtml += '<li><a class="todo_remove" href="" title="Supprimer la tache" id="'+i+'"> X</a> - <span>'+todolist[i]+'</span></li>';
		}
		document.querySelector(".todolist ul").innerHTML = todolistHtml;
		addEventRemove();

	});

	socket.on("add", (p_todo) => {
		if(todolist.length === 0){
			document.querySelector(".todolist ul").innerHTML = "";
		}
		todolist.push(p_todo);
		document.querySelector(".todolist ul").innerHTML += '<li><a class="todo_remove" href="" title="Supprimer la tache" id="'+(todolist.length-1)+'"> X</a> - <span>'+todolist[todolist.length-1]+'</span></li>' ;
		addEventRemove();
	});

	socket.on("remove", (p_id) => {
		if(p_id >= 0 && p_id < todolist.length){
			todolist.splice( p_id, 1 );

			let todolistHtml = todolist.length === 0 ? "Todolist vide ..." : "" ;

			for(let i = 0; i < todolist.length;i++){
				todolistHtml += '<li><a class="todo_remove" href="" title="Supprimer la tache" id="'+i+'"> X</a> - '+todolist[i]+'</li>';
			}
			document.querySelector(".todolist ul").innerHTML = todolistHtml;
			addEventRemove();
		}
	});



	document.getElementsByClassName("form_todo_button")[0].addEventListener("click", (e) => {
		e.preventDefault();
		let inputElt = document.getElementsByClassName("form_todo_text")[0];
		socket.emit("add", inputElt.value);
		 if(todolist.length === 0 ){
		 	document.querySelector(".todolist ul").innerHTML = "";
		 }
		todolist.push(inputElt.value);

		let todolistElt = document.querySelector(".todolist ul");
		todolistElt.innerHTML += '<li><a class="todo_remove" href="" title="Supprimer la tache" id="'+(todolist.length-1)+'"> X</a> - <span></span></li>' ;
		todolistElt.getElementsByTagName("span")[todolist.length-1].innerText = todolist[todolist.length-1];

		inputElt.value = "";
		addEventRemove();

	});

});