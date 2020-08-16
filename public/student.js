firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var email = user.email;
    var uid = user.uid;
  } else {
    console.log("Not logged In");
	window.location.assign("./index.html");
  }
		//------------check for approved teachers list------
				database.ref("/students/"+user.uid+"/teachers/").on("value",function (snap){
				snap.forEach(function (cnap){					
				console.log(cnap.val());
				var aplist=document.createElement("li");
				aplist.className="list-group-item";
				aplist.innerHTML=cnap.val().approvedTeacherEmail+"  ";
				document.getElementById("apt").appendChild(aplist);
		});
		});  
		//----------------------------set DP -----------------------------------
		database.ref("/students/"+user.uid).on("value",function(snap){
			console.log(snap.val().dpURL);
			document.getElementById("my-dp-id").src=snap.val().dpURL;
		});
		studentDetailOnDashboard(user.uid);

});


database=firebase.database();
postListRef=database.ref("/teachers/");
postListRef.on("value",function (snap){
snap.forEach(function (cnap){
	var list=document.createElement("li");
	list.className="list-group-item";
	list.innerHTML="<strong>"+cnap.val().teacherName+ " </strong>( Subjects: "+cnap.val().teacherSubjects+")"+"  ";
	document.getElementById("avltch").appendChild(list);
	sendBtn=document.createElement("button");
	sendBtn.className="btn btn-info btn-xs";
	sendBtn.setAttribute("onclick","sendRequest('"+cnap.val().userId+"')");
	sendBtn.innerHTML= " Send Request";
	list.appendChild(sendBtn);
console.log(cnap.val().teacherName);
});
});
//-------------------request send function
function sendRequest(to){
	database.ref("/requests/"+to).set({
		"ffrom": firebase.auth().currentUser.uid,
		"to": to,
		"fname":firebase.auth().currentUser.email,
	});
	console.log("Request Sent");
	noti("Request Sent");
	}
////-----------corner Notification--------------
function noti(msg){
		var list=document.createElement("div");
	list.className="alert alert-success alert-dismissible noti";
	document.body.appendChild(list);
	sendBtn=document.createElement("a");
	sendBtn.setAttribute("href","#");
	sendBtn.setAttribute("data-dismiss","alert");
	sendBtn.setAttribute("aria-label","colse");
	sendBtn.className="close";
	sendBtn.innerHTML= "&times;";
	list.appendChild(sendBtn);
	ms=document.createTextNode(msg);
	list.appendChild(ms);
}

//------------------available Teachers Filter----
$(document).ready(function(){
  $("#searchAvailableTeachers").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#avltch li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
	//----studence record p/a search
  $("#attSearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#stAttendence tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


//--------------------------------- show attendence function-------------------------------------------
function showAttendenceResult(attendenceDate){
postListRef=database.ref("/students/"+firebase.auth().currentUser.uid+"/attendence/"+attendenceDate);
postListRef.on("value",function (snap){
	var trlist=document.createElement("tr");
	trlist.innerHTML="<td>"+attendenceDate+"</td>";
	document.getElementById("studentAttendenceRecord").appendChild(trlist);
snap.forEach(function (cnap){
	
		console.log(cnap.val());
		var list=document.createElement("td");
		list.innerHTML=cnap.val();
		trlist.appendChild(list);
			
		
});
});
}
//var attendenceDate="2020-02-10";
//showAttendenceResult(attendenceDate);
//----------------------- Student Detail show on dashboard function------------------
function studentDetailOnDashboard(usr){
database.ref("/students/"+usr).on("value",function(snap){
	console.log(snap.val().studentName);
	document.getElementById("dp-name").innerHTML=snap.val().studentName;
	document.getElementById("dpsub").innerHTML="Branch:"+snap.val().branch;
	document.getElementById("dpemail").innerHTML=snap.val().email;
});
}

//----------------------------Dp upload-------------------
function myDpFunction(){
  var x = document.getElementById("dpname");
  var dpname;
  if ('files' in x) {
    if (x.files.length == 0) {
      alert("Select File")
    } else {
      for (var i = 0; i < x.files.length; i++) {
        var file = x.files[i];
        if ('name' in file) {
		  dpname=file;
        }
      }
    }
  } 
var file = dpname;

var metadata = {
  contentType: 'image/jpeg'
};
var storageRef = firebase.storage().ref();
var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {

    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {

  switch (error.code) {
    case 'storage/unauthorized':

      break;

    case 'storage/canceled':

      break;
    case 'storage/unknown':

      break;
  }
}, function() {

  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    console.log('File available at', downloadURL);
	document.getElementById("my-dp-id").src=downloadURL;
	firebase.auth().onAuthStateChanged(function(user){
		database.ref("/students/"+user.uid).update({
			dpURL:downloadURL
		});
	});
  });
});

}