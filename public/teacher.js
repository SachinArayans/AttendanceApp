firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var email = user.email;
    var uid = user.uid;
  } else {
    console.log("Not logged In");
	window.location.assign("./index.html");
  }
  
		//------------check for approved admins list------
				database.ref("/teachers/"+user.uid+"/admins/").on("value",function (snap){
				snap.forEach(function (cnap){					
				console.log(cnap.val());
				var aplist=document.createElement("li");
				aplist.className="list-group-item";
				aplist.innerHTML=cnap.val().approvedAdminEmail+"  ";
				document.getElementById("apadmins").appendChild(aplist);
		});
		});
		//------------check for approved Students list------
		database.ref("/teachers/"+user.uid+"/students/").on("value",function (snap){
		snap.forEach(function (cnap){					
				console.log(cnap.val());
				var aslist=document.createElement("li");
				aslist.className="list-group-item";
				aslist.innerHTML=cnap.val().approvedStudentEmail+"  <button type='button' class='btn btn-info btn-xs' data-toggle='modal' data-target='#tdetail' onclick='smdetail(\""+cnap.val().approvedStudentId+"\")'>Details</button> ";
				document.getElementById("approveds").appendChild(aslist);
				deleteBtn=document.createElement("button");
				deleteBtn.setAttribute("onclick","delStudent('"+cnap.val().approvedStudentId+"')");
				deleteBtn.innerHTML= " Delete ";
				deleteBtn.className="btn btn-danger btn-xs";
				aslist.appendChild(deleteBtn);  
		});
		});
		//----------------------------set DP -----------------------------------
		database.ref("/teachers/"+user.uid).on("value",function(snap){
			console.log(snap.val().dpURL);
			document.getElementById("my-dp-id").src=snap.val().dpURL;
		});

		TeacherDetailOnDashboard(user.uid);
});

//----------------for deleting a student
function delStudent(Id){
	firebase.database().ref("/teachers/"+firebase.auth().currentUser.uid+"/students/"+Id).set({});
	firebase.database().ref("/students/"+Id+"/teachers/"+firebase.auth().currentUser.uid).set({});
}
//-----------------------teacher detail modal function ----------------------------
function smdetail(tid){
	firebase.database().ref("/students/"+tid).on("value",function(snap){
		console.log(snap.val());
			document.getElementById("tmname").innerHTML=snap.val().studentName;
			document.getElementById("tmmobileno").innerHTML=snap.val().mobileNo;
			document.getElementById("tmaddress").innerHTML=snap.val().address;
			document.getElementById("tmgender").innerHTML=snap.val().studentGender;
			document.getElementById("smfathername").innerHTML=snap.val().fatherName;
			document.getElementById("tmdp").src=snap.val().dpURL;
			document.getElementById("smrollno").innerHTML=snap.val().rollNo;
			document.getElementById("smbranch").innerHTML=snap.val().branch;
			document.getElementById("smsemester").innerHTML=snap.val().semester;
			document.getElementById("smcourse").innerHTML=snap.val().course;
	});
}


database=firebase.database();
postListRef=database.ref("/admins/");
postListRef.on("value",function (snap){
snap.forEach(function (cnap){
	var list=document.createElement("li");
	list.className="list-group-item";
	list.innerHTML=cnap.val().collegeName+ "("+cnap.val().adminName+")"+"  ";
	document.getElementById("avlclg").appendChild(list);
	sendBtn=document.createElement("button");
	sendBtn.className="btn btn-info btn-xs";
	sendBtn.setAttribute("onclick","sendRequest('"+cnap.val().userId+"')");
	sendBtn.innerHTML= " Send Request";
	list.appendChild(sendBtn);
console.log(cnap.val().collegeName);
});
});


//-----------------Send Request-------------
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

//--------check if requests pending--------------
//database=firebase.database();
postListRef=database.ref("/requests/");
postListRef.on("value",function (snap){
snap.forEach(function (cnap){
	if(cnap.val().to==firebase.auth().currentUser.uid){
		console.log("Student Requests"+cnap.val().to);
		var list=document.createElement("li");
		list.className="list-group-item";
		list.innerHTML=cnap.val().fname+" <button type='button' class='btn btn-info btn-xs' data-toggle='modal' data-target='#tdetail' onclick='smdetail(\""+cnap.val().ffrom+"\")'>Details</button> ";
		document.getElementById("srequests").appendChild(list);
		approveBtn=document.createElement("button");
		declineBtn=document.createElement("button");
		approveBtn.setAttribute("onclick","approveT('"+cnap.val().fname+"','"+cnap.val().ffrom+"')");
		approveBtn.innerHTML= " Approve ";
		approveBtn.className="btn btn-success btn-xs";
		declineBtn.setAttribute("onclick","declineT()");
		declineBtn.innerHTML= " Decline ";
		declineBtn.className="btn btn-danger btn-xs";
		list.appendChild(approveBtn);
		list.appendChild(declineBtn);	
	}
});
});
//--------------approve Students-----
function approveT(tname,tid){
	console.log(tname);
	console.log(tid);
	firebase.database().ref("/teachers/"+firebase.auth().currentUser.uid+"/students/"+tid).set({
		approvedStudentId:tid,
		approvedStudentEmail:tname
	});
	
	firebase.database().ref("/students/"+tid+"/teachers/"+firebase.auth().currentUser.uid).set({
		approvedTeacherId:firebase.auth().currentUser.uid,
		approvedTeacherEmail:firebase.auth().currentUser.email
	});
	
	firebase.database().ref("/requests/"+firebase.auth().currentUser.uid).set({});
}
//-----------------decline students------------------
function declineT(){
	firebase.database().ref("/requests/"+firebase.auth().currentUser.uid).set({});
}
//------------------available College Filter----
$(document).ready(function(){
  $("#searchAvailableCollege").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#avlclg li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
	//----studence record p/a search
  $("#attSearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#stAttendence tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
//---------------------------------- Students Attendence Records Get Table Method---------------------------
//--------Attendence Retriving Function --------------
//database=firebase.database();

function showAttendenceResult(attendenceDate){
postListRef=database.ref("/students/");
postListRef.on("value",function (snap){
snap.forEach(function (cnap){
	var trlist=document.createElement("tr");
	trlist.innerHTML="<td>"+cnap.val().studentName+"</td><td>"+attendenceDate+"</td>";
	document.getElementById("studentAttendenceRecord").appendChild(trlist);
		database.ref("/students/"+cnap.key+"/attendence/"+attendenceDate).on("value",function(ssnap){
			ssnap.forEach(function(ccnap){
				console.log(ccnap.val());
				var list=document.createElement("td");
				list.innerHTML=ccnap.val();
				trlist.appendChild(list);
			});
		});
});
});
}
//var attendenceDate="2020-02-10";
//showAttendenceResult(attendenceDate);
//----------------------- Teacher Detail show on dashboard function------------------
function TeacherDetailOnDashboard(usr){
database.ref("/teachers/"+usr).on("value",function(snap){
	console.log(snap.val());
	document.getElementById("dp-name").innerHTML=snap.val().teacherName;
	document.getElementById("dpsub").innerHTML="Subjects:"+snap.val().teacherSubjects;
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
		database.ref("teachers/"+user.uid).update({
			dpURL:downloadURL
		});
	});
  });
});

}