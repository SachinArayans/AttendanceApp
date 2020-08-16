
firebase.auth().onAuthStateChanged(function(user){
		if(user){
			firebase.database().ref('/admins/' + user.uid).once('value').then(function(snapshot) {	
					try{		  
							  if(snapshot.val().userId==user.uid){
								  console.log("Matched as Admin ");
								  window.location.assign("./admin.html");
							  }
							  else{
								console.log(snapshot.key + " !=admins | something went wrong!");
								signupPopup(user.email);
							  }
					}
					catch(err){
						console.log("catch trigrred as admin with error = "+err);
						signupPopup(user.email);
					}
				});
			
			//-----below code is to check if user is already have an account as a teacher
			firebase.database().ref('/teachers/' + user.uid).once('value').then(function(snapshot) {
							try{	
									if(snapshot.val().userId==user.uid){
										  console.log("Matched as Teacher");
										  window.location.assign("./teacher.html");
									  }
									  else{
										console.log(snapshot.key + " !=teacher | something went wrong!");
										signupPopup(user.email);
									}		 
							}
							catch(err){
								console.log("catch trigrred as admin with error = "+err);
								signupPopup(user.email);
								}
				});
				
				//-----below code is to check if user is already have an account as a student
			firebase.database().ref('/students/' + user.uid).once('value').then(function(snapshot) {
							try{
									if(snapshot.val().userId==user.uid){
										  console.log("Matched as student");
										  window.location.assign("./student.html");
									  }
									  else{
										console.log(snapshot.key + " !=teacher | something went wrong!");
										signupPopup(user.email);
									  }
							}
							catch(err){
									console.log("catch trigrred as admin with error = "+err);
									signupPopup(user.email);
									}
				});
		
		}
	});
//------- SAve Admin Information ----------
function saveAdminInfo(){
	var adminInfo={
		collegeName:document.getElementById("college-name").value,
		adminName:document.getElementById("admin-name").value,
		universityName:document.getElementById("university-name").value,
		mobileNo:document.getElementById("mobile-no").value,
		website:document.getElementById("website").value,
		address:document.getElementById("address").value,
		gender:gender("gender"),
		userId:firebase.auth().currentUser.uid,
		email:firebase.auth().currentUser.email
	};
	if(adminInfo.collegeName!="" && adminInfo.adminName!="" && adminInfo.universityName!="" && adminInfo.address!="" && adminInfo.gender!=""){
		firebase.auth().onAuthStateChanged(function(user){
			if(user){
				writeAdminData(user.uid,adminInfo);
			}
			else{
				alert("You are not Logged In !");
			}
		});
	}
	else{
		alert("Fill all required Info!");
	}
}
//------- SAve Teacher Information ----------
function saveTeacherInfo(){
	var teacherInfo={
		teacherName:document.getElementById("teacher-name").value,
		teacherMobileNo:document.getElementById("teacher-mobile-no").value,
		teacherAddress:document.getElementById("teacher-address").value,
		teacherGender:gender("gender"),
		teacherSubjects: teacherSub("sub"),
		userId:firebase.auth().currentUser.uid,
		email:firebase.auth().currentUser.email
	};
	if(teacherInfo.teacherName!="" && teacherInfo.teacherGender!=""){
		firebase.auth().onAuthStateChanged(function(user){
			if(user){
				writeTeacherData(user.uid,teacherInfo);
			}
			else{
				alert("You are not Logged In !");
			}
		});
	}
	else{
		alert("Fill all required Info!");
	}
}

//------- SAve Students Information ----------
function saveStudentInfo(){
	var studentInfo={
		studentName:document.getElementById("student-name").value,
		fatherName:document.getElementById("student-father-name").value,
		rollNo:document.getElementById("student-roll-no").value,
		branch:document.getElementById("student-branch").value,
		semester:document.getElementById("student-sem").value,
		course:document.getElementById("student-course").value,
		mobileNo:document.getElementById("student-mobile-no").value,
		address:document.getElementById("student-address").value,
		studentGender:gender("gender"),
		userId:firebase.auth().currentUser.uid,
		email:firebase.auth().currentUser.email
	};
	if(studentInfo.studentName!="" && studentInfo.fatherName!="" && studentInfo.branch!="" && studentInfo.semester!="" && studentInfo.course!="" && studentInfo.studentGender!=""){
		firebase.auth().onAuthStateChanged(function(user){
			if(user){
				writeStudentData(user.uid,studentInfo);
			}
			else{
				alert("You are not Logged In !");
			}
		});
	}
	else{
		alert("Fill all required Info!");
	}
}


var database = firebase.database();

