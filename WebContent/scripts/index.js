/*
 * This is Olive's JavaScript file for index.jsp only.
 */

// Called once the DOM is ready but before the images, etc. load.
// Failsafe jQuery code modified from: http://api.jquery.com/jQuery/#jQuery3
jQuery(function($) {
	attachRegistrationHandlers();
});

function attachRegistrationHandlers() {
	var name = $('#register-name'), email = $('#register-email'), password = $('#register-password'), cPassword = $('#confirm-register-password'), allFields = $(
			[]).add(name).add(email).add(password).add(cPassword);
	
	$('#dialog-form').dialog({
		autoOpen : false,
		height : 550,
		width : 450,
		modal : true,
		buttons : {
			'Create an account' : function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');

				bValid = bValid
						&& checkLength(name,
								'register-username',
								MIN_USERNAME_LENGTH,
								MAX_USERNAME_LENGTH);
				bValid = bValid
						&& checkLength(email,
								'register-email',
								MIN_EMAIL_LENGTH,
								MAX_EMAIL_LENGTH);
				bValid = bValid
						&& checkLength(password,
								'register-password',
								MIN_PASSWORD_LENGTH,
								MAX_PASSWORD_LENGTH);
				bValid = bValid
						&& checkRegexp(name,
								SAFE_USERNAME_REGEX,
								SAFE_USERNAME_MESSAGE);
				bValid = bValid
						&& checkRegexp(email,
								SAFE_EMAIL_REGEX,
								SAFE_EMAIL_MESSAGE);
				bValid = bValid
						&& checkRegexp(password,
								SAFE_PASSWORD_REGEX,
								SAFE_PASSWORD_MESSAGE);
				bValid = bValid
						&& checkPasswordsEqual(password,
								cPassword,
								'Passwords do not match.');
				if (bValid) {
					$('#register-form').submit();
					$(this).dialog('close');
				}
			},
			Cancel : function() {
				$(this).dialog('close');
			}
		},
		close : function() {
			allFields.val('').change().removeClass('ui-state-error');
		}
	});

	$('#create-user').click(function() {
		$('#dialog-form').dialog('open');
	});
}

