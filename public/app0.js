
//---extra use less function just to check 
function pp(){
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			alert(user.uid);
		}
		else{
			alert("logged out");
		}	
	});
	
}