//-----------Write Admin Data Function
function writeAdminData(userId,adminInfo) {
  firebase.database().ref('/admins/' + userId).set(adminInfo).then(function(success){
	  alert("successfully saved!");
	  window.location.assign("./admin.html");
	  });
}

//-------------write Teacher data function
function writeTeacherData(userId,adminInfo) {
  firebase.database().ref('/teachers/' + userId).set(adminInfo).then(function(success){
	  alert("successfully saved!");
	  window.location.assign("./teacher.html");
	  });
}
//-------------write Student data function
function writeStudentData(userId,adminInfo) {
  firebase.database().ref('/students/' + userId).set(adminInfo).then(function(success){
	  alert("successfully saved!");
	  window.location.assign("./student.html");
	  });
}
function gender(name){
	if(document.getElementsByName(name)[0].checked){
		return "male";
	}
	else{
		return "female";
	}
}

function teacherSub(name){
	var name=document.getElementsByName(name);
	var txt="";
	var i=0;
	for(i=0;i<name.length;i++){
		if(name[i].checked){
		txt += name[i].value + ", ";
		}
	}
	return txt;
}
//------------Sign Up function --------------------
function signup(){
	password=document.getElementById("login-password").value;
	email=document.getElementById("login-email").value;
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(success){
		console.log("success" + success);
		signupPopup(email);
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
		document.getElementById("login-error").innerHTML="<strong>"+errorCode+"</strong> "+errorMessage;
		document.getElementById("login-error-div").style.display="block";
	});
}
function signupPopup(email){
		document.getElementById("sc-1").innerHTML=email;
		document.getElementById("sc-2").innerHTML=email;
		document.getElementById("sign-up-option").style.display="block";
}
//-----------------------Sign in function
function signin(){
	
	password=document.getElementById("login-password").value;
	email=document.getElementById("login-email").value;
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(success){
		console.log("success" + success);
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
		document.getElementById("login-error").innerHTML="<strong>"+errorCode+"</strong> "+errorMessage;
		document.getElementById("login-error-div").style.display="block";
	});
}

//-----------------------Password reset email sent
function resetPassword(){
	
	//password=document.getElementById("login-password").value;
	email=document.getElementById("login-email").value;
				firebase.auth().sendPasswordResetEmail(email).then(function() {
			  alert("Password reset email sent to :"+email);
			}).catch(function(error) {
			  alert("Error!"+error.message);
				document.getElementById("login-error").innerHTML="<strong>"+error.code+"</strong> "+error.message;
				document.getElementById("login-error-div").style.display="block";
			});
}

//------------------sign in with google function
function googleSignIn(){
	var provider = new firebase.auth.GoogleAuthProvider();
	
		firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var userr = result.user;
	  console.log(userr);
	  // ...
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  alert(errorMessage);
		document.getElementById("login-error").innerHTML="<strong>"+errorCode+"</strong> "+errorMessage;
		document.getElementById("login-error-div").style.display="block";
	});
}
//------------------sign in with facebook function
function fbSignIn(){
	var provider = new firebase.auth.FacebookAuthProvider();
	
			firebase.auth().signInWithPopup(provider).then(function(result) {
				  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
				  var token = result.credential.accessToken;
				  // The signed-in user info.
				  var userr = result.user;
				  console.log(userr);
				}).catch(function(error) {
				  // Handle Errors here.
				  var errorCode = error.code;
				  var errorMessage = error.message;
				  // The email of the user's account used.
				  var email = error.email;
				  // The firebase.auth.AuthCredential type that was used.
				  var credential = error.credential;
					alert(errorMessage);
					document.getElementById("login-error").innerHTML="<strong>"+errorCode+"</strong> "+errorMessage;
					document.getElementById("login-error-div").style.display="block";
				});
}
//------------- admin information pop up function---------------
function adminPopup(){
	document.getElementById("sign-up-option").style.display="none";
	document.getElementById("admin-info-form").style.display="block";
	document.getElementById("login-container").remove();
	document.getElementById("teacher-info-form").style.display="none";
	document.getElementById("student-info-form").style.display="none";
}

//------------- teacher information pop up function---------------
function teacherPopup(){
	document.getElementById("sign-up-option").style.display="none";
	document.getElementById("admin-info-form").style.display="none";
	document.getElementById("teacher-info-form").style.display="block";
	document.getElementById("login-container").remove();
	document.getElementById("student-info-form").style.display="none";
}

//------------- teacher information pop up function---------------
function studentPopup(){
	document.getElementById("sign-up-option").style.display="none";
	document.getElementById("admin-info-form").style.display="none";
	document.getElementById("teacher-info-form").style.display="none";
	document.getElementById("login-container").remove();
	document.getElementById("student-info-form").style.display="block";
}
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