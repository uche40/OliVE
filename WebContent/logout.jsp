<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
	session.removeAttribute("isAuthorized");
	session.removeAttribute("username");
	session.removeAttribute("password");
	session.removeAttribute("editSuccessfully");
	session.removeAttribute("addSuccessfully");
	session.removeAttribute("projectTitle");
	session.removeAttribute("passwordsMatch");
	session.removeAttribute("isSafe");
	response.sendRedirect("index.jsp");
%>
</body>
</html>