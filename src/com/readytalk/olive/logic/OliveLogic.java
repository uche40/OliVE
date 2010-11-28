package com.readytalk.olive.logic;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

import com.readytalk.olive.model.User;

/**
 * This is a nice, normal type of class. I call it logic because it is the type
 * of place where you would want to write some "business logic". The sorts of
 * things that a servlet would kick off. In this case, it's a ridiculous example
 * that mocks me (and other older folks). Not that old, of course...
 * 
 * All that said, this is a good sort of class to make to do things. I made the
 * methods static because this will only be used in the HttpRequest/HttpResponse
 * cycle that a user will initiate.
 * 
 * I hope that makes sense, read on!
 * 
 * @author mweaver
 */
public class OliveLogic {

	/**
	 * I don't use this method in my example, but this would be an excellent
	 * place to put some logic that:
	 * 
	 * 1) Connects to a database. 2) Validates a username and password. 3)
	 * returns some value.
	 * 
	 * I use a boolean here, but an enum that you write would be heaps better!
	 * 
	 * @param username
	 * @param password
	 * @return
	 */
	public static Boolean isAuthorized(User user) {
		if (user.getUsername().equals("olive")
				&& user.getPassword().equals("evilo")) {
			return true;
		} else {
			return false;
		}

		/*
		 * try { Statement stmt = null;
		 * 
		 * // Register the JDBC driver for MySQL.
		 * Class.forName("com.mysql.jdbc.Driver");
		 * 
		 * // Define URL of database server for // database named mysql on the
		 * localhost // with the default port number 3306. String url =
		 * "jdbc:mysql://localhost:3306/testDB";
		 * 
		 * // Get a connection to the database for a // user named root with a
		 * blank password. // This user is the default administrator // having
		 * full privileges to do anything. Connection con =
		 * DriverManager.getConnection(url, "root", "olive");
		 * 
		 * // Display URL and connection information System.out.println("URL: "
		 * + url); System.out.println("Connection: " + con); stmt =
		 * con.createStatement();
		 * 
		 * stmt.executeUpdate("CREATE TABLE myTable(test_id int," +
		 * "test_val char(15) not null)");
		 * stmt.executeUpdate("INSERT INTO myTable(test_id, " +
		 * "test_val) VALUES(2,'Two')");
		 * stmt.executeUpdate("INSERT INTO myTable(test_id, " +
		 * "test_val) VALUES(3,'Three')");
		 * stmt.executeUpdate("INSERT INTO myTable(test_id, " +
		 * "test_val) VALUES(4,'Four')");
		 * stmt.executeUpdate("INSERT INTO myTable(test_id, " +
		 * "test_val) VALUES(5,'Five')");
		 * 
		 * try { stmt.executeUpdate("DROP TABLE myTable"); } catch (Exception e)
		 * { System.out.print(e);
		 * System.out.println("No existing table to delete"); }
		 * 
		 * } catch (Exception e) { e.printStackTrace(); }
		 */
	}
}
