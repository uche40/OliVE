/*
 * This is Olive's JavaScript file for projects.jsp only.
 * Dependencies: "/olive/scripts/master.js"
 */

// Called once the DOM is ready but before the images, etc. load.
// Failsafe jQuery code modified from: http://api.jquery.com/jQuery/#jQuery3
jQuery(function($) {
	populateProjects();
});

function attachHandlers() {
	printFirstSignInMessage();
	attachCreateNewProjectHandlers();
	attachDeleteProjectHandlers();
	attachRenameProjectHandlers();
	enableDragAndDrop();
}

function createNewProjectContainer(projectName, projectNum, projectIcon) {
	if (projectIcon === '') {
		projectIcon = '/olive/images/Ponkan_folder_opened_64.png';
	}	// TODO Remove
	var projectContainer = '<div id="project-container-'
		+ projectNum
		+ '" class="project-container"><a href="OliveServlet?projectName='
		+ encodeURI(projectName)	// Ensure a safe link.
		+ '"><img id="project-image-'
		+ projectNum
		+ '" class="project-image" src="'
		+ projectIcon
		+ '" alt="project-image-'
		+ projectNum
		+ '" /></a><div class="project-name">'
		+ projectName
		+ '</div><div class="project-controls"><small><a id="delete-project-link-'
		+ projectNum
		+ '" class="delete-project-link warning">Delete</a></small></div></div>';
	
	$('#projects').append(projectContainer);
	
	// Return the object that was just appended (with the jQuery wrapper stripped off).
	return $('#project-container-' + projectNum).get(0);
}

function createProjectSpinner() {
	
}

function populateProjects() {
	$('.project-container').hide();
	
	var requestData = '{'
		+    '"command" : "getProjectInformation"'
		+  '}';
	makeAsynchronousPostRequest(requestData, function (responseData) {
		var poolPositions = [];
		for (var i = 0; i < responseData.length; ++i) {
			var element = createNewProjectContainer(responseData[i].name, i, responseData[i].icon);
			$(element).data('name', responseData[i].name);
			$(element).data('icon', responseData[i].icon);
			
			// Modified from: http://stackoverflow.com/questions/600700/jquery-javascript-reordering-rows/617349#617349
			if (responseData[i].poolPosition != -1) {
				$(element).data('poolPosition', responseData[i].poolPosition);
				poolPositions[(responseData.length - 1) - responseData[i].poolPosition] = element;	// Sort in reverse order to work with prepending.
			}
		}
		// Append in the sorted order
		for (var poolIndex = 0; poolIndex < poolPositions.length; ++poolIndex) {
			$('#projects').prepend(poolPositions[poolIndex]);	// Prepend to keep unsorted elements (poolPosition == -1) at the end.
		}
		
		$('.project-container').show();
		
		attachHandlers();	// This must go inside the ajax callback or it will be called too early.
	}, null);	// Defined in "/olive/scripts/master.js".
}

function printFirstSignInMessage() {
	var requestData = '{'
		+    '"command" : "isFirstSignIn"'
		+  '}';
	makeAsynchronousPostRequest(requestData, function (responseData) {
		if (responseData === true) {
			var welcomeMessage = '<p id="first-sign-in-dialog">Welcome to Olive. ' 
				+ 'This is the projects page where you can add, edit, and '
				+ 'delete your projects. We would like to remind you to go to '
				+ 'the Account Information page by clicking the account link '
				+ 'at the top right and adding a security question and answer '
				+ 'in case you forget your password.<br /><br />Thanks!<br /><br />'
				+ 'The Olive Team</p>';
			$('#projects').append(welcomeMessage);
		}
	}, null);	// Defined in "/olive/scripts/master.js". 
}

function attachCreateNewProjectHandlers() {
	var newProjectName = $('#new-project-name'),
		allFields = $([]).add(newProjectName);
	
	$('#new-project-dialog-form').dialog({
		autoOpen : false,
		height : 350,
		width : 400,
		modal : true,
		buttons : {
			'Create New Project' : function () {
				allFields.removeClass('ui-state-error');
				
				if (
					checkLength(
						newProjectName,
						'new-project-name',
						MIN_PROJECT_NAME_LENGTH,
						MAX_PROJECT_NAME_LENGTH)
					&& checkRegexp(
						newProjectName,
						SAFE_PROJECT_NAME_REGEX,
						SAFE_PROJECT_NAME_MESSAGE)
					&& !isDuplicateProjectName(
						newProjectName,
						'Project name already exists')
				) {	// Short-circuitry
					createNewProject();
					$(this).dialog('close');
				}
			},
			Cancel : function () {
				$(this).dialog('close');
			}
		},
		close : function () {
			allFields.val('').change().removeClass('ui-state-error');
			$('.validateTips').text('All form fields are required.').change();
		}
	});

	$('#create-new-project')
		.button()	// Style it all fancy-like
		.show()
		.click(function() {
			$('#new-project-dialog-form').dialog('open');
	});
}

