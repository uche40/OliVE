<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="com.readytalk.olive.logic.OliveDatabaseApi"%>
<%@ page import="com.readytalk.olive.model.User"%>
<%@ page import="com.readytalk.olive.util.Attribute"%>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>My Projects | Olive</title>

<link rel="shortcut icon" href="/olive/images/olive.ico">

<link rel="stylesheet" type="text/css" href="/olive/css/reset.css" />
<link rel="stylesheet" type="text/css"
	href="/olive/scripts/jquery-ui-1.8.6.custom/css/ui-lightness/jquery-ui-1.8.6.custom.css" />
<link rel="stylesheet" type="text/css" href="/olive/css/master.css" />
<link rel="stylesheet" type="text/css" href="/olive/css/projects.css" />

<script src="/olive/scripts/jquery-1.4.4.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.core.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.widget.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.mouse.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.button.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.position.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.dialog.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.draggable.js"></script>
<script
	src="/olive/scripts/jquery-ui-1.8.6.custom/development-bundle/ui/jquery.ui.droppable.js"></script>
<script src="/olive/scripts/master.js"></script>
<script src="/olive/scripts/projects.js"></script>
<script src="/olive/scripts/google-analytics.js"></script>
</head>
<body>
<%
	Boolean isAuthorized = (Boolean) session
			.getAttribute(Attribute.IS_AUTHORIZED.toString()); // Nasty cast
	if (isAuthorized == null) {
		response.sendRedirect("index.jsp");
	} else if (!isAuthorized) {
		response.sendRedirect("index.jsp");
	}
	String username = (String) session.getAttribute(Attribute.USERNAME
			.toString());
	String password = (String) session.getAttribute(Attribute.PASSWORD
			.toString());
	String projectsHTML = OliveDatabaseApi.populateProjects(new User(
			username, password));
%>
<div id="header">
<div id="header-left">
<h1>Olive</h1>
</div>
<div id="header-right">
<div>Welcome, <a href="account.jsp"><%=username%>!</a>&nbsp;<a
	href="logout.jsp">Logout</a></div>
<div><strong><a href="projects.jsp">My Projects</a></strong>&nbsp;<span
	id="help-dialog-opener"><a href="">Help</a></span></div>
<div id="help-dialog" title="How to use Olive">
<ul>
	<li>1. Create a new account.</li>
	<li>2. Create a new project.</li>
	<li>3. Upload your videos.</li>
	<li>4. Edit your videos.</li>
	<li>5. Export to your computer.</li>
</ul>
</div>
</div>
</div>

<div class="clear"></div>

<div id="main">
<div id="projects-container">

<div id="projects-title">
<h1>My Projects</h1>
</div>
<!-- end #projects-title -->

<div id="projects-controls">
<button type="button" onclick="openNewProjectForm()">Create New
Project</button>
</div>
<!-- end #controls -->

<div class="clear"></div>
<div id="project-clips"><%=projectsHTML%></div>
<!-- end #project-clips --></div>
<!-- end #projects-container --></div>
<!-- end #main -->

<div class="clear"></div>

<div id="footer"></div>
</body>
</html>