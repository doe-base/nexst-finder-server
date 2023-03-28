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



// const sql = `CREATE TABLE users(PRIMARY KEY(user_id),  
//                     user_id int AUTO_INCREMENT, 
//                     user_name VARCHAR(225) NOT NULL, 
//                     user_email VARCHAR(225) NOT NULL, 
//                     user_location VARCHAR(225) NOT NULL, 
//                     pro_user BOOLEAN NOT NULL DEFAULT 0)`