// Perform an isDuplicateProjectName request.
function isDuplicateProjectName(o, n) {
	var retval = true;	// Guilty until proven innocent.
	var requestData = '{'
		+    '"command" : "isDuplicateProjectName",'
		+    '"arguments" : {'
		+        '"project" : "' + o.val() + '"'
		+    '}'
		+  '}';
	makeSynchronousPostRequest(requestData, function (responseData) {
		if (responseData.isDuplicateProjectName === true) {
			o.addClass('ui-state-error');
			updateTips(n);
			retval = true;
		} else {
			retval = false;
		}
	}, null);	// Defined in "/olive/scripts/master.js".
	
	return retval;
}

function attachRenameProjectHandlers() {
	// Downloaded from: http://www.arashkarimzadeh.com/jquery/7-editable-jquery-plugin.html
	$('.project-name').editable({
		type: 'text',
        submit: 'Save',
        cancel: 'Cancel',
        onEdit: function () {
			// Restrict input length
			// Another way: http://www.arashkarimzadeh.com/jquery/9-how-to-extend-jquery-editable.html
			var maxProjectNameLength = 32;
			$(this).children('input').attr('maxlength', maxProjectNameLength);
		},
        onSubmit: function (content) {
			renameProject(content.previous, content.current);
		},
		onCancel: function (content) {
		}
	});
}

//Perform a renameProject request
function renameProject(oldProjectName, newProjectName) {
	var requestData = '{'
		+    '"command" : "renameProject",'
		+    '"arguments" : {'
		+        '"oldProjectName" : "' + oldProjectName + '",'
		+        '"newProjectName" : "' + newProjectName + '"'
		+    '}'
		+  '}';
	makeAsynchronousPostRequest(requestData, refresh, null);	// Defined in "/olive/scripts/master.js".
}

function attachDeleteProjectHandlers() {
	var projectToDelete;
	
	$('.delete-project-link').click(function () {
		$('#confirm-delete-project-dialog').dialog('open');
		projectToDelete = $(this).parent().parent().parent();
	});
	
	$('#confirm-delete-project-dialog').dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			'Delete': function () {
				deleteProject($(projectToDelete).data('name'));
				$(this).dialog('close');
			},
			Cancel: function () {
				$(this).dialog('close');
			}
		}
	});
}

function enableDragAndDrop() {
	$('#projects').sortable( {
		appendTo: 'body',
		helper: 'clone',
		items: '.project-container',
		revert: true,
		scroll: false,
		tolerance: 'pointer',
		update: function(event, ui) {
			updateProjectsPosition();
		}
	});
}

//Perform an update<command>Position request
function updatePosition(command, collectionItems) {
	var requestData = '{'
		+    '"command" : "' + command + '",'
		+    '"arguments" : {'
		+      '"projects" : [';
		
	if ($(collectionItems).length > 0) {
		$(collectionItems).each(function(index) {
			requestData += '{'
			+          '"project" : "' + $(this).data('name') + '",'
			+          '"position" : ' + index
			+        '},';	// This will result in an extra comma.
		});
		
		// Strip off the extra comma.
		requestData = requestData.substring(0, requestData.length - 1);
	}	
	
	requestData += ']}}';
	
	makeAsynchronousPostRequest(requestData, null, null);	// Defined in "/olive/scripts/master.js".
}

//Perform an updateProjectsPosition request
function updateProjectsPosition() {
	updatePosition('updateProjectsPosition', '#projects > .project-container');
}

//Perform a createNewProject request
function createNewProject() {
	var requestData = '{'
			+    '"command" : "createProject",'
			+    '"arguments" : {'
			+        '"project" : "' + $('#new-project-name').val() + '"'
			+      '}'
			+  '}';
	makeAsynchronousPostRequest(requestData, refresh, null);	// Defined in "/olive/scripts/master.js".
}

// Perform a deleteProject request
function deleteProject(projectName) {
	var requestData = '{'
			+    '"command" : "deleteProject",'
			+    '"arguments" : {'
			+        '"project" : "' + projectName + '"'
			+      '}'
			+  '}';
	makeAsynchronousPostRequest(requestData, refresh, null);	// Defined in "/olive/scripts/master.js".
}