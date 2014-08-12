(function(window){
	'use strict';

	$(document).ready(function(){
		/**
	     * Popup class.
	     * @constructor
	     */
		var Popup = function() {
			this._email = localStorage.getItem('_email') || "";
			this._password = localStorage.getItem('_password') || "";
			this.selectedJournal = null;
			this._accessToken = localStorage.getItem('_accessToken') || "";
			this._journals = JSON.parse(localStorage.getItem("_journals")) || {};
			this._journalName = "";
			this._colorCode = '0';	//	
			this._accessType = 0;	//	public
			this._clipType = 0;		//	url name and summary text
			this.init();
			
			$($('div .save-container')[0]).hide();
			$($('div .select-container')[0]).hide();
			$($('div .login-container')[0]).show();

			if (this._accessToken != "")
				this.showSelectContainer();
			else
				this.showLoginContainer();
		};

		Popup.prototype = {
			/**
			 * Initialize popup
			 */
			init: function() {
				var self = this;
				//alert(this.email);
				$($('input .email')[0]).val(localStorage.getItem('_email') || '');
				$($('input .password')[0]).val(localStorage.getItem('_password') || '');
				$($('.button-container #login-button')[0]).bind('click', this.onLogin);
				$($('.input span .addNewJournal')[0]).bind('click', this.onAddNewJournal);
				$($('.select-container .button-container #select-save-button')[0]).bind('click', this.onSelectSave);
				$($('.save-container .content .save-journal-name-container span h6:last-child')[0]).bind('click', this.showSelectContainer);
				$($('.save-container .button-container #select-save-button')[0]).bind('click', this.onNewTripSave);
				$('div.save-journal-color-pannel > ul.colors > li.color').bind('click', function() {
					$('div.save-journal-color-pannel > ul.colors > li.color.selected').removeClass('selected');
					$(this).addClass('selected');
					self._colorCode = $(this).attr('val');
				});

				$('#save-journal-name').bind('change', function() {
					self._journalName = $(this).val();
				});

				$($('.select-container input[type=radio][name=clip-type]')).bind('change', function(){
					if ($(this).val() == 'text'){
						$($('.select-container #select .input .clipTypeContainer #clip-type-text-content')[0]).show();
						self._clipType = 2; // cliptype = Text content
					} else if ($(this).val() == 'url') {
						$($('.select-container #select .input .clipTypeContainer #clip-type-text-content')[0]).hide();
						self._clipType = 0; // cliptype = url and summary text
					}
					else {
						$($('.select-container #select .input .clipTypeContainer #clip-type-text-content')[0]).hide();
						self._clipType = 1; //// cliptype = screenshot
					}
				});

				$($('.save-container .content .clipType .clipTypeContainer input[type=radio][name=clip-type]')).bind('change', function(){
					if ($(this).val() == 'text'){
						$($('.save-container .content .clipType .clipTypeContainer #save-clip-type-text-content')[0]).show();
						self._clipType = 2; // cliptype = Text content
					} else if ($(this).val() == 'url') {
						$($('.save-container .content .clipType .clipTypeContainer #save-clip-type-text-content')[0]).hide();
						self._clipType = 0; // cliptype = url and summary text
					}else {
						$($('.save-container .content .clipType .clipTypeContainer #save-clip-type-text-content')[0]).hide();
						self._clipType = 1; //// cliptype = screenshot
					}
				});

				/**
				 *
				 */
				$('div.save-container .save-option-container input[name="clip-access-type"]').bind('change', function() {
					if ($(this).val() == 'private')
						self._accessType = 1;
					else
						self._accessType = 0;
				});
			},

			/**
		     * Showing trip select panel
		     */
			showSelectContainer: function() {
				var self = this;
				$.ajax({
					beforeSend: function (xhr) {
						xhr.setRequestHeader("accessToken", self._accessToken);
					},
					type: "GET",
					url: "http://api.tripflock.com/api/Journal/",
					contentType: "application/json",
					success: function (data, textStatus, xhr) {
						if (xhr.status == 200 || xhr.status == 204) {
							// alert(JSON.stringify(data));

							$($('div .login-container')[0]).hide();
							$($('div .save-container')[0]).hide();
							$($('div .select-container')[0]).show();
						}
						else {
							alert(textStatus);
							self.showLoginContainer();
						}
					},
					error: function (response) {
						alert(response.statusText);
						self.showLoginContainer();
					}
				});
			},

			/**
			 *
			 */
			showLoginContainer: function() {
				$($('div .save-container')[0]).hide();
				$($('div .select-container')[0]).hide();
				$($('div .login-container')[0]).show();
			},

			/**
		     * Authentication and lead to select journals
		     * Save email and password into local storage
		     */
			onLogin: function(event) {
				event.preventDefault();
				this._email = $($('input').filter('.email')[0]).val();
				this._password = $($('input').filter('.password')[0]).val();
				
				if (this._email != '')
					localStorage.setItem('_email', this._email);

				if (this._password != '')
					localStorage.setItem('_password', this._password);

				var accessToken=""; //here declared accessToken value null
     
				var customer = { 'Name': $.trim(this._email), 'Password': $.trim(this._password) };

				$.ajax({
					type: "POST",
					data: JSON.stringify(customer),
					url: "http://api.tripflock.com/api/Authenticate/Login/",
					contentType: "application/json",
					success: function (data, textStatus, xhr) {
						if (xhr.status == 200) {
							accessToken = data.accessKey;
							//AccessToken value get  from response.accessKey

							localStorage.setItem("_accessToken", accessToken);
							window.Popup.showSelectContainer();
						}
						else {
							alert(textStatus);
							window.showLoginContainer();
						}
					}, 
					error: function (response) {
						alert(response.statusText);
						window.showLoginContainer();
					}

				});
			},

			/**
		     * User is able to go to popup for adding a new journal
		     */
			onAddNewJournal: function() {
				$($('div .login-container')[0]).hide();
				$($('div .select-container')[0]).hide();
				$($('div .save-container')[0]).show();
			},

			/**
		     * Save the selected trip as default trip.
		     */
			onSelectSave: function() {
				

			},

			/**
		     * Save the created trip with info that user filled.
		     */
			onNewTripSave: function() {
				var self = window.Popup,
					journalName = self._journalName,
					journalAccessType = self._accessType,
					journalColorCode = self._colorCode,
					journalClipType = self._clipType;
				
				if (journalName == "") {
					alert("Journal name can't be empty. Please enter the name!");
					return;
				}				

				var JournalDatails = { 
					'JournalTitle': journalName,
					'ColorCode': journalColorCode,
					'AccessType' : journalAccessType,
					'ClipType' : journalClipType
				};
				$.ajax({
					beforeSend: function (xhr) {
						xhr.setRequestHeader("accessToken ", self._accessToken);
					},
					type: "POST",
					data: JSON.stringify(JournalDatails),
					url: "http://api.tripflock.com/api/Journal/Insert",
					contentType: "application/json",
					success: function (response, textStatus, xhr) {
						alert(textStatus);
					},
					error: function (response) {
						alert(response.statusText);
					}
				});
			}
		};

		window.Popup = new Popup();
	});
})(window);