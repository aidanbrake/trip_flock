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
			this.init();
		};

		Popup.prototype = {
			/**
			 * Initialize popup
			 */
			init: function() {
				//alert(this.email);
				$($('input .email')[0]).val(localStorage.getItem('_email') || '');
				$($('input .password')[0]).val(localStorage.getItem('_password') || '');
				$($('.button-container #login-button')[0]).bind('click', this.onLogin);
				$($('.input span .addNewJournal')[0]).bind('click', this.onAddNewJournal);
				$($('.select-container .button-container #select-save-button')[0]).bind('click', this.onSelectSave);
				$($('.save-container .content .save-journal-name-container span h6:last-child')[0]).bind('click', this.showSelectContainer);
				$($('.save-container .button-container #select-save-button')[0]).bind('click', this.onNewTripSave);

				$($('.select-container input[type=radio][name=clip-type]')).bind('change', function(){
					if($(this).val() == 'text'){
						$($('.select-container #select .input .clipTypeContainer #clip-type-text-content')[0]).show();
					}else {
						$($('.select-container #select .input .clipTypeContainer #clip-type-text-content')[0]).hide();
					}
				});

				$($('.save-container .content .clipType .clipTypeContainer input[type=radio][name=clip-type]')).bind('change', function(){
					if($(this).val() == 'text'){
						$($('.save-container .content .clipType .clipTypeContainer #save-clip-type-text-content')[0]).show();
					}else {
						$($('.save-container .content .clipType .clipTypeContainer #save-clip-type-text-content')[0]).hide();
					}
				});
			},

			/**
		     * Showing trip select panel
		     */
			showSelectContainer: function() {
				$($('div .login-container')[0]).hide();
				$($('div .select-container')[0]).show();
				$($('div .save-container')[0]).hide();
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

				window.Popup.showSelectContainer();
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
				alert("Saving...");
			},

			/**
		     * Save the created trip with info that user filled.
		     */
			onNewTripSave: function() {
				alert("Saving the created Trip...");
			}
		};

		window.Popup = new Popup();
	});
})(window);