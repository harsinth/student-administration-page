<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Students List - JSP</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>School Administration System</h1>
        </header>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="register.html">Register</a></li>
                <li><a href="login.html">Login</a></li>
            </ul>
        </nav>
        <main>
            <h2>Students List (JSP)</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    <%
                    Connection conn = null;
                    Statement stmt = null;
                    ResultSet rs = null;
                    
                    try {
                        // Load the SQLite JDBC driver
                        Class.forName("org.sqlite.JDBC");
                        
                        // Connect to the database
                        conn = DriverManager.getConnection("jdbc:sqlite:school.db");
                        
                        // Create a statement
                        stmt = conn.createStatement();
                        
                        // Execute a query
                        rs = stmt.executeQuery("SELECT id, name, email, grade FROM users WHERE type = 'student'");
                        
                        // Process the result set
                        while(rs.next()) {
                            out.println("<tr>");
                            out.println("<td>" + rs.getInt("id") + "</td>");
                            out.println("<td>" + rs.getString("name") + "</td>");
                            out.println("<td>" + rs.getString("email") + "</td>");
                            out.println("<td>" + rs.getString("grade") + "</td>");
                            out.println("</tr>");
                        }
                    } catch(Exception e) {
                        out.println("<tr><td colspan='4'>Error: " + e.getMessage() + "</td></tr>");
                    } finally {
                        // Close resources
                        if(rs != null) rs.close();
                        if(stmt != null) stmt.close();
                        if(conn != null) conn.close();
                    }
                    %>
                </tbody>
            </table>
        </main>
        <footer>
            <p>&copy; 2025 School Administration System</p>
        </footer>
    </div>
</body>
</html>

