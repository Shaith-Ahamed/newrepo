// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const app = express();
// const port = 3000;
// const path = require('path');

// // Set up the SQLite database (adjust the path to your database file)
// const db = new sqlite3.Database('C:/Users/shait/datas_check.db');


// // Middleware to parse JSON requests
// app.use(express.json());


// // Serve static files (CSS, JS, images) from the "public" folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve the index.html file when visiting the root route "/"
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// // Example endpoint to get all users (adjust to your table and columns)
// app.get('/view', (req, res) => {
//     const sql = 'SELECT * FROM users';  // Adjust the query to match your database
//     db.all(sql, [], (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         res.json(rows);  // Send the result back as JSON
//     });
// });

// // // Example endpoint to add a user (adjust to your table and columns)
// // app.post('/update', (req, res) => {
// //     const { username, email } = req.body;
// //     const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';  // Adjust to your table and columns
// //     db.run(sql, [username, email], function (err) {
// //         if (err) {
// //             return console.error(err.message);
// //         }
// //         res.status(201).json({ id: this.lastID, username, email });
// //     });
// // });

// // Start the server
// app.listen(port, (err) => {
//     if (err) {
//         console.error("Error starting the server:", err);
//     } else {
//         console.log(`Server running at http://localhost:${port}`);
//     }
// });




const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
// const db = new sqlite3.Database('C:/Users/shait/newusers_data.db'); 
const db = new sqlite3.Database('C:\\Users\\shait\\OneDrive\\Desktop\\user_data_base\\user_data.db');

// Middleware to parse the form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve the registration page (GET request)
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Handle registration form submission (POST request)
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // Insert the new user into the database **WITHOUT HASHING**
    const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    stmt.run(username, email, password, function (err) {
        if (err) {
            return res.status(500).send("Error inserting user into database");
        }
        res.send("Registration successful!");
    });
    stmt.finalize();
});

// Serve the home page (GET request to /)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve the login page (GET request)
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Handle login form submission (POST request)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Fetch the user from the database
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err || !row) {
            return res.status(400).send("Invalid credentials");
        }
        res.send("Login successful!");
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
