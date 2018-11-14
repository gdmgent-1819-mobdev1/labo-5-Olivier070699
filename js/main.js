// Initialize Firebase 
let config = {
	apiKey: "AIzaSyDzrZAjTtDKbj4fUJkH4OtDsgiJEfDVuZM",
    authDomain: "labo5-ae9c9.firebaseapp.com",
    databaseURL: "https://labo5-ae9c9.firebaseio.com",
    projectId: "labo5-ae9c9",
    storageBucket: "labo5-ae9c9.appspot.com",
    messagingSenderId: "803712555220"
};
firebase.initializeApp(config);

// ELEMENTS
const txtEmail = document.getElementById("mail");
const txtPassword = document.getElementById("password");
const btnLogin = document.getElementById("signin");
const btnSignUp = document.getElementById("signup");
const btnLogout = document.getElementById("logout");
const loginDiv = document.getElementById ("loginDiv");
const welcome = document.getElementById("welcome");
const faults = document.getElementById("fouten");
const blogSection = document.getElementById("blogSection");

// SIGN IN
btnLogin.addEventListener('click', e =>{
	const email = txtEmail.value;
	const pass = txtPassword.value;
	const auth = firebase.auth();

	const promise = auth.signInWithEmailAndPassword(email, pass);
	promise.catch(e => faults.innerHTML = e.message);
});

// SIGN UP
btnSignUp.addEventListener('click', e =>{
	const email = txtEmail.value;
	const pass = txtPassword.value;
	const auth = firebase.auth();

	const promise = auth.createUserWithEmailAndPassword(email, pass);
	promise.catch(e => faults.innerHTML = e.message);
});

// SIGN OUT
btnLogout.addEventListener('click', e => {
	firebase.auth().signOut();
})

// REALTIME LISTENER
firebase.auth().onAuthStateChanged(firebaseUser => {
	if (firebaseUser) {
		console.log(firebaseUser);
		btnLogout.classList.remove('hide');
		loginDiv.classList.add('hide');
		welcome.classList.remove('hide');
		welcome.innerHTML =  firebaseUser.email;
		blogSection.classList.remove('hide');
		localStorage.setItem('name', firebaseUser.email);
	}else{
		console.log('not logged in');
		btnLogout.classList.add('hide');
		welcome.classList.add('hide');
		loginDiv.classList.remove('hide');
		blogSection.classList.add('hide');
	}
})

//BLOG
let sendPost = document.getElementById('sendPost');
let fout_post = document.getElementById('fout_post');
let name = localStorage.getItem('name');

// TIME
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1;
let yyyy = today.getFullYear();

let min = today.getMinutes();
let hour = today.getHours();

let post_time = hour + ':' + min + ", " + dd + '/' + mm + '/' + yyyy;


// SAVE CONTENT IN FIREBASS
sendPost.addEventListener('click', function() {
	let title = document.getElementById('title').value;
	let body = CKEDITOR.instances.editor1.getData();	
	firebase.database().ref("messages").push({

		title:title,
		body:body,
		date:post_time,
		name:name

	});
});

function read_data(){
	document.getElementById('tekst').innerHTML = "";
	let raw = firebase.database().ref("messages");
	raw.on("value", function(snapshot){
		snapshot.forEach(function (childSnapshot){
			data = childSnapshot.val();
			let inhoud = "";
			let post_content = "<div class='post'><h1>" + data.title + "</h1><p>" + data.body + "</p><p id='post_time'>posted at " + data.date + " by "  + data.name + "</p></div>";
			document.getElementById('tekst').insertAdjacentHTML('afterbegin', post_content);
		})
	})
}

read_data();