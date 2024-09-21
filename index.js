const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))

// Set EJS as view engine and specify views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'r1i2y3a4m5i6s7h8r9a0'
});

// Home Route
app.get("/", (req, res) => {
    let q = `SELECT COUNT(*) AS count FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result[0]["count"]);
            res.render("home", { userCount: result[0]["count"] });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Some error occurred in the database");
    }
});

// Show Route for Users
app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.render("user", { users: result });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Some error occurred in the database");
    }
});

// Edit User Route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id ='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result[0]);  // Logs the user details
            res.render("edit.ejs", { user: result[0] });  // Render the edit.ejs view and pass user data
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Some error occurred in the database");
    }
});

//upadatedata
app.patch("/user/:id",(req,res) =>{
    res.send("upadted")
    let { id } = req.params;
    let {password : formPass,username:newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id ='${id}'`;
    try {
        connection.query(q, (err, result) => {

            if (err) throw err;
            let user = result[0];
            if(formPass != user.password){
                res.send("WRONG PASSWORD");
            } else {
                let q2 = `UPADTE user SET username =${newUsername} WHERE id ='{id}'` ;
                connection.query(q2,(err,result) => {
                    if(err) throw err;
                    res.send(result);
                })
            }
            console.log(result[0]);  // Logs the user details
            res.render("edit.ejs", { user: result[0] });  // Render the edit.ejs view and pass user data
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Some error occurred in the database");
    }
})



// Start Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
