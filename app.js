function signup(){
	
	var usr_ref=document.getElementById("usr").value;
	var password=document.getElementById("psd").value;
	var email=document.getElementById("email").value;
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success){
		console.log("success "+ success);
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
		alert(errorMessage);
	});
}
function signin(){
	var e_email = document.getElementById("e-email").value;
	var e_pass = document.getElementById("e-pass").value;
	firebase.auth().signInWithEmailAndPassword(e_email,e_pass).then(function(success){
		console.log("success" + success);
	}).catch(function(error){
		alert(errorMessage);
	});
}
function inf(){
	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
	alert(providerData+"<br>"+email);
  } else {
    // User is signed out.
    // ...
	alert("user is signed out");
  }
});

}