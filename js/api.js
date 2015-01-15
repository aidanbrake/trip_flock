console.log("API library was loading...");

TripFlockAPI = {
	baseurl: "http://api.tripflock.com/api/",
	username: localStorage.getItem("_email") || "",
	password: localStorage.getItem("_password") || "",
	accessToken: localStorage.getItem("_accessToken") || "",
	clipType : {
		urlPageNameAndSummary: 1,
		screenshot: 2,
		text: 3
	},
	accessType: {
		private: 1,
		public: 0
	},
	journals: [],

	/**
	 *	Authentication
	 */
	authenticate: function(username, password, callback) {
		var accessToken=TripFlockAPI.accessToken,
			customer = { 
				'Name': $.trim(username), 
				'Password': $.trim(password) 
			},
			result = {status: "error", accessToken: null};

		if (typeof callback == "function")
		{
			$.ajax({
				type: "POST",
				data: JSON.stringify(customer),
				url: TripFlockAPI.baseurl + "Authenticate/Login/",
				contentType: "application/json",
				success: function (data, textStatus, xhr) {
					if (xhr.status == 200) {
						result.status = xhr.status;
						TripFlockAPI.accessToken = result.accessToken = data.accessKey;
					}
					else {
						result.status = xhr.status;
					}
					callback(data, textStatus, xhr);
				}, 
				error: function (response) {
					result.status = "error"
					callback(data, textStatus, xhr);
				}
			});
		}
	},

	/**
	 *	Create Journal with Clip Url or Summary text Request
	 */


	/**
	 *	Create Journal with Screen Shot Request
	 */
	CreateJournal: function(journalDetails, formData, callback) {
		var CurrentClipType = journalDetails.ClipType; //Your current clip type option value

		// var JournalDatails = {
			// 	'JournalTitle': "Test JournalSakthi123", 
			// 	'AccessType': "0", 
			// 	'ColorCode': 5, 
			// 	'Name': "", 
			// 	'ImageUrl': "", 
			// 	'Text': "Test Web Clip in Invoke api method", 
			// 	'ClipType': CurrentClipType
			// };
		if (typeof callback != "function")
			return;

		if (clipType.ClipUrlandText == CurrentClipType || clipType.ClipText == CurrentClipType) {
			$.ajax ({
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("accessToken", TripFlockAPI.accessToken);
				},
				type: "POST",
				data: JSON.stringify(JournalDatails),
				url: TripFlockAPI.baseurl + "Journal/Insert",
				contentType: "application/json",
				success: function (response, textStatus, xhr) {
					console.log(xhr.status);
					console.log(textStatus);
					callback(response);
				}, 
				error: function (response) {
					console.log("error --");
					console.log(JSON.stringify(response));
					console.log(response. status);
					console.log(response.statusText);
					callback(response);
				}
			});
		} else if (clipType.ClipScreenShot == CurrentClipType) {
			// var formData = new FormData($('form')[0]);

			$.ajax({
				beforeSend: function (xhr) {
					xhr.setRequestHeader("accessToken", accessToken);
				},
				url: TripFlockAPI.baseurl + "Journal/InsertScreenShot/?" + 
										"journaltitle=" + journalDetails.JournalTitle + 
										"&accesstype=" + journalDetails.AccessType +
										"&colorcode=" + journalDetails.ColorCode +
										"&clipType=" + CurrentClipType,
				type: 'POST',
				// Form data
				data: formData,
				//Options to tell JQuery not to process data or worry about content-type
				cache: false,
				contentType: false,
				processData: false,
				success: function (response, textStatus, xhr) {
					console.log(xhr.status);
					console.log(textStatus);
					callback(response);
				}
			});
		}
	},

	/**
	 *	Select all Journals
	 */
	getAllJournals: function(callback) {
		if (typeof callback != "function")
		{
			console.log("A callback function is required.");
			return;
		}

		$.ajax({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("accessToken", TripFlockAPI.accessToken);
			},
			headers: {
				"accessToken": TripFlockAPI.accessToken
			},
			type: "GET",
			url: TripFlockAPI.baseurl + "Journal/",
			contentType: "application/json",
			success: function (data, textStatus, xhr) {
				callback(data, textStatus, xhr);
			},
			error: function (data, textStatus, xhr) {
				console.log(textStatus);
				callback(data, textStatus, xhr);
			}
		});
	},

	/**
	 *	Select Journal based on “Id”
	 */
	getJournalById: function(id, callback) {
		if (typeof callback != "function")
		{
			console.log("A callback function is required.");
			return;
		}

		$.ajax({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("accessToken ", accessToken);
			},
			type: "GET",
			url: "http://api.tripflock.com/api/Journal/157",
			contentType: "application/json",
			success: function (data, textStatus, xhr) {
				callback(data, textStatus, xhr);
			}, 
			error: function (response, textStatus, xhr) {
				callback(data, textStatus, xhr);
			}
		});
	},

	/**
	 *	Update Journal Request
	 */
	updateJournal: function(params, callback) {
		var JournalDatails = { 'JournalId': 157,'JournalTitle': "Test Update Journal", 'AccessType': "0" };
		$.ajax({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("accessToken ", accessToken);
			},
			type: "PUT",
			data: JSON.stringify(JournalDatails),
			url: "http://api.tripflock.com/api/Journal/Update/",
			contentType: "application/json",
			success: function (response, textStatus, xhr) {
				alert(textStatus);
			}, 
			error: function (response) {
				alert(response.statusText);
			} 
		});
	},

	/**
	 *	WebClip - Clip URL Page Name and Text (or) Clip Text Request
	 *	Adding WebClip in type of Clip URL Page Name and Text or Clip Text
	 *	var WebClipDetails = { 
	 *	 						'JournalId': JournalId, 
	 *	 						'Name': "", 'ImageUrl': "", 
	 *	 						'Text': "Test Web Clip in Invoke api method", 
	 *	 						'ClipType': CurrentClipType 
	 *						};
	 */

	addWebClip: function(webClipDetails, callback ) {
		if (typeof callback != "function") {
			console.log("A callback function is required.");
			return;
		}

		$.ajax({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("accessToken", TripFlockAPI.accessToken);
			},
			headers: {
				"accessToken": TripFlockAPI.accessToken
			},
			type: "POST",
			url: TripFlockAPI.baseurl + "File/InsertWebClip/",
			data: JSON.stringify(webClipDetails),
			contentType: "application/json",
			success: function (data, textStatus, xhr) {
				callback(data, textStatus, xhr);
			},
			error: function (data, textStatus, xhr) {
				console.log(textStatus);
				callback(data, textStatus, xhr);
			}
		});
	},

	/**
	 *	WebClip - Upload ScreenShot
	 */
	uploadScreenshot: function() {
		var clipType = {
			ClipUrlandText: 1,
			ClipScreenShot: 2,
			ClipText: 3
		}
		function WebCilpUpload() {
		var CurrentClipType = 2 //Your current clip type option value
		var JournalId = 173 // Selected journalId
		if (clipType.ClipUrlandText == CurrentClipType || clipType.ClipText == CurrentClipType ) {
		var WebClipDetails = { 'JournalId': JournalId, 'Name': "", 'ImageUrl': "", 'Text': "Test Web Clip in Invoke api method", 'ClipType': CurrentClipType };
		$.ajax({
		beforeSend: function (xhr) {
		xhr.setRequestHeader("accessToken", accessToken);
		},
		type: "POST",
		data: JSON.stringify(WebClipDetails),
		url: "http://api.tripflock.com/api/File/InsertWebClip",
		contentType: "application/json",
		success: function (response, textStatus, xhr) {
		alert(textStatus);
		}, error: function (response) {
		alert(response.statusText);
		}
		});
		}
		else if(clipType.ClipScreenShot == CurrentClipType) {
		var formData = new FormData($('form')[0]);
		$.ajax({
		beforeSend: function (xhr) {
		xhr.setRequestHeader("accessToken", accessToken);
		},
		url: 'http://api.tripflock.com/api/File/ScreenShot/?journalId=' + JournalId + '&clipType=' + clipType.ClipScreenShot,
		type: 'POST',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		success: function (response, textStatus, xhr) {
		alert(xhr.status);
		alert(textStatus);
		}
		});
		}
		}
	}
}