$(document).ready(function(){

	var Playlist = function(instance, playlist, options) {
		var self = this;

		this.instance = instance; // String: To associate specific HTML with this playlist
		this.playlist = playlist; // Array of Objects: The playlist
		this.options = options; // Object: The jPlayer constructor options for this playlist

		this.current = 0;

		this.cssId = {
			jPlayer: 'jquery_jplayer_',
			interface: 'jp_interface_',
			playlist: 'jp_playlist_'
		};
		this.cssSelector = {};

		$.each(this.cssId, function(entity, id) {
			self.cssSelector[entity] = '#' + id + self.instance;
		});

		if(!this.options.cssSelectorAncestor) {
			this.options.cssSelectorAncestor = this.cssSelector.interface;
		}

		$(this.cssSelector.jPlayer).jPlayer(this.options);

		$(this.cssSelector.interface + ' .jp-previous').click(function() {
			self.playlistPrev();
			$(this).blur();
			return false;
		});

		$(this.cssSelector.interface + ' .jp-next').click(function() {
			self.playlistNext();
			$(this).blur();
			return false;
		});
	};

	Playlist.prototype = {
		displayPlaylist: function() {
			var self = this;
			$(this.cssSelector.playlist + ' ul').empty();
			for (i=0; i < this.playlist.length; i++) {
				var listItem = (i === this.playlist.length-1) ? '<li class="jp-playlist-last">' : '<li>';
				listItem += '<a href="#" id="' + this.cssId.playlist + this.instance + '_item_' + i + '" tabindex="1">' + this.playlist[i].name + '</a>';

				// Create links to free media
				if(this.playlist[i].free) {
					var first = true;
					listItem += '<div class="jp-free-media">(';
					$.each(this.playlist[i], function(property,value) {
						if($.jPlayer.prototype.format[property]) { // Check property is a media format.
							if(first) {
								first = false;
							} else {
								listItem += ' | ';
							}
							listItem += '<a id="' + self.cssId.playlist + self.instance + '_item_' + i + '_' + property + '" href="' + value + '" tabindex="1">' + property + '</a>';
						}
					});
					listItem += ')</span>';
				}

				listItem += '</li>';

				// Associate playlist items with their media
				$(this.cssSelector.playlist + ' ul').append(listItem);
				$(this.cssSelector.playlist + '_item_' + i).data('index', i).click(function() {
					var index = $(this).data('index');
					if(self.current !== index) {
						self.playlistChange(index);
					} else {
						$(self.cssSelector.jPlayer).jPlayer('play');
					}
					$(this).blur();
					return false;
				});

				// Disable free media links to force access via right click
				if(this.playlist[i].free) {
					$.each(this.playlist[i], function(property,value) {
						if($.jPlayer.prototype.format[property]) { // Check property is a media format.
							$(self.cssSelector.playlist + '_item_' + i + '_' + property).data('index', i).click(function() {
								var index = $(this).data('index');
								$(self.cssSelector.playlist + '_item_' + index).click();
								$(this).blur();
								return false;
							});
						}
					});
				}
			}
		},
		playlistInit: function(autoplay) {
			if(autoplay) {
				this.playlistChange(this.current);
			} else {
				this.playlistConfig(this.current);
			}
		},
		playlistConfig: function(index) {
			$(this.cssSelector.playlist + '_item_' + this.current).removeClass('jp-playlist-current').parent().removeClass('jp-playlist-current');
			$(this.cssSelector.playlist + '_item_' + index).addClass('jp-playlist-current').parent().addClass('jp-playlist-current');
			this.current = index;
			$(this.cssSelector.jPlayer).jPlayer('setMedia', this.playlist[this.current]);
		},
		playlistChange: function(index) {
			this.playlistConfig(index);
			$(this.cssSelector.jPlayer).jPlayer('play');
		},
		playlistNext: function() {
			var index = (this.current + 1 < this.playlist.length) ? this.current + 1 : 0;
			this.playlistChange(index);
		},
		playlistPrev: function() {
			var index = (this.current - 1 >= 0) ? this.current - 1 : this.playlist.length - 1;
			this.playlistChange(index);
		}
	};

	var videoPlaylist = new Playlist('1', [
		{
			name: 'Signing up',
			ogv: 'https://s3.amazonaws.com/o-live/01-SignUp.mp4.ogv',
			//free: true,	// whether to provide a link to download the video
			poster: '/olive/images/splash-simple-white.png'	// Wrong aspect ratio
		},
		{
			name: 'Projects',
			ogv: 'https://s3.amazonaws.com/o-live/03-myProjectsPage.mp4.ogv'
			//free: true	// whether to provide a link to download the video
			//poster: '/olive/images/splash-simple.png'	// Black, wrong aspect ratio
		},
		{
			name: 'Uploading videos',
			ogv: 'https://s3.amazonaws.com/o-live/04-uploading.mp4.ogv'
		},
		{
			name: 'Playing videos',
			ogv: 'https://s3.amazonaws.com/o-live/05-play.mp4.ogv'
		},
		{
			name: 'Splitting videos',
			ogv: 'https://s3.amazonaws.com/o-live/06-spliting.mp4.ogv'
		},
		{
			name: 'Combining videos',
			ogv: 'https://s3.amazonaws.com/o-live/07-combining.mp4.ogv'
		},
		{
			name: 'Registering and logging in',
			ogv: 'https://s3.amazonaws.com/o-live/02-accountInformation.mp4.ogv'
		}
	], {
		ready: function() {
			videoPlaylist.displayPlaylist();
			videoPlaylist.playlistInit(false); // Parameter is a boolean for autoplay.
		},
		ended: function() {
			videoPlaylist.playlistNext();
		},
		play: function() {
			$(this).jPlayer('pauseOthers');
		},
		swfPath: '../scripts',
		supplied: 'ogv',
		preload: 'auto',
		volume: 1.0,
		muted: false
	});

	

/*	$('#jplayer_inspector_1').jPlayerInspector({jPlayer:$('#jquery_jplayer_1')});
	$('#jplayer_inspector_2').jPlayerInspector({jPlayer:$('#jquery_jplayer_2')});*/
});