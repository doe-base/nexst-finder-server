const express = require("express")
const mysql = require("mysql")

// Connection Object
var connection = mysql.createConnection({
    host     : process.env.SQL_CONNECTION_HOST,
    user     : process.env.SQL_CONNECTION_HOST_USER,
    password : process.env.SQL_CONNECTION_PASSWORD,
    database : process.env.SQL_DATABASE,
    port: 3306
});

// MySQL Connection
connection.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('connected to mysql')
    }
})

const app = express()


// Create table
app.get("/mysql/action", (req, res)=>{
    
    const sql = ''
    
    connection.query(sql, (err, result) =>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })
})



const SQLConnection = connection

module.exports = SQLConnection;

// const sql = `CREATE TABLE events(PRIMARY KEY(event_id),  
//                         event_id int AUTO_INCREMENT, 
//                         event_name VARCHAR(225) NOT NULL, 
//                         event_image VARBINARY(225), 
//                         about_event VARCHAR(225) NOT NULL, 
//                         public_event BOOLEAN NOT NULL)`

// const sql = `CREATE TABLE users(PRIMARY KEY(user_id),  
//                     user_id int AUTO_INCREMENT, 
//                     user_name VARCHAR(225) NOT NULL, 
//                     user_email VARCHAR(225) NOT NULL, 
//                     user_location VARCHAR(225) NOT NULL, 
//                     pro_user BOOLEAN NOT NULL DEFAULT 0)`

// const sql = `CREATE TABLE pro_users(PRIMARY KEY(user_id),  
//                     user_id int AUTO_INCREMENT, 
//                     user_brand VARCHAR(225) NOT NULL, 
//                     user_post_location VARCHAR(225) NOT NULL, 
//                     user_location VARCHAR(225) NOT NULL)`

// const sql = `CREATE TABLE event_time(PRIMARY KEY(event_id),
//                     event_id int AUTO_INCREMENT, 
//                     event_date DATE NOT NULL, 
//                     event_time VARCHAR(225))`

// const sql = `CREATE TABLE events(PRIMARY KEY(event_id),  
//                         event_id int AUTO_INCREMENT, 
//                         country VARCHAR(225) NOT NULL, 
//                         state VARCHAR(225) NOT NULL, 
//                         area VARCHAR(225) NOT NULL, 
//                         center VARCHAR(225) NOT NULL`
