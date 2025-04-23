const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const fs = require("fs")
const sqlite3 = require("sqlite3").verbose()
const app = express()
const port = 3000


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/")))

const db = new sqlite3.Database(":memory:")

db.serialize(() => {
  db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            type TEXT NOT NULL,
            grade TEXT,
            subject TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)

  const sampleUsers = [
    { name: "Admin User", email: "admin@school.com", password: "admin123", type: "admin" },
    { name: "John Smith", email: "john@school.com", password: "pass123", type: "student", grade: "10th" },
    { name: "Jane Doe", email: "jane@school.com", password: "pass123", type: "teacher", subject: "Mathematics" },
  ]

  const stmt = db.prepare("INSERT INTO users (name, email, password, type, grade, subject) VALUES (?, ?, ?, ?, ?, ?)")
  sampleUsers.forEach((user) => {
    stmt.run(user.name, user.email, user.password, user.type, user.grade, user.subject)
  })
  stmt.finalize()

  console.log("Database initialized with sample data")
})

// API Routes

// Get all users
app.get("/api/users", (req, res) => {
  db.all("SELECT id, name, email, type, grade, subject, created_at FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(rows)
  })
})

// Get users by type
app.get("/api/users/:type", (req, res) => {
  const type = req.params.type
  db.all("SELECT id, name, email, type, grade, subject, created_at FROM users WHERE type = ?", [type], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(rows)
  })
})

// Register new user
app.post("/api/register", (req, res) => {
  const { name, email, password, type, grade, subject } = req.body

  if (!name || !email || !password || !type) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  const sql = "INSERT INTO users (name, email, password, type, grade, subject) VALUES (?, ?, ?, ?, ?, ?)"
  db.run(sql, [name, email, password, type, grade, subject], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json({
      id: this.lastID,
      message: "User registered successfully",
    })
  })
})

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  db.get(
    "SELECT id, name, email, type, grade, subject FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (!row) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      res.json({
        user: row,
        message: "Login successful",
      })
    },
  )
})

// Update user
app.put("/api/users/:id", (req, res) => {
  const id = req.params.id
  const { name, email, grade, subject } = req.body

  let sql = "UPDATE users SET "
  const params = []

  if (name) {
    sql += "name = ?, "
    params.push(name)
  }

  if (email) {
    sql += "email = ?, "
    params.push(email)
  }

  if (grade) {
    sql += "grade = ?, "
    params.push(grade)
  }

  if (subject) {
    sql += "subject = ?, "
    params.push(subject)
  }

  // Remove trailing comma and space
  sql = sql.slice(0, -2)

  sql += " WHERE id = ?"
  params.push(id)

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "User updated successfully",
    })
  })
})

// Delete user
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id

  db.run("DELETE FROM users WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "User deleted successfully",
    })
  })
})

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

