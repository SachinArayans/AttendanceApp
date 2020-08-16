firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var email = user.email;
    var uid = user.uid;
  } else {
    console.log("Not logged In");
	window.location.assign("./index.html");
  }
  
  //------------check for approved teacher list------
		database.ref("/admins/"+user.uid+"/teachers/").on("value",function (snap){
		snap.forEach(function (cnap){					
					console.log(cnap.val());
				var aplist=document.createElement("li");
				aplist.className="list-group-item";
				aplist.innerHTML=cnap.val().approvedTeacherEmail+" <button type='button' class='btn btn-info btn-xs' data-toggle='modal' data-target='#tdetail' onclick='tmdetail(\""+cnap.val().approvedTeacherId+"\")'>Details</button> ";
				document.getElementById("approvedt").appendChild(aplist);
				deleteBtn=document.createElement("button");
				deleteBtn.setAttribute("onclick","delTeacher('"+cnap.val().approvedTeacherId+"')");
				deleteBtn.innerHTML= " Delete ";
				deleteBtn.className="btn btn-danger btn-xs";
				aplist.appendChild(deleteBtn);  
		});
		});
		//----------------------------set DP -----------------------------------
		database.ref("/admins/"+user.uid).on("value",function(snap){
			console.log(snap.val().dpURL);
			document.getElementById("my-dp-id").src=snap.val().dpURL;
		});
		
		adminDetailOnDashboard(user.uid);
});
function delTeacher(Id){
	firebase.database().ref("/admins/"+firebase.auth().currentUser.uid+"/teachers/"+Id).set({});
	firebase.database().ref("/teachers/"+Id+"/admins/"+firebase.auth().currentUser.uid).set({});
}
//-----------------------teacher detail modal function ----------------------------
function tmdetail(tid){
	firebase.database().ref("/teachers/"+tid).on("value",function(snap){
		console.log(snap.val());
			document.getElementById("tmname").innerHTML=snap.val().teacherName;
			document.getElementById("tmmobileno").innerHTML=snap.val().teacherMobileNo;
			document.getElementById("tmaddress").innerHTML=snap.val().teacherAddress;
			document.getElementById("tmgender").innerHTML=snap.val().teacherGender;
			document.getElementById("tmsub").innerHTML=snap.val().teacherSubjects;
			document.getElementById("tmdp").src=snap.val().dpURL;
	});
}
//--------check if requests pending--------------
database=firebase.database();
postListRef=database.ref("/requests/");
postListRef.on("value",function (snap){
snap.forEach(function (cnap){
	if(cnap.val().to==firebase.auth().currentUser.uid){
			console.log("Teacher Requests"+cnap.val().to);
			var list=document.createElement("li");
		list.className="list-group-item";
		list.innerHTML=cnap.val().fname+" <button type='button' class='btn btn-info btn-xs' data-toggle='modal' data-target='#tdetail' onclick='tmdetail(\""+cnap.val().ffrom+"\")'>Details</button> ";
		document.getElementById("trequests").appendChild(list);
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


	//----studence record p/a search
  $("#attSearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#stAttendence tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


//--------------approve teacher-----
function approveT(tname,tid){
	console.log(tname);
	console.log(tid);
	firebase.database().ref("/admins/"+firebase.auth().currentUser.uid+"/teachers/"+tid).set({
		approvedTeacherId:tid,
		approvedTeacherEmail:tname
	});
	
	firebase.database().ref("/teachers/"+tid+"/admins/"+firebase.auth().currentUser.uid).set({
		approvedAdminId:firebase.auth().currentUser.uid,
		approvedAdminEmail:firebase.auth().currentUser.email
	});
	
	firebase.database().ref("/requests/"+firebase.auth().currentUser.uid).set({});
}
//-----------------decline Teacher------------------
function declineT(){
	firebase.database().ref("/requests/"+firebase.auth().currentUser.uid).set({});
}


//---------------------------------- Students Attendence Records Get Table Method---------------------------
//--------Attendence Retriving Function --------------
//database=firebase.database();

function showAttendenceResult(attendenceDate){
postListRef=database.ref("/admins/"+firebase.auth().currentUser.uid+"/teachers/");
postListRef.on("value",function (snap){
snap.forEach(function (cnap){
	tid=cnap.val().approvedTeacherId;
	database.ref("/teachers/"+tid+"/students/").on("value",function(tsnap){
		tsnap.forEach(function(tcnap){
			sid=tcnap.val().approvedStudentId;
			var trlist=document.createElement("tr");
			trlist.innerHTML="<td>"+attendenceDate+"</td>";
			document.getElementById("studentAttendenceRecord").appendChild(trlist);
			database.ref("/students/"+sid).on("value",function(nsnap){
						sname=document.createElement("td");
						sname.innerHTML=nsnap.val().studentName;
						trlist.insertBefore(sname,trlist.childNodes[0]);
					});		
			database.ref("/students/"+sid+"/attendence/"+attendenceDate).on("value",function(ssnap){
				ssnap.forEach(function(scnap){
					var list=document.createElement("td");
					list.innerHTML=scnap.val();
					trlist.appendChild(list);
				});
			});
		});
	});
	/*
		database.ref("/students/"+cnap.key+"/attendence/"+attendenceDate).on("value",function(ssnap){
			ssnap.forEach(function(ccnap){
				console.log(ccnap.val());
				var list=document.createElement("td");
				list.innerHTML=ccnap.val();
				trlist.appendChild(list);
			});
		});*/
});
});
}

//----------------------- Admin Detail show on dashboard function------------------
function adminDetailOnDashboard(usr){
database.ref("/admins/"+usr).on("value",function(snap){
	console.log(snap.val());
	document.getElementById("dp-name").innerHTML=snap.val().adminName;
	document.getElementById("dpsub").innerHTML="College:"+snap.val().collegeName;
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
		database.ref("/admins/"+user.uid).update({
			dpURL:downloadURL
		});
	});
  });
});

}